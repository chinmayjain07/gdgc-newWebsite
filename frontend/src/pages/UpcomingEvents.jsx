import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { upcomingEvents, upcomingEventPhotos } from '@/data/events';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import { CoverflowCarousel } from '@/components/ui/CoverflowCarousel';
import { Link } from 'react-router-dom';

export function UpcomingEvents() {
  return (
    <>
      {/* Hero Section */}
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
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground"
            >
              Don't Miss Out on What's Coming
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

      {/* 3D Coverflow — Primary Showcase of Upcoming Events */}
      <section className="relative py-12 lg:py-20 overflow-hidden" aria-labelledby="upcoming-showcase-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-10"
          >
            <h2 id="upcoming-showcase-title" className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Featured Upcoming Events ({upcomingEvents.length})
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-2 text-sm sm:text-base">
              Drag, swipe, or click any card to inspect event details, check seat availability, and register.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <CoverflowCarousel
              slides={upcomingEventPhotos}
              cardWidth="clamp(240px, 28vw, 340px)"
              cardHeight="clamp(300px, 35vw, 420px)"
              showCaption={true}
              showPagination={true}
              showNavigation={true}
              autoplay={true}
              autoplayInterval={6000}
              className="mx-auto"
              renderActions={(active) => (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                  {active?.registrationUrl?.includes('unstop') ? (
                    <Button asChild size="sm" className="bg-[#EA4335] hover:bg-[#d93025] text-white shadow-md font-semibold cursor-pointer">
                      <a href={active.registrationUrl} target="_blank" rel="noopener noreferrer">
                        Register on Unstop <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </Button>
                  ) : (
                    <Button asChild size="sm" className="bg-[#4285F4] hover:bg-[#1a73e8] shadow-md font-semibold cursor-pointer">
                      <Link to={active?.registrationUrl || '/contact'}>
                        Register Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}