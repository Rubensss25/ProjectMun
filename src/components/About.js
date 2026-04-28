import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Users, Target, Zap, Award, Linkedin, Github, Mail, X, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Animated counter with intersection observer
const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const increment = target / (duration / 16);
          let start = 0;
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const STATS = [
  { value: 15, suffix: '+', label: 'Projects Completed' },
  { value: 4, suffix: '', label: 'Team Members' },
  { value: 100, suffix: '%', label: 'Client Satisfaction' },
  { value: 2, suffix: '+', label: 'Years Experience' }
];

const VALUES = [
  {
    icon: Target,
    title: 'Precision',
    description: 'We focus on delivering exactly what our clients need with attention to every detail.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We embrace cutting-edge technologies to create modern, future-proof solutions.'
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'We never compromise on quality, ensuring robust and scalable applications.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with our clients, keeping communication transparent throughout.'
  }
];

const DEFAULT_TEAM = [
  { name: 'Ruben Albao', role: 'Frontend Developer', description: 'Expert in React, JavaScript, and modern frontend frameworks.', initials: 'RA', socials: { linkedin: '#', github: '#', email: 'mailto:ruben@projectmun.com' } },
  { name: 'Kristian Gomez', role: 'Frontend Developer', description: 'Specialized in React.js and modern JavaScript.', initials: 'KG', socials: { linkedin: '#', github: '#', email: 'mailto:kristian@projectmun.com' } },
  { name: 'Jonelle Mayari', role: 'Project Manager', description: 'Oversees project timelines and client communication.', initials: 'JM', socials: { linkedin: '#', github: '#', email: 'mailto:jonelle@projectmun.com' } },
  { name: 'Alvin Panganiban', role: 'Backend Developer', description: 'Expert in server-side development and APIs.', initials: 'AP', socials: { linkedin: '#', github: '#', email: 'mailto:alvin@projectmun.com' } }
];

// Reveal animation hook
const useRevealAnimation = (ref) => {
  useEffect(() => {
    const reveals = ref.current?.querySelectorAll('.reveal');
    if (!reveals?.length) return;

    // Immediately activate elements already in viewport
    const checkAndActivate = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
          entry.target.classList.add('active');
        }
      });
    };

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

    // Initial check + observe
    reveals.forEach((el) => {
      observer.observe(el);
      // Force activate if already visible
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('active');
      }
    });

    return () => observer.disconnect();
  }, [ref]);
};

// Member card component with 3D tilt effect
const MemberCard = ({ member, index, onClick }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
  };

  return (
    <div
      ref={cardRef}
      className="reveal group relative cursor-pointer active"
      style={{ 
        transitionDelay: `${index * 100}ms`, 
        opacity: 1,
        transform,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      onClick={() => onClick(member)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 overflow-hidden h-full flex flex-col border border-white/10 hover:border-blue-500/40 transition-all duration-500 shadow-xl hover:shadow-blue-500/20 hover:shadow-2xl">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/5 group-hover:to-blue-600/10 transition-all duration-700" />
        
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:via-purple-600/20 group-hover:to-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
        
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-5 transform group-hover:scale-110 transition-transform duration-500 overflow-hidden shadow-lg shadow-blue-500/30">
            {member.image_url ? (
              <img 
                src={member.image_url} 
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-white">{member.initials}</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
            {member.name}
          </h3>
          <p className="text-sm font-semibold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{member.role}</p>
          <p className="text-gray-400 text-sm leading-relaxed flex-grow">{member.description}</p>
          <div className="flex gap-3 mt-5 pt-4 border-t border-white/10">
            <a href={member.socials.linkedin} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href={member.socials.github} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300">
              <Github className="w-4 h-4" />
            </a>
            <a href={member.socials.email} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 transition-all duration-300">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Team member modal with enhanced design
const MemberModal = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 animate-scale-in">
        <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl p-8 border border-white/10 shadow-2xl shadow-blue-500/20 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative text-center">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 mx-auto overflow-hidden shadow-xl shadow-blue-500/30 ring-4 ring-white/5">
              {member.image_url ? (
                <img 
                  src={member.image_url} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">{member.initials}</span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
            <p className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold mb-4">{member.role}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{member.description}</p>
            <div className="flex justify-center gap-3">
              <a 
                href={member.socials.linkedin} 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-600/10 flex items-center justify-center text-blue-400 hover:from-blue-600 hover:to-blue-500 hover:text-white transition-all duration-300 border border-blue-500/20"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={member.socials.github} 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600/20 to-gray-600/10 flex items-center justify-center text-gray-400 hover:from-gray-700 hover:to-gray-600 hover:text-white transition-all duration-300 border border-gray-500/20"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={member.socials.email} 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600/20 to-red-600/10 flex items-center justify-center text-red-400 hover:from-red-600 hover:to-red-500 hover:text-white transition-all duration-300 border border-red-500/20"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Enhanced value card component with hover effects
const ValueCard = ({ value, index }) => {
  const Icon = value.icon;
  return (
    <div
      className="reveal group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden"
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Animated gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/5 group-hover:to-blue-600/10 transition-all duration-700" />
      
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all duration-500 ring-1 ring-white/10">
          <Icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
        </div>
        <h4 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{value.title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
      </div>
    </div>
  );
};

// Main About component
const About = () => {
  const sectionRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const { teamMembers } = useAuth();
  
  const teamList = useMemo(() => teamMembers || DEFAULT_TEAM, [teamMembers]);
  
  useRevealAnimation(sectionRef);

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-[#0a1628] relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-navy-900/50 to-transparent" />
      <div className="absolute -top-40 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20 reveal">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
            <Sparkles className="w-4 h-4" />
            Who We Are
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Meet the <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We are a passionate group of developers and designers dedicated to creating 
            exceptional digital experiences for businesses of all sizes.
          </p>
        </div>

        {/* Enhanced Stats with glassmorphism */}
        <div className="reveal mb-20">
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 rounded-3xl" />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {teamList.map((member, index) => (
            <MemberCard 
              key={member.name} 
              member={member} 
              index={index} 
              onClick={setSelectedMember} 
            />
          ))}
        </div>

        {/* Modal */}
        <MemberModal 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)} 
        />

        {/* Enhanced Values Section */}
        <div className="reveal">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-gray-400 text-sm mb-4 border border-white/10">
              What Drives Us
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Values</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
