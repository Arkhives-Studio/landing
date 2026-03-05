import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'motion/react';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { X, Check } from 'lucide-react';

/* ─── TiltCard (spring-physics perspective tilt on hover) ─── */
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
    x.set(e.clientX / rect.width - rect.left / rect.width - 0.5);
    y.set(e.clientY / rect.height - rect.top / rect.height - 0.5);
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
      style={{ rotateY, rotateX, transformStyle: 'preserve-3d' }}
      className={className}>
      <div
        style={{
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
        }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Tier data ─── */
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

/* ─── Stagger wrapper ─── */
function FadeUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}>
      {children}
    </motion.div>
  );
}

/* ─── Modal ─── */
function DesignPartnerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formState, setFormState] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState('Creator');
  const [teamSize, setTeamSize] = useState('2-5');
  const [projectStatus, setProjectStatus] = useState('Ideation');

  const apiBaseUrl = useMemo(() => {
    const fallback = import.meta.env.PROD
      ? 'https://api.arkhivesstudio.com'
      : 'http://localhost:8000';
    const configured =
      import.meta.env.VITE_DESIGN_PARTNER_SERVICE_URL ?? fallback;
    return (configured as string).replace(/\/$/, '');
  }, []);

  useEffect(() => {
    if (open) {
      setFormState('idle');
      setErrorMsg('');
      setName('');
      setEmail('');
      setLevel('Creator');
      setTeamSize('2-5');
      setProjectStatus('Ideation');
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  const showTeamSize = level === 'Studio' || level === 'Enterprise';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please fill in all required fields.');
      setFormState('error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      setFormState('error');
      return;
    }
    setFormState('submitting');
    setErrorMsg('');

    try {
      const response = await fetch(`${apiBaseUrl}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          level,
          team_size: showTeamSize ? teamSize : null,
          project_status: projectStatus,
        }),
      });
      if (!response.ok) throw new Error('Request failed');
      setFormState('success');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setFormState('error');
    }
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius)',
    border: '1px solid rgba(81, 48, 26, 0.2)',
    backgroundColor: '#efe9e0',
    color: '#221a14',
    fontFamily: "'Gloock', serif",
    fontSize: '1rem',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23221a14' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    cursor: 'pointer',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius)',
    border: '1px solid rgba(81, 48, 26, 0.2)',
    backgroundColor: '#efe9e0',
    color: '#221a14',
    fontFamily: "'Gloock', serif",
    fontSize: '1rem',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '28rem',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#efe9e0',
              border: '1px solid rgba(81, 48, 26, 0.2)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              position: 'relative',
            }}>
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#5e4f41',
                padding: '0.25rem',
              }}
              aria-label='Close modal'>
              <X size={20} />
            </button>

            {formState === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div
                  style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '50%',
                    backgroundColor: '#51301a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}>
                  <Check size={28} color='#efe9e0' />
                </div>
                <h3
                  className='text-2xl text-foreground'
                  style={{ marginBottom: '0.75rem' }}>
                  Application Received
                </h3>
                <p
                  className='text-muted'
                  style={{ marginBottom: '1.5rem' }}>
                  Thank you for applying to the Forge Design Partner
                  Program. Our team will review your application and be in
                  touch soon.
                </p>
                <Button
                  onClick={onClose}
                  className='bg-secondary hover:bg-secondary/90 text-secondary-foreground'>
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3
                  className='text-2xl text-foreground'
                  style={{ marginBottom: '0.5rem' }}>
                  Apply for Design Partner Program
                </h3>
                <p
                  className='text-muted'
                  style={{ marginBottom: '1.5rem' }}>
                  Join the Forge Design Partner Program and get early access
                  with exclusive pricing. Limited to 20 slots.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}>
                  <div>
                    <label
                      className='text-foreground'
                      style={{
                        display: 'block',
                        marginBottom: '0.25rem',
                      }}>
                      Name
                    </label>
                    <input
                      type='text'
                      placeholder='Your full name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={formState === 'submitting'}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label
                      className='text-foreground'
                      style={{
                        display: 'block',
                        marginBottom: '0.25rem',
                      }}>
                      Email
                    </label>
                    <input
                      type='email'
                      placeholder='you@company.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={formState === 'submitting'}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label
                      className='text-foreground'
                      style={{
                        display: 'block',
                        marginBottom: '0.25rem',
                      }}>
                      Partner Level
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      disabled={formState === 'submitting'}
                      style={selectStyle}>
                      <option value='Creator'>Creator</option>
                      <option value='Studio'>Studio</option>
                      <option value='Enterprise'>Enterprise</option>
                    </select>
                  </div>

                  {showTeamSize && (
                    <div>
                      <label
                        className='text-foreground'
                        style={{
                          display: 'block',
                          marginBottom: '0.25rem',
                        }}>
                        Team Size
                      </label>
                      <select
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        disabled={formState === 'submitting'}
                        style={selectStyle}>
                        <option value='2-5'>2–5</option>
                        <option value='6-20'>6–20</option>
                        <option value='21-50'>21–50</option>
                        <option value='51+'>51+</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label
                      className='text-foreground'
                      style={{
                        display: 'block',
                        marginBottom: '0.25rem',
                      }}>
                      Project Status
                    </label>
                    <select
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value)}
                      disabled={formState === 'submitting'}
                      style={selectStyle}>
                      <option value='Ideation'>Ideation</option>
                      <option value='Prototyping'>Prototyping</option>
                      <option value='Pre-Production'>Pre-Production</option>
                      <option value='Production'>Production</option>
                      <option value='Post-Production'>
                        Post-Production
                      </option>
                      <option value='Marketing'>Marketing</option>
                    </select>
                  </div>
                </div>

                {formState === 'error' && errorMsg && (
                  <p
                    className='text-destructive'
                    style={{ marginTop: '1rem' }}>
                    {errorMsg}
                  </p>
                )}

                <Button
                  type='submit'
                  disabled={formState === 'submitting'}
                  className='w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                  style={{ marginTop: '1.5rem' }}>
                  {formState === 'submitting'
                    ? 'Submitting...'
                    : 'Submit Application'}
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Section ─── */
export function DesignPartner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className='relative px-6' style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            background:
              'linear-gradient(180deg, rgba(81,48,26,0.06) 0%, rgba(81,48,26,0.03) 40%, transparent 100%)',
          }}
        />
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl'>
          <div className='h-px bg-secondary/20' />
        </div>

        <div className='relative max-w-4xl mx-auto text-center'>
          <FadeUp delay={0}>
            <span
              className='inline-block bg-secondary/80 text-secondary-foreground px-4 py-1.5 rounded-full uppercase tracking-widest mb-6'
              style={{ fontSize: '0.75rem' }}>
              Limited Program
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className='text-4xl md:text-5xl text-foreground mb-4'>
              Calling Design Partners for Forge
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className='text-xl text-muted mb-4 max-w-3xl mx-auto'>
              An Agentic Platform for On-Device 3D Production on top of
              Unreal Engine 5.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className='text-lg mb-12' style={{ color: '#51301a' }}>
              Only <strong>20 slots</strong> available — deadline{' '}
              <strong>June 1st 2026</strong>
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div
              className='border rounded-lg p-8 mb-12 max-w-2xl mx-auto'
              style={{
                backgroundColor: 'rgba(219, 189, 20, 0.12)',
                borderColor: 'rgba(219, 189, 20, 0.3)',
              }}>
              <h3 className='text-2xl text-foreground mb-4'>
                Exclusive Partner Pricing
              </h3>
              <p className='text-foreground'>
                Get a{' '}
                <span
                  className='text-3xl text-secondary'
                  style={{ verticalAlign: 'baseline' }}>
                  20%
                </span>{' '}
                discount on 2 calendar months, with an option to convert at
                a{' '}
                <span
                  className='text-3xl text-secondary'
                  style={{ verticalAlign: 'baseline' }}>
                  10%
                </span>{' '}
                discount on top of annual discounts.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.5}>
            <style>{`@media(min-width:768px){.dp-tier-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}`}</style>
            <div className='grid grid-cols-1 gap-6 mb-12 dp-tier-grid'>
              {tiers.map((tier) => (
                <TiltCard key={tier.name}>
                  <div
                    className='bg-card/50 border border-secondary-foreground/20 backdrop-blur-sm rounded-lg p-6 h-full'
                    style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
                    <h4 className='text-xl text-foreground mb-3'>
                      {tier.name}
                    </h4>
                    <p className='text-muted' style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>{tier.description}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.6}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='inline-block'>
              <Button
                size='lg'
                className='bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
                onClick={() => setModalOpen(true)}>
                Apply Now
              </Button>
            </motion.div>
          </FadeUp>
        </div>
      </section>

      <DesignPartnerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
