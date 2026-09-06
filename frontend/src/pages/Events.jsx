import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, ArrowRight, ShieldAlert, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import {
  allEvents,
  upcomingEvents,
  pastEvents,
  allEventPhotos,
  upcomingEventPhotos,
  pastEventPhotos,
} from '@/data/events';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import { BlackoutMysteryGame } from '@/components/events/BlackoutMysteryGame';
import { CoverflowCarousel } from '@/components/ui/CoverflowCarousel';

const tabs = [
  { id: 'all', label: 'All Events', count: allEvents.length },
  { id: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
  { id: 'past', label: 'Past Archive', count: pastEvents.length },
];

export function Events() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [isMysteryOpen, setIsMysteryOpen] = useState(false);

  const domains = [...new Set(allEvents.map((e) => e.domain).filter(Boolean))];

  const filterSlides = (list) => {
    return list.filter((photo) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        photo.title.toLowerCase().includes(q) ||
        photo.subtitle?.toLowerCase().includes(q) ||
        photo.description?.toLowerCase().includes(q) ||
        photo.domain?.toLowerCase().includes(q) ||
        photo.type?.toLowerCase().includes(q);

      const matchesDomain =
        selectedDomain === 'all' ||
        photo.domain === selectedDomain ||
        photo.domain === 'All';

      return matchesSearch && matchesDomain;
    });
  };

  const baseSlides =
    activeTab === 'upcoming'
      ? upcomingEventPhotos
      : activeTab === 'past'
      ? pastEventPhotos
      : allEventPhotos;

  const currentSlides = filterSlides(baseSlides);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDomain('all');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[45vh] flex items-center overflow-hidden" aria-labelledby="events-hero-title">
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
              Official GDGC Calendar
            </motion.span>
            <motion.h1
              id="events-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground"
            >
              Explore Our Event Calendar
              <InteractiveLogo size="md" className="inline-flex ml-3 align-middle" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Discover upcoming hackathons, tech talks, hands-on bootcamps, and historical archives from GDGC.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter and Tab Controller */}
      <section className="relative py-8" aria-labelledby="events-filter-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Tab Switcher */}
              <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Event category tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#4285F4] text-white shadow-md'
                        : 'bg-card text-foreground/70 hover:bg-accent/10 hover:text-foreground border border-border/50'
                    }`}
                  >
                    {tab.label}
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-black/10 dark:bg-white/10">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search and Domain Select */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search events, tags, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    aria-label="Search events"
                  />
                </div>
                {domains.length > 0 && (
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    aria-label="Filter by domain"
                  >
                    <option value="all">All Domains</option>
                    {domains.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Coverflow Showcase — Main Attraction */}
      <section className="relative py-8 lg:py-16 overflow-hidden" aria-labelledby="events-showcase-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 sm:mb-10"
          >
            <h2 id="events-showcase-title" className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              {activeTab === 'upcoming'
                ? `Upcoming Events (${currentSlides.length})`
                : activeTab === 'past'
                ? `Past Tenure Archive (${currentSlides.length})`
                : `All Events Showcase (${currentSlides.length})`}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-2 text-sm sm:text-base">
              Drag, swipe, or click any card to inspect details, explore speakers, and participate.
            </p>
          </motion.div>

          {currentSlides.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/50 max-w-xl mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#4285F4]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">No matching events found</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                No events matched your current search or domain filter in this view.
              </p>
              <Button onClick={resetFilters} variant="outline" size="sm" className="cursor-pointer">
                <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeTab}-${searchQuery}-${selectedDomain}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CoverflowCarousel
                slides={currentSlides}
                showCaption={true}
                showPagination={true}
                showNavigation={true}
                autoplay={true}
                autoplayInterval={4500}
                className="mx-auto"
                renderActions={(active) => {
                  const isUpcoming =
                    active?.isUpcoming ??
                    upcomingEvents.some((u) => u.id === active?.id);
                  const isBlackout = active?.title?.includes('BLACKOUT');

                  return (
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                      {isBlackout && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsMysteryOpen(true)}
                          className="text-red-500 hover:bg-red-500/10 border border-red-500/20 font-semibold cursor-pointer"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 mr-1 animate-pulse" /> Detective Clues
                        </Button>
                      )}
                      {isUpcoming ? (
                        <Button asChild size="sm" className="bg-[#4285F4] hover:bg-[#1a73e8] shadow-md">
                          <Link to="/contact">
                            Register Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild size="sm" variant="outline" className="border-border hover:bg-accent/10">
                          <Link to="/events/past">
                            View Past Archive <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  );
                }}
              />
            </motion.div>
          )}
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