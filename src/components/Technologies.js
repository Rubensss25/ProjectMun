import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Cpu, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Technologies = () => {
  const sectionRef = useRef(null);
  const { skills, loading } = useAuth();

  const defaultSkills = [
    { name: 'React.js', category: 'Frontend', color: '#61DAFB' },
    { name: 'JavaScript', category: 'Language', color: '#F7DF1E' },
    { name: 'PHP', category: 'Backend', color: '#777BB4' },
    { name: 'MySQL', category: 'Database', color: '#4479A1' },
    { name: 'Node.js', category: 'Backend', color: '#339933' },
    { name: 'Git', category: 'Tools', color: '#F05032' },
    { name: 'Python', category: 'Backend', color: '#3776AB' },
    { name: 'Laravel', category: 'Backend', color: '#FF2D20' },
    { name: 'Tailwind CSS', category: 'Styling', color: '#38BDF8' },
    { name: 'C++', category: 'Language', color: '#00599C' },
    { name: 'Java', category: 'Language', color: '#F8981D' },
    { name: 'Electron.js', category: 'Framework', color: '#47848F' }
  ];

  useEffect(() => {
    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    if (!reveals?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px 0px 50px 0px' }
    );

    reveals.forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('active');
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="technologies" ref={sectionRef} className="py-24 bg-[#0a1628] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
            <Cpu className="w-4 h-4" />
            Tech Stack
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Technologies <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">We Use</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We leverage modern technologies and tools to build scalable, 
            efficient, and maintainable web solutions.
          </p>
        </div>

        {/* Enhanced Tech Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-16">
          {(skills.length > 0 ? skills : defaultSkills).map((tech, index) => (
            <div
              key={tech.name}
              className="reveal group active"
              style={{ transitionDelay: `${index * 50}ms`, opacity: 1 }}
            >
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-5 text-center border border-white/10 hover:border-blue-500/30 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-blue-500/10 overflow-hidden">
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${tech.color}40, transparent 70%)` }}
                />
                
                {/* Animated border on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/50 group-hover:via-purple-500/50 group-hover:to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                
                <div className="relative z-10">
                  <div 
                    className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${tech.color}20, ${tech.color}10)`,
                      boxShadow: `0 8px 32px ${tech.color}20`
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="w-8 h-8" fill={tech.color}>
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">{tech.name}</h3>
                  <p className="text-xs text-gray-400">{tech.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10 hover:border-blue-500/30 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/5 group-hover:to-blue-600/10 transition-all duration-700" />
            <div className="relative">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center ring-1 ring-white/10">
                <Sparkles className="w-7 h-7 text-blue-400" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Modern</div>
              <p className="text-gray-400 text-sm">Latest frameworks and libraries</p>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10 hover:border-blue-500/30 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/5 group-hover:to-blue-600/10 transition-all duration-700" />
            <div className="relative">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center ring-1 ring-white/10">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Scalable</div>
              <p className="text-gray-400 text-sm">Built for growth and performance</p>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10 hover:border-blue-500/30 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/5 group-hover:to-blue-600/10 transition-all duration-700" />
            <div className="relative">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center ring-1 ring-white/10">
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Secure</div>
              <p className="text-gray-400 text-sm">Best practices in security</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;
