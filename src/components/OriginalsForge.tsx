import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

function TiltCard({ children, className = '' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ['17.5deg', '-17.5deg'],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ['-17.5deg', '17.5deg'],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY: rotateY,
        rotateX: rotateX,
        transformStyle: 'preserve-3d',
      }}
      className={className}>
      <div
        style={{
          transform: 'translateZ(75px)',
          transformStyle: 'preserve-3d',
        }}>
        {children}
      </div>
    </motion.div>
  );
}

export function OriginalsForge() {
  return (
    <section className='py-24 px-6 bg-card/30'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl mb-4 text-foreground'>
            Two Worlds, One Vision
          </h2>
          <p className='text-xl text-muted max-w-3xl mx-auto'>
            Experience premium games through Arkhives Originals, or create your
            own with the power of Forge.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Arkhives Originals */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}>
            <TiltCard>
              <Card className='h-full bg-primary/10 border-primary/20 backdrop-blur-sm'>
                <CardContent className='p-8'>
                  <div className='mb-6'>
                    <div className='w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4'>
                      <svg
                        width='32'
                        height='32'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='text-primary-foreground'>
                        <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                      </svg>
                    </div>
                    <h3 className='text-3xl mb-4 text-foreground'>
                      Arkhives Originals
                    </h3>
                    <p className='text-muted mb-6'>
                      Immerse yourself in handcrafted gaming experiences. Each
                      title is meticulously designed to deliver unprecedented
                      depth, storytelling, and player agency.
                    </p>
                  </div>

                  <div className='space-y-3 mb-8'>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full'></div>
                      <span className='text-sm text-muted'>
                        Premium single-player campaigns
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full'></div>
                      <span className='text-sm text-muted'>
                        Steam Deck optimized experiences
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full'></div>
                      <span className='text-sm text-muted'>
                        PC Handheld first Premium Gaming Experiences
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full'></div>
                      <span className='text-sm text-muted'>
                        Innovative gameplay mechanics
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full'></div>
                      <span className='text-sm text-muted'>
                        Artist-driven narratives
                      </span>
                    </div>
                  </div>

                  {/* TODO: Uncomment when ready to show CTA button */}
                  {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Explore Games
                    </Button>
                  </motion.div> */}
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>

          {/* Forge */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}>
            <TiltCard>
              <Card className='h-full bg-secondary/10 border-secondary/20 backdrop-blur-sm'>
                <CardContent className='p-8'>
                  <div className='mb-6'>
                    <div className='w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mb-4'>
                      <svg
                        width='32'
                        height='32'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-secondary-foreground'>
                        {/* Hammer head */}
                        <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
                        {/* Forge/anvil base */}
                        <rect
                          x='2'
                          y='18'
                          width='20'
                          height='3'
                          rx='1'
                          fill='currentColor'
                          opacity='0.3'
                        />
                        {/* Sparks/creation elements */}
                        <circle
                          cx='18'
                          cy='5'
                          r='1'
                          fill='currentColor'
                          opacity='0.6'
                        />
                        <circle
                          cx='20'
                          cy='7'
                          r='0.5'
                          fill='currentColor'
                          opacity='0.6'
                        />
                        <circle
                          cx='16'
                          cy='3'
                          r='0.5'
                          fill='currentColor'
                          opacity='0.6'
                        />
                      </svg>
                    </div>
                    <h3 className='text-3xl mb-4 text-foreground'>
                      Forge Platform
                    </h3>
                    <p className='text-muted mb-6'>
                      Empower your creativity with comprehensive development
                      tools. Build games, interactive experiences, and cinematic
                      content using Unreal Engine 5+. Perfect for film, TV, and
                      movie production studios.
                    </p>
                  </div>

                  <div className='space-y-3 mb-8'>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-secondary rounded-full'></div>
                      <span className='text-sm text-muted'>
                        No-code game builder
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-secondary rounded-full'></div>
                      <span className='text-sm text-muted'>
                        Unreal Engine 5+ integration
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-secondary rounded-full'></div>
                      <span className='text-sm text-muted'>
                        Film, TV & movie production tools
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-secondary rounded-full'></div>
                      <span className='text-sm text-muted'>
                        Advanced scripting & pipeline tools
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-secondary rounded-full'></div>
                      <span className='text-sm text-muted'>
                        Revenue sharing program
                      </span>
                    </div>
                  </div>

                  {/* TODO: Uncomment when ready to show CTA button */}
                  {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                      Start Creating
                    </Button>
                  </motion.div> */}
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
