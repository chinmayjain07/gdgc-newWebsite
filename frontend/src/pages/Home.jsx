import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Award, Code, Zap, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { upcomingEvents } from '@/data/events';
import { stats } from '@/data/achievements';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import { GdgText } from '@/components/ui/GdgText';
import { BlackoutMysteryGame } from '@/components/events/BlackoutMysteryGame';
import { FloatingDomains } from '@/components/home/FloatingDomains';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { CountUp } from '@/hooks/useCountUp';
import { ArrowFillButton } from '@/components/ui/ArrowFillButton';
import { LaptopCTA } from '@/components/home/LaptopCTA';

function HeroHeadline({ onSecretTrigger }) {
  const fullText = 'Build the Future with GDGC';
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    let index = 0;
    const startDelay = setTimeout(() => {
      const timer = setInterval(() => {
        index += 1;
        setDisplayedLength(index);
        if (index >= fullText.length) {
          clearInterval(timer);
        }
      }, 55);
      return () => clearInterval(timer);
    }, 200);

    return () => clearTimeout(startDelay);
  }, []);

  const currentStr = fullText.slice(0, displayedLength);
  const prefix = currentStr.slice(0, 22);
  const gdgcLetters = displayedLength > 22 ? currentStr.slice(22) : '';

  return (
    <h1
      id="hero-title"
      className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.15] mb-8 text-center text-foreground flex flex-col items-center justify-center gap-1 sm:gap-2"
    >
      <span>{prefix}</span>
      <span className="inline-flex items-center justify-center flex-wrap gap-2 sm:gap-3.5 align-middle">
        {gdgcLetters.length > 0 && (
          <span className="font-extrabold tracking-tight inline-flex items-center">
            {gdgcLetters.length >= 1 && <span className="text-[#4285F4]">G</span>}
            {gdgcLetters.length >= 2 && <span className="text-[#EA4335]">D</span>}
            {gdgcLetters.length >= 3 && <span className="text-[#FBBC04]">G</span>}
            {gdgcLetters.length >= 4 && <span className="text-[#34A853]">C</span>}
          </span>
        )}
        <span className="text-primary animate-pulse font-mono font-normal">_</span>
        <motion.span
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{
            opacity: displayedLength >= 22 ? 1 : 0,
            scale: displayedLength >= 22 ? 1 : 0.2,
          }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 18,
          }}
          className="inline-flex ml-1 sm:ml-2 align-middle"
        >
          <InteractiveLogo
            size="hero"
            showGlow={false}
            onSecretTrigger={onSecretTrigger}
          />
        </motion.span>
      </span>
    </h1>
  );
}

const features = [
  { icon: Users, title: 'Vibrant Community', description: 'Connect with 1000+ passionate student developers across all tech domains.', stat: '1250+ Members' },
  { icon: Code, title: 'Hands-on Learning', description: 'Workshops, study jams, and hackathons with industry mentors and Google experts.', stat: '120+ Events' },
  { icon: Award, title: 'Global Recognition', description: 'Win prizes, earn certifications, and compete in Google Solution Challenge.', stat: '12 Hackathon Wins' },
  { icon: Zap, title: 'Career Growth', description: 'Internship opportunities, resume reviews, and direct connections to tech companies.', stat: '500+ Alumni' },
];

const statsData = [
  { label: 'Total Members', value: stats.totalMembers, suffix: '+', icon: Users },
  { label: 'Events Hosted', value: stats.totalEvents, suffix: '+', icon: Code },
  { label: 'Tech Domains', value: stats.totalDomains, icon: Sparkles },
  { label: 'Certifications', value: stats.certifications, suffix: '+', icon: Award },
  { label: 'Hackathon Wins', value: stats.hackathonWins, icon: Award },
  { label: 'Global Finalists', value: stats.globalFinalists, icon: Sparkles },
];

export function Home() {
  const [isMysteryOpen, setIsMysteryOpen] = useState(false);
  const heroRef = useScrollAnimation({ start: 'top 80%' });
  const statsRef = useStaggerAnimation({ stagger: 0.1 });
  const featuresRef = useStaggerAnimation({ stagger: 0.15 });
  const eventsRef = useScrollAnimation({ start: 'top 80%' });
  const ctaRef = useScrollAnimation({ start: 'top 80%' });

  useEffect(() => {
    const handleSecret = () => setIsMysteryOpen(true);
    window.addEventListener('gdgc:secret-mystery', handleSecret);
    return () => window.removeEventListener('gdgc:secret-mystery', handleSecret);
  }, []);

  return (
    <>
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center hero-section overflow-hidden" aria-labelledby="hero-title">
        <AnimatedBackground variant="orb" />
        {/* Floating Domain Pills without emojis */}
        <FloatingDomains />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 z-20 w-full">
          {/* Centered Hero Container */}
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
            {/* Tenure Announcement Pill */}
            <motion.a
              href="#upcoming-events"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-semibold border border-red-500/30 mb-8 transition-all hover:scale-105 shadow-sm cursor-pointer"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span>⚡ First Event of the Tenure: <span className="underline font-bold">BLACKOUT</span> Hackathon</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </motion.a>
            
            {/* Centered Hero Headline with Typewriter Animation matching gdgc-pccoe */}
            <HeroHeadline onSecretTrigger={() => setIsMysteryOpen(true)} />

            {/* Centered Subtitle with blur-to-clear animation */}
            <ScrollReveal
              as="p"
              blurStrength={6}
              duration={0.6}
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-center"
            >
              Google Developer Groups on Campus — Where student developers learn, collaborate, and engineer impactful solutions through workshops, hackathons, and mentorship.
            </ScrollReveal>

            {/* CTAs with animated ArrowFillButton from gdgc-pccoe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-4"
            >
              <ArrowFillButton
                to="/contact"
                btnText="Join GDGC Community"
                bgColor="#4285F4"
                textColor="#ffffff"
                fillBgColor="#ffffff"
                fillTextColor="#1a73e8"
              />
              <ArrowFillButton
                to="/events"
                btnText="Explore Event Calendar"
                transparent={true}
                className="border-border hover:border-primary"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with Rapid CountUp and Minimalist Styling */}
      <section ref={statsRef} id="stats" className="relative py-16 lg:py-24 bg-muted/20" aria-labelledby="stats-title">
        <AnimatedBackground variant="grid" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="stats-title" className="sr-only">Key Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" role="list">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all shadow-sm group"
                role="listitem"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-[#4285F4] group-hover:scale-110 transition-transform" />
                {/* Minimalist, clean bold typography */}
                <div className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  <CountUp to={stat.value} suffix={stat.suffix || ''} duration={1400} />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Clean & Minimal with Click & Hover Lift Animation */}
      <section ref={featuresRef} id="features" className="relative py-20 lg:py-28" aria-labelledby="features-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Join GDGC?"
            subtitle="Everything you need to accelerate your career as a student engineer."
            badge="Chapter Benefits"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                whileTap={{ y: -12, scale: 0.98, transition: { type: 'spring', stiffness: 500, damping: 20 } }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer select-none"
                role="listitem"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 border border-primary/20 transition-transform duration-200 group-hover:scale-110">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <ScrollReveal as="p" blurStrength={4} duration={0.5} className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {feature.description}
                </ScrollReveal>
                <span className="text-sm font-medium text-primary flex items-center gap-1">
                  {feature.stat}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Spotlight with BLACKOUT */}
      <section ref={eventsRef} id="upcoming-events" className="relative py-20 lg:py-28 bg-muted/20" aria-labelledby="events-title">
        <AnimatedBackground variant="particles" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <SectionHeader
              title="Tenure Event Spotlight"
              subtitle="Get ready for our debut flagship event followed by workshops and hackathons."
              align="left"
              badge="Tenure Kickoff"
            />
            <ArrowFillButton
              to="/events"
              btnText="View All Events"
              transparent={true}
              size="sm"
              className="mt-4 md:mt-0"
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {upcomingEvents.slice(0, 3).map((event, index) => {
              const isBlackout = event.title.includes('BLACKOUT');
              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden"
                  role="listitem"
                >
                  <Card hover className={`h-full ${isBlackout ? 'border-red-500/40 shadow-lg shadow-red-500/5' : ''}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {isBlackout && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-md animate-pulse">
                            🔥 FIRST EVENT OF TENURE
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                          {event.type}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/30 backdrop-blur-md text-blue-200 border border-blue-400/30">
                          {event.domain}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium">
                        <span>{event.date}</span>
                        <span>·</span>
                        <span>{event.time}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
                      <ScrollReveal as="p" blurStrength={4} duration={0.5} className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                        {event.description}
                      </ScrollReveal>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs text-muted-foreground font-medium">
                          {event.registered}/{event.capacity} registered
                        </span>
                        <div className="flex items-center gap-2">
                          <ArrowFillButton
                            to="/contact"
                            btnText="Register"
                            size="sm"
                            bgColor="#4285F4"
                            textColor="#ffffff"
                            fillBgColor="#ffffff"
                            fillTextColor="#1a73e8"
                            arrowColor="#4285F4"
                            hoverArrowColor="#1a73e8"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3D Interactive Laptop CTA Workstation (acm-vit inspired) */}
      <LaptopCTA />

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
    </>
  );
}