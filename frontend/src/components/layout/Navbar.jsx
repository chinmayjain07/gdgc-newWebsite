import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronDown, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import { GdgText } from '@/components/ui/GdgText';
import { BlackoutMysteryGame } from '@/components/events/BlackoutMysteryGame';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Events',
    href: '/events',
    children: [
      { label: 'All Events', href: '/events' },
      { label: 'Upcoming', href: '/events/upcoming' },
      { label: 'Past Events', href: '/events/past' },
    ],
  },
  { label: 'Team', href: '/team' },
  { label: 'Domains', href: '/domains' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [isMysteryOpen, setIsMysteryOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = (index) => setHoveredDropdown(index);
  const handleMouseLeave = () => setHoveredDropdown(null);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg' : 'bg-background/80 backdrop-blur-md'
      )}
    >
      {/* Top Google 4-Color Accent Line */}
      <div className="h-[3px] w-full bg-gradient-gdg" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="GDGC Home">
            <InteractiveLogo size="sm" showGlow={false} />
            <GdgText className="text-2xl" />
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item, index) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-semibold transition-colors relative py-2',
                    location.pathname === item.href || (item.children && location.pathname.startsWith(item.href))
                      ? 'text-primary'
                      : 'text-foreground/75 hover:text-foreground'
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-4 h-4 opacity-70" />}
                </Link>

                <AnimatePresence>
                  {item.children && hoveredDropdown === index && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 min-w-[200px] glass-strong rounded-2xl p-2 shadow-xl border border-border/50 bg-background/95 backdrop-blur-xl"
                      role="menu"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={cn(
                            'block px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                            location.pathname === child.href
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground/70 hover:bg-accent/10 hover:text-foreground'
                          )}
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* BLACKOUT Mystery Game Button */}
            <button
              onClick={() => setIsMysteryOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 transition-all hover:scale-105 shadow-sm"
              title="Play BLACKOUT Clue Hunt Challenge"
            >
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span>BLACKOUT Clue Hunt</span>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="rounded-full hover:bg-primary/10"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-slate-700" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </Button>

            <Button variant="primary" size="sm" className="hidden lg:inline-flex shadow-gdg-glow bg-[#4285F4] hover:bg-[#1a73e8]" asChild>
              <Link to="/contact">Join GDGC</Link>
            </Button>

            <button
              className="lg:hidden p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-accent/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsMysteryOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/30"
                  >
                    <ShieldAlert className="w-4 h-4 animate-pulse" />
                    <span>BLACKOUT Clue Hunt</span>
                  </button>
                  <Button variant="ghost" size="sm" onClick={toggleTheme} className="flex items-center gap-2">
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-400" />}
                    <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
                  </Button>
                </div>

                {navItems.map((item) => (
                  <div key={item.href} className="space-y-1">
                    <Link
                      to={item.href}
                      className={cn(
                        'block px-3 py-2 rounded-xl text-base font-medium transition-colors',
                        location.pathname === item.href
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground/70 hover:bg-accent/10 hover:text-foreground'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="pl-6 space-y-1 pt-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block px-3 py-1.5 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-accent/10 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-border/50">
                  <Button variant="primary" className="w-full bg-[#4285F4]" asChild>
                    <Link to="/contact" onClick={() => setIsOpen(false)}>Join GDGC</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mystery Game Modal */}
      <AnimatePresence>
        {isMysteryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <BlackoutMysteryGame isModal onClose={() => setIsMysteryOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}