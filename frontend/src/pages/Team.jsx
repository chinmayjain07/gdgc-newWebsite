import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { coreTeam, domainLeads, allTeam } from '@/data/team';
import { useState } from 'react';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import { TeamFlipCard } from '@/components/team/TeamFlipCard';

const teamTabs = [
  { id: 'core', label: 'Core Team', count: coreTeam.length },
  { id: 'leads', label: 'Domain Leads', count: domainLeads.length },
  { id: 'all', label: 'All Members', count: allTeam.length },
];

export function Team() {
  const [activeTab, setActiveTab] = useState('core');
  const teamRef = useStaggerAnimation({ stagger: 0.1 });

  const currentTeam = activeTab === 'core' ? coreTeam : activeTab === 'leads' ? domainLeads : allTeam;

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden" aria-labelledby="team-hero-title">
        <AnimatedBackground variant="orb" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6"
            >
              <Users className="w-4 h-4" />
              Meet the Team
            </motion.span>
            <motion.h1
              id="team-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              The People Behind{' '}
              <span className="text-gradient-gdg">
                GDGC
              </span>
              <InteractiveLogo size="md" className="inline-flex ml-3 align-middle" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Passionate student leaders dedicated to building the best developer community on campus.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-10 lg:py-16" aria-labelledby="team-filter-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-2 flex-wrap justify-center" role="tablist" aria-label="Team filters">
            {teamTabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'bg-card text-foreground/70 hover:bg-accent/50 hover:text-foreground border border-border/50'
                }`}
              >
                {tab.label} <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-background/50">{tab.count}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section ref={teamRef} className="relative py-10 lg:py-16" aria-labelledby="team-list-title">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="team-list-title" className="sr-only">Team Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5" role="list">
            {currentTeam.map((member, index) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
                role="listitem"
              >
                <TeamFlipCard member={member} />
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}