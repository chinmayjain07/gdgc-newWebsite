import { motion } from 'framer-motion';

const FLOATING_DOMAINS = [
  // Left Side
  { label: 'WebDev', color: 'blue', top: '8%', left: '3%', delay: '0s' },
  { label: 'Cloud', color: 'red', top: '24%', left: '1.5%', delay: '0.4s' },
  { label: 'Machine Learning', color: 'yellow', top: '40%', left: '4%', delay: '0.8s' },
  { label: 'Flutter', color: 'green', top: '56%', left: '1.5%', delay: '1.2s' },
  { label: 'Competitive Programming', color: 'blue', top: '72%', left: '3.5%', delay: '1.6s' },
  { label: 'Management', color: 'red', top: '88%', left: '2%', delay: '2.0s' },

  // Right Side
  { label: 'UI/UX', color: 'yellow', top: '8%', right: '3%', delay: '0.2s' },
  { label: 'Design', color: 'green', top: '24%', right: '1.5%', delay: '0.6s' },
  { label: 'PR & Outreach', color: 'blue', top: '40%', right: '4%', delay: '1.0s' },
  { label: 'Social Media', color: 'red', top: '56%', right: '1.5%', delay: '1.4s' },
  { label: 'AR/VR', color: 'yellow', top: '72%', right: '3.5%', delay: '1.8s' },
  { label: 'IoT', color: 'green', top: '88%', right: '2%', delay: '2.2s' },
];

export function FloatingDomains() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 hidden lg:block" aria-hidden="true">
      {FLOATING_DOMAINS.map((domain) => (
        <motion.div
          key={domain.label}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: parseFloat(domain.delay) * 0.4 }}
          className={`hero__float-pill tag tag-${domain.color} pointer-events-auto`}
          style={{
            position: 'absolute',
            top: domain.top,
            left: domain.left,
            right: domain.right,
            animation: 'floatY 5.5s ease-in-out infinite',
            animationDelay: domain.delay,
          }}
        >
          {domain.label}
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingDomains;
