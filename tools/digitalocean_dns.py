#!/usr/bin/env python3
"""Read-only by default. Changes only two explicitly approved website DNS records.
Requires DO_API_TOKEN supplied as a GitHub Actions secret, never committed.
"""
import json, os, sys, urllib.request, urllib.error

API = "https://api.digitalocean.com/v2"
CONFIG = json.load(open("config/digitalocean-dns.json", encoding="utf-8"))
DOMAIN = CONFIG["domain"]
MODE = os.getenv("DNS_MODE", "plan")
TOKEN = os.getenv("DO_API_TOKEN", "")
if MODE not in ("plan", "apply"):
    sys.exit("Invalid mode")
if MODE == "apply" and os.getenv("DNS_CONFIRM") != "APPLY-ROBOTGO-DNS":
    sys.exit("Apply requires confirmation APPLY-ROBOTGO-DNS")
if not TOKEN:
    sys.exit("Set repository secret DO_API_TOKEN first. No changes were made.")

def req(path, method="GET", payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    headers={"Authorization": "Bearer "+TOKEN, "Accept":"application/json"}
    if data is not None: headers["Content-Type"]="application/json"
    request=urllib.request.Request(API+path, method=method, data=data, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=20) as res:
            raw=res.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as err:
        sys.exit("DigitalOcean API error (%s): %s" % (err.code, err.read().decode()[:600]))

try:
    zone=req("/domains/"+DOMAIN)
except SystemExit:
    raise
print("Existing DO zone:", zone.get("domain",{}).get("name","unknown"))
all_records=[]
page=1
while True:
    results=req("/domains/"+DOMAIN+"/records?per_page=200&page="+str(page))
    all_records += results.get("domain_records",[])
    if not results.get("links",{}).get("pages",{}).get("next"): break
    page+=1
    if page>20: sys.exit("Too many pages; stop")

actions=[]
for desired in CONFIG["records"]:
    name=desired["name"]
    matching=[r for r in all_records if r.get("name")==name and r.get("type") not in ("NS","SOA")]
    identical=[r for r in matching if r.get("type")==desired["type"] and str(r.get("data","")).rstrip(".")==desired["data"].rstrip(".")]
    if identical:
        print("OK:",name,desired["type"],desired["data"])
    elif matching:
        print("STOP: existing records for",name,[(r.get("type"),r.get("data")) for r in matching])
        sys.exit("Conflicting records must be reviewed manually; no changes made")
    else:
        print("MISSING:",name,desired["type"],desired["data"])
        actions.append(desired)

if MODE == "plan":
    print("PLAN ONLY. Records to create:",len(actions))
else:
    for record in actions:
        result=req("/domains/"+DOMAIN+"/records",method="POST",payload=record)
        print("CREATED:",record["name"],record["type"],"id",result.get("domain_record",{}).get("id"))
print("No existing records deleted or overwritten.")
