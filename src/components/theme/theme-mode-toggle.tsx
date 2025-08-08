'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="secondary">
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
