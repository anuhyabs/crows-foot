---
name: custom-app-400o2y2l
description: "A blank live-web-app scaffold to build FROM SCRATCH by editing its OWN\
  \ bundle files in place. Use when the user starts a new app from nothing and describes\
  \ what they want it to show and which data to use. Follow the live-app-builder skill\
  \ for HOW to design and bind a live app, but apply it to THIS app's own app.yaml,\
  \ page modules and styles.css \u2014 never create a separate skill or a new bundle.\
  \ This is the 'start from scratch' counterpart to adopting an app template."
---

New App (blank scaffold)

You are **this app's own agent**, and this app currently ships a minimal, bootable
starter bundle: an `app.yaml` (one `Home` route → `pages/home.js`, `styles.css`,
and one live `data:` source still set to the unbound-template sentinel), a
query-free `pages/home.js` empty state, and `styles.css`. When the user describes
what they want, turn that into a real live web app — its data binding, routes,
page modules and design — by rewriting **these files in place.**

## Follow `live-app-builder` for HOW to build

Do not restate the app-building rules here — they live in one place:

- `use_skill(skill_name="live-app-builder")` and apply its whole doctrine:
  resolving the room's real data, making it **live** (a re-runnable
  producer/data pipeline, never a static snapshot), authoring the `app.yaml` manifest
  (routes, styles, `data:`), writing one plain-JavaScript page module per route
  (default-exporting the render function the platform calls), and having a Grackle
  agent open the finished app in a real browser and report on every route before
  handing off.

## The ONE override: build IN PLACE, in this bundle's own files

`live-app-builder`'s from-scratch branch scaffolds a brand-new bundle. You are
not scaffolding a new one — **you already are the app bundle.** So apply its
doctrine, but:

- **Edit THIS app's own files** — its `app.yaml`, its page modules under
  `pages/`, and `styles.css`. Load them with `use_skill`, edit with the file
  tools, and **reuse this skill's existing table id** for every write. The edits
  are auto-published back onto this room instance in place when your turn settles.
- **Never create a second table/skill or a new bundle.** Any `edit_text_files` with
  `source_table_id=-1` mints a NEW table, and any table containing an `app.yaml`
  or `SKILL.md` registers as a **separate** app/skill — a stray "draft"/"bundle"
  table silently spawns a phantom app. Do not do this.
- **Bind real, live data — or none:** if the app reads room data, uncomment the
  `source:` line in `app.yaml` and write the room's real feature-view ref, provisioning a data pipeline first if the data isn't
  already live. If it doesn't (a calculator, a form, a page whose content is its
  own — or the user asked for an app without data), delete the whole `data:` block
  **and** the `refresh:` block: the scaffold's sentinel is a placeholder to replace
  or remove, never something to leave bound. Never withhold the app because the room
  has no data.
- Replace the placeholder `pages/home.js` empty state with the real page(s);
  add routes to `app.yaml` as the app grows. Keep exactly one `home: true` route.

## Build loop

0. **Clarify first** — `use_skill(skill_name="live-app-builder", step_id="clarify")`
   before any other tool call. A New App usually starts
   from a sentence, and a sentence is rarely the app: unless the request already
   says who uses it, its core features, its data and its look, ask one round of
   questions as one `request_user_answers` form — suggested answers included, the
   visual style among them — and end the turn without writing a file. Build when they
   answer, or on your suggested answers if they say "just build it".
1. **Resolve the data** from the user's description (which room source, its
   schema, how it's produced), following live-app-builder's guidance — including its
   first question, whether this app needs room data at all.
2. **Design and write the app in place** — `app.yaml` (routes, plus real `data:` when
   the app reads any), then one page module per route and `styles.css`. Reuse this
   skill's table id; persist before you reply so the canvas re-renders from what you
   wrote.
3. **Verify in a browser** (live-app-builder's verify step), fix any defect, then
   surface the live app link and invite refinements — re-writing the touched
   file(s) on each accepted change.
