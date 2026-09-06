import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, MessageSquare, Send, CheckCircle, AlertCircle, Loader2, GitBranch, X, Link, Play, BotMessageSquare, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Textarea, Label } from '@/components/ui/Input';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AnimatedBackground } from '@/components/sections/AnimatedBackground';
import { useTheme } from '@/context/ThemeContext';

const contactInfo = [
  { icon: Mail, title: 'Email Us', value: 'hello@gdgcampus.dev', description: 'General inquiries, partnerships, and sponsorships', href: 'mailto:hello@gdgcampus.dev' },
  { icon: MapPin, title: 'Visit Us', value: 'University Campus, Building A, Room 101', description: 'Mon-Fri: 9:00 AM - 6:00 PM', href: '#' },
  { icon: Phone, title: 'Call Us', value: '+1 (555) 123-4567', description: 'Available during office hours', href: 'tel:+15551234567' },
  { icon: Clock, title: 'Office Hours', value: 'Mon-Fri: 9AM-6PM', description: 'Weekends: Event days only', href: '#' },
];

const socialLinks = [
  { icon: GitBranch, label: 'GitHub', href: '#', color: 'hover:text-gray-400 dark:hover:text-gray-500' },
  { icon: X, label: 'X (Twitter)', href: '#', color: 'hover:text-sky-400' },
  { icon: Link, label: 'LinkedIn', href: '#', color: 'hover:text-blue-400' },
  { icon: Play, label: 'YouTube', href: '#', color: 'hover:text-red-400' },
  { icon: BotMessageSquare, label: 'Discord', href: '#', color: 'hover:text-indigo-400' },
  { icon: Mail, label: 'Newsletter', href: '#', color: 'hover:text-green-400' },
];

const faqs = [
  {
    question: 'Who can join GDGC?',
    answer: 'Any student currently enrolled at our university can join! No prior coding experience required. We welcome all skill levels and backgrounds.'
  },
  {
    question: 'Is there a membership fee?',
    answer: "No! All GDGC events, workshops, and resources are completely free for students. We're funded by Google and our generous sponsors."
  },
  {
    question: 'How do I stay updated on events?',
    answer: 'Join our Discord community, follow us on social media, subscribe to our newsletter, or check the Events page regularly. We announce events 2-3 weeks in advance.'
  },
  {
    question: 'Can I speak at a GDGC event?',
    answer: 'Absolutely! We love having student speakers. If you have expertise in a technology or want to share a project, reach out via our contact form or Discord.'
  },
  {
    question: 'Do you offer certifications?',
    answer: 'Yes! Many of our study jams and workshops offer Google Cloud skill badges and completion certificates. Check individual event details for certification info.'
  },
  {
    question: 'How can my company partner with GDGC?',
    answer: 'We welcome industry partnerships for sponsorships, mentorship programs, hiring events, and tech talks. Contact us at partnerships@gdgcampus.dev for opportunities.'
  },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'loading', null
  const [expandedFaq, setExpandedFaq] = useState(null);
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you'd send to your backend here
    // const response = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
    
    setSubmitStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden" aria-labelledby="contact-hero-title">
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
              <MessageSquare className="w-4 h-4" />
              Get in Touch
            </motion.span>
            <motion.h1
              id="contact-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground"
            >
              Let's Start a Conversation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Have questions? Want to partner? Ready to join? We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-10 lg:py-16" aria-labelledby="contact-info-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((card, index) => (
              <motion.a
                key={card.title}
                href={card.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors group block"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                <p className="text-sm text-primary font-medium mb-1">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-10 lg:py-16" aria-labelledby="contact-form-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                title="Send Us a Message"
                subtitle="Fill out the form and we'll get back to you within 24 hours."
                align="left"
                badge="Contact Form"
              />
              
              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-3 mb-6"
                    role="alert"
                  >
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Message Sent Successfully!</p>
                      <p className="text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                  </motion.div>
                ) : submitStatus === 'error' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3 mb-6"
                    role="alert"
                  >
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Something Went Wrong</p>
                      <p className="text-sm">Please try again or email us directly.</p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="block mb-2">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={submitStatus === 'loading'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="block mb-2">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={submitStatus === 'loading'}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject" className="block mb-2">Subject *</Label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={submitStatus === 'loading'}
                    className="w-full h-12 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="membership">Join GDGC</option>
                    <option value="events">Event Question</option>
                    <option value="partnership">Partnership/Sponsorship</option>
                    <option value="speaking">Speak at Event</option>
                    <option value="media">Media/Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="message" className="block mb-2">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    disabled={submitStatus === 'loading'}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={submitStatus === 'loading'}>
                  {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>

            <div>
              <SectionHeader
                title="Other Ways to Connect"
                subtitle="Join our community on your favorite platform."
                align="left"
                badge="Stay Connected"
              />

              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground/70 hover:bg-accent/50 hover:text-foreground transition-colors ${social.color}`}
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                        {social.label}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why Contact Us?</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4" role="list">
                    {[
                      { icon: MessageSquare, title: 'General Questions', desc: 'Ask anything about GDGC, events, or membership.' },
                      { icon: GitBranch, title: 'Partnership Proposals', desc: 'Sponsorships, hiring partnerships, or tech collaborations.' },
                      { icon: Send, title: 'Speaker Applications', desc: 'Share your expertise with our community.' },
                      { icon: CheckCircle, title: 'Event Feedback', desc: 'Help us improve future events and workshops.' },
                      { icon: AlertCircle, title: 'Report an Issue', desc: 'Code of conduct violations, accessibility concerns, etc.' },
                      { icon: Mail, title: 'Media Inquiries', desc: 'Press coverage, interviews, or brand asset requests.' },
                    ].map((item, index) => (
                      <motion.li
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 bg-muted/30" aria-labelledby="faq-title">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Quick answers to common questions about GDGC."
            badge="FAQ"
          />
          <div className="space-y-3" role="list">
            {faqs.map((faq, index) => (
              <motion.article
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative"
                role="listitem"
              >
                <Card>
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-accent/50 transition-colors"
                      aria-expanded={expandedFaq === index}
                    >
                      <h3 className="font-semibold text-base pr-10">{faq.question}</h3>
                      <div className="flex-shrink-0 text-muted-foreground">
                        {expandedFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 border-t border-border/50">
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.article>
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
              Ready to Join the Community?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Become a member today and start your developer journey with 1000+ passionate students.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" asChild className="w-full sm:w-auto group">
                <a href="mailto:hello@gdgcampus.dev?subject=Join%20GDGC%20Membership">Become a Member</a>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#discord">Join Discord</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}