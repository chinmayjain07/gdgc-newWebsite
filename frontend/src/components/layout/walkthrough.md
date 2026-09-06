# Dino Jump-Cactus Synchronization Fix — Walkthrough

## What Was Fixed

The jump animation in `SplashScreen` was corrected to guarantee that the Dino triggers its jump right before each cactus, peaks directly above the obstacle with ample clearance, and lands cleanly on the ground right after clearing it.

---

### Root Cause of Previous Behavior
1. **Desynchronized Easing**: Horizontal travel was previously using `cubic-bezier(0.2, 0.75, 0.35, 1)` (non-linear deceleration) while the separate vertical jump element used `linear` timing. This caused the horizontal position at any given time to drift out of sync with the jump arc.
2. **Transform Collisions**: Both horizontal travel and dissolution effects were applied to the same container element, causing CSS transform overwrite glitches.
3. **Low Jump Clearance**: The previous hop height (`-40px`) was too low relative to the cactus height (`34px–36px`), making the jump look like a small twitch or clipping through the obstacles.

---

### Implementation Details

#### 1. [SplashScreen.css](file:///c:/Users/DIYA/gdgc-newWebsite/frontend/src/components/layout/SplashScreen.css)
- **Unified `@keyframes dinoRunAndJump`**:
  Combined `translateX`, `translateY`, and `rotate` into a single, unified 2.1s linear keyframe animation on `.dino-runner`. This mathematically guarantees that at every horizontal coordinate, the vertical height and body angle are 100% synchronized with the cacti.
- **Physical Position Alignment**:
  - **Cactus 1**: Centered at `left: calc(50% - 180px)`, height `34px`.
    - **Takeoff**: `24%` (0.50s) at `X: -220px` (40px before cactus, on ground).
    - **Rising Arc**: `28%` (`Y: -28px`, `rotate(5deg)`) → `33%` (`Y: -48px`, `rotate(7deg)`).
    - **Peak**: `38%` (0.80s) at `X: -180px` directly above Cactus 1 with **`Y: -56px`** (a massive 22px clearance) and **`rotate(8deg)` forward leap pose**.
    - **Descending Arc**: `43%` (`Y: -48px`, `rotate(6deg)`) → `48%` (`Y: -28px`, `rotate(3deg)`).
    - **Landing**: `52%` (1.09s) at `X: -140px` (40px past cactus, clean ground touchdown at `Y: 0px`).
  - **Ground Strides**: `52%` to `58%` — Dino takes quick ground strides between `X: -140px` and `X: -120px`.
  - **Cactus 2**: Centered at `left: calc(50% - 80px)`, height `36px`.
    - **Takeoff**: `58%` (1.22s) at `X: -120px` (40px before cactus, on ground).
    - **Rising Arc**: `62%` (`Y: -28px`, `rotate(5deg)`) → `67%` (`Y: -48px`, `rotate(7deg)`).
    - **Peak**: `72%` (1.51s) at `X: -80px` directly above Cactus 2 with **`Y: -56px`** (20px clearance) and **`rotate(8deg)` forward leap pose**.
    - **Descending Arc**: `77%` (`Y: -48px`, `rotate(6deg)`) → `82%` (`Y: -28px`, `rotate(3deg)`).
    - **Landing**: `86%` (1.81s) at `X: -40px` (40px past cactus, clean ground touchdown at `Y: 0px`).
  - **Final Stride to Center**: `86%` to `100%` (1.81s – 2.10s) — Dino trots smoothly from `X: -40px` to `X: 0px` (center stage) and halts firmly.
- **Mid-air Leg Tuck Pose**:
  - `dinoLegLeftSequence` & `dinoLegRightSequence` alternate active running strides while on the ground.
  - During Jump 1 (`24% – 52%`) and Jump 2 (`58% – 86%`), both legs tuck up tightly (`translateY(-5px)`) in authentic Chrome Dino jumping posture.
- **Decoupled Dissolve Container**:
  - Moved the pixel shimmer and disintegration animation to a dedicated child container `.dino-dissolver`, ensuring zero interference with `.dino-runner`'s coordinates.

#### 2. [SplashScreen.jsx](file:///c:/Users/DIYA/gdgc-newWebsite/frontend/src/components/layout/SplashScreen.jsx)
- Nested `<div className="dino-dissolver">` inside `<div className="dino-runner">`.
- Kept all particle dissolve, magnetic vortex assembly, exit transition, and theme support completely intact.

---

## Verification
- **Production Build**: `npm run build` compiled with exit code 0 in 1.61s.
- **Local Dev Server**: Active at [http://localhost:5173/](http://localhost:5173/).
