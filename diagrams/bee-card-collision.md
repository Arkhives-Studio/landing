# Bee–Card Collision Animation

Bees physically bounce off the "Exclusive Partner Pricing" card and trigger a gold ripple wave at the point of impact.

---

## Architecture

```mermaid
flowchart TD
    subgraph Context ["BeeCollisionContext (React Context)"]
        CT1[registerTarget / unregisterTarget]
        CT2[getTargets → CollidableTarget list]
        CT3[fireHit id, x, y]
        CT4[ripples: RippleHit state]
        CT5[clearRipple key]
    end

    subgraph App
        AP[BeeCollisionProvider wraps App tree]
    end

    subgraph FlyingBees ["FlyingBees.tsx — reads context"]
        FB1[useAnimationFrame loop]
        FB2[getTargets each frame]
        FB3{AABB collision check\nbee.x/y vs rect}
        FB4[Reflect velocity off nearest edge]
        FB5[insideRef.Set prevents repeat hits]
        FB6[fireHit target.id, bee.x, bee.y]
    end

    subgraph DesignPartner ["DesignPartner.tsx — reads context"]
        DP1[pricingCardRef → HTMLDivElement]
        DP2[registerTarget on mount\nunregisterTarget on unmount]
        DP3[cardRipples = ripples filtered by id]
        DP4[AnimatePresence renders RippleCircle]
    end

    subgraph Ripple ["RippleCircle — motion.div"]
        R1[position: absolute, overflow: hidden on card]
        R2[origin: hit point relative to card bounds]
        R3["scale: 0 → 8\nopacity: 0.6 → 0\nduration: 0.9s ease-out"]
        R4[onAnimationComplete → clearRipple]
    end

    AP --> FlyingBees
    AP --> DesignPartner
    DP1 --> DP2 --> CT1
    FB1 --> FB2 --> CT2
    FB3 -->|hit detected| FB4
    FB3 -->|hit detected| FB5
    FB3 -->|hit detected| FB6
    FB6 --> CT3 --> CT4
    CT4 --> DP3 --> DP4 --> Ripple
    R4 --> CT5
```

---

## Collision Detection (per frame)

```mermaid
flowchart LR
    A[For each bee × each target] --> B{bee.x in rect.left..right\nbee.y in rect.top..bottom}
    B -->|No| C[Delete hitKey from insideRef\nno action]
    B -->|Yes| D{hitKey in insideRef?}
    D -->|Already inside| E[Skip — prevents repeat hits]
    D -->|New entry| F[Add hitKey to insideRef]
    F --> G[fireHit → add RippleHit to context]
    F --> H[Find nearest edge\nmin of left/right/top/bottom distance]
    H --> I{Horizontal or vertical edge?}
    I -->|left edge| J[vx = -abs·vx\nx = rect.left - 1]
    I -->|right edge| K[vx = +abs·vx\nx = rect.right + 1]
    I -->|top edge| L[vy = -abs·vy\ny = rect.top - 1]
    I -->|bottom edge| M[vy = +abs·vy\ny = rect.bottom + 1]
```

---

## Ripple Lifecycle

```mermaid
sequenceDiagram
    participant Bee as FlyingBees
    participant Ctx as BeeCollisionContext
    participant Card as DesignPartner

    Bee->>Ctx: fireHit("pricing-card", x, y)
    Ctx->>Ctx: append RippleHit { id, x, y, key }
    Ctx->>Card: ripples state update
    Card->>Card: filter ripples by id
    Card->>Card: render motion.div at (x - rect.left, y - rect.top)
    Note over Card: scale 0→8, opacity 0.6→0 over 0.9s
    Card->>Ctx: onAnimationComplete → clearRipple(key)
    Ctx->>Ctx: remove RippleHit from state
```

---

## Key Files

| File | Role |
|---|---|
| `src/context/BeeCollisionContext.tsx` | Shared state: target registry + ripple hits |
| `src/components/FlyingBees.tsx` | Reads targets, runs AABB collision, fires hits |
| `src/components/DesignPartner.tsx` | Registers card ref, renders ripple overlays |
| `src/App.tsx` | Mounts `BeeCollisionProvider` at tree root |
