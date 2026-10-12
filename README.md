# SeedCore · Mini Robotics Central

A static public website for SeedCore's small robotics direction. The homepage
is a navigable concept world with four districts: Robot Lab, Build Gallery,
Exchange, and Commons. SeedCore remains the main brand and the trust runtime
for physical AI beneath the public experience.

## Direction and implementation status

The source of direction is the sibling SeedCore repository, especially:

- `docs/development/application_directions.md`
- `docs/development/robotics/physical_ai_strategy.md`
- `docs/development/robotics/robot_solution_delivery.md`
- `docs/development/robotics/mini_robot_simulator_implementation_plan.md`
- `apps/mini-robot-simulator/README.md`

Direction reviewed October 12, 2026 through SeedCore commit `bb711b69c5c39cd644826c1ff31b72118605894c`. Microduck is the primary planned integration.
The browser lab is a working two-link research model; it does not simulate
Microduck, control hardware, issue execution authority, or establish physical
safety. SIM-1 and a narrow SIM-2 C++/Wasm/checkpoint slice have local source qualification; SIM-3–SIM-6 remain research plans. The native MuJoCo workbench and versioned model-package inspection are available in SeedCore, including pinned Microduck 0.1.0 assets. Browser MuJoCo, CAD adapters, actuator-aware package experiments, and hardware integration remain planned.
The Exchange and community sessions are concepts in discovery. There are no
live listings, transactions, grants, paid policies, or scheduled tournaments.

## Public pages

| Path | Purpose |
| --- | --- |
| `index.html` | Concept world, four destinations, kinematics preview, and SeedCore direction |
| `develop.html` | Working browser lab entry and simulator roadmap |
| `studio/index.html` | Included two-joint physics lab: experiments, replay, JSON exports |
| `diy-showcase.html` | Filterable original-project references, not a kit catalog |
| `trading.html` | Future parts/skills exchange and feedback invitation |
| `activities.html` | Three available self-guided challenges; proposed community formats |
| `about.html` | Customer mission, trust boundary, and current/future scope |
| `contact.html` | Email draft with query-prefilled interest and copy fallback |
| `resources/index.html` | Current research pointers; earlier concepts marked deferred |
| `sitemap.html`, `sitemap.xml` | Current public routes |

The main website uses local assets and system fonts. Concept illustrations are
original SVG; they are not renders of specific hardware. The homepage arm is a
kinematics illustration, explicitly distinct from the dynamics in the lab.
The lab runtime is copied from SeedCore; see `studio/PROVENANCE.md` for snapshot
origin, modifications, and update instructions.

The contact form prepares a `mailto:` draft to the established studio address,
`hello@seedcore.ai`. It does not submit or persist a message. Visitors review
and send from their own email app; native submission is disabled without JavaScript; a visible copy fallback is provided.

## Preview and stage

```sh
python3 tools/build_site.py
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist/client
```

Open `http://127.0.0.1:4173/`. HTTP(S) is required for the lab worker.
The build validates its explicit public-file manifest, local links/fragments,
CSS and worker dependencies, and sitemap routes before replacing `dist/client`.
It preserves the existing Sites asset worker and metadata. It does not publish.
Historical research files remain in the source repo outside the public build.
The existing legal pages and their stylesheet are retained.

## Verify

```sh
python3 tools/check_site.py
node --check js/robotics-central.js
node --test studio/physics.test.cjs studio/simulation-worker.test.cjs studio/app-worker.test.cjs
# With Playwright resolvable and Chrome installed; the preview server must be running:
node tools/check_browser.cjs
```

For the bundled Codex runtime, set `NODE_PATH` to the runtime's Node packages
and use its Node executable if they are not available on the system PATH.
Browser checks accept `SITE_URL` and `BROWSER_CHANNEL` environment overrides.
They cover 12 routes at 1440, 768, 390, and 320 pixels; responsive navigation,
no-JavaScript links, gallery filters/deep links, contact drafts, reduced motion,
and lab step/reset/run/replay/export. Preview screenshots go to `/tmp`.

All 40 included lab tests passed on October 12, 2026. This website suite does not
include the sibling repository's compiler/toolchain and full native parity checks or establish
cross-browser or physical-robot qualification. See
`docs/website-review-2026-10-12.md` for this update, source findings, and verification.
