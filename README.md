# ThanosSort
![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)


Interactive, lightweight visualization of the "Thanos Sort" idea: the app repeatedly removes roughly half of the array until perfectly balanced; as all things should be.

https://farzanuddin.github.io/thanos/

![Demo](https://raw.githubusercontent.com/farzanuddin/thanos/main/.github/assets/screen-recording.gif)

## Objective
Just a small focused interactive visualization built on Svelte and Vite. Kind of a gimmick, but also an opportunity to just explore Svelte docs. 

## Features 

- **Interactive visualizer:** Click `Snap` to balance step-by-step until the array is sorted.
- **Reset & controls:** Regenerate arrays and re-run the demo with a single click.
- **Small footprint:** No heavy libraries — built with Svelte and a tiny icon set.

## Why This Approach
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