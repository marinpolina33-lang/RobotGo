# RobotGo migration - RoTLD / Cloudflare -> DigitalOcean DNS

## Status
PREPARED ONLY. Do not switch nameservers until the DigitalOcean zone and records are created and verified. No Cloudflare access is required for this migration.

## Architecture
- Registrar: RoTLD (unchanged)
- DNS: DigitalOcean (target)
- Hosting: Render static site robotgo-preview
- Code: GitHub main branch (unchanged until PR reviewed)

## Steps
1. In Render > robotgo-preview > Settings > Custom Domains, add robotgo.ro and www.robotgo.ro. Use the exact DNS targets displayed in Render. Check against config/digitalocean-dns.json before any changes; update the PR if Render requests different values.
2. In DigitalOcean Networking > Domains, create robotgo.ro. This does not transfer domain ownership. If creation is unavailable through ChatGPT, do this manually.
3. Copy ALL authoritative existing DNS records, including MX, TXT SPF, DKIM, DMARC, verification, CAA and special service records, before changing nameservers. Public DNS scans are NOT a complete inventory.
4. In GitHub repository Settings > Secrets and variables > Actions, add DO_API_TOKEN as a secret, generated in DigitalOcean API settings with minimum domain/DNS permissions where supported. Never put it in source code or chat.
5. Configure GitHub repository Settings > Environments > dns-production with required reviewers / trusted deployment protections if available. Store the token as an environment secret if you prefer; ensure Actions can read it in the environment.
6. Merge this pull request only after checking configuration and enabling approval protection. Run Actions > RobotGo DigitalOcean DNS > Run workflow > plan. Review output.
7. Ensure DigitalOcean DNS contains apex A and www CNAME, plus all other required DNS records. If the plan detects conflicting records, it stops; resolve after review.
8. Check delegation/DNSSEC at RoTLD. If a DS record exists, coordinate its removal or replacement before switching authoritative nameservers to avoid DNSSEC validation failures.
9. At RoTLD > Domain administration > Nameservers, replace Cloudflare delegation with: ns1.digitalocean.com, ns2.digitalocean.com, ns3.digitalocean.com. Confirm if RoTLD sends an email.
10. Verify public NS, A, CNAME, SSL, Render custom domain status, MX and application operation from multiple DNS resolvers. DNS propagation can take time. Roll back to Cloudflare nameservers only if Cloudflare zone is still intact and validated.

## Automation guarantees and limits
- This GitHub Action is manual-only (workflow_dispatch), not triggered on code push.
- Default mode plan is read-only. Apply requires explicit text confirmation and approval of dns-production environment when configured.
- The script never changes existing records and never deletes records; it creates only records listed in config/digitalocean-dns.json.
- It does NOT create the DigitalOcean domain zone, change RoTLD nameservers, configure Render domains, inspect all unknown subdomains, or guarantee working email.
- Repo is public: never commit credentials. GitHub repository environment approvals depend on plan/settings.
- For the first production migration, manual approval of each change is advised.
