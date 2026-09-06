import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { Layout } from '@/components/layout/Layout';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Events } from '@/pages/Events';
import { UpcomingEvents } from '@/pages/UpcomingEvents';
import { PastEvents } from '@/pages/PastEvents';
import { Team } from '@/pages/Team';
import { Domains } from '@/pages/Domains';
import { Achievements } from '@/pages/Achievements';
import { Resources } from '@/pages/Resources';
import { Contact } from '@/pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider>
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="events" element={<Events />} />
            <Route path="events/upcoming" element={<UpcomingEvents />} />
            <Route path="events/past" element={<PastEvents />} />
            <Route path="team" element={<Team />} />
            <Route path="domains" element={<Domains />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="resources" element={<Resources />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;