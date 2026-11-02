# SeedCore · Mini Robotics Central

A static public website for SeedCore's physical AI operating foundation and mini-robotics direction. The website connects the simulation-first approach to small robotics to SeedCore's verifiable trust runtime, zero-install WebAssembly simulation studio, Central World component/assembly authoring stack, and staged hardware qualification gates.

## Direction and implementation status (Synced November 2, 2026)

The source of direction is the sibling SeedCore repository (`../seedcore`), specifically:

- `docs/development/current_next_steps.md`
- `docs/development/strategy/seedcore_physical_ai_execution_plan_2026_2028.md`
- `docs/development/robotics/central_world_remaining_delivery_schedule.md`
- `docs/development/robotics/central_world_acceptance_matrix.md`
- `docs/development/robotics/central_world_cw_a01_acceptance_plan.md`
- `docs/development/robotics/central_world_cw_a02_authoring.md`
- `docs/development/robotics/central_world_cw_a03_snapping.md`
- `docs/development/robotics/m0_cw_d01_register_2026_10_19.md`
- `docs/development/robotics/simulation_first_acceptance.md`
- `docs/development/robotics/mjswan_integration_assessment.md`

### Current qualification & delivery state:
- **Delivered Browser Simulation Slices (`SIM-1`, `SIM-2`, `SIM-3`)**:
  - **SIM-1 & SIM-2**: 2D Planar arm dynamics with state checkpointing, JSON exports, and Wasm ABI 1.
  - **SIM-3**: 3D Kinematic Tree Studio (`studio/tree-lab.html`) with dual-ABI Wasm (ABI 2, 13,242 bytes), **78/78 Node.js tests** + 30 native/Wasm invariant groups passing, live analytical mass matrix `M(q)`, Coriolis vector, and end-effector Jacobian `J(q)` evaluation.
- **Delivered Central World Foundation & Authoring Slices (`CW1`, `CW-A01 v2`, `CW-A02/A03`)**:
  - **CW1 Component Catalog (`c16b805`)**: Strict `.sc-part.json` v1 schema, 12 draft/proxy component records, original box-proxy GLB meshes, and read-only viewer (**107 passing tests**).
  - **CW-A01 v2 Assembly Contract (`9c8b1c0`)**: `seedcore.assembly.v2` schema, `seedcore.jcs-safe-integers.v1` RFC 8785 cross-language canonical bytes, exact catalog byte pins, `opposed_z_rx_pi` rest poses, explicit proxy `actuator_outputs`, and the 5-part `tabletop-starter.sc-assembly.json` (`0.2.0`, digest `2550d184...`), verified across **117 Python tests and 71 Node conformance tests**.
  - **CW-A02 Mini Studio & Immutable Store (`4708e06`, CW-ASM-02)**: Offline authoring shell (`ts/apps/mini-studio` & `ts/packages/robot-canvas`) with duplicate-key JSON rejection, 32-entry / 2 MiB frozen revision store, deterministic undo/redo, authority-epoch invalidation (`admission: null`), stale async asset-load fencing, and Three.js box-proxy preview (**58 TypeScript tests, 13 FastAPI tests, and 12 Chrome browser exercise groups at the CW-A02 handoff**).
  - **CW-A03 Proxy Placement (`12aa49e`, CW-SNAP-01)**: 15 mm candidate snapping, exact opposed-Z mating, non-committing ghost previews, keyboard/numeric placement and subtree reparenting. Combined CW-A02/A03 evidence: **88 TypeScript tests, 14 API tests, 18 browser exercise groups**. CW-A04 subsequently added offline DRC, routing proposals, mass/inertia calculations and an unknown-aware BOM.
- **Delivered Simulation-First Acceptance & M0 / CW-D01 Inventory**:
  - **Simulation-First Rehearsal (`c535f35`–`c50abee`)**: Pinned Microduck 0.1.0 MJCF package (recorded workbench baseline: 64 Python tests passed, 24 skipped), read-only `microduck-sim-v1` HAL adapter (61 observations / 14 policy actions / 15 servo channels), 16 upstream-derived observation/ONNX (`alpha_walking.onnx`) goldens, bounded `fast-spine-v1` simulation sessions, localhost split-screen rehearsal, Python/Rust simulation receipt verification, and local firmware review packet preparation.
  - **Oct 19 M0 / CW-D01 Source Register**: Inventories `ESP32-S3-DevKitC-1-N8R8` and `Feetech STS3215` (TTL half-duplex spec A/0, 4–7.4 V input) reference facts while keeping physical hardware qualification explicitly open (`physical_acceptance: false`—A/0 page 4 vs. page 8 connector pin-numbering and regulated servo rail setpoints require physical harness reconciliation before `CW-D01`/`G1`/`G2` closure).

The snapshot is based on the local SeedCore checkout through `636fb87`. CW-S01–S04 have local synthetic compiler, fixed-profile MuJoCo, policy preflight and gesture/replay evidence. CW-G01 has a local admission adapter under review; CW-G02 has a host-signed simulation evidence and Python verification foundation, with Rust and Studio/browser work still open. Production intake, policy execution and physical qualification remain gated. Public pages link to local summaries when a detailed source record is not yet available on GitHub. The public physics labs do not embed the localhost Mini Studio editor or grant hardware authority. Hardware harness and regulated-rail questions remain open.

## Public pages

| Path | Purpose |
| --- | --- |
| `index.html` | Technical product portal: interactive arm preview, capability cards, execution flow, illustrative trust contracts, reference builds (`SIM-3`/`CW-A02/A03`, `Microduck M0`, `Fast Spine v1`), and tech stack |
| `develop.html` | `SIM-3` 3D Tree Studio showcase, Central World `CW1` / `CW-A01 v2` / `CW-A02/A03` local authoring stack, `fast-spine-v1` session rehearsal, `M0 / CW-D01` register boundary, `mjswan 0.11.9` assessment, and active qualification gates |
| `studio/tree-lab.html` | **Live SIM-3 3D Studio**: 1/2/3-link kinematic tree dynamics, 3D orbit viewport, and live `M(q)` / `J(q)` inspectors |
| `studio/index.html` | **SIM-1/SIM-2 2D Lab**: Step-by-step physics lessons, checkpointing, replay, and JSON export |
| `diy-showcase.html` | Reference builds (`Microduck M0`, `3-link manipulator`, `Tabletop Starter / SO-100`, `Reachy Mini`) and the Central World `.sc-part.json` Parts Gallery (`CW1` & `CW-D01`) |
| `trading.html` | Future verified skills & parts exchange discovery |
| `activities.html` | Builder challenges and community experiment formats |
| `about.html` | Small-robot scope, single-use session token lifecycle, multi-layer stack, and `G0–G5` release gates |
| `contact.html` | Client-side email draft generator with topic prefilling and copy fallback |
| `resources/index.html` | November 2, 2026 source snapshot and engineering documentation pointers |
| `sitemap.html`, `sitemap.xml` | Public routes and indexing |

## Build and Stage

```sh
# Stage public files into dist/client and validate links/fragments
python3 tools/build_site.py

# Launch local preview server
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist/client
```

## Verification

```sh
# 1. Check local HTML links, fragments, and sitemap routes
python3 tools/check_site.py

# 2. Syntax-check main website script
node --check js/robotics-central.js

# 3. Run studio physics and worker tests
node --test studio/physics.test.cjs studio/simulation-worker.test.cjs studio/app-worker.test.cjs

# 4. Exercise all 13 pages at desktop/mobile widths, including both Wasm labs
# Requires Playwright and Chrome; for a sibling SeedCore install:
NODE_PATH=../seedcore/ts/node_modules node tools/check_browser.cjs
```
