# Public asset audit

All 16 files in `public/` were inventoried before editing. The contact sheet records the ten raster assets; SVG source and GLB usage were also inspected.

| Asset | Dimensions / size | Art-direction decision |
| --- | --- | --- |
| hero/hero-environment.jpg | 1199 × 675 | Keep the strong frontal studio opening. Adapt the mobile image stage to give the car more presence without stretching it. |
| porsche-911.png | 1930 × 815, alpha | Keep as the primary cutout across collection, detail and reservation. Reuse in the new branded social composition. |
| bmw-m4.png | 1672 × 941, alpha | Keep vehicle-specific display and containment. |
| amg-gt.png | 1672 × 941, alpha | Keep vehicle-specific display and containment. |
| lifestyle/porsche-night.jpg | 1200 × 670 | Keep the GLB fallback establishing image and Porsche detail photography; remove from the finale to reduce repetition. |
| lifestyle/bmw-city.jpg | 735 × 490 | Keep BMW detail; use as the mobile machine study's second composition instead of enlarging the tiny detail asset. |
| lifestyle/amg-night.jpg | 736 × 589 | Keep AMG detail; give the finale a distinct sunset palette and low vehicle-focused crop. Medium-resolution source limits large-screen detail. |
| experience/delivery.jpg | 1200 × 800 | Previously unused. Promote the warm hotel-arrival scene to the main experience photograph. |
| experience/detail.jpg | 500 × 333 | Retain only as a restrained, max-440px detail study. Remove from the full-screen fallback. |
| experience/interior.jpg | 735 × 490 | Leave unused: saturated cabin lighting and landscape source are less suitable for the large portrait service story. |
| models/sports-car.glb | 4,955,640 bytes | Keep existing camera choreography, scale, lighting, lazy loading, demand rendering and all fallbacks. |
| file.svg, globe.svg, window.svg | Starter icons | Leave unused; unrelated to the campaign. |
| next.svg, vercel.svg | Framework logos | Leave unused; unrelated to VELOCE identity. |

The existing application favicon lives at `app/icon.svg`, outside public, and remains unchanged. There were no public OG/social assets. `app/opengraph-image.tsx` now renders a 1200 × 630 branded cover at build time from the existing Porsche PNG, with matching Open Graph and Twitter metadata. No external assets or generated photography are introduced.

Transparent vehicles retain their proportions and contain fitting. Lightweight radial ground shadows support showroom, featured, detail, reservation, and confirmation placements without blur filters. Reservation vehicle wrappers now explicitly use the existing full-width containment rather than conflicting oversized utility classes. Dates, driver data, session state, fees and confirmation logic are unchanged.
