# RobotGo website measurement in Metricool

The website uses the existing Metricool brand `7815373`, alongside the Robot Go
social accounts. The public tracker hash in `public/site-config.js` identifies
that brand; it is not an API credential.

`public/metricool.js` implements the small image-request protocol used by
Metricool's official `https://tracker.metricool.com/resources/be.js`. It sends
the brand hash, canonical public page, viewport size and referring origin to
`https://tracker.metricool.com/c3po.jpg`. The first-party adapter avoids loading
remote executable code and strips queries, fragments and private referral paths.
Existing image permissions suffice; security headers are unchanged.

## Visitor choices

- The footer and `/privacy/` disclose Metricool and offer allow/decline controls.
- Existing internal measurement consent alone never enables Metricool. The
  additional `robotgo-metricool-consent-v1` opt-in must also be allowed.
- Declining, withdrawing consent or enabling Global Privacy Control stops future
  requests. Withdrawal does not erase already collected provider data.
- Only known, indexable public routes on robotgo.ro/www.robotgo.ro are counted.
  Account, API, quotation, checkout, cart, favorites and unknown routes are excluded.
- Form contents, search terms, query strings and URL fragments are never sent.
- Re-rendering a page does not produce duplicate views. The tracker makes no
  requests from localhost or preview deployments.

## Checks and dashboard

Run `npm test` (static checks and consent/privacy unit tests) and `npm run build`
(all generated pages, SEO, asset and discovery checks).

In Metricool select the existing brand and open Web/Blog. The provider documents
real-time visits after the first allowed page view; historical daily analytics
become available from the following day. Old visits cannot be recovered. Visitors
who decline measurement or use blocking software are not represented.

Official setup instructions:
https://help.metricool.com/how-to-connect-your-website-or-blog-to-metricool-ejuy1

Official troubleshooting:
https://help.metricool.com/i-have-connected-the-web-blog-but-no-data-appears-bevvv
