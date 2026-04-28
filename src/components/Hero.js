import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { settings, API_URL } = useAuth();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default slides fallback
  const defaultSlides = [
    {
      id: 1,
      title: 'We Build Digital Experiences',
      subtitle: 'Creative Solutions',
      description: 'We are a team of passionate developers crafting innovative web solutions for modern businesses.',
      button_text: 'View Portfolio',
      button_link: '#portfolio',
      image_url: null
    }
  ];

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${API_URL}/hero.php`);
        if (response.ok) {
          const data = await response.json();
          const activeSlides = data.filter(slide => slide.is_active !== false);
          setSlides(activeSlides.length > 0 ? activeSlides : defaultSlides);
        } else {
          setSlides(defaultSlides);
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [API_URL]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, slides.length]);

  const currentSlideData = slides[currentSlide] || defaultSlides[0];
  const [progress, setProgress] = useState(0);

  // Progress bar animation
  useEffect(() => {
    if (!isAutoPlaying) {
      setProgress(0);
      return;
    }
    setProgress(0);
    const duration = 5000;
    const interval = 50;
    const step = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + step;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [currentSlide, isAutoPlaying]);

  if (loading) {
    return (
      <section id="home" className="relative h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-blue-400 animate-pulse">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="relative h-screen overflow-hidden bg-[#0a1628]">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f172a] to-[#1e293b]" />
      
      {/* Main Background Image with Ken Burns Effect */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {slide.image_url ? (
              <img
                src={slide.image_url}
                alt={slide.title}
                className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${
                  index === currentSlide ? 'scale-110' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-blue-600/20" />
            )}
            {/* Enhanced Dark Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {slides.length > 1 && (
        <div className="absolute top-0 left-0 right-0 h-1 z-30 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Animated Particles/Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 transition-all duration-700 ${
            currentSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">{settings?.site_title || 'Project MUN'}</span>
          </div>

          {/* Subtitle with animation */}
          {currentSlideData.subtitle && (
            <p className="text-blue-400 text-lg md:text-2xl mb-4 font-medium tracking-wider uppercase animate-fade-in">
              {currentSlideData.subtitle}
            </p>
          )}
          
          {/* Title with enhanced typography */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              {currentSlideData.title}
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
            {currentSlideData.description}
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href={currentSlideData.button_link || '#portfolio'}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
            >
              {currentSlideData.button_text || 'Learn More'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Side Navigation Arrows */}
          <button
            onClick={() => {
              prevSlide();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => {
              nextSlide();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Thumbnail Carousel at Bottom */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-3xl p-4 border border-white/10">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    goToSlide(index);
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 10000);
                  }}
                  className={`relative rounded-xl overflow-hidden transition-all duration-500 ${
                    index === currentSlide
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black/50 scale-110'
                      : 'opacity-50 hover:opacity-80 hover:scale-105'
                  }`}
                  style={{ width: '70px', height: '90px' }}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {slide.image_url ? (
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800" />
                  )}
                  {/* Active indicator */}
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent" />
                  )}
                  {/* Label overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 py-1.5 px-2 backdrop-blur-sm">
                    <p className="text-white text-xs font-medium truncate">{index + 1}</p>
                  </div>
                </button>
              ))}
              
              {/* Play/Pause Button */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/10 ml-2"
                aria-label={isAutoPlaying ? 'Pause' : 'Play'}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Slide Counter */}
          <div className="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2 text-white/60 text-sm font-medium">
            <span className="text-white text-lg font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span>{String(slides.length).padStart(2, '0')}</span>
          </div>
        </>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <div className="flex flex-col items-center gap-2 text-white/50 animate-bounce">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
