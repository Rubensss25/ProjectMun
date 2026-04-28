import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import munLogo from '../assets/images/MUN.png';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ scrolled, mobileMenuOpen, setMobileMenuOpen }) => {
  const { settings } = useAuth();
  const siteTitle = settings.site_title || 'Project MUN';
  const [activeLink, setActiveLink] = useState('home');

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Portfolio', href: '#portfolio', id: 'portfolio' },
    { name: 'Testimonials', href: '#testimonials', id: 'testimonials' },
    { name: 'Tech', href: '#technologies', id: 'technologies' },
    { name: 'Contact', href: '#contact', id: 'contact' }
  ];

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => document.querySelector(link.href));
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveLink(navLinks[index].id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0a1628]/80 backdrop-blur-xl py-3 shadow-lg shadow-black/20 border-b border-white/5' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 overflow-hidden ring-2 ring-blue-500/30 group-hover:ring-blue-500/50">
              <img 
                src={munLogo} 
                alt="MUN Logo" 
                className="w-11 h-11 object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white tracking-tight">
                {siteTitle.split(' ')[0]} <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{siteTitle.split(' ').slice(1).join(' ') || 'MUN'}</span>
              </span>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Digital Solutions</p>
            </div>
          </a>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                  activeLink === link.id
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {activeLink === link.id && (
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg" />
                )}
              </a>
            ))}

            <div className="w-px h-6 bg-white/10 mx-2" />

            {/* Login Link */}
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
            >
              Login
            </Link>

            {/* Enhanced Contact Button */}
            <a href="#contact" className="ml-2">
              <button className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center gap-1.5">
                  Contact Us
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </a>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4 relative z-50">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-all duration-300 relative z-50 ${
                mobileMenuOpen 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {/* Backdrop blur overlay */}
          <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-500 ease-out ${
              mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu content */}
          <div className={`fixed top-20 left-4 right-4 z-50 transition-all duration-500 ease-out ${
            mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <div className="rounded-3xl p-5 bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-blue-500/10">
              {/* Menu Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Menu</p>
                  <p className="text-gray-500 text-xs">Navigate to sections</p>
                </div>
              </div>

              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 mb-1 ${
                    activeLink === link.id
                      ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms' }}
                >
                  {link.name}
                  {activeLink === link.id && <ArrowRight className="w-4 h-4 text-blue-400" />}
                </a>
              ))}
              
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center py-3 px-4 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 mt-2"
              >
                Login
              </Link>

              <div className="pt-4 border-t border-white/10 mt-4">
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center gap-2 group">
                    Contact Us
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
