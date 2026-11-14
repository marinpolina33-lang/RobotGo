# Category carousel — 14 November 2026

The homepage opens with a full-width visual category carousel, followed by category names, model links and the existing introduction. It contains reception, serving/delivery, humanoids, logistics and robotic arms. The complete 32-model catalogue and verified price references remain below it.

## Image provenance

- `public/assets/home/robot-stage.webp`: original AI-generated decorative exhibition stage. It is a conceptual presentation background, not an actual RobotGo showroom.
- `reception-lineup.webp`: AI-assisted background removal and arrangement of the existing official Alpha Timo, Amy and Alice reference photographs.
- `delivery-lineup.webp`: AI-assisted background removal and arrangement of the existing official Alpha Panda, Speedybot Max and Panda Hotel reference photographs.
- The other groups render existing original product WebP assets through SVG viewports, without modifying those source files. Display sizes are compositional, not a physical size comparison.
- Original manufacturer photographs remain in the catalogue and product pages. Alpha provenance URLs are recorded in `alpha-robotics-sources.json`.

## Interaction and accessibility

Automatic advance is 6.5 seconds. Previous/next arrows, category buttons, left/right keyboard arrows and horizontal touch swipes change the selected group. Manual selection pauses rotation. The play/pause control resumes or stops it explicitly. Rotation suspends when the page is hidden, the stage is offscreen, a mouse hovers over it, or a keyboard user focuses it. Reduced-motion preference disables initial autoplay and transitions. Hidden slides are inert; only the active group exposes interactive links. Route/language rerenders dispose old timers, observers and listeners.

## Validation

- Existing build/static/SEO and catalogue-price tests retained.
- Carousel tests exercise wraparound, manual pause/resume, reduced motion, visibility, hover, horizontal vs vertical touch gestures and cleanup on remount.
- Browser checks at desktop and 390px iframe width: complete robot silhouettes, copy below the stage, category controls, native product links, no horizontal overflow.
