import { motion } from 'framer-motion';
import { Calendar, Sparkles, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { pastEventPhotos } from '@/data/events';
import { CoverflowCarousel } from '@/components/ui/CoverflowCarousel';
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
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground"
            >
              Past Tenure Highlights
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

      {/* 3D Coverflow Carousel — Retrospective Photo Rack */}
      <section className="relative py-12 lg:py-20 overflow-hidden" aria-labelledby="past-gallery-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-10"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              <ImageIcon className="w-3.5 h-3.5" />
              Interactive Photo Gallery
            </span>
            <h2 id="past-gallery-title" className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Moments That Defined Us
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-2 text-sm sm:text-base">
              Swipe or click through highlights, hackathons, and workshops from our vibrant developer community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <CoverflowCarousel
              slides={pastEventPhotos}
              cardWidth="clamp(240px, 28vw, 340px)"
              cardHeight="clamp(300px, 35vw, 420px)"
              showCaption={true}
              showPagination={true}
              showNavigation={true}
              autoplay={true}
              autoplayInterval={6000}
              className="mx-auto"
              renderActions={(active) => (
                <div className="flex items-center justify-center gap-3 mt-2">
                  <Button asChild size="sm" className="bg-[#34A853] hover:bg-[#1e8e3e] text-white shadow-md font-semibold cursor-pointer">
                    <Link to="/events">
                      Explore All Events <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              )}
            />
          </motion.div>
        </div>
      </section>

      {/* Active Tenure Status Notice */}
      <section className="relative py-12 lg:py-16" aria-labelledby="past-empty-title">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 md:p-16 rounded-3xl bg-card border border-dashed border-border/70 shadow-xl"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#4285F4]" />
            </div>
            <h2 id="past-empty-title" className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
              New Tenure Underway — Current Cycle Events Ahead!
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed text-sm sm:text-base">
              We have just kicked off our new tenure! Exciting workshops, speaker sessions, and hackathons are right around the corner. Get ready for our opening flagship experience: <strong className="text-foreground">BLACKOUT</strong>.
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