# SeedCore source review and website revision — October 12, 2026

Reviewed the seven requested commits, ending at
`bb711b69c5c39cd644826c1ff31b72118605894c`, against the local SeedCore
implementation and the existing Mini Robotics Central website draft.
This is an implementation/status review for website accuracy, not an exhaustive
security audit or physical-robot qualification. SeedCore source was not changed.

## Commit review

| Commit | Finding | Website response |
| --- | --- | --- |
| `5402f7a` | The narrow SIM-2 slice ships a C++/Wasm two-link core and same-build checkpoints; broader release qualification remains open. | Refresh the embedded runtime, binary, build identity, tests, and save/resume controls. Correct the SIM-2 status. |
| `e556cd3` | Native MuJoCo workbench and optional agent tools implement bounded experiments for a limited authoring subset. | Add a source-repository workbench path; distinguish native tools from the browser lesson. |
| `21821a2` | CAD toolkit assessment defines an integration sequence; adapters are not implemented. | Link the assessment and mark CAD integration planned. |
| `d07ac71` | Model packages verify a pinned inventory and compiled parity, with a Microduck reference. Inspection does not make the torque-controller experiment API compatible with Microduck position actuators. | Describe model ingestion and inspection accurately; keep actuator-aware experiments and hardware qualification open. |
| `bfb32bc` | Embodied-AI research informs architecture, but paper claims are not SeedCore implementation evidence. | Add research pointers with explicit implementation status. |
| `edff1e7` | Mini-robotics priorities emphasize local enforcement and action-bound evidence for the Microduck milestone. | Explain the proposed development-to-execution path and the allowed/denied/interrupted milestone. |
| `bb711b6` | Developer blueprint provides useful role separation but mixes target behavior with current capabilities. | Add a developer path without presenting proposed hardware/browser integrations as shipped. |

## Source issues affecting public claims

1. **Blueprint sections 1 and 7 overstate physical safety.** Low mass and torque
   alone do not substantiate the categorical “Safe-by-Physics” and cannot-injure
   claims. The site makes no blanket child-safety promise and requires
   robot-specific qualification of limits and stopping behavior.
2. **Blueprint section 6 presents a future browser-to-hardware flow as current.**
   The actual browser app is a custom fixed-base two-link engine without a
   robot importer or hardware connection. Native MuJoCo is implemented;
   browser MuJoCo and the Microduck hardware adapter remain planned according
   to their implementation documents.
3. **Blueprint section 4 is illustrative firmware, not a complete execution
   boundary.** Its example packet handler clears the stopped flag on each
   CRC-valid packet; it does not implement the session/token/replay and explicit
   resume requirements in the execution contract. The website points to those
   requirements instead of treating this snippet as deployable firmware.

These findings were not fixed in the sibling SeedCore repository; they inform
this website's wording. New research links are pinned to the reviewed commit.

## Website changes

- Preserve the existing four-district design and local in-progress website work.
- Expand Robot Lab with native workbench, package ingestion, agent workflow,
  developer architecture, and separately labelled hardware milestones.
- Update homepage, About, Microduck gallery status, and research resources.
- Refresh vendored runtime and expose save/resume alongside recorded replay.
- Stage all Wasm dependencies; recursively validate worker script dependencies
  and the Wasm request path.
- Extend browser checks to save, reset, import and continue a checkpoint, then
  verify a complete 361-sample export from the C++/Wasm backend.

## Verification

- 40 vendored physics/worker/UI tests passed.
- 88 SeedCore model-package and MuJoCo-workbench tests passed (two dependency
  deprecation warnings). No live agent provider or robot was connected.
- Static build checks passed: 12 pages, links/fragments, CSS, worker dependencies,
  Wasm dependency and sitemap routes; 29 public files staged.
- Browser checks cover 12 routes at 1440, 768, 390 and 320 pixels, navigation,
  filters, contact draft, reduced motion, and lab interaction/save/resume/export.
- Desktop and mobile Developer page screenshots inspected for layout.
- No full cross-browser, release-device, native compiler rebuild or physical
  safety qualification is claimed.
