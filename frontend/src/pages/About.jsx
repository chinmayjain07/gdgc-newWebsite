import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, Globe, Heart, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { InteractiveLogo } from '@/components/ui/InteractiveLogo';
import { CountUp } from '@/hooks/useCountUp';
import { ArrowFillButton } from '@/components/ui/ArrowFillButton';

const values = [
  { icon: Target, title: 'Learning First', description: 'We prioritize hands-on, practical learning over theory. Every event is designed to give you real skills you can apply immediately.' },
  { icon: Users, title: 'Community Driven', description: 'Built by students, for students. Our community shapes every decision, from event topics to leadership opportunities.' },
  { icon: Lightbulb, title: 'Innovation Focused', description: "We explore cutting-edge technologies before they hit the mainstream. Stay ahead with Google's latest tools and platforms." },
  { icon: Globe, title: 'Global Impact', description: "Connect with Google Developer Groups worldwide. Your projects can reach global audiences through Google's platforms." },
  { icon: Heart, title: 'Inclusive & Welcoming', description: 'No experience required. We celebrate diverse backgrounds and create safe spaces for everyone to learn and grow.' },
  { icon: CheckCircle, title: 'Career Ready', description: 'Bridge the gap between campus and industry. Access mentorship, internships, and job opportunities through our network.' },
];

const milestones = [
  { year: '2022', title: 'Chapter Founded', description: 'GDG Campus Chapter officially recognized by Google. Started with 50 founding members.' },
  { year: '2022', title: 'First DevFest', description: 'Hosted our inaugural DevFest with 200+ attendees and 15 speakers from Google and industry.' },
  { year: '2023', title: 'Rapid Growth', description: 'Community grew to 500+ members. Launched 6 technical domains with dedicated leads.' },
  { year: '2023', title: 'Global Recognition', description: 'Won GDG Campus Chapter of the Year - Asia Pacific. Solution Challenge Top 10 Global Finalists.' },
  { year: '2024', title: 'New Horizons', description: 'Expanded to 1000+ members. Launched mentorship program, alumni network, and industry partnerships.' },
];

const team = [
  { name: 'Alexandra Chen', role: 'Lead Organizer', quote: '"GDGC transformed my college experience. It\'s not just about coding—it\'s about finding your people."' },
  { name: 'Rahul Sharma', role: 'Co-Lead Organizer', quote: '"The best part is seeing beginners become mentors. That\'s the cycle we\'re building."' },
  { name: 'Priya Patel', role: 'Technical Lead', quote: '"Every workshop, every hackathon—we\'re not just teaching tech, we\'re building confidence."' },
];

export function About() {
  return (
    <>
      <section className="relative min-h-[60vh] flex items-center overflow-hidden" aria-labelledby="about-hero-title">
        <AnimatedBackground variant="orb" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              About GDGC
            </motion.span>
            <motion.h1
              id="about-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground"
            >
              Empowering Student Developers Worldwide
              <InteractiveLogo size="md" className="inline-flex ml-3 align-middle" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              We're a global community of student developers backed by Google, dedicated to bridging the gap between theory and practice through hands-on learning, mentorship, and real-world projects.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28" aria-labelledby="mission-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Mission & Values"
            subtitle="Everything we do is guided by our core principles. These aren't just words—they're how we operate every day."
            badge="Core Principles"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {values.map((value, index) => (
              <motion.article
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors"
                role="listitem"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      {/* ── Our Journey / Timeline (Commented Out) ── */}
      {/*
      <section className="relative py-20 lg:py-28 bg-muted/30" aria-labelledby="journey-title">
        <AnimatedBackground variant="grid" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Journey"
            subtitle="From a small group of passionate students to an award-winning chapter recognized globally."
            badge="Timeline"
            align="left"
          />
          <div className="relative max-w-3xl">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-accent" />
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year + index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-14 pb-10 group"
              >
                <div className="absolute left-[17px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-background shadow-md group-hover:scale-125 transition-transform" />
                <Card className="hover:border-primary/40 transition-colors">
                  <CardContent className="p-5">
                    <span className="inline-block px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
                      {milestone.year}
                    </span>
                    <h3 className="font-bold text-lg text-foreground">{milestone.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{milestone.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}

      <section className="relative py-20 lg:py-28" aria-labelledby="impact-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Impact in Numbers"
            subtitle="Real results from our community-driven approach to developer education."
            badge="2023-2024 Stats"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Students Reached', value: 5000, icon: Users },
              { label: 'Events Hosted', value: 120, icon: Lightbulb },
              { label: 'Projects Built', value: 200, icon: Globe },
              { label: 'Countries Connected', value: 15, icon: Heart },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all shadow-sm group"
              >
                <stat.icon className="w-9 h-9 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  <CountUp to={stat.value} suffix="+" duration={1400} />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Our Members Say / Testimonials (Commented Out) ── */}
      {/*
      <section className="relative py-20 lg:py-28 bg-muted/30" aria-labelledby="team-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What Our Members Say"
            subtitle="Real stories from students whose lives changed through GDGC."
            badge="Testimonials"
          />
          <div className="grid md:grid-cols-3 gap-6" role="list">
            {team.map((member, index) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50"
                role="listitem"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{member.quote}"</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      */}

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
              Ready to Be Part of Something Bigger?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Join a global movement of student developers. Your journey starts with a single step.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <ArrowFillButton
                to="/contact"
                btnText="Join Us Today"
                bgColor="#4285F4"
                textColor="#ffffff"
                fillBgColor="#ffffff"
                fillTextColor="#1a73e8"
              />
              <ArrowFillButton
                to="/team"
                btnText="Meet the Team"
                transparent={true}
                className="border-border hover:border-primary"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}