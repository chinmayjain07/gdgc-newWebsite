import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Award, Medal, Star, Globe, BadgeCheck, Users, Code, Heart, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { achievements, stats } from '@/data/achievements';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';

const statCards = [
  { label: 'Total Members', value: stats.totalMembers, suffix: '+', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { label: 'Events Hosted', value: stats.totalEvents, suffix: '+', icon: Code, color: 'from-purple-500 to-pink-500' },
  { label: 'Tech Domains', value: stats.totalDomains, icon: Sparkles, color: 'from-green-500 to-teal-500' },
  { label: 'Certifications', value: stats.certifications, suffix: '+', icon: BadgeCheck, color: 'from-orange-500 to-red-500' },
  { label: 'Hackathon Wins', value: stats.hackathonWins, icon: Trophy, color: 'from-yellow-500 to-amber-500' },
  { label: 'Global Finalists', value: stats.globalFinalists, icon: Globe, color: 'from-indigo-500 to-blue-500' },
  { label: 'Alumni Network', value: stats.alumniNetwork, suffix: '+', icon: Users, color: 'from-rose-500 to-pink-500' },
  { label: 'Industry Partners', value: stats.industryPartners, icon: Heart, color: 'from-teal-500 to-cyan-500' },
];

const awardIcons = {
  'Chapter Award': Trophy,
  'Event Excellence': Award,
  Competition: Medal,
  Certification: BadgeCheck,
  'Community Impact': Heart,
};

export function Achievements() {
  const statsRef = useStaggerAnimation({ stagger: 0.1 });
  const achievementsRef = useStaggerAnimation({ stagger: 0.1 });

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden" aria-labelledby="achievements-hero-title">
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
              <Trophy className="w-4 h-4" />
              Achievements & Recognition
            </motion.span>
            <motion.h1
              id="achievements-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Our{' '}
              <span className="text-gradient-gdg">
                Proudest Moments
              </span>
              <InteractiveLogo size="md" className="inline-flex ml-3 align-middle" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Recognition from Google, industry leaders, and the global developer community for our impact and excellence.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section ref={statsRef} className="relative py-10 lg:py-16" aria-labelledby="stats-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="stats-title" className="sr-only">Key Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" role="list">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors text-center"
                role="listitem"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-5 rounded-2xl" style={{ background: `linear-gradient(135deg, ${stat.color})` }} />
                <div className="relative w-12 h-12 mx-auto mb-3" style={{ background: `linear-gradient(135deg, ${stat.color})` }}>
                  <stat.icon className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="relative text-3xl md:text-4xl font-bold bg-gradient-to-r text-transparent bg-clip-text" style={{ background: `linear-gradient(135deg, ${stat.color})` }}>
                  {stat.value}{stat.suffix || ''}
                </div>
                <p className="relative text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={achievementsRef} className="relative py-10 lg:py-16" aria-labelledby="achievements-list-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Awards & Recognition"
            subtitle="Milestones that define our journey and impact."
            badge="Hall of Fame"
            align="left"
          />
          <div className="space-y-6" role="list">
            {achievements.map((achievement, index) => (
              <motion.article
                key={achievement.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
                role="listitem"
              >
                <Card className="overflow-hidden relative">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${achievement.color})` }} />
                  <div className="relative flex flex-col md:flex-row">
                    <div className="relative md:w-72 flex-shrink-0 overflow-hidden">
                      <img
                        src={achievement.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/60" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <Badge variant="primary" className="mb-2">{achievement.year}</Badge>
                        <h3 className="text-xl font-bold">{achievement.title}</h3>
                        <p className="text-sm opacity-90">{achievement.category}</p>
                      </div>
                    </div>
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${achievement.color})` }}>
                          {(() => {
                            const Icon = awardIcons[achievement.category];
                            return Icon ? <Icon className="w-6 h-6" /> : null;
                          })()}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.category} · {achievement.year}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4 flex-1">{achievement.description}</p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {Object.entries(achievement.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r text-transparent bg-clip-text" style={{ background: `linear-gradient(135deg, ${achievement.color})` }}>
                              {value}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          View Details <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 bg-muted/30" aria-labelledby="highlights-title">
        <AnimatedBackground variant="particles" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Recent Highlights"
            subtitle="Some of our most impactful achievements from the past year."
            badge="2023-2024"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'Solution Challenge Top 10', desc: 'EcoTrack selected as global finalist from 2000+ submissions worldwide.', stat: 'Top 10 Global', color: 'from-green-500 to-teal-500' },
              { icon: Trophy, title: 'APAC Chapter of the Year', desc: 'Recognized as the best GDG campus chapter across Asia Pacific region.', stat: '#1 in APAC', color: 'from-yellow-500 to-orange-500' },
              { icon: Medal, title: 'Cloud Hero Champions', desc: 'Team CloudNine won grand prize at Google Cloud Hero Regional Hackathon.', stat: '$10K Prize', color: 'from-blue-500 to-cyan-500' },
              { icon: BadgeCheck, title: '50+ Cloud Certifications', desc: 'Members earned Associate, Professional, and Specialty GCP certifications.', stat: '50+ Certified', color: 'from-purple-500 to-pink-500' },
              { icon: Heart, title: '45% Female Participation', desc: 'Achieved near gender parity through Women in Tech mentorship program.', stat: 'D&I Champion', color: 'from-rose-500 to-pink-500' },
              { icon: Sparkles, title: 'DevFest 500+ Attendees', desc: 'Largest student-run tech conference with 50+ speakers and 15 workshops.', stat: '500+ Attendees', color: 'from-indigo-500 to-blue-500' },
            ].map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white" style={{ background: `linear-gradient(135deg, ${highlight.color})` }}>
                  <highlight.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="mb-2" style={{ borderColor: highlight.color.split(' ')[1], color: highlight.color.split(' ')[1] }}>
                  {highlight.stat}
                </Badge>
                <h3 className="font-bold text-lg mb-2">{highlight.title}</h3>
                <p className="text-muted-foreground">{highlight.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28" aria-labelledby="cta-title">
        <AnimatedBackground variant="orb" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-3xl p-10 md:p-16 border border-white/20"
          >
            <motion.h2
              id="cta-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Want to Be Part of Our Next Success Story?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Join a chapter that wins globally. Your contribution could be our next achievement.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" asChild className="w-full sm:w-auto group">
                <Link to="/contact">Join GDGC</Link>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/events/upcoming">Compete With Us</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}