# FlyingBees Animation

Six bees fly autonomously around the viewport. Each bee steers toward random targets, occasionally breaks into circular loops, leaves a fading dot trail, and bounces off screen edges.

---

## Bee State Shape

```mermaid
classDiagram
    class BeeData {
        +number id
        +number x
        +number y
        +number vx
        +number vy
        +TrailPoint[] trail
        +number targetX
        +number targetY
        +number changeTargetTimer
        +number circleProgress
        +number nextCircleTimer
        +number circleCenterX
        +number circleCenterY
        +number circleRadius
        +number circleStartAngle
        +number circleDirection
    }
    class TrailPoint {
        +number x
        +number y
        +number age
    }
    BeeData --> TrailPoint
```

---

## Per-Frame Animation Loop (useAnimationFrame)

```mermaid
flowchart TD
    START([Frame tick]) --> DT[Decrement changeTargetTimer\nDecrement nextCircleTimer]

    DT --> CC{nextCircleTimer ≤ 0\nAND circleProgress = 0?}
    CC -->|Yes| CS[Start circle:\nset circleProgress = 0.01\nrecord center x/y\nreset nextCircleTimer 6–20s]
    CC -->|No| CM

    CS --> CM{circleProgress > 0\nAND < 1?}
    CM -->|Yes — circling| CI[circleProgress += 0.008\nCalculate angle on circle\nSteer velocity toward circle point\nstrength = 0.15]
    CI --> CD{circleProgress ≥ 1?}
    CD -->|Yes| CE[Reset circleProgress = 0\nApply exit momentum velocity]
    CD -->|No| VL
    CM -->|No — normal flight| NF

    NF --> TT{changeTargetTimer ≤ 0?}
    TT -->|Yes| NT[Pick new random targetX/Y\nReset changeTargetTimer 2–5s]
    TT -->|No| ST[Steer toward target\nacc = direction × 0.03]
    NT --> ST
    ST --> RN[Add random noise ±0.05]
    RN --> VL

    CE --> VL[Clamp speed to maxSpeed = 3]
    VL --> UP[x += vx\ny += vy]
    UP --> COL[Card collision check\nsee bee-card-collision diagram]
    COL --> EB{Outside viewport?}
    EB -->|x out of bounds| BX[vx *= -0.8\nclamp x to 0..innerWidth]
    EB -->|y out of bounds| BY[vy *= -0.8\nclamp y to 0..innerHeight]
    EB -->|inside| TR
    BX --> TR
    BY --> TR
    TR[Update trail:\nprepend current position\nincrement age on all points\nkeep last 20] --> END([Next frame])
```

---

## Visual Rendering

```mermaid
flowchart LR
    subgraph SVG ["SVG layer (absolute, full viewport)"]
        T1[Trail path — dashed polyline\nstroke #221a14, opacity 0.4]
        T2[Trail particles — circles\nsize and opacity fade with age\nmax age 20 frames]
    end

    subgraph DOM ["DOM layer (fixed overlay)"]
        B1[motion.div per bee\nposition: absolute at bee.x/y\nrotation = atan2 vy/vx]
        B2[Outer motion: scale pulse\n0.9 → 1.1 → 0.9\nperiod 2.5–3.7s per bee]
        B3[Inner motion: wing wobble\nrotate 0 → 10 → -10 → 0\nperiod 0.8s]
        B4[LowPolyBee SVG\nbody + head + wings + stripes\nantennae + eyes]
    end

    SVG --> DOM
```

---

## Initialization

```mermaid
flowchart LR
    A[useEffect on mount] --> B[Create 6 BeeData objects]
    B --> C{Pick random spawn\nposition 0–7}
    C --> D[0: top edge]
    C --> E[1: right edge]
    C --> F[2: bottom edge]
    C --> G[3: left edge]
    C --> H[4–7: corners]
    D & E & F & G & H --> I[Assign random:\nvx/vy ±1\ntargetX/Y random in viewport\nchangeTargetTimer 200–500\nnextCircleTimer 400–1200\ncircleRadius 40–70px\ncircleDirection ±1]
```

---

## Key File

| File | Role |
|---|---|
| `src/components/FlyingBees.tsx` | All bee state, animation loop, and rendering |
