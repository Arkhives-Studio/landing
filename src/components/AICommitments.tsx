import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Card, CardContent } from './ui/card';

interface CommitmentItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function CommitmentItem({
  icon,
  title,
  description,
  delay,
}: CommitmentItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className='flex items-start gap-6'>
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.2 }}
        className='flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground'>
        {icon}
      </motion.div>

      <div className='pt-2'>
        <h4 className='text-xl mb-2 text-foreground'>{title}</h4>
        <p className='text-muted leading-relaxed'>{description}</p>
      </div>
    </motion.div>
  );
}

export function AICommitments() {
  const commitments = [
    {
      icon: (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z' />
        </svg>
      ),
      title: 'Litigation Shield',
      description:
        'Built-in copyright-safe IP management ensures all content created on Forge is legally protected. Our litigation shield gives studios confidence to ship without risk.',
    },
    {
      icon: (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
        </svg>
      ),
      title: 'Local-First AI Agents',
      description:
        'AI agents run on-device, keeping your data private and your production pipeline fast. No cloud dependency means full control over your creative workflow.',
    },
    {
      icon: (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      ),
      title: 'Seamless Tool Integration',
      description:
        'Forge connects with the creative tools studios already use, eliminating fragmented workflows and reducing costly context-switching across your pipeline.',
    },
    {
      icon: (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z' />
        </svg>
      ),
      title: 'Agentic Game Optimizations',
      description:
        'Automated agents handle technical optimization so your team can focus on creative work. Accelerated production speeds without sacrificing quality.',
    },
  ];

  return (
    <section className='py-24 px-6 bg-secondary/5'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl mb-6 text-foreground'>
            Our Commitments
          </h2>
          <p className='text-xl text-muted max-w-3xl mx-auto'>
            Fixing fragmented workflows with local-first AI, copyright-safe IP
            management, and seamless creative tool integration.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto'>
          {commitments.map((commitment, index) => (
            <CommitmentItem
              key={commitment.title}
              icon={commitment.icon}
              title={commitment.title}
              description={commitment.description}
              delay={index * 0.2}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className='mt-16'>
          <Card className='relative overflow-hidden bg-card/50 backdrop-blur-sm border-primary/20'>
            <motion.div
              className='absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent'
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }}
              style={{
                width: '200%',
                height: '100%',
                transform: 'skewX(-25deg)',
              }}
            />
            <CardContent className='p-8 text-center relative z-10'>
              <h3 className='text-2xl mb-4 text-foreground'>
                Built for Studios
              </h3>
              <p className='text-muted mb-6 max-w-2xl mx-auto'>
                Forge is purpose-built for Unreal Engine AA game studios ready
                to accelerate production without compromising creative control.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
