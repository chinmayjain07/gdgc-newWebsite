import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DotParticleCanvas } from '@/components/ui/DotParticleCanvas';
import { AIAssistant } from '@/components/ai/AIAssistant';

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <DotParticleCanvas />
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="min-h-[calc(100vh-200px)]"
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}