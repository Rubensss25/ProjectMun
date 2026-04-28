import React, { useEffect, useRef, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, MessageSquare, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Testimonials = () => {
  const sectionRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { testimonials } = useAuth();

  const testimonialsList = testimonials && testimonials.length > 0 ? testimonials : [
    {
      name: 'Maria Santos',
      role: 'CEO, TechStart Philippines',
      content: 'Project MUN delivered an exceptional e-commerce platform that exceeded our expectations.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      name: 'John Reyes',
      role: 'Marketing Director, InnovateCorp',
      content: 'Working with the Project MUN team was a game-changer for our business.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      name: 'Sarah Chen',
      role: 'Founder, EduLearn Platform',
      content: 'The learning management system they built is incredible.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
      name: 'David Lim',
      role: 'Operations Manager, FoodHub PH',
      content: 'Our restaurant booking system has streamlined operations.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    }
  ];

  // Safely get current testimonial with fallback
  const currentTestimonial = testimonialsList[currentIndex] || testimonialsList[0] || {};

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

  useEffect(() => {
    if (!isAutoPlaying || testimonialsList.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => testimonialsList.length > 0 ? (prev + 1) % testimonialsList.length : 0);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, testimonialsList.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => testimonialsList.length > 0 ? (prev + 1) % testimonialsList.length : 0);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => testimonialsList.length > 0 ? (prev - 1 + testimonialsList.length) % testimonialsList.length : 0);
  };

  return (
    <section id="testimonials" ref={sectionRef} className="py-24 bg-[#0a1628] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 text-[400px] font-serif text-white/[0.02] leading-none select-none">"</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
            <MessageSquare className="w-4 h-4" />
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            What Our <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Clients Say</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We take pride in delivering exceptional results that our clients love.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="reveal max-w-4xl mx-auto">
          <div className="relative">
            {/* Enhanced Main Card */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 overflow-hidden border border-white/10 shadow-2xl">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 blur-2xl opacity-50 -z-10" />
              
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center ring-1 ring-white/10">
                <Quote className="w-8 h-8 text-blue-400" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
                  <span className="text-blue-400 text-3xl">"</span>
                  {currentTestimonial.content || ''}
                  <span className="text-blue-400 text-3xl">"</span>
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-500/30 ring-offset-2 ring-offset-[#0a1628]">
                    <img 
                      src={currentTestimonial.image_url || currentTestimonial.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'} 
                      alt={currentTestimonial.name || 'Client'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {currentTestimonial.name || 'Anonymous Client'}
                    </h4>
                    <p className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">{currentTestimonial.role || ''}</p>
                  </div>
                  <Heart className="w-5 h-5 text-red-500 fill-red-500 ml-auto opacity-50" />
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / testimonialsList.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Enhanced Navigation */}
            <div className="flex items-center justify-between mt-8">
              {/* Dots */}
              <div className="flex gap-2">
                {testimonialsList.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(index);
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-10 shadow-lg shadow-blue-500/30' 
                        : 'bg-white/20 hover:bg-white/40 w-2.5'
                    }`}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="flex gap-3">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 group"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Client Logos */}
        <div className="mt-20 reveal">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <p className="text-gray-400 text-sm">Trusted by innovative companies</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['TechStart', 'InnovateCorp', 'EduLearn', 'FoodHub', 'DigitalPH'].map((company, index) => (
              <div 
                key={company} 
                className="text-xl font-bold text-white/30 hover:text-white/70 transition-all duration-300 cursor-default hover:scale-110"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
