import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import arkImage from 'figma:asset/7ab08545f08af82bd2efde536e2ee3591e324279.png';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, input, textarea, [role="button"], [data-interactive]');
      setIsHovering(!!isInteractive);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: mousePosition.x - 24,
        y: mousePosition.y - 16,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? (isHovering ? 1.2 : 1) : 0.8,
        rotate: isHovering ? 12 : 0,
      }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { duration: 0.3, ease: "easeOut" },
        rotate: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <img
        src={arkImage}
        alt="Ark cursor"
        className="w-12 h-auto object-contain drop-shadow-lg filter brightness-110"
        draggable={false}
      />
    </motion.div>
  );
}