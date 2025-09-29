import { motion, useAnimationFrame } from "motion/react";
import { useEffect, useState, useRef } from "react";

interface BeeData {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number; age: number }[];
  targetX: number;
  targetY: number;
  changeTargetTimer: number;
  circleProgress: number;
  nextCircleTimer: number;
  circleCenterX: number;
  circleCenterY: number;
  circleRadius: number;
  circleStartAngle: number;
  circleDirection: number;
}

export function FlyingBees() {
  const [bees, setBees] = useState<BeeData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize bees starting from random sides and corners of the screen
    const initialBees: BeeData[] = Array.from({ length: 6 }, (_, i) => {
      const position = Math.floor(Math.random() * 8); // 0-7: 4 sides + 4 corners
      let x, y;
      
      switch (position) {
        case 0: // Top side
          x = Math.random() * window.innerWidth;
          y = -50;
          break;
        case 1: // Right side
          x = window.innerWidth + 50;
          y = Math.random() * window.innerHeight;
          break;
        case 2: // Bottom side
          x = Math.random() * window.innerWidth;
          y = window.innerHeight + 50;
          break;
        case 3: // Left side
          x = -50;
          y = Math.random() * window.innerHeight;
          break;
        case 4: // Top-left corner
          x = -50;
          y = -50;
          break;
        case 5: // Top-right corner
          x = window.innerWidth + 50;
          y = -50;
          break;
        case 6: // Bottom-right corner
          x = window.innerWidth + 50;
          y = window.innerHeight + 50;
          break;
        case 7: // Bottom-left corner
        default:
          x = -50;
          y = window.innerHeight + 50;
          break;
      }
      
      return {
        id: i + 1,
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        trail: [],
        targetX: Math.random() * window.innerWidth,
        targetY: Math.random() * window.innerHeight,
        changeTargetTimer: Math.random() * 300 + 200, // 2-5 seconds at 60fps
        circleProgress: 0,
        nextCircleTimer: Math.random() * 800 + 400, // Random time until next circle (6-20 seconds)
        circleCenterX: 0,
        circleCenterY: 0,
        circleRadius: 40 + Math.random() * 30, // Random radius between 40-70px
        circleStartAngle: 0,
        circleDirection: Math.random() > 0.5 ? 1 : -1, // Clockwise or counter-clockwise
      };
    });
    setBees(initialBees);
  }, []);

  useAnimationFrame(() => {
    setBees(prevBees => 
      prevBees.map(bee => {
        let newBee = { ...bee };

        // Decrease timers
        newBee.changeTargetTimer -= 1;
        newBee.nextCircleTimer -= 1;

        // Start a circle when timer reaches 0
        if (newBee.nextCircleTimer <= 0 && newBee.circleProgress === 0) {
          newBee.circleProgress = 0.01; // Start the circle
          newBee.circleCenterX = newBee.x; // Center circle at current position
          newBee.circleCenterY = newBee.y;
          newBee.circleStartAngle = Math.atan2(newBee.y - newBee.circleCenterY, newBee.x - newBee.circleCenterX);
          newBee.nextCircleTimer = Math.random() * 800 + 400; // Next circle in 6-20 seconds
        }

        if (newBee.circleProgress > 0 && newBee.circleProgress < 1) {
          // Performing circular motion
          newBee.circleProgress += 0.008; // Complete circle in ~2 seconds at 60fps
          
          // Calculate position on circle
          const currentAngle = newBee.circleStartAngle + (newBee.circleProgress * Math.PI * 2 * newBee.circleDirection);
          const targetX = newBee.circleCenterX + Math.cos(currentAngle) * newBee.circleRadius;
          const targetY = newBee.circleCenterY + Math.sin(currentAngle) * newBee.circleRadius;
          
          // Smooth movement towards circle position
          const circleStrength = 0.15;
          newBee.vx += (targetX - newBee.x) * circleStrength;
          newBee.vy += (targetY - newBee.y) * circleStrength;
          
          // Complete the circle
          if (newBee.circleProgress >= 1) {
            newBee.circleProgress = 0;
            // Give bee some momentum coming out of the circle
            const exitSpeed = 2;
            newBee.vx = Math.cos(currentAngle + Math.PI/4) * exitSpeed;
            newBee.vy = Math.sin(currentAngle + Math.PI/4) * exitSpeed;
          }
        } else {
          // Normal flight behavior when not circling
          
          // Change target when timer reaches 0
          if (newBee.changeTargetTimer <= 0) {
            newBee.targetX = Math.random() * window.innerWidth;
            newBee.targetY = Math.random() * window.innerHeight;
            newBee.changeTargetTimer = Math.random() * 300 + 200;
          }

          // Move towards target
          const dx = newBee.targetX - newBee.x;
          const dy = newBee.targetY - newBee.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 10) {
            newBee.vx += (dx / distance) * 0.03;
            newBee.vy += (dy / distance) * 0.03;
          }

          // Add some random movement
          newBee.vx += (Math.random() - 0.5) * 0.1;
          newBee.vy += (Math.random() - 0.5) * 0.1;
        }

        // Limit velocity
        const maxSpeed = 3;
        const speed = Math.sqrt(newBee.vx * newBee.vx + newBee.vy * newBee.vy);
        if (speed > maxSpeed) {
          newBee.vx = (newBee.vx / speed) * maxSpeed;
          newBee.vy = (newBee.vy / speed) * maxSpeed;
        }

        // Update position
        newBee.x += newBee.vx;
        newBee.y += newBee.vy;

        // Bounce off edges
        if (newBee.x < 0 || newBee.x > window.innerWidth) {
          newBee.vx *= -0.8;
          newBee.x = Math.max(0, Math.min(window.innerWidth, newBee.x));
        }
        if (newBee.y < 0 || newBee.y > window.innerHeight) {
          newBee.vy *= -0.8;
          newBee.y = Math.max(0, Math.min(window.innerHeight, newBee.y));
        }

        // Update trail
        newBee.trail = [
          { x: newBee.x, y: newBee.y, age: 0 },
          ...newBee.trail.slice(0, 19).map(point => ({ ...point, age: point.age + 1 }))
        ];

        return newBee;
      })
    );
  });

  const LowPolyBee = ({ className }: { className?: string }) => (
    <svg width="42" height="42" viewBox="0 0 32 32" className={className}>
      {/* Body - simplified oval shape */}
      <ellipse
        cx="16"
        cy="16"
        rx="6"
        ry="9"
        fill="#dbbd14"
        stroke="#221a14"
        strokeWidth="1"
      />
      
      {/* Head - circular */}
      <circle
        cx="16"
        cy="8"
        r="4"
        fill="#dbbd14"
        stroke="#221a14"
        strokeWidth="1"
      />
      
      {/* Wings - simplified geometric shapes */}
      <ellipse
        cx="10"
        cy="12"
        rx="4"
        ry="6"
        fill="rgba(255,255,255,0.8)"
        stroke="#221a14"
        strokeWidth="0.8"
        transform="rotate(-20 10 12)"
      />
      
      <ellipse
        cx="22"
        cy="12"
        rx="4"
        ry="6"
        fill="rgba(255,255,255,0.8)"
        stroke="#221a14"
        strokeWidth="0.8"
        transform="rotate(20 22 12)"
      />
      
      {/* Simplified stripes */}
      <rect x="12" y="12" width="8" height="2" fill="#221a14" rx="1" />
      <rect x="12" y="16" width="8" height="2" fill="#221a14" rx="1" />
      <rect x="12" y="20" width="8" height="2" fill="#221a14" rx="1" />
      
      {/* Simple antennae */}
      <line x1="14" y1="6" x2="13" y2="4" stroke="#221a14" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="6" x2="19" y2="4" stroke="#221a14" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="4" r="1" fill="#221a14" />
      <circle cx="19" cy="4" r="1" fill="#221a14" />
      
      {/* Eyes */}
      <circle cx="14" cy="7" r="1" fill="#221a14" />
      <circle cx="18" cy="7" r="1" fill="#221a14" />
    </svg>
  );

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-5">
      <svg className="absolute inset-0 w-full h-full">
        {bees.map((bee) =>
          bee.trail.length > 1 && (
            <g key={`trail-${bee.id}`}>
              {/* Trail path */}
              <path
                d={`M ${bee.trail.map(point => `${point.x},${point.y}`).join(' L ')}`}
                stroke="#221a14"
                strokeWidth="2"
                fill="none"
                strokeOpacity="0.4"
                strokeDasharray="3,2"
              />
              
              {/* Trail particles with fade */}
              {bee.trail.map((point, index) => {
                const opacity = Math.max(0, 1 - (point.age / 20));
                const size = Math.max(0.5, 2 - (point.age / 10));
                
                return (
                  <circle
                    key={`particle-${bee.id}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={size}
                    fill="#221a14"
                    opacity={opacity * 0.6}
                  />
                );
              })}
            </g>
          )
        )}
      </svg>

      {bees.map((bee) => {
        const rotation = Math.atan2(bee.vy, bee.vx) * (180 / Math.PI);
        
        return (
          <motion.div
            key={bee.id}
            className="absolute"
            style={{
              left: bee.x - 21,
              top: bee.y - 21,
              transform: `rotate(${rotation}deg)`,
            }}
            animate={{
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2.5 + (bee.id % 4) * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <LowPolyBee className="drop-shadow-lg" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}