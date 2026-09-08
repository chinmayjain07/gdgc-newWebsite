import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GitBranch, X, Link as LinkIcon, Play, MessageSquare, Mail,
  ArrowUp, MapPin, Clock
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import './Footer.css';

function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const footerLinks = {
  navigate: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'All Events', href: '/events' },
    { label: 'Upcoming Events', href: '/events/upcoming' },
    { label: 'Past Events', href: '/events/past' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact Us', href: '/contact' },
  ],
  events: [
    { label: '⚡ BLACKOUT Clue Hunt', href: '/events/upcoming' },
    { label: 'Workshops & Bootcamps', href: '/events' },
    { label: 'Hackathons & Contests', href: '/events' },
    { label: 'Tech Talks & Panels', href: '/events' },
    { label: 'Study Jams', href: '/events' },
  ],
  community: [
    { label: 'Google Developer Student Clubs', href: '#' },
    { label: 'Code of Conduct', href: '#' },
    { label: 'Community Guidelines', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

const socialLinks = [
  // { icon: GitBranch, href: '#', label: 'GitHub', color: 'hover:text-gray-600 dark:hover:text-gray-300' },
  // { icon: X, href: '#', label: 'X (Twitter)', color: 'hover:text-sky-500' },
  {
    icon: LinkedInIcon,
    href: 'https://www.linkedin.com/company/google-developer-groups-on-campus-pccoe/',
    label: 'LinkedIn',
    color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]',
  },
  {
    icon: InstagramIcon,
    href: 'https://www.instagram.com/gdgcpccoe?stkn=MWc2Z2NmZTBwYjExeQ==',
    label: 'Instagram',
    color: 'hover:text-[#E4405F] hover:border-[#E4405F]',
  },
  // { icon: Play, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
  // { icon: MessageSquare, href: '#', label: 'Discord', color: 'hover:text-indigo-500' },
  // { icon: Mail, href: '#', label: 'Email', color: 'hover:text-green-500' },
];

const contactInfo = [
  { icon: MapPin, text: 'Campus Hub, Innovation Center Room 204' },
  { icon: Mail, text: 'contact@gdgcampus.dev' },
  { icon: Clock, text: 'Mon - Fri: 9:00 AM - 6:00 PM' },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-white dark:bg-[#070A0F] text-foreground overflow-hidden border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      {/* Subtle Google Ambient Animated Blobs & Micro-Texture */}
      <div className="footer-ambient-container" aria-hidden="true">
        <div className="footer-gradient-aurora" />
        <div className="footer-motion-waves" />
        <div className="footer-texture-grid" />
        <span className="footer-blob footer-blob--blue" />
        <span className="footer-blob footer-blob--cyan" />
        <span className="footer-blob footer-blob--yellow" />
        <span className="footer-blob footer-blob--green" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Link to="/" className="inline-flex items-center gap-3 mb-6" aria-label="GDGC Home">
              <InteractiveLogo size="md" showGlow={false} />
              <span className="font-display font-bold text-2xl text-foreground">
                GDGC
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs leading-relaxed text-sm">
              Google Developer Groups on Campus — Empowering student developers to learn, innovate, and engineer real-world solutions.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-muted-foreground hover:border-primary/40 transition-all duration-300 shadow-sm', color)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold text-foreground mb-4 text-sm tracking-wider uppercase">Navigation</h4>
            <nav>
              <ul className="space-y-2.5" role="list">
                {footerLinks.navigate.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-[#4285F4] transition-colors flex items-center gap-1.5 text-sm group"
                    >
                      {link.label}
                      <ArrowUp className="w-3 h-3 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-foreground mb-4 text-sm tracking-wider uppercase">Events</h4>
            <nav>
              <ul className="space-y-2.5" role="list">
                {footerLinks.events.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-[#4285F4] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-semibold text-foreground mb-4 text-sm tracking-wider uppercase">Contact</h4>
            <address className="not-italic space-y-3 text-muted-foreground text-sm">
              {contactInfo.map((item) => (
                <div key={item.text} className="flex items-start gap-2.5">
                  <item.icon className="w-4 h-4 text-[#4285F4] mt-0.5 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </address>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Google Developer Groups on Campus. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-300 shadow-sm cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}