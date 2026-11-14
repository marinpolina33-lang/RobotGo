# RobotGo — homepage refresh, 14 November 2026

## Reference inspected

https://www.alpharobotics.ai/ — desktop homepage, product-series navigation, six official product pages and manufacturer scenario images. The visual review identified a strong first-screen multi-robot presentation, clear product families and contextual photography that helps explain practical uses.

## Implemented

- Replaced the single concept-robot hero with six clickable, official Alpha Robotics photographs on one shared light stage within the established dark/turquoise RobotGo identity. Retained the approved headline.
- Exposed every catalogue model directly on the homepage: 32 models/families, 14 brands, search plus eight task/brand filters, result count and empty-state reset. No carousel or pagination hides models.
- Added Alpha Timo, Amy, Alice, Panda, Speedybot Max and Panda Hotel to the shared catalogue, product pages, brand filtering, comparisons, quotation selection and sitemap. Added bilingual descriptions, usage examples and 12 model-specific buying questions with manufacturer sources.
- Added three attributed Alpha Robotics scenario photographs: reception, restaurant and hotel. These are manufacturer examples, not RobotGo customer installations.
- Changed the primary G1 photograph to its verified dynamic pose and added an official outdoor Go2 photograph. Retained the existing galleries.
- Kept the previously published G1/Go2 European price references, source tax/configuration context and quote-only sales flow. Alpha prices remain on request; stock, Romanian voice support and distributor status are not asserted.
- Responsive layout: six robots in three columns on phones; two-column catalogue; compact WhatsApp control to reduce obstruction. Images remain local, indexed HTML is complete before JavaScript, below-fold images load lazily and reduced-motion preference is respected.

## Content boundaries

Alice has a wheeled base. Amy reception is distinct from Amy Delivery. Panda’s 30 kg is total payload. Speedybot Max dimensions and payload remain unconfirmed. Panda Hotel’s manufacturer-listed 100 kg was not promoted without configuration confirmation. Exact sources, original hashes and image metadata are in `alpha-robotics-sources.json` and `product-image-sources.json`.

## Validation

Build validates 83 HTML routes, sitemap, internal links, canonical metadata, structured data and asset hashes. Fifteen automated tests cover catalogue preservation, filters/search, generated product pages, price semantics and existing analytics/video behavior. Browser checks covered desktop and a 390 px mobile frame, image loading, Alpha filtering, search/empty-state reset and selection of Alpha Timo for a quote without sending it.
