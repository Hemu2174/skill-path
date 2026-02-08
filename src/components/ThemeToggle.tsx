import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  variant?: 'ghost' | 'outline';
  className?: string;
}

export function ThemeToggle({ variant = 'ghost', className }: ThemeToggleProps) {
  const { resolvedTheme, mode, setMode } = useTheme();

  const toggle = () => {
    if (mode === 'system') {
      setMode(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setMode(mode === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <Button variant={variant} size="icon" onClick={toggle} aria-label="Toggle theme" className={className}>
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}
