#!/usr/bin/env python3
"""RobotGo ClouDNS API helper.

All operations are scoped to robotgo.ro.
- plan: authenticate and inspect, never change data
- create-zone: create the Master zone ONLY if missing
- add-web-records: add ONLY absent A(@) and CNAME(www) records
No record is deleted, changed, or used to alter the registrar delegation.

Credentials must come from GitHub Actions encrypted environment/repository secrets.
Requires ClouDNS account plan with HTTP API access.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

DOMAIN = "robotgo.ro"
API = "https://api.cloudns.net"
MODE = os.environ.get("CLOUDNS_MODE", "plan")
CONFIRM = os.environ.get("CLOUDNS_CONFIRM", "")
AUTH_ID = os.environ.get("CLOUDNS_AUTH_ID", "")
SUB_AUTH_ID = os.environ.get("CLOUDNS_SUB_AUTH_ID", "")
AUTH_PASSWORD = os.environ.get("CLOUDNS_AUTH_PASSWORD", "")
WANTED = [
    {"type": "A", "host": "@", "record": "216.24.57.1", "ttl": "3600"},
    {"type": "CNAME", "host": "www", "record": "robotgo-preview.onrender.com", "ttl": "3600"},
]

if MODE not in ("plan", "create-zone", "add-web-records"):
    sys.exit("ERROR: Invalid mode")
if MODE != "plan" and CONFIRM != "CONFIGURE-ROBOTGO":
    sys.exit("BLOCKED: changes require confirmation CONFIGURE-ROBOTGO")
if (not AUTH_ID and not SUB_AUTH_ID) or not AUTH_PASSWORD:
    print("NO_CLOUDNS_API_CREDENTIALS: Store CLOUDNS_AUTH_ID (or CLOUDNS_SUB_AUTH_ID) and CLOUDNS_AUTH_PASSWORD in GitHub Actions secrets.")
    print("No DNS changes were made.")
    sys.exit(0)

class CloudNSError(Exception):
    pass

def request(path, fields=None):
    payload = {
        **({"sub-auth-id": SUB_AUTH_ID} if SUB_AUTH_ID else {"auth-id": AUTH_ID}),
        "auth-password": AUTH_PASSWORD,
        **(fields or {}),
    }
    body = urllib.parse.urlencode(payload).encode("utf-8")
    req = urllib.request.Request(
        API + path,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            parsed = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        raise CloudNSError("ClouDNS HTTP status " + str(exc.code)) from None
    except (urllib.error.URLError, TimeoutError, ValueError) as exc:
        raise CloudNSError("ClouDNS network/API response error: " + type(exc).__name__) from None
    if isinstance(parsed, dict) and str(parsed.get("status", "")).lower() in ("failed", "0"):
        raise CloudNSError(str(parsed.get("statusDescription", "ClouDNS operation failed")))
    return parsed

def get_zone():
    try:
        response = request("/dns/get-zone-info.json", {"domain-name": DOMAIN})
        if not isinstance(response, (dict, list)):
            raise CloudNSError("Unexpected zone info response")
        return True
    except CloudNSError as exc:
        msg = str(exc).lower()
        if "missing domain-name" in msg or "non-existent" in msg or "not found" in msg:
            return False
        raise

def normalize(value):
    return str(value or "").strip().rstrip(".").lower()

def read_records():
    records = []
    for page in range(1, 11):
        data = request("/dns/records.json", {
            "domain-name": DOMAIN,
            "page": str(page),
            "rows-per-page": "100",
        })
        if isinstance(data, list):
            items = data
        elif isinstance(data, dict):
            items = [value for value in data.values() if isinstance(value, dict)
                     and ("record" in value or "type" in value)]
            if data and not items and not (set(data.keys()) <= {"status", "statusDescription"}):
                raise CloudNSError("Unexpected DNS records structure; refusing changes.")
        else:
            raise CloudNSError("Unrecognized ClouDNS records response")
        records.extend(items)
        if len(items) < 100:
            return records
    raise CloudNSError("More than 1000 DNS records: stop for manual review.")

def matches_host(record, wanted_host):
    name = normalize(record.get("host"))
    return name == wanted_host or (wanted_host == "@" and name in ("", DOMAIN))

def assess(records):
    missing = []
    for wanted in WANTED:
        host, record_type, target = wanted["host"], wanted["type"], normalize(wanted["record"])
        at_host = [r for r in records if matches_host(r, host)]
        same = [r for r in at_host if normalize(r.get("type")) == record_type.lower()
                and normalize(r.get("record")) == target]
        if same:
            print("OK: " + host + " " + record_type + " -> " + target)
            continue
        if host == "@":
            conflicts = [r for r in at_host if normalize(r.get("type")) in ("a", "aaaa", "cname", "alias", "aname")]
        else:
            conflicts = [r for r in at_host if normalize(r.get("type")) not in ("ns", "soa")]
        if conflicts:
            types = sorted({str(r.get("type", "?")) for r in conflicts})
            raise CloudNSError("Existing conflicting records at " + host + ": " + ",".join(types) + ". No changes.")
        print("MISSING: " + host + " " + record_type + " -> " + target)
        missing.append(wanted)
    return missing

try:
    exists = get_zone()
    print("ClouDNS Master zone present:", exists)
    if not exists:
        if MODE == "create-zone":
            request("/dns/register.json", {"domain-name": DOMAIN, "zone-type": "master"})
            print("CREATED_ZONE:", DOMAIN)
            print("Zone created. Verify ClouDNS name servers and copy all mail/other records before switching RoTLD.")
        elif MODE == "plan":
            print("PLAN: Zone missing. Next authorized action is create-zone.")
        else:
            raise CloudNSError("Zone missing. Create zone first; web record creation not attempted.")
    else:
        records = read_records()
        print("Records inspected:", len(records))
        missing = assess(records)
        if MODE == "add-web-records":
            for wanted in missing:
                fields = {"domain-name": DOMAIN, **wanted}
                request("/dns/add-record.json", fields)
                print("CREATED_WEB_RECORD:", wanted["host"], wanted["type"])
        else:
            print("PLAN: No changes made. Missing web records:", len(missing))
    print("No existing records were deleted or modified. Nameserver delegation at RoTLD was not changed.")
except CloudNSError as exc:
    sys.exit("STOPPED_SAFELY: " + str(exc))
