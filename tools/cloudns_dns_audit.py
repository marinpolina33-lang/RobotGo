#!/usr/bin/env python3
"""Read-only ClouDNS migration preflight for RobotGo.

Runs on GitHub Actions and does NOT need credentials or change DNS.
Provide CLOUDNS_NS as a comma/space separated set of actual ClouDNS name servers
to inspect the new zone before modifying RoTLD delegation.
"""
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

config = json.loads(Path("config/cloudns-dns.json").read_text(encoding="utf-8"))
domain = config["domain"]
records = config["expected_web_records"]
expected = {(r["host"], r["type"]): r["value"].rstrip(".").lower() for r in records}
lines = ["# RobotGo — audit DNS fără modificări", "",
         "Domeniu: " + domain, "Target: ClouDNS DNS → Render, registrar RoTLD.", "",
         "Acest raport NU reprezintă un inventar complet al zonei DNS și nu schimbă nameserverele."]

def report(s=""):
    lines.append(s)

def query(name, kind, server):
    cmd = ["dig", "@" + server, name, kind, "+short", "+time=4", "+tries=1"]
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=8, check=False)
    except (OSError, subprocess.TimeoutExpired) as e:
        return None, str(e)
    if p.returncode:
        return None, (p.stderr or "dig a eșuat").strip()
    answer = [x.strip() for x in p.stdout.splitlines() if x.strip()]
    return answer, None

def cell(label, name, kind, server):
    answer, error = query(name, kind, server)
    value = "(fără înregistrare)" if answer == [] else ("EROARE: " + error if error else ", ".join(answer))
    report("- " + label + ": " + value)
    return answer

report("")
report("## DNS public actual")
for resolver in ("1.1.1.1", "8.8.8.8"):
    report("### Resolver " + resolver)
    cell("NS " + domain, domain, "NS", resolver)
    cell("A " + domain, domain, "A", resolver)
    cell("CNAME www", "www." + domain, "CNAME", resolver)
cell("DS / DNSSEC", domain, "DS", "1.1.1.1")
cell("MX (email)", domain, "MX", "1.1.1.1")
cell("TXT (SPF/verificări)", domain, "TXT", "1.1.1.1")
cell("DMARC TXT", "_dmarc." + domain, "TXT", "1.1.1.1")

report("")
report("## Hosting Render")
request = urllib.request.Request("https://" + config["render_service"], method="HEAD",
                                 headers={"User-Agent": "RobotGo-DNS-readonly-audit"})
try:
    with urllib.request.urlopen(request, timeout=12) as response:
        report("- Render HTTPS: HTTP " + str(response.status) + " (certificat verificat)")
except (urllib.error.URLError, TimeoutError) as e:
    report("- Render HTTPS: nereușit (" + type(e).__name__ + ")")

raw_ns = os.environ.get("CLOUDNS_NS", "").strip()
if not raw_ns:
    raw_ns = " ".join(config.get("name_servers_to_test", []))
servers = [x.rstrip(".").lower() for x in re.split(r"[\s,;]+", raw_ns) if x]
servers = list(dict.fromkeys(servers))
report("")
report("## Verificare directă ClouDNS înainte de delegare")
ok = True
if not servers:
    report("**ÎNCĂ NEVERIFICAT:** nu au fost furnizate nameserverele reale afișate în contul ClouDNS.")
    report("Adaugă zona Master, configurează A și CNAME, apoi rulează auditul cu nameserverele respective.")
else:
    if len(servers) < 2 or len(servers) > 10 or any(not re.fullmatch(r"[a-z0-9-]+(?:\.[a-z0-9-]+)+", s) for s in servers):
        raise SystemExit("Lista nameserverelor nu este validă. Furnizează cel puțin două FQDN valide, separate prin virgulă.")
    for server in servers:
        report("### " + server)
        a = cell("A domeniu principal", domain, "A", server)
        cname = cell("CNAME www", "www." + domain, "CNAME", server)
        aaaa = cell("AAAA domeniu principal (Render cere eliminarea)", domain, "AAAA", server)
        cell("MX (verificare separată necesară)", domain, "MX", server)
        cell("CAA (restricții posibile pentru SSL)", domain, "CAA", server)
        if a is None or cname is None or aaaa is None:
            ok = False
        else:
            match_a = sorted(x.rstrip(".").lower() for x in a) == [expected[("@", "A")]]
            match_www = sorted(x.rstrip(".").lower() for x in cname) == [expected[("www", "CNAME")]]
            if not (match_a and match_www and len(aaaa) == 0):
                ok = False
        report("- Înregistrări web: " + ("CORECTE" if a is not None and cname is not None and aaaa is not None and
                sorted(x.rstrip(".").lower() for x in a) == [expected[("@", "A")]] and
                sorted(x.rstrip(".").lower() for x in cname) == [expected[("www", "CNAME")]] and
                len(aaaa) == 0 else "NECORESPUNZĂTOARE"))
report("")
report("## Concluzie")
if not servers:
    report("**PREGĂTIRE INCOMPLETĂ**: zona DNS ClouDNS trebuie creată și verificată.")
elif ok:
    report("**WEB DNS PRECONFIGURAT** pe nameserverele testate. Nu schimba delegarea până la inventarul complet "
           "al înregistrărilor (email/servicii) și verificarea DNSSEC la RoTLD.")
else:
    report("**NU SCHIMBA NAMESERVERELE**: cel puțin o verificare A/CNAME/AAAA a eșuat.")
report("Pentru Render: adaugă domeniul în Settings → Custom Domains și verifică după propagare.")
report("Orice modificare DNS se face manual în conturile autorizate, nu din acest workflow.")

result = "\n".join(lines) + "\n"
print(result)
summary = os.environ.get("GITHUB_STEP_SUMMARY")
if summary:
    with open(summary, "a", encoding="utf-8") as f:
        f.write(result)
if servers and not ok:
    sys.exit(2)
