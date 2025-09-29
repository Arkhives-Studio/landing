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
      title: 'Creator IP Protection',
      description:
        'All content created on Forge remains 100% owned by creators. We provide legal frameworks and technology to protect your intellectual property rights.',
    },
    {
      icon: (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
        </svg>
      ),
      title: 'Ethical AI Development',
      description:
        'Our AI tools enhance creativity rather than replace it. We commit to transparent, creator-centric AI that augments human imagination and skill.',
    },
    {
      icon: (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      ),
      title: 'Fair Revenue Sharing',
      description:
        'Creators receive the majority of revenue from their work. Our transparent revenue model ensures sustainable income for all community members.',
    },
    {
      icon: (
        <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z' />
        </svg>
      ),
      title: 'Community Governance',
      description:
        'Major platform decisions involve community input. Creators and players have a voice in shaping the future of the Arkhives ecosystem.',
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
            Building the future of gaming with ethical AI, creator empowerment,
            and community-first principles.
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
          <Card className='bg-card/50 backdrop-blur-sm border-primary/20'>
            <CardContent className='p-8 text-center'>
              <h3 className='text-2xl mb-4 text-foreground'>
                Join the Movement
              </h3>
              <p className='text-muted mb-6 max-w-2xl mx-auto'>
                Be part of a gaming ecosystem that values creativity, fairness,
                and innovation. Together, we're building something
                unprecedented.
              </p>
              {/* <motion.a
                href="#"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                whileHover={{ x: 5 }}
              >
                Read our full manifesto
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 6l6 6-6 6M4 12h12"/>
                </svg>
              </motion.a> */}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
