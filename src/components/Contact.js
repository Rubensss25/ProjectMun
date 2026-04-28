import React, { useState, useEffect, useRef } from 'react';
import { Mail, MapPin, Phone, Send, Linkedin, Github, Facebook, Twitter, CheckCircle, Sparkles, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const sectionRef = useRef(null);
  const { settings, API_URL } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/contact.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: settings.site_email || 'projectmun.team@gmail.com',
      href: `mailto:${settings.site_email || 'projectmun.team@gmail.com'}`
    },
    {
      icon: Phone,
      label: 'Phone',
      value: settings.site_phone || '+63 (XXX) XXX-XXXX',
      href: `tel:${settings.site_phone?.replace(/\D/g, '') || ''}`
    },
    {
      icon: MapPin,
      label: 'Location',
      value: settings.site_location || 'Philippines',
      href: '#'
    }
  ];

  const socialLinks = [
    { icon: Github, href: settings.site_github || '#', label: 'GitHub' },
    { icon: Linkedin, href: settings.site_linkedin || '#', label: 'LinkedIn' },
    { icon: Facebook, href: settings.site_facebook || '#', label: 'Facebook' },
    { icon: Twitter, href: settings.site_twitter || '#', label: 'Twitter' }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-24 bg-[#0a1628] relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
            <MessageSquare className="w-4 h-4" />
            Get in Touch
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Contact <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Us</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Have a project in mind? We&apos;d love to hear from you. 
            Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Contact Info */}
          <div className="reveal space-y-8">
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Let&apos;s Talk</h3>
                    <p className="text-gray-400 text-sm">We&apos;re here to help</p>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Whether you need a website, web application, or system solution, 
                  our team is ready to help bring your vision to life.
                </p>

                <div className="space-y-5">
                  {contactInfo.map((info) => (
                    <a
                      key={info.label}
                      href={info.href}
                      className="flex items-center gap-4 group p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all ring-1 ring-white/10">
                        <info.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{info.label}</p>
                        <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                          {info.value}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>

                {/* Enhanced Social Links */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-4">Follow us on social media</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 transition-all duration-300 border border-white/10 hover:border-transparent"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response Badge */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Quick Response</p>
                <p className="text-gray-400 text-sm">We typically reply within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <div className="reveal active" style={{ transitionDelay: '100ms', opacity: 1 }}>
            <form onSubmit={handleSubmit} className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent" />
              
              <div className="relative">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-400">We&apos;ll get back to you soon.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="group">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="mb-6 group">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Project Inquiry"
                      />
                    </div>

                    <div className="mb-6 group">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                        placeholder="Tell us about your project..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 group"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </div>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    {error && (
                      <p className="text-red-400 text-sm text-center mt-3">{error}</p>
                    )}
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
