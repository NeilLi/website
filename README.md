# SeedCore · Mini Robotics Central

A static public website for SeedCore's physical AI operating foundation and mini-robotics direction. The website connects the paradigm shift of safe-by-physics small robotics to SeedCore's verifiable trust runtime, zero-install WebAssembly simulation studio, and open maker blueprints.

## Direction and implementation status

The source of direction is the sibling SeedCore repository (`/Users/ningli/project/seedcore`), specifically:

- `docs/development/application_directions.md`
- `docs/development/robotics/physical_ai_strategy.md`
- `docs/development/robotics/robot_solution_delivery.md`
- `docs/development/robotics/mini_robot_simulator_implementation_plan.md`
- `apps/mini-robot-simulator/README.md`

### Current qualification & delivery state:
- **Safe-by-Physics Paradigm**: While industrial robots require hard physical safety cages, mini-robotics (<1 kg) is inherently safe-by-physics. The governance focus shifts to behavioral trust, capability boundaries, and verifiable audit trails.
- **Slow Brain, Fast Spine Architecture**: High-level vision-language models run asynchronously at ~1–5 Hz generating bounded `ActionIntent` chunks, while embedded microcontrollers (ESP32/RP2040) run a 200–500 Hz deterministic spline interpolator with sub-millisecond hardware watchdog trip circuits.
- **Delivered Simulation Slices (SIM-1, SIM-2, SIM-3)**:
  - **SIM-1 & SIM-2**: 2D Planar arm dynamics with state checkpointing, JSON exports, and Wasm ABI 1.
  - **SIM-3**: 3D Kinematic Tree Studio (`studio/tree-lab.html`) with dual-ABI Wasm (ABI 2), 78/78 deterministic tests passing, live analytical mass matrix $M(q)$, Coriolis vector, and end-effector Jacobian $\mathbf{J}(q)$ evaluation.
- **MuJoCo & Microduck Ingestion (M0)**: Native MuJoCo workbench and versioned model-package inspection are available in SeedCore, including pinned Microduck 0.1.0 MJCF assets with SHA-256 integrity verification.
- **Maker Blueprints**: $150 Fast Spine controller architecture utilizing WebSerial, smart serial bus servos (Feetech/Dynamixel), and open 3D printable designs (Microduck biped, SO-100 arm, Reachy Mini).

## Public pages

| Path | Purpose |
| --- | --- |
| `index.html` | Core portal: paradigm shift matrix, slow brain/fast spine flow, tech stack grid, and 4 districts |
| `develop.html` | SIM-3 3D Tree Studio showcase, $150 Fast Spine blueprint, MuJoCo workbench, and full SIM-1–SIM-6 roadmap |
| `studio/tree-lab.html` | **Live SIM-3 3D Studio**: 1/2/3-link kinematic tree dynamics, 3D orbit viewport, and live $M(q)$ / $\mathbf{J}(q)$ inspectors |
| `studio/index.html` | **SIM-1/SIM-2 2D Lab**: Step-by-step physics lessons, checkpointing, replay, and JSON export |
| `diy-showcase.html` | Curated reference builds: Microduck biped (0.1.0 pinned MJCF), 3-link manipulator, SO-100 arm, Reachy Mini |
| `trading.html` | Future verified skills & parts exchange discovery |
| `activities.html` | Builder challenges and community experiment formats |
| `about.html` | Safe-by-physics philosophy, capability token lifecycle, and SeedCore trust runtime foundation |
| `contact.html` | Client-side email draft generator with topic prefilling and copy fallback |
| `resources/index.html` | Technical documentation and research pointers |
| `sitemap.html`, `sitemap.xml` | Public routes and indexing |

## Asset & Studio Synchronization

The browser simulation runtime in `website/studio/` mirrors `seedcore/apps/mini-robot-simulator/`:
- `mini-physics.wasm` (13,242 bytes, compiled C++ dynamics kernel supporting ABI 1 and ABI 2)
- `sim-contracts.js` & `sim-contracts.d.ts` (Strongly typed schemas)
- `tree-lab.html`, `tree-lab.js`, `tree-lab-ui.js`, `tree-physics-wasm.js` (3D kinematic tree studio)
- `index.html`, `app.js`, `styles.css` (2D interactive physics lessons)

Zero remote CDN dependencies: all physics, 3D projections, and UI widgets execute 100% offline in client browsers.

## Build and Stage

```sh
# Stage public files into dist/client and validate links/fragments
python3 tools/build_site.py

# Launch local preview server
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist/client
```

Open `http://127.0.0.1:4173/`. HTTP(S) is required for WebAssembly and Web Worker execution.

## Verification

```sh
# 1. Check local HTML links, fragments, and sitemap routes
python3 tools/check_site.py

# 2. Syntax-check main website script
node --check js/robotics-central.js

# 3. Run studio physics and worker tests
node --test studio/physics.test.cjs studio/simulation-worker.test.cjs studio/app-worker.test.cjs

# 4. (Optional) Run headless browser smoke suite
node tools/check_browser.cjs
```
