"""Read-only post-deploy indexability audit; Python standard library only.

This checks public technical eligibility, never Google's actual index status.
Run: python3 tools/audit_seo.py --output /tmp/robotgo-seo.json
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

ORIGIN = "https://robotgo.ro"
UA = "RobotGo-SEO-Audit/1.0"
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.canonicals, self.directives, self.titles = [], [], []
        self.h1 = 0
        self.in_title = False
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and "canonical" in attrs.get("rel", "").lower().split():
            self.canonicals.append(attrs.get("href", ""))
        if tag == "meta" and attrs.get("name", "").lower() in ("robots", "googlebot"):
            self.directives.extend(attrs.get("content", "").lower().replace(",", " ").split())
        if tag == "title":
            self.titles.append("")
            self.in_title = True
        if tag == "h1":
            self.h1 += 1

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.titles[-1] += data


def header_directives(values):
    """Respect agent-scoped X-Robots-Tag values, including repeated headers."""
    result = []
    for value in values:
        agent = None
        for part in value.lower().split(","):
            part = part.strip()
            if ":" in part:
                prefix, directive = part.split(":", 1)
                if prefix not in ("max-snippet", "max-image-preview", "max-video-preview", "unavailable_after"):
                    agent, part = prefix.strip(), directive.strip()
            if agent in (None, "googlebot"):
                result.extend(part.split())
    return result


def inspect_page(url, status, final_url, headers, html):
    page = Page(html)
    problems = []
    if status != 200:
        problems.append(f"HTTP {status}, expected 200")
    if final_url != url:
        problems.append(f"Sitemap URL redirects to {final_url}")
    if page.canonicals != [url]:
        problems.append(f"Canonical mismatch: {page.canonicals}")
    directives = page.directives + header_directives(headers)
    if {"noindex", "none"}.intersection(directives):
        problems.append("Indexing blocked by HTML or X-Robots-Tag")
    if {"nofollow", "none"}.intersection(directives):
        problems.append("Links blocked by HTML or X-Robots-Tag")
    if len(page.titles) != 1 or not page.titles[0].strip():
        problems.append("Missing or multiple titles")
    if page.h1 != 1:
        problems.append(f"Expected one H1, found {page.h1}")
    return {"url": url, "status": status, "canonical": page.canonicals,
            "title": page.titles[0] if page.titles else "", "issues": problems}


def get(url):
    try:
        response = urlopen(Request(url, headers={"User-Agent": UA}), timeout=30)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.url, response.headers, response.read().decode("utf-8", errors="replace")


def audit():
    issues = []
    status, _, _, robots_text = get(ORIGIN + "/robots.txt")
    if status != 200:
        issues.append(f"robots.txt returned HTTP {status}")
    robots = RobotFileParser()
    robots.parse(robots_text.splitlines())
    for name in ("sitemap.xml", "video-sitemap.xml"):
        if ORIGIN + "/" + name not in (robots.site_maps() or []):
            issues.append(f"robots.txt does not advertise {name}")
    status, _, _, xml = get(ORIGIN + "/sitemap.xml")
    if status != 200:
        raise RuntimeError(f"sitemap.xml returned HTTP {status}")
    root = ET.fromstring(xml)
    urls = [item.text for item in root.findall("s:url/s:loc", NS)]
    if not urls or len(urls) != len(set(urls)):
        issues.append("Empty sitemap or duplicate URLs")
    # Only page loc entries, never image/video locations; never fetch other hosts.
    safe_urls = []
    for url in urls:
        parsed = urlsplit(url)
        if parsed.scheme != "https" or parsed.netloc != "robotgo.ro" or parsed.query or parsed.fragment:
            issues.append(f"Non-canonical sitemap URL: {url}")
            continue
        safe_urls.append(url)
        if not robots.can_fetch("Googlebot", url):
            issues.append(f"robots.txt blocks Googlebot: {url}")

    def check(url):
        try:
            status, final, headers, html = get(url)
            return inspect_page(url, status, final, headers.get_all("X-Robots-Tag", []), html)
        except Exception as error:
            return {"url": url, "issues": [str(error)]}

    with ThreadPoolExecutor(max_workers=4) as pool:
        pages = list(pool.map(check, safe_urls))
    title_urls = {}
    for page in pages:
        title = page.get("title")
        if title:
            if title in title_urls:
                issues.append(f"Duplicate title: {title_urls[title]} and {page['url']}")
            title_urls[title] = page["url"]
    quote = ORIGIN + "/quote/"
    status, _, headers, html = get(quote)
    directives = Page(html).directives + header_directives(headers.get_all("X-Robots-Tag", []))
    if status != 200 or quote in urls or not {"noindex", "none"}.intersection(directives):
        issues.append("Quotation form must respond 200, remain noindex and stay outside sitemap")
    status, _, _, _ = get(ORIGIN + "/robotgo-seo-audit-nonexistent-page/")
    if status != 404:
        issues.append(f"Unknown URL returns {status} instead of 404")
    report = {"checked_at": datetime.now(timezone.utc).isoformat(), "origin": ORIGIN,
              "scope": "Public technical indexability, not Google index status",
              "page_count": len(pages), "issues": issues, "pages": pages}
    report["passed"] = not issues and all(not page["issues"] for page in pages)
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", help="Optional JSON report path")
    args = parser.parse_args()
    try:
        report = audit()
    except Exception as error:
        print(f"Audit failed: {error}")
        return 1
    if args.output:
        with open(args.output, "w", encoding="utf-8") as file:
            json.dump(report, file, ensure_ascii=False, indent=2)
    print(f"{'PASS' if report['passed'] else 'FAIL'}: {report['page_count']} sitemap pages checked")
    for issue in report["issues"]:
        print(issue)
    for page in report["pages"]:
        for issue in page["issues"]:
            print(page["url"], issue)
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
