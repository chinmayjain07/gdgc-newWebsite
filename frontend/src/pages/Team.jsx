import { motion } from 'framer-motion';
import { Users, GraduationCap, Award, Layers } from 'lucide-react';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { faculties, leads, domainHeads, domainGroups, multiHeadDomainGroups, singleHeadDomainGroups } from '@/data/team';
import { useState } from 'react';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import { TeamFlipCard } from '@/components/team/TeamFlipCard';

const teamTabs = [
  { id: 'faculties', label: 'Faculties', count: faculties.length },
  { id: 'leads', label: 'Leads', count: leads.length },
  { id: 'domainHeads', label: 'Domain Heads', count: 22 },
  { id: 'all', label: 'All Members', count: 24 },
];

export function Team() {
  const [activeTab, setActiveTab] = useState('faculties');
  const teamRef = useStaggerAnimation({ stagger: 0.1 });

  return (
    <>
      {/* Hero Section */}
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
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground"
            >
              The People Behind GDGC
              <InteractiveLogo size="md" className="inline-flex ml-3 align-middle" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Dedicated mentors, chapter leadership, and domain heads building the premier developer community at PCCOE.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="relative py-8" aria-labelledby="team-filter-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-2 flex-wrap justify-center"
            role="tablist"
            aria-label="Team filters"
          >
            {teamTabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-foreground/70 hover:bg-accent/50 hover:text-foreground border border-border/50'
                }`}
              >
                {tab.label}{' '}
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-background/50">
                  {tab.count}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Content Showcase */}
      <section ref={teamRef} className="relative py-10 lg:py-16" aria-labelledby="team-list-title">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="team-list-title" className="sr-only">Team Members</h2>

          {/* TAB 1: FACULTIES (First position) */}
          {activeTab === 'faculties' && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-2">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Academic Mentorship
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Faculty Coordinators</h3>
                <p className="text-muted-foreground text-sm mt-1">Guiding student developers and institutional excellence.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6" role="list">
                {faculties.map((member, index) => (
                  <motion.article
                    key={member.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                    role="listitem"
                  >
                    <TeamFlipCard member={member} />
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CHAPTER LEADS */}
          {activeTab === 'leads' && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 mb-2">
                  <Award className="w-3.5 h-3.5" />
                  Chapter Executive Leadership
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Chapter Leads</h3>
                <p className="text-muted-foreground text-sm mt-1">Directing chapter vision, partnerships, and technical programs.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto gap-6" role="list">
                {leads.map((member, index) => (
                  <motion.article
                    key={member.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                    role="listitem"
                  >
                    <TeamFlipCard member={member} />
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOMAIN HEADS */}
          {activeTab === 'domainHeads' && (
            <div className="space-y-16">
              {/* Multi-Head Domains */}
              {multiHeadDomainGroups.map((group, gIdx) => (
                <div key={group.id} className="space-y-6">
                  {/* Domain Name Heading Centered Above with Description Below */}
                  <div className="flex flex-col items-center justify-center text-center gap-1.5 mx-auto max-w-2xl">
                    <div className="inline-flex items-center justify-center gap-2.5 flex-wrap">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {group.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        {group.members.length} {group.members.length === 1 ? 'Head' : 'Heads'}
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {group.description}
                      </p>
                    )}
                  </div>

                  {/* Cards Grid: Centered and responsive according to card count */}
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${
                      group.members.length === 2
                        ? 'sm:grid-cols-2 max-w-2xl mx-auto'
                        : group.members.length === 3
                        ? 'md:grid-cols-3 max-w-4xl mx-auto'
                        : group.members.length === 4
                        ? 'md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto'
                        : 'md:grid-cols-3 lg:grid-cols-5'
                    } gap-4 sm:gap-5`}
                    role="list"
                  >
                    {group.members.map((member, index) => (
                      <motion.article
                        key={`${group.id}-${member.id}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (gIdx * 0.05) + (index * 0.05) }}
                        className="h-full"
                        role="listitem"
                      >
                        <TeamFlipCard member={member} />
                      </motion.article>
                    ))}
                  </div>
                </div>
              ))}

              {/* Single-Head Domains in One Row at the Last of Domain Heads Section */}
              <div className="pt-8 border-t border-border/40 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto" role="list">
                  {singleHeadDomainGroups.map((group, sIdx) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + (sIdx * 0.05) }}
                      className="flex flex-col h-full items-center"
                      role="listitem"
                    >
                      {/* Domain Name Centered & Description Below */}
                      <div className="flex flex-col items-center justify-start text-center gap-1 mb-4 w-full min-h-[64px]">
                        <div className="inline-flex items-center justify-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                            {group.name}
                          </h3>
                        </div>
                        {group.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed px-1">
                            {group.description}
                          </p>
                        )}
                      </div>

                      {/* Card with uniform sizing */}
                      <div className="w-full flex-1">
                        <TeamFlipCard member={group.members[0]} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALL MEMBERS (Hierarchical view of all sections) */}
          {activeTab === 'all' && (
            <div className="space-y-20">
              {/* Section 1: Faculties */}
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 pb-3 border-b border-border/60 text-center">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <h3 className="text-2xl font-bold text-foreground">Faculties</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500">
                    {faculties.length} Coordinators
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6" role="list">
                  {faculties.map((member) => (
                    <div key={member.id} role="listitem">
                      <TeamFlipCard member={member} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Leads */}
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 pb-3 border-b border-border/60 text-center">
                  <Award className="w-5 h-5 text-red-500" />
                  <h3 className="text-2xl font-bold text-foreground">Leads</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
                    {leads.length} Organizers
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto gap-6" role="list">
                  {leads.map((member) => (
                    <div key={`all-lead-${member.id}`} role="listitem">
                      <TeamFlipCard member={member} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Domain Heads */}
              <div className="space-y-12">
                <div className="flex items-center justify-center gap-3 pb-3 border-b border-border/60 text-center">
                  <Layers className="w-5 h-5 text-green-500" />
                  <h3 className="text-2xl font-bold text-foreground">Domain Heads</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-500">
                    22 Heads
                  </span>
                </div>

                {/* Multi-Head Domains */}
                {multiHeadDomainGroups.map((group, idx) => (
                  <div key={group.id} className={`space-y-6 ${idx !== 0 ? 'pt-8 border-t border-border/40' : ''}`}>
                    {/* Highlighted & Centered Domain Name Header */}
                    <div className="flex flex-col items-center justify-center text-center gap-1.5 mx-auto max-w-2xl">
                      <div className="inline-flex items-center justify-center gap-2.5 flex-wrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        <h4 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                          {group.name}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                          {group.members.length} {group.members.length === 1 ? 'Head' : 'Heads'}
                        </span>
                      </div>
                      {group.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {group.description}
                        </p>
                      )}
                    </div>
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 ${
                        group.members.length === 2
                          ? 'sm:grid-cols-2 max-w-2xl mx-auto'
                          : group.members.length === 3
                          ? 'md:grid-cols-3 max-w-4xl mx-auto'
                          : group.members.length === 4
                          ? 'md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto'
                          : 'md:grid-cols-3 lg:grid-cols-5'
                      } gap-4 sm:gap-5`}
                      role="list"
                    >
                      {group.members.map((member) => (
                        <div key={`all-${group.id}-${member.id}`} role="listitem">
                          <TeamFlipCard member={member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Single-Head Domains in One Row at the Last of All Members Section */}
                <div className="pt-8 border-t border-border/40 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto" role="list">
                    {singleHeadDomainGroups.map((group) => (
                      <div key={`all-single-${group.id}`} className="flex flex-col h-full items-center" role="listitem">
                        {/* Domain Name Centered & Description Below */}
                        <div className="flex flex-col items-center justify-start text-center gap-1 mb-4 w-full min-h-[64px]">
                          <div className="inline-flex items-center justify-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                            <h4 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                              {group.name}
                            </h4>
                          </div>
                          {group.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed px-1">
                              {group.description}
                            </p>
                          )}
                        </div>

                        {/* Card with uniform sizing */}
                        <div className="w-full flex-1">
                          <TeamFlipCard member={group.members[0]} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}