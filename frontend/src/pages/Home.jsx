import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Award, Code, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { upcomingEvents, spotlightEvents } from '@/data/events';
import { stats } from '@/data/achievements';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import { GdgText } from '@/components/ui/GdgText';
import { FloatingDomains } from '@/components/home/FloatingDomains';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { CountUp } from '@/hooks/useCountUp';
import { ArrowFillButton } from '@/components/ui/ArrowFillButton';
import { LaptopCTA } from '@/components/home/LaptopCTA';
import { cn } from '@/utils/cn';
import { AboutPreview } from '@/components/home/AboutPreview';

function HeroHeadline({ onSecretTrigger }) {
  const fullText = 'Build the Future with GDGC';
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    let timer = null;
    let startDelay = null;

    const startTyping = () => {
      let index = 0;
      setDisplayedLength(0);
      startDelay = setTimeout(() => {
        timer = setInterval(() => {
          index += 1;
          setDisplayedLength(index);
          if (index >= fullText.length) {
            clearInterval(timer);
          }
        }, 55);
      }, 250);
    };

    // Check if splash screen is currently active
    const isSplashActive = !window.__gdgc_splash_completed && !!document.querySelector('.splash-overlay');

    if (isSplashActive) {
      const handleSplashDone = () => {
        window.removeEventListener('gdgc:splash-complete', handleSplashDone);
        startTyping();
      };
      window.addEventListener('gdgc:splash-complete', handleSplashDone);
      return () => {
        window.removeEventListener('gdgc:splash-complete', handleSplashDone);
        clearTimeout(startDelay);
        clearInterval(timer);
      };
    } else {
      startTyping();
      return () => {
        clearTimeout(startDelay);
        clearInterval(timer);
      };
    }
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
  {
    icon: Users,
    title: 'Vibrant Community',
    description: 'Connect with 1000+ passionate student developers across all tech domains.',
    stat: '1250+ Members',
    iconBox: 'bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/25',
    statColor: 'text-[#4285F4]',
  },
  {
    icon: Code,
    title: 'Hands-on Learning',
    description: 'Workshops, study jams, and hackathons with industry mentors and Google experts.',
    stat: '120+ Events',
    iconBox: 'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/25',
    statColor: 'text-[#EA4335]',
  },
  {
    icon: Award,
    title: 'Global Recognition',
    description: 'Win prizes, earn certifications, and compete in Google Solution Challenge.',
    stat: '12 Hackathon Wins',
    iconBox: 'bg-[#FBBC04]/10 text-[#d99b00] dark:text-[#FBBC04] border-[#FBBC04]/25',
    statColor: 'text-[#b06000] dark:text-[#FBBC04]',
  },
  {
    icon: Zap,
    title: 'Career Growth',
    description: 'Internship opportunities, resume reviews, and direct connections to tech companies.',
    stat: '500+ Alumni',
    iconBox: 'bg-[#34A853]/10 text-[#34A853] border-[#34A853]/25',
    statColor: 'text-[#34A853]',
  },
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
  const heroRef = useScrollAnimation({ start: 'top 80%' });
  const statsRef = useStaggerAnimation({ stagger: 0.1 });
  const featuresRef = useStaggerAnimation({ stagger: 0.15 });
  const eventsRef = useScrollAnimation({ start: 'top 80%' });
  const ctaRef = useScrollAnimation({ start: 'top 80%' });

  useEffect(() => {
    if (window.location.hash === '#laptop-terminal') {
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('gdgc:open-laptop-terminal'));
      }, 400);
      return () => clearTimeout(timer);
    }
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
            {/* Centered Hero Headline with Typewriter Animation matching gdgc-pccoe */}
            <HeroHeadline onSecretTrigger={() => window.dispatchEvent(new CustomEvent('gdgc:open-laptop-terminal'))} />

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
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-2xl bg-card border border-border/50 cursor-pointer select-none feature-card"
                role="listitem"
              >
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-5 border transition-transform duration-200 group-hover:scale-110", feature.iconBox)}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <ScrollReveal as="p" blurStrength={4} duration={0.5} className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {feature.description}
                </ScrollReveal>
                <span className={cn("text-sm font-medium flex items-center gap-1", feature.statColor)}>
                  {feature.stat}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* About GDGC PCCOE Preview Section */}
      <AboutPreview />

      {/* Upcoming Events Spotlight with BLACKOUT */}
      <section ref={eventsRef} id="upcoming-events" className="relative py-20 lg:py-28 bg-muted/20" aria-labelledby="events-title">
        <AnimatedBackground variant="particles" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <SectionHeader
              title="Tenure Event Spotlight"
              subtitle="Get ready for lots of fun events , workshops and hackathons."
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
            {spotlightEvents.map((event, index) => {
              const isBlackout = event.title?.includes('BLACKOUT');
              const isPast = event.registrationUrl === '/events/past' || event.type === 'Coding Contest';
              const isUnstop = event.registrationUrl?.includes('unstop');

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
                  <Card
                    hover
                    className={`h-full ${
                      isBlackout
                        ? 'border-red-500/50 shadow-lg shadow-red-500/10 ring-1 ring-red-500/30'
                        : isPast
                        ? 'border-green-500/40 shadow-lg shadow-green-500/5'
                        : ''
                    }`}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {isBlackout && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-md animate-pulse">
                             FIRST EVENT OF TENURE
                          </span>
                        )}
                        {!isBlackout && !isPast && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
                             UPCOMING WORKSHOP
                          </span>
                        )}
                        {isPast && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                             COMPLETED CONTEST
                          </span>
                        )}
                      </div>

                      {/* Bottom Type & Domain Pills */}
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
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <ScrollReveal as="p" blurStrength={4} duration={0.5} className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                        {event.description}
                      </ScrollReveal>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs text-muted-foreground font-medium">
                          {isPast
                            ? `${event.registered} Registrations · ${event.participants || 18} Live`
                            : `${event.registered}/${event.capacity} registered`}
                        </span>
                        <div className="flex items-center gap-2">
                          {isUnstop ? (
                            <ArrowFillButton
                              href={event.registrationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              btnText="Register on Unstop"
                              size="sm"
                              bgColor="#EA4335"
                              textColor="#ffffff"
                              fillBgColor="#ffffff"
                              fillTextColor="#d93025"
                              arrowColor="#EA4335"
                              hoverArrowColor="#d93025"
                            />
                          ) : isPast ? (
                            <ArrowFillButton
                              to="/events/past"
                              btnText="View Report"
                              size="sm"
                              bgColor="#34A853"
                              textColor="#ffffff"
                              fillBgColor="#ffffff"
                              fillTextColor="#1e8e3e"
                              arrowColor="#34A853"
                              hoverArrowColor="#1e8e3e"
                            />
                          ) : (
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
                          )}
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
    </>
  );
}