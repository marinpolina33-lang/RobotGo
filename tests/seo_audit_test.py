import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("audit", Path(__file__).resolve().parents[1] / "tools/audit_seo.py")
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
URL = "https://robotgo.ro/"
HTML = '<title>RobotGo</title><link rel="canonical" href="https://robotgo.ro/"><h1>RobotGo</h1>'


class AuditTest(unittest.TestCase):
    def inspect(self, html=HTML, headers=(), status=200, final=URL):
        return audit.inspect_page(URL, status, final, headers, html)["issues"]

    def test_normal_indexable_page(self):
        self.assertEqual(self.inspect(), [])

    def test_hidden_http_and_googlebot_blocks(self):
        for header in ("noindex", "googlebot: noindex, follow", "Googlebot: NONE"):
            self.assertTrue(self.inspect(headers=[header]))
        self.assertTrue(self.inspect(HTML + '<meta content="noindex" name="googlebot">'))
        self.assertTrue(self.inspect(HTML + '<meta name="robots" content="none">'))
        self.assertEqual(self.inspect(headers=["bingbot: noindex, nofollow"]), [])
        self.assertTrue(self.inspect(headers=["bingbot: noindex", "noindex"]))

    def test_canonical_redirect_and_soft404_regressions(self):
        self.assertTrue(self.inspect(HTML.replace(URL, URL + "shop/")))
        self.assertTrue(self.inspect(HTML + '<link rel="canonical" href="https://robotgo.ro/">'))
        self.assertTrue(self.inspect(status=404))
        self.assertTrue(self.inspect(final=URL + "shop/"))
        self.assertTrue(self.inspect('<title>Not found</title><h1>Not found</h1>'))

if __name__ == "__main__":
    unittest.main()
