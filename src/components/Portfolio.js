import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Eye, ArrowUpRight, Sparkles, Play, Pause, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const defaultProjects = [
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'A full-featured online store with secure payment processing, inventory management, and real-time order tracking.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    tech: ['React.js', 'Node.js', 'MySQL', 'Stripe'],
    demoLink: '#',
    codeLink: '#',
    featured: true
  },
  {
    title: 'Learning Management System',
    category: 'System Development',
    description: 'Comprehensive LMS for educational institutions with course management, student tracking, and assessment tools.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
    tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
    demoLink: '#',
    codeLink: '#',
    featured: false
  },
  {
    title: 'Corporate Dashboard',
    category: 'UI/UX Design',
    description: 'Modern analytics dashboard with data visualization, real-time metrics, and customizable widgets.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    tech: ['React.js', 'Tailwind CSS', 'Chart.js', 'REST API'],
    demoLink: '#',
    codeLink: '#',
    featured: true
  },
  {
    title: 'Restaurant Booking App',
    category: 'Web Development',
    description: 'Online reservation system with table management, menu display, and customer notifications.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    tech: ['React.js', 'PHP', 'MySQL', 'Twilio'],
    demoLink: '#',
    codeLink: '#',
    featured: false
  },
  {
    title: 'Portfolio Generator',
    category: 'Web Development',
    description: 'Dynamic portfolio builder allowing users to create and customize their professional portfolios.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    tech: ['React.js', 'Firebase', 'Tailwind CSS'],
    demoLink: '#',
    codeLink: '#',
    featured: false
  },
  {
    title: 'Healthcare Portal',
    category: 'System Development',
    description: 'Patient management system with appointment scheduling, medical records, and prescription tracking.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    tech: ['PHP', 'MySQL', 'JavaScript', 'HTML5'],
    demoLink: '#',
    codeLink: '#',
    featured: true
  }
];

const categories = ['All', 'Web Development', 'System Development', 'UI/UX Design'];

const Portfolio = () => {
  const sectionRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [currentProjectTitle, setCurrentProjectTitle] = useState('');
  const { projects } = useAuth();
  
  const projectsList = projects && projects.length > 0 ? projects.map(project => ({
    id: project.id,
    title: project.title || 'Untitled Project',
    description: project.description || 'No description available',
    category: project.category || 'Web Development',
    image: project.image || project.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    tech: project.tech ? (Array.isArray(project.tech) ? project.tech : String(project.tech).split(',').filter(t => t.trim())) : ['React.js', 'Node.js'],
    demoLink: project.demoLink || project.project_url || '#',
    codeLink: project.codeLink || '#',
    featured: project.featured || false,
    video_url: project.video_url,
    video_two_url: project.video_two_url,
    // Database fields for debugging
    image_filename: project.image_filename,
    video_filename: project.video_filename,
    video_two_filename: project.video_two_filename,
    project_url: project.project_url
  })) : defaultProjects;

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

  const handleViewVideo = (project) => {
    if (project.video_url) {
      setCurrentVideo(project.video_url);
      setCurrentProjectTitle(project.title);
      setShowVideoModal(true);
    } else if (project.video_two_url) {
      setCurrentVideo(project.video_two_url);
      setCurrentProjectTitle(project.title);
      setShowVideoModal(true);
    } else {
      // Fallback to demo link if no video
      window.open(project.demoLink, '_blank');
    }
  };

  const filteredProjects = activeFilter === 'All' 
    ? projectsList
    : projectsList.filter(p => p.category === activeFilter);

  return (
    <section id="portfolio" ref={sectionRef} className="py-24 bg-[#0a1628] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Enhanced Section Header */}
        <div className="text-center mb-12 reveal">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
            <Sparkles className="w-4 h-4" />
            Our Work
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Featured <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore our portfolio of successful projects that showcase our expertise 
            and commitment to delivering exceptional results.
          </p>
        </div>

        {/* Enhanced Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 reveal">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span className="relative z-10">{category}</span>
              {activeFilter === category && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity" />
              )}
            </button>
          ))}
        </div>

        {/* Featured Projects (when showing All) */}
        {activeFilter === 'All' && (
          <div className="mb-12 reveal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(filteredProjects.filter(p => p.featured)).slice(0, 2).map((project, index) => (
                <div
                  key={project.title}
                  className="group relative"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl overflow-hidden h-full border border-white/10 hover:border-blue-500/30 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:via-purple-600/20 group-hover:to-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                    
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
                      
                      {/* Featured Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/30">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Links */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <button
                          onClick={() => handleViewVideo(project)}
                          className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-blue-500 transition-all duration-300 hover:scale-110 border border-white/20"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a href={project.codeLink} className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-gray-700 transition-all duration-300 hover:scale-110 border border-white/20">
                          <Github className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Bottom content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 to-transparent">
                        <span className="inline-block px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-medium mb-2">{project.category}</span>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {(project.tech || []).slice(0, 3).map((tech) => (
                            <span key={tech} className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors">
                              {tech}
                            </span>
                          ))}
                          {(project.tech || []).length > 3 && (
                            <span className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-400 bg-white/5">
                              +{(project.tech || []).length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-blue-500/30">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div key={activeFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredProjects).map((project, index) => (
            <div
              key={project.id || project.title}
              className="reveal active group"
              style={{ transitionDelay: `${index * 100}ms`, opacity: 1 }}
            >
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl overflow-hidden h-full flex flex-col border border-white/10 hover:border-blue-500/30 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-blue-500/10">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-blue-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />

                  {/* Hover Links */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleViewVideo(project)}
                      className="w-12 h-12 rounded-full bg-blue-500/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <a
                      href={project.codeLink}
                      className="w-12 h-12 rounded-full bg-gray-700/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col relative">
                  <span className="inline-block w-fit px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-medium mb-2">{project.category}</span>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {(project.tech || []).slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.tech || []).length > 3 && (
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-500 bg-white/5">
                        +{(project.tech || []).length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced View More CTA */}
        <div className="text-center mt-16 reveal">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10">
            <p className="text-gray-400">Want to see more projects?</p>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl"
            >
              Let&apos;s collaborate
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Video Modal */}
      {showVideoModal && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowVideoModal(false);
              setCurrentVideo('');
              setCurrentProjectTitle('');
            }
          }}
        >
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => {
                setShowVideoModal(false);
                setCurrentVideo('');
                setCurrentProjectTitle('');
              }}
              className="absolute -top-14 right-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
              <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{currentProjectTitle}</h3>
              </div>
              
              <div className="p-6">
                <video
                  src={currentVideo}
                  controls
                  autoPlay
                  className="w-full rounded-2xl"
                  style={{ maxHeight: '70vh' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
