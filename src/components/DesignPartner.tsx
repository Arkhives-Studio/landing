import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { DesignPartnerModal } from './DesignPartnerModal';

const DEADLINE = 'June 1st 2026';
const SLOTS = 20;

const tiers = [
  {
    name: 'Creator',
    description: 'For individual creators building on Forge.',
  },
  {
    name: 'Studio',
    description: 'For small-to-mid teams shipping production content.',
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with dedicated pipelines.',
  },
];

export function DesignPartner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className='py-24 px-6'>
        <div className='max-w-4xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='text-center mb-12'>
            <span className='inline-block text-sm uppercase tracking-wider text-secondary-foreground bg-secondary/80 px-4 py-1 rounded-full mb-6'>
              Limited Program
            </span>
            <h2 className='text-4xl md:text-5xl mb-4 text-foreground'>
              Calling Design Partners for Forge
            </h2>
            <p className='text-xl text-muted max-w-3xl mx-auto mb-2'>
              An Agentic Platform for On-device 3D Production on top of Unreal
              Engine 5.
            </p>
            <p className='text-lg text-secondary-foreground/80'>
              Only <strong>{SLOTS} slots</strong> available — deadline{' '}
              <strong>{DEADLINE}</strong>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            viewport={{ once: true }}
            className='mb-12'>
            <Card className='bg-secondary/5 border-secondary/20 backdrop-blur-sm'>
              <CardContent className='p-8 text-center space-y-4'>
                <h3 className='text-2xl text-foreground'>
                  Exclusive Partner Pricing
                </h3>
                <p className='text-muted max-w-2xl mx-auto'>
                  Get a <span className='text-3xl text-secondary'>20% discount</span> on 2 calendar months, with an option to convert at a{' '}
                  <span className='text-3xl text-secondary'>10% discount</span> on top of annual discounts.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
                viewport={{ once: true }}>
                <Card className='h-full bg-card/50 border-secondary-foreground/20 backdrop-blur-sm text-center'>
                  <CardContent className='p-6 space-y-2'>
                    <h4 className='text-xl text-foreground'>{tier.name}</h4>
                    <p className='text-sm text-muted'>{tier.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className='text-center'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setModalOpen(true)}
                className='bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg'>
                Apply Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <DesignPartnerModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
