import { motion } from 'motion/react';

export function Header() {
  return (
    <header className='relative z-20 bg-secondary/80 backdrop-blur-sm border-b border-border'>
      <div className='max-w-6xl mx-auto px-6 py-4'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='flex items-center justify-between'>
          <motion.h1
            className='text-3xl text-primary'
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}>
            Arkhives
          </motion.h1>

          {/* TODO: Uncomment when ready to show navigation buttons */}
          {/* <nav className="hidden md:flex items-center gap-8">
            {["Originals", "Forge", "Community", "About"].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-background hover:text-primary transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item}
              </motion.a>
            ))}
          </nav> */}

          {/* <motion.button
            className='md:hidden text-foreground'
            whileTap={{ scale: 0.95 }}>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
              <path
                d='M3 12h18M3 6h18M3 18h18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </motion.button> */}
        </motion.div>
      </div>
    </header>
  );
}
