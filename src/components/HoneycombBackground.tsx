import { motion } from "motion/react";
import { useRef, useState, useEffect } from "react";

export function HoneycombBackground() {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial dimensions
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);

    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create multiple layers of honeycomb patterns for full screen coverage
  const createHexagonLayer = (rows: number, cols: number, size: number, offset: { x: number, y: number }) => {
    const hexagons = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * (size * 1.5) + (row % 2) * (size * 0.75) + offset.x;
        const y = row * (size * 0.866) + offset.y;
        
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const px = x + size * Math.cos(angle);
          const py = y + size * Math.sin(angle);
          points.push(`${px},${py}`);
        }
        
        hexagons.push(
          <motion.polygon
            key={`${row}-${col}`}
            points={points.join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.44"
            strokeOpacity="0.12"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 4,
              delay: (row + col) * 0.02,
              ease: "easeInOut"
            }}
          />
        );
      }
    }
    return hexagons;
  };

  // Create filled hexagons for depth
  const createFilledHexagons = (count: number, viewWidth: number, viewHeight: number) => {
    const hexagons = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * viewWidth;
      const y = Math.random() * viewHeight;
      const size = dimensions.width / 60 + Math.random() * (dimensions.width / 40);
      
      const points = [];
      for (let j = 0; j < 6; j++) {
        const angle = (Math.PI / 3) * j;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        points.push(`${px},${py}`);
      }
      
      hexagons.push(
        <motion.polygon
          key={`filled-${i}`}
          points={points.join(' ')}
          fill="currentColor"
          fillOpacity="0.19"
          stroke="currentColor"
          strokeWidth="0.72"
          strokeOpacity="0.23"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 3,
            delay: i * 0.08,
            ease: "easeOut"
          }}
        />
      );
    }
    return hexagons;
  };

  // Create animated random hexagons that fade in/out
  const createAnimatedHexagons = (count: number, viewWidth: number, viewHeight: number) => {
    const hexagons = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * viewWidth;
      const y = Math.random() * viewHeight;
      const minSize = dimensions.width / 80;
      const maxSize = dimensions.width / 30;
      const size = minSize + Math.random() * (maxSize - minSize);
      
      const points = [];
      for (let j = 0; j < 6; j++) {
        const angle = (Math.PI / 3) * j;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        points.push(`${px},${py}`);
      }

      const animationDelay = Math.random() * 10;
      const animationDuration = 4 + Math.random() * 6;
      const maxOpacity = 0.23 + Math.random() * 0.12;
      
      hexagons.push(
        <motion.polygon
          key={`animated-${i}`}
          points={points.join(' ')}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, maxOpacity, maxOpacity, 0],
            scale: [0.5, 1, 1, 0.8]
          }}
          transition={{
            duration: animationDuration,
            delay: animationDelay,
            repeat: Infinity,
            repeatDelay: Math.random() * 8,
            ease: "easeInOut"
          }}
        />
      );
    }
    return hexagons;
  };

  return (
    <div ref={ref} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main honeycomb pattern layer */}
      <motion.div
        className="absolute inset-0 text-secondary opacity-75"
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {createHexagonLayer(
            Math.ceil(dimensions.height / 70) + 5, 
            Math.ceil(dimensions.width / (dimensions.width / 24 * 1.5)) + 4, 
            dimensions.width / 24, 
            { x: -dimensions.width / 48, y: -dimensions.width / 40 }
          )}
        </svg>
      </motion.div>

      {/* Secondary layer with offset */}
      <motion.div
        className="absolute inset-0 text-secondary opacity-65"
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {createHexagonLayer(
            Math.ceil(dimensions.height / 90) + 4, 
            Math.ceil(dimensions.width / (dimensions.width / 28 * 1.5)) + 4, 
            dimensions.width / 28, 
            { x: dimensions.width * 0.02, y: -dimensions.width / 50 }
          )}
        </svg>
      </motion.div>

      {/* Filled accent hexagons */}
      <motion.div
        className="absolute inset-0 text-secondary opacity-80"
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {createFilledHexagons(
            Math.ceil((dimensions.width * dimensions.height) / 80000), 
            dimensions.width, 
            dimensions.height
          )}
        </svg>
      </motion.div>

      {/* Animated random hexagons layer */}
      <motion.div
        className="absolute inset-0 text-secondary opacity-60"
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {createAnimatedHexagons(
            Math.ceil((dimensions.width * dimensions.height) / 200000), 
            dimensions.width, 
            dimensions.height
          )}
        </svg>
      </motion.div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/3 to-background/8" />
    </div>
  );
}