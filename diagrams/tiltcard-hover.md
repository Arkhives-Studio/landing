# TiltCard Mouse Hover Animation

Cards tilt in 3D perspective tracking the mouse position. When the cursor leaves, the card springs back to flat. Used on tier cards in `DesignPartner` and the two feature cards in `OriginalsForge`.

---

## Data Flow

```mermaid
flowchart TD
    subgraph Inputs
        MM[onMouseMove event\nclientX, clientY]
        ML[onMouseLeave event]
    end

    subgraph MotionValues ["Framer Motion Values (raw, no lag)"]
        MX[x = MotionValue\nnormalized -0.5 to +0.5]
        MY[y = MotionValue\nnormalized -0.5 to +0.5]
    end

    subgraph Springs ["Spring-smoothed Values"]
        SX[mouseXSpring = useSpring x\nsmooth interpolation]
        SY[mouseYSpring = useSpring y\nsmooth interpolation]
    end

    subgraph Transforms ["useTransform — map to degrees"]
        RX["rotateX = mouseYSpring\n[-0.5, +0.5] → [+17.5°, -17.5°]\n(inverted: moving up tilts top toward viewer)"]
        RY["rotateY = mouseXSpring\n[-0.5, +0.5] → [-17.5°, +17.5°]\n(moving right tilts right toward viewer)"]
    end

    subgraph Output ["motion.div — 3D card"]
        O1[style: rotateX, rotateY\ntransformStyle: preserve-3d]
        O2[inner div\ntransform: translateZ 50px\ntransformStyle: preserve-3d\npushes content toward viewer]
    end

    MM --> NORM[Normalize cursor within card bounds\nx = clientX/width - left/width - 0.5\ny = clientY/height - top/height - 0.5]
    NORM --> MX
    NORM --> MY
    ML --> RESET[x.set 0\ny.set 0]
    RESET --> MX
    RESET --> MY
    MX --> SX --> RY --> O1
    MY --> SY --> RX --> O1
    O1 --> O2
```

---

## Coordinate Mapping

```mermaid
flowchart LR
    subgraph CursorPosition ["Cursor position in card (normalized)"]
        TL["top-left\n x=-0.5, y=-0.5"]
        TC["top-center\n x=0, y=-0.5"]
        TR["top-right\n x=+0.5, y=-0.5"]
        ML2["mid-left\n x=-0.5, y=0"]
        MC["center\n x=0, y=0"]
        MR["mid-right\n x=+0.5, y=0"]
        BL["bottom-left\n x=-0.5, y=+0.5"]
        BC["bottom-center\n x=0, y=+0.5"]
        BR["bottom-right\n x=+0.5, y=+0.5"]
    end

    subgraph ResultingTilt ["Resulting 3D tilt"]
        TL --> R1["rotateX +17.5°\nrotateY -17.5°\ntop-left corner lifts"]
        TR --> R2["rotateX +17.5°\nrotateY +17.5°\ntop-right corner lifts"]
        BL --> R3["rotateX -17.5°\nrotateY -17.5°\nbottom-left corner lifts"]
        BR --> R4["rotateX -17.5°\nrotateY +17.5°\nbottom-right corner lifts"]
        MC --> R5["rotateX 0°\nrotateY 0°\nflat"]
    end
```

---

## Spring Behavior

```mermaid
sequenceDiagram
    participant Mouse
    participant Raw as Raw MotionValue x/y
    participant Spring as Spring-smoothed Value
    participant Card as Card rotation

    Mouse->>Raw: set(normalizedPosition) — instant
    Raw->>Spring: spring interpolates toward target\n(natural easing, slight overshoot)
    Spring->>Card: rotateX / rotateY update every frame

    Note over Mouse,Card: On mouse leave
    Mouse->>Raw: set(0) — instant
    Raw->>Spring: spring eases back to 0
    Spring->>Card: card returns to flat with spring physics
```

---

## DOM Structure

```mermaid
flowchart TD
    A["motion.div\nref attached for getBoundingClientRect\nonMouseMove / onMouseLeave handlers\nstyle: rotateX, rotateY, transformStyle preserve-3d"] --> B["div\ntransform: translateZ 50px\ntransformStyle: preserve-3d\n↑ pushes child content closer to viewer\ncreates depth illusion"]
    B --> C[children — card content]
```

---

## Key Files

| File | Usage |
|---|---|
| `src/components/DesignPartner.tsx` | `TiltCard` wraps each of the 3 tier cards |
| `src/components/OriginalsForge.tsx` | `TiltCard` wraps Arkhives Originals and Forge Platform cards |
