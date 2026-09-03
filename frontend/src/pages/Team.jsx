import { motion } from 'framer-motion';
import { Link, GitBranch, X, Mail, ChevronDown, ChevronUp, Users, Award, Code, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { coreTeam, domainLeads, allTeam } from '@/data/team';
import { useState } from 'react';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';

const teamTabs = [
  { id: 'core', label: 'Core Team', count: coreTeam.length },
  { id: 'leads', label: 'Domain Leads', count: domainLeads.length },
  { id: 'all', label: 'All Members', count: allTeam.length },
];

export function Team() {
  const [activeTab, setActiveTab] = useState('core');
  const [expandedMember, setExpandedMember] = useState(null);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="team-list-title" className="sr-only">Team Members</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
            {currentTeam.map((member, index) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
                role="listitem"
              >
                <Card hover className="h-full relative overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex gap-2">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors" aria-label={`${member.name} on LinkedIn`}>
                          <Link className="w-5 h-5" />
                        </a>
                      )}
                      {member.social.github && (
                        <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors" aria-label={`${member.name} on GitHub`}>
                          <GitBranch className="w-5 h-5" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors" aria-label={`${member.name} on Twitter`}>
                          <X className="w-5 h-5" />
                        </a>
                      )}
                      {member.social.email && (
                        <a href={`mailto:${member.social.email}`} className="p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors" aria-label={`Email ${member.name}`}>
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <CardContent className="pb-4 relative">
                    <div className="absolute -top-6 left-6 right-6 flex justify-end">
                      <button
                        onClick={() => setExpandedMember(member.id === expandedMember ? null : member.id)}
                        className="p-2 rounded-full bg-card shadow-lg hover:bg-accent/50 transition-colors"
                        aria-label={expandedMember === member.id ? 'Collapse' : 'Expand'}
                        aria-expanded={expandedMember === member.id}
                      >
                        {expandedMember === member.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="primary">{member.domain}</Badge>
                    </div>
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                      {member.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{member.skills.length - 3}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {expandedMember && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setExpandedMember(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-detail-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl"
          >
            <MemberDetail member={currentTeam.find(m => m.id === expandedMember)} onClose={() => setExpandedMember(null)} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

function MemberDetail({ member, onClose }) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Badge variant="primary" className="mb-2">{member.domain}</Badge>
          <h2 id="member-detail-title" className="text-2xl font-bold">{member.name}</h2>
          <p className="text-muted-foreground">{member.role}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-accent/50 transition-colors" aria-label="Close">
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
      <img src={member.image} alt={member.name} className="w-full h-64 object-cover rounded-xl mb-6" />
      <p className="text-muted-foreground mb-6">{member.bio}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {member.skills.map(skill => (
          <Badge key={skill} variant="outline">{skill}</Badge>
        ))}
      </div>
      <div className="flex gap-4 pt-4 border-t border-border/50">
        {member.social.linkedin && (
          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
            <Link className="w-5 h-5" /> LinkedIn
          </a>
        )}
        {member.social.github && (
          <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
            <GitBranch className="w-5 h-5" /> GitHub
          </a>
        )}
        {member.social.twitter && (
          <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
            <X className="w-5 h-5" /> Twitter
          </a>
        )}
      </div>
    </div>
  );
}