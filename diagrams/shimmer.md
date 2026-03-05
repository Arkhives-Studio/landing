# Shimmer Animation

A diagonal light sweep passes across a card at regular intervals, giving the impression of a reflective surface catching light. Used on the **Competitive Play** card and the **Built for Studios** card in AI Commitments.

---

## Visual Concept

```
Card (overflow: hidden)
┌──────────────────────────────────────┐
│                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────────────┘
         ↑
  Shimmer div (200% wide, skewed -25°)
  sweeps from x=-100% to x=+100%
  gradient: transparent → primary/20 → transparent
```

---

## Animation Properties

```mermaid
flowchart TD
    subgraph Card ["Parent Card (overflow: hidden)"]
        direction TB
        C1[position: relative]
        C2[overflow: hidden ← clips shimmer outside card bounds]
    end

    subgraph Shimmer ["Shimmer motion.div (absolute, inset 0)"]
        S1["width: 200%\nheight: 100%\nposition: absolute"]
        S2["background: linear-gradient\ntransparent → primary/20 → transparent\nleft to right"]
        S3["transform: skewX -25°\n↑ diagonal angle for realistic light sweep"]
    end

    subgraph Animation ["Framer Motion animate"]
        A1["x: -100% → +100%\n(sweeps full width of card)"]
        A2["duration: 3s\nease: easeInOut"]
        A3["repeat: Infinity\nrepeatDelay: 2s\n↑ 2s pause between sweeps"]
    end

    Card --> Shimmer --> Animation
```

---

## Timeline

```mermaid
gantt
    title Shimmer cycle (one full repeat)
    dateFormat  s
    axisFormat  %Ss

    section Sweep
    Shimmer travels x -100% to +100%  :active, sweep, 0, 3s

    section Pause
    repeatDelay — shimmer offscreen    :pause, 3, 5s
```

---

## Layering

```mermaid
flowchart TD
    A["Card (relative, overflow hidden)"] --> B["Shimmer div\nz-index: auto\npointer-events: none\nabsolute inset-0"]
    A --> C["CardContent\nposition: relative\nz-index: 10\n↑ sits above shimmer so text is always readable"]
```

---

## Why `width: 200%` and `skewX(-25°)`

```mermaid
flowchart LR
    W["width 200%\n(2× card width)"] --> WR["Ensures the skewed div\ncovers the full card width\nwithout leaving gaps at the\ndiagonal edges during sweep"]
    SK["skewX -25°\n(diagonal slant)"] --> SKR["Mimics a real glare or light\nstreak hitting a surface\nat an angle — more natural\nthan a straight vertical sweep"]
```

---

## Key Files

| File | Component | Card |
|---|---|---|
| `src/components/CompetitivePlay.tsx` | `CompetitivePlay` | Competitive Play card |
| `src/components/AICommitments.tsx` | `AICommitments` | Built for Studios card |
