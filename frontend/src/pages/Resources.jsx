import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Lightbulb, Briefcase, FileText, Rocket, ExternalLink, GitBranch, MessageSquare, ChevronDown, ChevronUp, CheckCircle, Clock, Globe, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { resources } from '@/data/resources';
import { useState } from 'react';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';

const categoryIcons = {
  'Getting Started': Rocket,
  'Study Jam Materials': BookOpen,
  'Project Showcase': Lightbulb,
  'Career Resources': Briefcase,
  'Quick References': FileText,
};

export function Resources() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedResource, setExpandedResource] = useState(null);
  const categoriesRef = useStaggerAnimation({ stagger: 0.1 });
  const featuredRef = useStaggerAnimation({ stagger: 0.1 });

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden" aria-labelledby="resources-hero-title">
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
              <BookOpen className="w-4 h-4" />
              Learning Resources
            </motion.span>
            <motion.h1
              id="resources-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Your Developer{' '}
              <span className="text-gradient-gdg">
                Toolkit
              </span>
              <InteractiveLogo size="md" className="inline-flex ml-3 align-middle" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Curated learning materials, project showcases, career guides, and quick references — everything you need to grow.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section ref={categoriesRef} className="relative py-10 lg:py-16" aria-labelledby="categories-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Browse by Category"
            subtitle="Structured resources organized by learning stage and topic."
            badge="5 Categories"
            align="left"
          />
          <div className="space-y-4" role="list">
            {resources.categories.map((category, catIndex) => {
              const Icon = categoryIcons[category.name] || BookOpen;
              const isExpanded = expandedCategory === category.id;
              return (
                <motion.article
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                  className="relative"
                  role="listitem"
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                        className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-accent/50 transition-colors"
                        aria-expanded={isExpanded}
                        aria-controls={`category-${category.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${category.color})` }}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span className="text-sm">{category.resources.length} resources</span>
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>
                    </CardContent>
                  </Card>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        id={`category-${category.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0">
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
                            {category.resources.map((resource, resIndex) => (
                              <motion.article
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: resIndex * 0.05 }}
                                className="relative"
                                role="listitem"
                              >
                                <Card hover className="h-full">
                                  <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1 pr-4">
                                        <Badge variant="outline" className="mb-2">{resource.type}</Badge>
                                        <h4 className="font-semibold text-base mb-1">{resource.title}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                                      </div>
                                      {resource.badge && (
                                        <Badge variant="primary" className="flex-shrink-0">{resource.badge}</Badge>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {resource.duration}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3" /> {resource.level}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {resource.tags.slice(0, 3).map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                      ))}
                                    </div>
{resource.github && (
                                        <div className="mt-3 pt-3 border-t border-border/50 flex gap-2">
                                          <Button variant="ghost" size="sm" asChild className="flex-1">
                                            <a href={resource.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                                              <GitBranch className="w-4 h-4" /> Code
                                            </a>
                                          </Button>
                                        {resource.demo && (
                                          <Button variant="ghost" size="sm" asChild className="flex-1">
                                            <a href={resource.demo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                                              <Globe className="w-4 h-4" /> Demo
                                            </a>
                                          </Button>
                                        )}
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </motion.article>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={featuredRef} className="relative py-20 lg:py-28 bg-muted/30" aria-labelledby="featured-title">
        <AnimatedBackground variant="particles" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured Resources"
            subtitle="Essential links and platforms for every GDGC member."
            badge="Quick Access"
            align="left"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
            {resources.featuredResources.map((resource, index) => (
              <motion.article
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                role="listitem"
              >
                <Card hover className="h-full group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <resource.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        Access Resource <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28" aria-labelledby="contribute-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Contribute to Our Resources"
            subtitle="Have a great tutorial, project, or guide? Help the community grow by sharing your knowledge."
            badge="Open Source"
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Lightbulb, title: 'Submit a Tutorial', desc: 'Write a step-by-step guide for a technology you\'ve mastered.', action: 'Submit Tutorial' },
              { icon: Globe, title: 'Share a Project', desc: 'Showcase your project with source code and learnings.', action: 'Share Project' },
              { icon: CheckCircle, title: 'Improve Existing', desc: 'Fix typos, update outdated content, or add missing info.', action: 'Contribute' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.desc}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contact">{item.action} <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}