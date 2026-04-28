import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Technologies from './components/Technologies';
import Contact from './components/Contact';
import Login from './components/Login';
import Dashboard from './components/admin/Dashboard';
import Projects from './components/admin/Projects';
import Settings from './components/admin/Settings';
import ServicesAdmin from './components/admin/ServicesAdmin';
import TestimonialsAdmin from './components/admin/TestimonialsAdmin';
import TechnologiesAdmin from './components/admin/TechnologiesAdmin';
import AboutAdmin from './components/admin/AboutAdmin';
import HeroAdmin from './components/admin/HeroAdmin';
import Footer from './components/Footer';

// Scroll Progress Component
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Back to Top Button
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

// Landing Page Component
const LandingPage = ({ darkMode, setDarkMode, scrolled, mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <ScrollProgress />

      <main className={`transition-all duration-300 ${mobileMenuOpen ? 'blur-sm pointer-events-none' : ''}`}>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Testimonials />
        <Technologies />
        <Contact />
      </main>
      <div className={`transition-all duration-300 ${mobileMenuOpen ? 'blur-sm pointer-events-none' : ''}`}>
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
              scrolled={scrolled}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
                <Route path="/settings" element={<Settings />} />
        <Route path="/admin/services" element={<ServicesAdmin />} />
        <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
        <Route path="/admin/technologies" element={<TechnologiesAdmin />} />
        <Route path="/admin/about" element={<AboutAdmin />} />
        <Route path="/admin/hero" element={<HeroAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
