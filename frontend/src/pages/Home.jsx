import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, Code, Zap, Sparkles, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { upcomingEvents } from '@/data/events';
import { stats } from '@/data/achievements';
import { domains } from '@/data/domains';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import { GdgText } from '@/components/ui/GdgText';
import { BlackoutMysteryGame } from '@/components/events/BlackoutMysteryGame';

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
  const heroRef = useScrollAnimation({ trigger: '.hero-section', start: 'top 80%' });
  const statsRef = useStaggerAnimation({ stagger: 0.1 });
  const featuresRef = useStaggerAnimation({ stagger: 0.15 });
  const eventsRef = useScrollAnimation({ trigger: '#upcoming-events' });
  const domainsRef = useStaggerAnimation({ stagger: 0.1 });
  const ctaRef = useScrollAnimation({ trigger: '#cta-section' });

  return (
    <>
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center hero-section overflow-hidden" aria-labelledby="hero-title">
        <AnimatedBackground variant="orb" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-4xl">
            {/* BLACKOUT Announcement Pill */}
            <motion.button
              onClick={() => setIsMysteryOpen(true)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-semibold border border-red-500/30 mb-8 transition-all hover:scale-105 shadow-sm cursor-pointer"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span>⚡ First Event of the Tenure: <span className="underline font-bold">BLACKOUT</span> Clue Hunt & Hackathon</span>
              <ShieldAlert className="w-4 h-4 ml-1" />
            </motion.button>
            
            {/* Main Hero Title with Interactive Logo and GDGC */}
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.15] mb-8"
            >
              <span className="text-foreground">Build the Future with </span>
              <span className="inline-flex items-center gap-3 flex-wrap align-middle">
                <GdgText className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl" />
                <InteractiveLogo size="hero" className="inline-flex ml-2" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            >
              Google Developer Groups on Campus — Where student developers learn, collaborate, and engineer impactful solutions through workshops, hackathons, and mentorship.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 mb-16"
            >
              <Button size="lg" asChild className="bg-[#4285F4] hover:bg-[#1a73e8] shadow-gdg-glow group">
                <Link to="/contact">
                  Join GDGC Community <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border hover:border-primary">
                <Link to="/events">Explore Event Calendar</Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => setIsMysteryOpen(true)}
                className="text-red-500 hover:bg-red-500/10 border border-red-500/20"
              >
                <ShieldAlert className="w-5 h-5 mr-2 animate-pulse" /> Play BLACKOUT Clues
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4285F4]" />
                <span className="font-medium text-foreground">{stats.totalMembers}+ Active Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#EA4335]" />
                <span className="font-medium text-foreground">{stats.hackathonWins} Hackathon Wins</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#34A853]" />
                <span className="font-medium text-foreground">{stats.totalDomains} Tech Domains</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} id="stats" className="relative py-16 lg:py-24 bg-muted/30" aria-labelledby="stats-title">
        <AnimatedBackground variant="grid" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="stats-title" className="sr-only">Key Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" role="list">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors shadow-sm"
                role="listitem"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-[#4285F4]" />
                <div className="text-3xl md:text-4xl font-extrabold text-gradient-gdg">
                  {stat.value}{stat.suffix || ''}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500"
                role="listitem"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
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
      <section ref={eventsRef} id="upcoming-events" className="relative py-20 lg:py-28 bg-muted/30" aria-labelledby="events-title">
        <AnimatedBackground variant="particles" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <SectionHeader
              title="Tenure Event Spotlight"
              subtitle="Get ready for our debut flagship event followed by workshops and hackathons."
              align="left"
              badge="Tenure Kickoff"
            />
            <Button variant="outline" asChild className="mt-4 md:mt-0">
              <Link to="/events">View All Events <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {upcomingEvents.slice(0, 3).map((event, index) => {
              const isBlackout = event.title.includes('BLACKOUT');
              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden"
                  role="listitem"
                >
                  <Card hover className={`h-full ${isBlackout ? 'border-red-500/40 shadow-xl shadow-red-500/10' : ''}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs text-muted-foreground font-medium">
                          {event.registered}/{event.capacity} registered
                        </span>
                        <div className="flex gap-2">
                          {isBlackout && (
                            <Button size="sm" variant="ghost" onClick={() => setIsMysteryOpen(true)} className="text-red-500 hover:bg-red-500/10">
                              <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Clues
                            </Button>
                          )}
                          <Button size="sm" asChild variant="primary" className="bg-[#4285F4] hover:bg-[#1a73e8]">
                            <Link to="/contact">Register</Link>
                          </Button>
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

      {/* Tech Domains Overview */}
      <section ref={domainsRef} id="domains" className="relative py-20 lg:py-28" aria-labelledby="domains-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Technical Domains"
            subtitle="Explore our specialized fields with hands-on curriculums and community mentors."
            badge="Tracks"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {domains.map((domain, index) => (
              <motion.article
                key={domain.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.1 }}
                role="listitem"
              >
                <Card hover className="h-full p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{domain.icon}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {domain.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{domain.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{domain.description}</p>
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start p-0 text-primary hover:text-primary/80">
                    <Link to={`/domains#${domain.id}`}>
                      View Curriculum <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </Card>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} id="cta-section" className="relative py-20 lg:py-28 bg-muted/30" aria-labelledby="cta-title">
        <AnimatedBackground variant="orb" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-strong rounded-3xl p-10 md:p-16 border border-border/50 shadow-2xl">
            <h2 id="cta-title" className="text-3xl md:text-5xl font-bold mb-6 text-gradient-gdg">
              Ready to Shape the Future?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our active community of 1000+ student developers. Workshops, mentor hours, and our opening event BLACKOUT await you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto bg-[#4285F4] hover:bg-[#1a73e8] shadow-gdg-glow">
                <Link to="/contact">Join GDGC Today</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/events">Explore Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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