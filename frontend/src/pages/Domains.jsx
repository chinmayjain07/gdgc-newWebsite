import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Calendar, Clock, GitBranch, ExternalLink, CheckCircle, Target, Lightbulb, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { domains } from '@/data/domains';
import { useState } from 'react';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';

export function Domains() {
  const [activeDomain, setActiveDomain] = useState(null);
  const domainsRef = useStaggerAnimation({ stagger: 0.1 });

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden" aria-labelledby="domains-hero-title">
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
              <Target className="w-4 h-4" />
              Technical Domains
            </motion.span>
            <motion.h1
              id="domains-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Choose Your{' '}
              <span className="text-gradient-gdg">
                Learning Path
              </span>
              <InteractiveLogo size="md" className="inline-flex ml-3 align-middle" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Explore our six technical domains. Each offers structured learning paths, hands-on projects, and expert mentorship.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section ref={domainsRef} className="relative py-10 lg:py-16" aria-labelledby="domains-grid-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="domains-grid-title" className="sr-only">Domain Cards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {domains.map((domain, index) => (
              <motion.article
                key={domain.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
                role="listitem"
              >
                <Card hover className="h-full relative overflow-hidden" style={{ borderColor: `hsl(from ${domain.color.replace('from-', '').replace('to-', '')} h s l / 0.3)` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${domain.color})` }} />
                  <CardContent className="relative p-6 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${domain.color})` }}>
                      <domain.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-primary">{domain.shortName}</span>
                      <Badge variant="outline" className="text-xs">{domain.stats.events} Events</Badge>
                      <Badge variant="outline" className="text-xs">{domain.stats.members} Members</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{domain.name}</h3>
                    <p className="text-muted-foreground mb-4 flex-1">{domain.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {domain.technologies.slice(0, 5).map(tech => (
                        <span key={tech} className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">{tech}</span>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start mt-auto group">
                      <Link to={`/domains#${domain.shortName.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-')}`}>
                        Explore {domain.shortName} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {activeDomain && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setActiveDomain(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="domain-detail-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl"
          >
            <DomainDetail domain={activeDomain} onClose={() => setActiveDomain(null)} />
          </motion.div>
        </motion.div>
      )}

      <section className="relative py-20 lg:py-28" aria-labelledby="learning-paths-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Structured Learning Paths"
            subtitle="Each domain offers progressive learning tracks from beginner to advanced."
            badge="Curriculum"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.flatMap(domain => 
              domain.learningPaths.slice(0, 1).map((path, pathIndex) => (
                <motion.article
                  key={`${domain.id}-${pathIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: pathIndex * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <Badge variant="primary" className="mb-2">{domain.shortName}</Badge>
                  <h3 className="font-bold text-lg mb-1">{path.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{path.level} · {path.duration}</p>
                  <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                    {path.topics.slice(0, 3).map(topic => (
                      <li key={topic} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-primary" /> {topic}
                      </li>
                    ))}
                    {path.topics.length > 3 && <li className="text-primary">+{path.topics.length - 3} more topics</li>}
                  </ul>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to={`/domains#${domain.shortName.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-')}`}>View Full Curriculum</Link>
                  </Button>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 bg-muted/30" aria-labelledby="why-domains-title">
        <AnimatedBackground variant="orb" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Learn with GDGC?"
            subtitle="Our domain programs are designed for real-world impact."
            badge="Benefits"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Rocket, title: 'Industry-Aligned', desc: 'Curriculum designed with Google engineers and industry experts.' },
              { icon: Lightbulb, title: 'Project-Based', desc: 'Build real projects for your portfolio, not just tutorials.' },
              { icon: Users, title: 'Peer Learning', desc: 'Learn alongside motivated peers with study groups and pair programming.' },
              { icon: Calendar, title: 'Flexible Schedule', desc: 'Weekly sessions, recordings available, learn at your own pace.' },
              { icon: CheckCircle, title: 'Certifications', desc: 'Earn verified certificates and Google Cloud skill badges.' },
              { icon: GitBranch, title: 'Open Source', desc: 'Contribute to real open-source projects and build your GitHub profile.' },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function DomainDetail({ domain, onClose }) {
  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      <div className="flex items-start justify-between mb-6 sticky top-0 bg-card/95 backdrop-blur z-10 py-4 border-b border-border/50">
        <div>
          <Badge variant="primary" className="mb-2">{domain.shortName}</Badge>
          <h2 id="domain-detail-title" className="text-2xl font-bold">{domain.name}</h2>
          <p className="text-muted-foreground">{domain.description}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-accent/50 transition-colors" aria-label="Close">
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="w-4 h-4" /> {domain.stats.members} Members
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" /> {domain.stats.events} Events
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GitBranch className="w-4 h-4" /> {domain.stats.projects} Projects
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <h4 className="font-semibold mb-2">Technologies</h4>
            <div className="flex flex-wrap gap-1">
              {domain.technologies.map(tech => (
                <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <h4 className="font-semibold mb-2">Upcoming</h4>
            <div className="space-y-1">
              {domain.upcomingEvents.map(event => (
                <div key={event.title} className="text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3 inline mr-1" /> {event.title} ({event.date})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Learning Paths
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {domain.learningPaths.map((path, index) => (
              <Card key={path.title} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="primary" className="mb-1">{path.level}</Badge>
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="mt-1">{path.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                    {path.topics.map(topic => (
                      <li key={topic} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-primary" /> {topic}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to={`/resources#${domain.shortName.toLowerCase()}`}>Start Learning</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Upcoming Events
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {domain.upcomingEvents.map(event => (
              <Card key={event.title}>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary">{event.type}</Badge>
                  </div>
                  <h4 className="font-semibold mb-1">{event.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {event.date} · <Clock className="w-3 h-3" /> {event.time}
                  </p>
                  <Button size="sm" asChild variant="outline" className="w-full">
                    <Link to={`/events/upcoming#event-${event.id}`}>Register</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5" /> Recommended Resources
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {domain.resources.map(resource => (
              <Card key={resource.title}>
                <CardContent className="pt-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">{resource.type}</Badge>
                      <h4 className="font-semibold">{resource.title}</h4>
                    </div>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-accent/50 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}