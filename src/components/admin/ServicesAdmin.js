import React, { useState, useEffect } from 'react';
import { 
  Bell,
  Search,
  Menu,
  Plus,
  Edit3,
  Trash2,
  GripVertical,
  Save,
  X,
  Code,
  Palette,
  Database,
  Globe,
  Smartphone,
  Layout,
  Monitor,
  Cloud,
  Shield,
  Zap,
  Settings,
  Layers,
  Server,
  Cpu,
  Wifi,
  HardDrive,
  Terminal,
  Box,
  Grid,
  Component,
  FileCode,
  PenTool,
  Image,
  Video,
  Music,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Heart,
  Star,
  ThumbsUp,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Bell as BellIcon,
  Search as SearchIcon,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import Sidebar from '../Sidebar';
import { useAuth } from '../../context/AuthContext';

const iconMap = {
  Code, Palette, Database, Globe, Smartphone, Layout, Monitor, Cloud, Shield, Zap, Settings, Layers, Server, Cpu, Wifi, HardDrive, Terminal, Box, Grid, Component, FileCode, PenTool, Image, Video, Music, BarChart3, PieChart, LineChart, Activity, Heart, Star, ThumbsUp, MessageCircle, Mail, Phone, MapPin, Calendar, Clock, BellIcon, SearchIcon
};

const colorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' }
];

const ServicesAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { API_URL } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Code',
    color: 'blue',
    features: [],
    display_order: 0
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/services.php`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewService = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Code',
      color: 'blue',
      features: [],
      display_order: services.length
    });
    setShowModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      icon: service.icon || 'Code',
      color: service.color || 'blue',
      features: service.features || [],
      display_order: service.display_order || 0
    });
    setShowModal(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const response = await fetch(`${API_URL}/services.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: serviceId })
      });
      
      if (response.ok) {
        fetchServices();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please enter a title and description.');
      return;
    }
    
    try {
      const url = `${API_URL}/services.php`;
      const method = editingService ? 'PUT' : 'POST';
      const body = editingService 
        ? { ...formData, id: editingService.id }
        : formData;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchServices();
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to save service.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const filteredServices = services.filter(service => 
    (service.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || Code;
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-[#0a1628]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-white">Services Management</h2>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">RA</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading services...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button 
                  onClick={handleNewService}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service, index) => {
                  const IconComponent = getIconComponent(service.icon);
                  const colorClass = colorOptions.find(c => c.value === service.color)?.class || 'bg-blue-500';
                  
                  return (
                    <div 
                      key={service.id}
                      className="bg-[#0f172a] rounded-2xl border border-white/5 overflow-hidden hover:border-blue-500/20 transition-all"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditService(service)}
                              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{service.description}</p>

                        {service.features && service.features.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {service.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="px-2 py-1 rounded-md text-xs font-medium bg-white/10 text-white border border-white/20">
                                {feature}
                              </span>
                            ))}
                            {service.features.length > 3 && (
                              <span className="px-2 py-1 rounded-md text-xs font-medium text-gray-400">
                                +{service.features.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-xs text-gray-500">Order: {service.display_order}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} text-white`}>
                            {service.color}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No services found</h3>
                  <p className="text-gray-400">Create your first service to get started</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Service Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-[#0f172a] rounded-2xl w-full max-w-md mx-auto border border-white/10" style={{ maxWidth: '75vw', transform: 'scale(0.8)', transformOrigin: 'center' }}>
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">
                {editingService ? 'Edit Service' : 'New Service'}
              </h3>
            </div>
            <form onSubmit={handleSubmitService} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  >
                    {Object.keys(iconMap).map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Color</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  >
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Features</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesAdmin;
