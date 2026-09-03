import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GitBranch, X, Link as LinkIcon, Play, MessageSquare, Mail,
  ArrowUp, MapPin, Phone, Clock
} from 'lucide-react';
import { cn } from '@/utils/cn';

const footerLinks = {
  navigate: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Team', href: '/team' },
    { label: 'Domains', href: '/domains' },
  ],
  domains: [
    { label: 'AI & Machine Learning', href: '/domains#ai-ml' },
    { label: 'Mobile Development', href: '/domains#mobile' },
    { label: 'Web Development', href: '/domains#web' },
    { label: 'Cloud & DevOps', href: '/domains#cloud' },
    { label: 'UI/UX Design', href: '/domains#design' },
    { label: 'Backend', href: '/domains#backend' },
  ],
  community: [
    { label: 'Code of Conduct', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Report an Issue', href: '#' },
  ],
  resources: [
    { label: 'Study Materials', href: '/resources#study-jams' },
    { label: 'Project Showcase', href: '/resources#project-showcase' },
    { label: 'Career Resources', href: '/resources#career' },
    { label: 'Quick References', href: '/resources#reference' },
    { label: 'GitHub Organization', href: '#' },
  ],
};

const socialLinks = [
  { icon: GitBranch, href: '#', label: 'GitHub', color: 'hover:text-gray-400 dark:hover:text-gray-500' },
  { icon: X, href: '#', label: 'X (Twitter)', color: 'hover:text-sky-400' },
  { icon: LinkIcon, href: '#', label: 'LinkedIn', color: 'hover:text-blue-400' },
  { icon: Play, href: '#', label: 'YouTube', color: 'hover:text-red-400' },
  { icon: MessageSquare, href: '#', label: 'Discord', color: 'hover:text-indigo-400' },
  { icon: Mail, href: '#', label: 'Email', color: 'hover:text-green-400' },
];

const contactInfo = [
  { icon: MapPin, text: 'University Campus, Building A, Room 101' },
  { icon: Phone, text: '+1 (555) 123-4567' },
  { icon: Mail, text: 'hello@gdgcampus.dev' },
  { icon: Clock, text: 'Mon - Fri: 9:00 AM - 6:00 PM' },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-dark-950 text-dark-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Link to="/" className="flex items-center gap-2 mb-6" aria-label="GDGC Home">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">G</span>
              </div>
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                GDGC
              </span>
            </Link>
            <p className="text-dark-400 mb-6 max-w-xs leading-relaxed">
              Google Developer Groups on Campus - Empowering student developers to learn, build, and grow together through technology.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  className={cn('p-2 rounded-xl bg-dark-900/50 text-dark-400 transition-all duration-300', color)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
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
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <nav>
              <ul className="space-y-3" role="list">
                {footerLinks.navigate.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-dark-400 hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      {link.label}
                      <ArrowUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <h4 className="font-semibold text-white mb-4">Domains</h4>
            <nav>
              <ul className="space-y-2" role="list">
                {footerLinks.domains.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-dark-400 hover:text-primary transition-colors text-sm"
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
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <nav>
              <ul className="space-y-2" role="list">
                {footerLinks.community.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-dark-400 hover:text-primary transition-colors text-sm"
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
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <address className="not-italic space-y-3 text-dark-400">
              {contactInfo.map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
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
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} GDG Campus Chapter. Built with passion by student developers.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="#"
              className="text-dark-500 hover:text-primary transition-colors text-sm flex items-center gap-1"
            >
              <span>Privacy</span>
            </Link>
            <Link
              to="#"
              className="text-dark-500 hover:text-primary transition-colors text-sm flex items-center gap-1"
            >
              <span>Terms</span>
            </Link>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-dark-900/50 text-dark-400 hover:text-white hover:bg-primary/20 transition-all duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}