import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from 'react';

export interface RippleHit {
  id: string;
  x: number;
  y: number;
  key: number;
}

interface CollidableTarget {
  id: string;
  el: HTMLElement;
}

interface BeeCollisionContextValue {
  registerTarget: (id: string, el: HTMLElement) => void;
  unregisterTarget: (id: string) => void;
  getTargets: () => CollidableTarget[];
  fireHit: (id: string, x: number, y: number) => void;
  ripples: RippleHit[];
  clearRipple: (key: number) => void;
}

const BeeCollisionContext = createContext<BeeCollisionContextValue | null>(
  null,
);

export function BeeCollisionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const targetsRef = useRef<CollidableTarget[]>([]);
  const hitCounter = useRef(0);
  const [ripples, setRipples] = useState<RippleHit[]>([]);

  const registerTarget = useCallback((id: string, el: HTMLElement) => {
    targetsRef.current = [
      ...targetsRef.current.filter((t) => t.id !== id),
      { id, el },
    ];
  }, []);

  const unregisterTarget = useCallback((id: string) => {
    targetsRef.current = targetsRef.current.filter((t) => t.id !== id);
  }, []);

  const getTargets = useCallback(() => targetsRef.current, []);

  const fireHit = useCallback((id: string, x: number, y: number) => {
    const key = ++hitCounter.current;
    setRipples((prev) => [...prev, { id, x, y, key }]);
  }, []);

  const clearRipple = useCallback((key: number) => {
    setRipples((prev) => prev.filter((r) => r.key !== key));
  }, []);

  return (
    <BeeCollisionContext.Provider
      value={{
        registerTarget,
        unregisterTarget,
        getTargets,
        fireHit,
        ripples,
        clearRipple,
      }}>
      {children}
    </BeeCollisionContext.Provider>
  );
}

export function useBeeCollision() {
  const ctx = useContext(BeeCollisionContext);
  if (!ctx)
    throw new Error('useBeeCollision must be used within BeeCollisionProvider');
  return ctx;
}
