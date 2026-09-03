import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { upcomingEvents } from '@/data/events';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import { BlackoutMysteryGame } from '@/components/events/BlackoutMysteryGame';
import { Link } from 'react-router-dom';

const typeColors = {
  Workshop: 'bg-blue-500/10 text-[#4285F4] border-blue-500/20',
  'Tech Talk': 'bg-red-500/10 text-[#EA4335] border-red-500/20',
  Hackathon: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  Conference: 'bg-green-500/10 text-[#34A853] border-green-500/20',
};

const domainColors = {
  'AI/ML': 'bg-blue-500/10 text-[#4285F4] border-blue-500/20',
  Mobile: 'bg-green-500/10 text-[#34A853] border-green-500/20',
  Web: 'bg-red-500/10 text-[#EA4335] border-red-500/20',
  Cloud: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  All: 'bg-blue-500/10 text-[#4285F4] border-blue-500/20',
};

export function UpcomingEvents() {
  const [isMysteryOpen, setIsMysteryOpen] = useState(false);
  const eventsRef = useStaggerAnimation({ stagger: 0.1 });

  return (
    <>
      <section className="relative min-h-[45vh] flex items-center overflow-hidden" aria-labelledby="upcoming-hero-title">
        <AnimatedBackground variant="orb" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 mb-6"
            >
              <Calendar className="w-4 h-4" />
              Tenure Event Schedule
            </motion.span>
            <motion.h1
              id="upcoming-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Don't Miss Out on <span className="text-gradient-gdg">What's Coming</span>
              <InteractiveLogo size="md" className="inline-flex ml-3 align-middle" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Register early to secure your spot. Experience our premier debut event BLACKOUT followed by tech bootcamps.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section ref={eventsRef} className="relative py-10 lg:py-16" aria-labelledby="upcoming-list-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={`Upcoming Events (${upcomingEvents.length})`}
            subtitle="Secure your spot now — seats fill up fast!"
            badge="Register Today"
            align="left"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {upcomingEvents.map((event, index) => {
              const isBlackout = event.title.includes('BLACKOUT');
              return (
                <motion.article
                  key={event.id}
                  id={`event-${event.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative"
                  role="listitem"
                >
                  <Card hover className={`h-full ${isBlackout ? 'border-red-500/40 shadow-xl shadow-red-500/10' : ''}`}>
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={event.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {isBlackout && (
                          <Badge className="bg-red-600 text-white font-bold animate-pulse">
                            TENURE FLAGSHIP OPENER
                          </Badge>
                        )}
                        <Badge className={typeColors[event.type] || 'bg-blue-500/10 text-primary'}>{event.type}</Badge>
                        {event.domain && (
                          <Badge className={domainColors[event.domain] || 'bg-blue-500/10 text-primary'}>{event.domain}</Badge>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[11px]">Open</span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3 font-medium">
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {event.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">{event.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {(event.tags || []).slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xs text-muted-foreground font-medium">
                          {event.registered}/{event.capacity} registered
                        </span>
                        <div className="flex gap-2">
                          {isBlackout && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsMysteryOpen(true)}
                              className="text-red-500 hover:bg-red-500/10 border border-red-500/20"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 mr-1 animate-pulse" /> Clues
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