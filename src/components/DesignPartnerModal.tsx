import { useState } from 'react';
import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type PartnerLevel = 'Creator' | 'Studio' | 'Enterprise';
type ProjectStatus =
  | 'Ideation'
  | 'Prototyping'
  | 'Pre-Production'
  | 'Production'
  | 'Post-Production'
  | 'Marketing';
type TeamSize = '2-5' | '6-20' | '21-50' | '51+';

interface DesignPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DesignPartnerModal({
  open,
  onOpenChange,
}: DesignPartnerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState<PartnerLevel | ''>('');
  const [teamSize, setTeamSize] = useState<TeamSize | ''>('');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus | ''>('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const showTeamSize = level === 'Studio' || level === 'Enterprise';

  const apiBaseUrl = useMemo(() => {
    const fallback = import.meta.env.PROD
      ? 'https://api.arkhivesstudio.com'
      : 'http://localhost:8000';
    const configured =
      import.meta.env.VITE_DESIGN_PARTNER_SERVICE_URL ?? fallback;
    return (configured as string).replace(/\/$/, '');
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setLevel('');
    setTeamSize('');
    setProjectStatus('');
    setStatus('idle');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !level || !projectStatus) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (showTeamSize && !teamSize) {
      setStatus('error');
      setErrorMessage('Team size is required for Studio and Enterprise levels.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

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

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  if (status === 'success') {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='bg-card border-secondary/20'>
          <div className='text-center py-8 space-y-4'>
            <div className='w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                width='32'
                height='32'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-secondary-foreground'>
                <polyline points='20 6 9 17 4 12' />
              </svg>
            </div>
            <h3 className='text-2xl text-foreground'>Application Received</h3>
            <p className='text-muted'>
              Thank you for applying to the Forge Design Partner Program. Our
              team will review your application and be in touch soon.
            </p>
            <Button
              onClick={() => handleOpenChange(false)}
              className='bg-secondary hover:bg-secondary/90 text-secondary-foreground mt-4'>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='bg-card border-secondary/20 max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl text-foreground'>
            Apply for Design Partner Program
          </DialogTitle>
          <DialogDescription className='text-muted'>
            Join the Forge Design Partner Program and get early access with
            exclusive pricing. Limited to 20 slots.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='dp-name' className='text-foreground'>
              Name
            </Label>
            <Input
              id='dp-name'
              type='text'
              placeholder='Your full name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='bg-input-background/80'
              required
              disabled={status === 'loading'}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='dp-email' className='text-foreground'>
              Email
            </Label>
            <Input
              id='dp-email'
              type='email'
              placeholder='you@company.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-input-background/80'
              required
              disabled={status === 'loading'}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-foreground'>Partner Level</Label>
            <Select
              value={level}
              onValueChange={(v) => {
                setLevel(v as PartnerLevel);
                if (v === 'Creator') setTeamSize('');
              }}
              disabled={status === 'loading'}>
              <SelectTrigger className='bg-input-background/80'>
                <SelectValue placeholder='Select a level' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Creator'>Creator</SelectItem>
                <SelectItem value='Studio'>Studio</SelectItem>
                <SelectItem value='Enterprise'>Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showTeamSize && (
            <div className='space-y-2'>
              <Label className='text-foreground'>Team Size</Label>
              <Select
                value={teamSize}
                onValueChange={(v) => setTeamSize(v as TeamSize)}
                disabled={status === 'loading'}>
                <SelectTrigger className='bg-input-background/80'>
                  <SelectValue placeholder='Select team size' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='2-5'>2 - 5</SelectItem>
                  <SelectItem value='6-20'>6 - 20</SelectItem>
                  <SelectItem value='21-50'>21 - 50</SelectItem>
                  <SelectItem value='51+'>51+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='space-y-2'>
            <Label className='text-foreground'>Project Status</Label>
            <Select
              value={projectStatus}
              onValueChange={(v) => setProjectStatus(v as ProjectStatus)}
              disabled={status === 'loading'}>
              <SelectTrigger className='bg-input-background/80'>
                <SelectValue placeholder='Select project status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Ideation'>Ideation</SelectItem>
                <SelectItem value='Prototyping'>Prototyping</SelectItem>
                <SelectItem value='Pre-Production'>Pre-Production</SelectItem>
                <SelectItem value='Production'>Production</SelectItem>
                <SelectItem value='Post-Production'>Post-Production</SelectItem>
                <SelectItem value='Marketing'>Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === 'error' && errorMessage && (
            <p className='text-sm text-destructive'>{errorMessage}</p>
          )}

          <Button
            type='submit'
            className='w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground'
            disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
