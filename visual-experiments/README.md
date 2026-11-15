# KHEROTIVE Coding — Visual Experiments

Six interactive 3D experiments built with Three.js, opened from one dashboard.

## Run it
```
cd KHEROTIVE-VISUAL-EXPERIMENTS
python -m http.server 8000
```
Open http://localhost:8000 (a server is needed because the projects use ES modules).

## Structure
```
index.html                 dashboard (opens each experiment in a viewer)
assets/
  css/experiment.css       shared black theme, HUD, controls
  js/core.js               shared Three.js stage, orbit camera, HUD helper
  vendor/                  three.js (local, works offline)
experiments/
  particle-flow/           index.html + main.js
  mouse-3d-environment/
  fractal-explorer/
  kinetic-typography/
  orbital-mechanics/
  harmonic-ribbons/
```
To add an experiment: copy any folder in `experiments/`, edit its `main.js`, and add an entry to the `P` list in `index.html`.
