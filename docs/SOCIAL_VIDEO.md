# Official channels and product video links

Updated 2026-11-05. The four account identifiers were read from the connected RobotGo brand in Metricool. Facebook uses the stable Page ID rather than an unverified vanity handle.

`public/social-video-data.js` contains four profiles and one primary presentation link for each of the 26 catalogue products. G1, CC1, BellaBot and T300 use the RobotGo YouTube Shorts, with the existing TikTok, Facebook and Instagram versions as alternatives. Other videos are attributed to their publishers. Family, series and variant presentations are explicitly labelled. BrainCo Revo 2 links to the manufacturer's page containing two model-specific videos; it is labelled as a manufacturer website rather than YouTube.

`public/social-video.js` renders the same link components for the interactive application and generated HTML. Links appear on catalogue cards, product pages, the footer and Contact. Organization structured data includes the four official accounts in `sameAs`. The 25 YouTube primary links were checked through YouTube oEmbed; the BrainCo page was checked for its actual video elements. Evidence is recorded in `social-video-sources.json`.

Videos open at their original source in a new tab with `noopener noreferrer`. No third-party player or tracking script is embedded. Thumbnails use the existing local product photographs.

Validation: 35 static checks, seven existing Metricool tests, full build of 72 HTML pages, catalogue coverage for all 26 products, both languages, and four schema profile references. The generated-page verification context loads the same social modules as the build and browser.
