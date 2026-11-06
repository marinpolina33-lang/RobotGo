# RobotGo video publication — 6 November 2026

The four approved RobotGo presentations are already public on YouTube. Dedicated watch pages now embed those publications, avoiding binary uploads and Base64 video segments. Existing MP4 files and social publications are unchanged.

| Product | Watch page | Verified YouTube ID |
| --- | --- | --- |
| PUDU CC1 | `/video/pudu-cc1/` | `SfmkM3auKCc` |
| PUDU BellaBot | `/video/pudu-bellabot/` | `XnuYEJsRNIA` |
| PUDU T300 | `/video/pudu-t300/` | `LRvsGNN_g88` |
| Unitree G1 | `/video/unitree-g1/` | `LN_M6Q1zGqM` |

YouTube watch pages and oEmbed returned HTTP 200 on 6 November 2026 and identified the publisher as Robot Go. Durations (32 seconds) and original upload timestamps were read from the watch-page metadata. Publication dates are in the original YouTube timezone; all four correspond to 5 November in Romania.

`/video/` lists the four watch pages. Product and catalogue video links point to their corresponding page; each watch page links back to its product and product-specific quotation request. The pages contain one visible, responsive player in the initial HTML and the interactive RO/EN view. A YouTube source link remains available. The player uses youtube-nocookie.com, has no autoplay, and is disclosed in the privacy page.

VideoObject metadata uses the actual YouTube player, thumbnail, duration and upload timestamp. `video-sitemap.xml` contains four player entries and is advertised in `robots.txt`; the normal sitemap includes all five new pages. No expiring media URLs, fabricated MP4 content URLs, or Base64 data URLs are used. Indexing and video playback remain subject to Google and YouTube availability respectively.

The quotation form now explains the difference between direct receipt with a reference, email/WhatsApp handoff, and downloading/copying a request. No form submission behavior changed.

Validation: `node tools/build.mjs`, `node --test tests/video-pages.test.mjs tests/metricool.test.mjs tests/auth/auth.test.mjs`. Build output contains 77 content pages plus the existing 404 page.
