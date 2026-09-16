# SeedCore Application Studio Website

This repository contains the public website for SeedCore, an independent application studio exploring digital cities, tourist journeys, family creativity, trusted collecting, and friendly robotics.

The website is intentionally application-first. It explains the person, moment, and experience behind each idea while keeping deeper implementation details in the development notebook.

## Main pages

- `index.html` — application portfolio and studio positioning
- `about.html` — the studio story and working style
- `resources/index.html` — human-readable field notes with links to the deeper SeedCore development docs
- `contact.html` — a privacy-friendly email handoff for new conversations

## Run locally

Serve the directory with any static web server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Content direction

The public story centers on five application worlds:

1. Digital City
2. Tourist Design Studio
3. Family Journey
4. Craft & Collectibles — handicrafts, artisan objects, and treasured finds
5. Robot Moments

The existing technical and research pages remain in the repository as background material, but they are no longer part of the main public navigation or sitemap.

## Blender navigation entrance

The homepage uses an original orthographic render from the sibling SeedCore
project, with four scene hotspots and five application links. All destinations
open the existing application descriptions; this does not embed the Godot app.
Links work without JavaScript. With JavaScript, hidden filter results are
revealed before navigation and keyboard focus moves to the destination heading.
Small screens use numbered scene pins and full destination cards below them.

- Image: `images/seedcore-blender-entrance.png`
- Layout: `index.html` and `css/entrance.css`
- Interactions: `js/application-site.js`
- Editable Blender source: `../seedcore/apps/neighborhood-guide/assets/blender/neighborhood_entrance.blend`

After re-rendering the Blender source, copy its `assets/illustrations/entrance_render.png`
to the website image path above. The image uses a 3:2 aspect ratio. If the camera
or anchors change, update the percentage positions in `index.html` from the
source project's generated `scripts/entrance_layout.gd` (multiply by 100).
The website maps textile → Tourist Design Studio and guide → Robot Moments;
Family Journey remains a separate fifth destination card.

Stage the static website for its existing Sites asset worker:

```bash
python3 tools/build_site.py
```

This refreshes `dist/client` and deployment metadata without publishing.
