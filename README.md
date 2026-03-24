# ThanosSort

Interactive, lightweight visualization of the "Thanos Sort" idea: the app repeatedly removes roughly half of the array until perfectly balanced; as all things should be.

https://farzanuddin.github.io/thanos/

![Demo](https://raw.githubusercontent.com/farzanuddin/thanos/main/.github/assets/screen-recording.gif)

## Objective
Just a small focused interactive visualization built on Svelte and Vite. Kind of a gimmick, but also an opportunity to just explore Svelte docs. 

**Features**
- **Interactive visualizer:** Click `Snap` to balance step-by-step until the array is sorted.
- **Reset & controls:** Regenerate arrays and re-run the demo with a single click.
- **Small footprint:** No heavy libraries — built with Svelte and a tiny icon set.

**Tech Stack**

| Technology | Version | Role |
|---|---:|---|
| [Svelte](https://svelte.dev) | ^4.0.0 | UI framework |
| [Vite](https://vitejs.dev) | ^4.4.9 | Dev server & build tool |
| [lucide-svelte](https://github.com/lucide-icons/lucide/tree/main/packages/lucide-svelte) | ^1.0.1 | Icons |

**Why This Approach**
- Component-first: UI components keep structure simple and the visual logic focused in `src/components/ThanosVisualizer.svelte`.
- Declarative animation: state drives the visuals; small helper functions manage array generation, shuffling, and particle spawning.
- Minimal dependencies: keeps build small and fast while demonstrating readable Svelte code.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```