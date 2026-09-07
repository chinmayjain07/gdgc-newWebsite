import { motion } from "framer-motion";
import { Sparkles, Target, Users, Globe, ArrowRight } from "lucide-react";
import { ArrowFillButton } from "@/components/ui/ArrowFillButton";
import { InteractiveLogo } from "@/components/ui/InteractiveLogo";

const highlights = [
  { icon: Target, title: "Hands-on First", text: "Practical skills over theory" },
  { icon: Users, title: "1250+ Community", text: "Student developers & mentors" },
  { icon: Globe, title: "Google Ecosystem", text: "Direct tech & Solution Challenges" },
];

export function AboutPreview() {
  return (
    <section
      id="about-preview"
      className="relative py-16 lg:py-24 overflow-hidden"
      aria-labelledby="about-preview-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-primary/5 p-8 sm:p-12 lg:p-16 shadow-xl shadow-black/5 overflow-hidden"
        >
          {/* Subtle Google brand color ambient orbs */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#4285F4]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#34A853]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#FBBC04]/5 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                About GDGC PCCOE
              </div>

              {/* Title */}
              <h2
                id="about-preview-title"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]"
              >
                Who We Are: Building the Next Generation of Engineers
                <InteractiveLogo size="sm" className="inline-flex ml-2.5 align-middle" />
              </h2>

              {/* Overview Copy condensed from About page */}
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
                We are a passionate community of student developers backed by Google, dedicated to bridging the gap between theory and industry practice through hands-on learning, mentorship, and real-world projects. From campus tech bootcamps to global hackathons, we provide the platform, resources, and network to help every student grow into an industry-ready engineer.
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <ArrowFillButton
                  to="/about"
                  btnText="Learn More About Us"
                  size="md"
                />
              </div>
            </div>

            {/* Right Highlights Cards Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {highlights.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + idx * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-background/60 border border-border/60 backdrop-blur-xs shadow-xs hover:border-primary/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutPreview;
