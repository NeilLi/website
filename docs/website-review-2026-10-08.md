# Website review · October 8, 2026

## Direction used

Reviewed the sibling `../seedcore` application direction, physical AI strategy,
customer solution delivery, current queue, robotics index, simulator roadmap,
and Mini Robot Lab documentation. The product is a trust runtime for physical
AI. Microduck is the planned first integration; a useful customer job is the
starting point. The larger robotics world is an ambition, not a claim of
existing marketplace or fleet capability.

Checked the upstream [Microduck project](https://github.com/pollen-robotics/microduck)
and [Reachy Mini documentation](https://huggingface.co/docs/reachy_mini/index)
for appropriate original-project links. Removed the draft's unsourced hardware
prices, configurations, and speculative technical specifications instead of
presenting them as purchasing recommendations.

## Material issues found and resolved

| Severity | Draft finding | Revision |
| --- | --- | --- |
| High | Contact form displayed “dispatched” without sending or storing anything; original studio email replaced with an unrelated personal address | Restored established `hello@seedcore.ai`; prepares an email draft with accurate instructions and copy fallback |
| High | Homepage and development copy claimed live Wasm/MuJoCo execution, instant hardware revocation, direct policy flashing, and broad qualification | Working lab included; kinematics preview labelled; local SIM-1 scope and planned SIM-2–SIM-6 clearly distinguished |
| High | Marketplace invented stock, prices, certification, downloadable policies, and audit turnaround | Exchange becomes a clearly labelled discovery concept with concrete feedback paths |
| High | Activities invented funded grants, tournament dates, prize pools, and registrations | Three immediately usable self-guided experiments; future sessions clearly proposed |
| High | About page claimed absolute torque safety and risk-free home robotics | Replaced with SeedCore's proposal/admission/local enforcement/evidence boundary and body-specific validation requirements |
| Medium | Build silently skipped missing files, left stale output, omitted existing legal-page CSS, and shipped outdated sitemaps | Explicit manifest fails early, validates dependency closure, replaces generated client output, retains worker/metadata and legal CSS, updates sitemaps |
| Medium | Several inner pages lost navigation on phones; toggling mutated inline styles and survived resize incorrectly | Shared accessible menu, expanded state, Escape/outside-click close, breakpoint reset, and no-JS links |
| Medium | Preview IK could divide by zero at the origin; touch/keyboard controls and reduced motion were incomplete | Replaced with a bounded kinematic illustration, explicit pause control, elapsed-time animation, reduced-motion and hidden-tab handling; real experiments go to the lab |
| Medium | SeedCore brand was displaced by an unsupported “global platform” claim | SeedCore remains primary; Mini Robotics Central is the public robotics world |
| Medium | Old resource landing page linked to removed homepage sections and described deferred directions as current | Updated existing research entry point to the current robotics direction |

## Result

A consistent public site with a clickable SVG world map, four districts,
concept robot illustrations, filterable references, an actual browser lab,
source-grounded roadmap, and a truthful contact handoff. Runtime source is
vendored separately with provenance; physics and worker files are unchanged.

## Verification

- Staged dependency checker passed: 12 HTML pages, all local targets and
  fragments, CSS/worker dependencies, and sitemap routes.
- 33 included tests passed: physics invariants, worker/tick/buffer boundaries,
  and UI acknowledgement/replay/export behavior.
- Chrome browser checks passed at 1440, 768, 390, and 320 pixels with no
  horizontal overflow, browser exceptions, or failed HTTP requests.
- Mobile menu, desktop resize, Escape, gallery filtering and hidden deep-link
  reveal, no-JavaScript navigation, query-prefilled contact and correctly
  encoded draft, reduced motion, and lab step/reset/run/replay/export checked.
- A real browser lab run exported all 361 observations and identified its
  source as `local_research_simulation`.
- Desktop and phone screenshots inspected; desktop menu visibility and header
  logo sizing corrected during visual review.

## Remaining concerns outside this website revision

The existing privacy and terms pages contain registered-office placeholders
and older service/data-processing descriptions. Their legal copy is preserved;
the required stylesheet now ships. Business details and applicable wording
need the owner's review before public release. No legal compliance claim is
made by this revision.

An actual marketplace, event registration, automated development pipeline,
governed skill loader, or hardware execution integration needs separate product
work and acceptance evidence. Public hosting, mailbox delivery, and behavior in
browsers other than Chrome have not been verified. This revision stages a local
preview; it does not deploy, commit, or push.
