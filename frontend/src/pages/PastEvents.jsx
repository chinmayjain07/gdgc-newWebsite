import { motion } from 'framer-motion';
import { Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { pastEvents } from '@/data/events';
import { Link } from 'react-router-dom';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';

export function PastEvents() {
  return (
    <>
      <section className="relative min-h-[45vh] flex items-center overflow-hidden" aria-labelledby="past-hero-title">
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
              Tenure Event Archive
            </motion.span>
            <motion.h1
              id="past-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Past Tenure <span className="text-gradient-gdg">Highlights</span>
              <InteractiveLogo size="md" className="inline-flex ml-3 align-middle" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Archive of events and community workshops hosted by GDGC.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24" aria-labelledby="past-empty-title">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 md:p-16 rounded-3xl bg-card border border-dashed border-border/70 shadow-xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-[#4285F4]" />
            </div>
            <h2 id="past-empty-title" className="text-3xl font-bold mb-4 text-foreground">
              New Tenure Underway — No Past Events Yet!
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
              We have just kicked off our tenure! All exciting workshops, speaker sessions, and hackathons are just ahead. Get ready for our opening flagship experience: <strong className="text-foreground">BLACKOUT</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-[#4285F4] hover:bg-[#1a73e8] shadow-gdg-glow">
                <Link to="/events/upcoming">
                  View Upcoming Events <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link to="/contact">Join the Team</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}