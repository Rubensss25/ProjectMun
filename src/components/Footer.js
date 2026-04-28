import React from 'react';
import { Mail, Phone, MapPin, ArrowUp, Github, Linkedin, Facebook, Twitter, Heart, Sparkles, ExternalLink, ChevronRight } from 'lucide-react';
import munLogo from '../assets/images/MUN.png';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { settings, teamMembers, services } = useAuth();
  
  const servicesList = services || [
    { title: 'Web Development' },
    { title: 'UI/UX Design' },
    { title: 'System Development' },
    { title: 'E-Commerce' },
    { title: 'Maintenance' }
  ];
  
  const teamList = teamMembers || [
    { name: 'Ruben Albao', role: 'Project Lead' },
    { name: 'Kristian Gomez', role: 'Frontend Dev' },
    { name: 'Jonelle Mayari', role: 'UI/UX Designer' },
    { name: 'Alvin Panganiban', role: 'Full Stack Dev' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, href: settings?.site_github || '#', label: 'GitHub', color: 'hover:bg-gray-700' },
    { icon: Linkedin, href: settings?.site_linkedin || '#', label: 'LinkedIn', color: 'hover:bg-blue-600' },
    { icon: Facebook, href: settings?.site_facebook || '#', label: 'Facebook', color: 'hover:bg-blue-500' },
    { icon: Twitter, href: settings?.site_twitter || '#', label: 'Twitter', color: 'hover:bg-sky-500' }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="relative bg-[#0a1628] border-t border-white/5 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-blue-500/30 group-hover:ring-blue-500/50 transition-all">
                <img 
                  src={munLogo} 
                  alt="MUN Logo" 
                  className="w-12 h-12 object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  Project <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">MUN</span>
                </span>
                <p className="text-xs text-gray-500">Digital Excellence</p>
              </div>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A passionate web development team dedicated to creating innovative 
              digital solutions for modern businesses.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 border border-white/10 ${social.color} hover:text-white hover:border-transparent`}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            
            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <span className="text-sm">Back to top</span>
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all">
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Services
            </h4>
            <ul className="space-y-3">
              {servicesList.slice(0, 5).map((service) => (
                <li key={service.title}>
                  <span className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    {service.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href={`mailto:${settings?.site_email || 'projectmun.team@gmail.com'}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm">{settings?.site_email || 'projectmun.team@gmail.com'}</p>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href={`tel:${settings?.site_phone?.replace(/\D/g, '') || ''}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Phone className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm">{settings?.site_phone || '+63 (XXX) XXX-XXXX'}</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm">{settings?.site_location || 'Philippines'}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} Project MUN. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> by Project MUN Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
