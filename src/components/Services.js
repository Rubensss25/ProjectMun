import React, { useEffect, useRef, useState } from 'react';
import { Code, Palette, Database, Globe, Smartphone, Layout, ArrowUpRight, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const iconMap = {
  Code, Palette, Database, Globe, Smartphone, Layout
};

const TiltCard = ({ children, className }) => {
  const [transform, setTransform] = useState('');
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.3s ease' }}
    >
      {children}
    </div>
  );
};

const Services = () => {
  const sectionRef = useRef(null);
  const { services } = useAuth();
  
  const servicesList = services || [
    { title: 'Web Development', description: 'Custom web applications built with modern frameworks.', icon: 'Code', color: 'blue', features: ['React.js', 'Node.js', 'RESTful APIs'] },
    { title: 'UI/UX Design', description: 'User-centered design for intuitive digital experiences.', icon: 'Palette', color: 'purple', features: ['Wireframing', 'Prototyping'] },
    { title: 'System Development', description: 'Robust backend systems using PHP and MySQL.', icon: 'Database', color: 'green', features: ['PHP', 'MySQL'] },
    { title: 'E-Commerce Solutions', description: 'Complete online store development.', icon: 'Globe', color: 'orange', features: ['Payment Gateways'] },
    { title: 'Responsive Design', description: 'Mobile-first approach for all devices.', icon: 'Smartphone', color: 'pink', features: ['Mobile-First'] },
    { title: 'Website Maintenance', description: 'Ongoing support and updates.', icon: 'Layout', color: 'indigo', features: ['Security Updates'] }
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
      // Force activate if already visible
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('active');
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-24 bg-[#0a1628] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16" style={{ opacity: 1 }}>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
            <Sparkles className="w-4 h-4" />
            What We Do
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We offer comprehensive web solutions tailored to meet your business needs 
            and help you succeed in the digital landscape.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, index) => (
            <div
              key={service.title}
              className="group relative"
              style={{ transitionDelay: `${index * 100}ms`, opacity: 1 }}
            >
              <TiltCard className="h-full">
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 h-full flex flex-col overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-blue-500/10">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-blue-600/10 blur-xl opacity-100 transition-opacity duration-700 -z-10" />

                  {/* Number indicator */}
                  <div className="absolute top-4 right-4 text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors duration-500">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-5 transform group-hover:scale-110 transition-all duration-500 relative z-10 ring-1 ring-white/10 group-hover:ring-blue-500/30">
                    {React.createElement(iconMap[service.icon], { className: "w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors" })}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 relative z-10">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-5 leading-relaxed flex-grow text-sm relative z-10">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {service.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Arrow icon */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center opacity-100 transform translate-y-0 transition-all duration-300 shadow-lg shadow-blue-500/30">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>

        {/* Enhanced CTA */}
        <div className="text-center mt-16" style={{ opacity: 1 }}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Need a custom solution?</p>
                <p className="text-gray-400 text-sm">Let&apos;s discuss your project requirements</p>
              </div>
            </div>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl"
            >
              Get a Free Consultation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
