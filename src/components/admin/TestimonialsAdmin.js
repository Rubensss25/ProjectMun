import React, { useState, useEffect } from 'react';
import { 
  Bell,
  Search,
  Menu,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Star,
  Quote,
  User,
  Briefcase,
  Image as ImageIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  MessageCircle
} from 'lucide-react';
import Sidebar from '../Sidebar';
import { useAuth } from '../../context/AuthContext';

const TestimonialsAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { API_URL } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    image_url: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/testimonials.php`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTestimonial = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      content: '',
      rating: 5,
      image_url: '',
      is_active: true,
      display_order: testimonials.length
    });
    setShowModal(true);
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name || '',
      role: testimonial.role || '',
      content: testimonial.content || '',
      rating: parseInt(testimonial.rating) || 5,
      image_url: testimonial.image_url || '',
      is_active: testimonial.is_active !== false,
      display_order: testimonial.display_order || 0
    });
    setShowModal(true);
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const response = await fetch(`${API_URL}/testimonials.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: testimonialId })
      });
      
      if (response.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.content.trim()) {
      alert('Please enter a name and testimonial content.');
      return;
    }
    
    try {
      const url = `${API_URL}/testimonials.php`;
      const method = editingTestimonial ? 'PUT' : 'POST';
      const body = editingTestimonial 
        ? { ...formData, id: editingTestimonial.id }
        : formData;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchTestimonials();
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to save testimonial.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleToggleActive = async (testimonial) => {
    try {
      const response = await fetch(`${API_URL}/testimonials.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: testimonial.id,
          is_active: !testimonial.is_active
        })
      });
      
      if (response.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => 
    (testimonial.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (testimonial.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (testimonial.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
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
              <h2 className="text-xl font-semibold text-white">Testimonials Management</h2>
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
              <p className="text-gray-400">Loading testimonials...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search testimonials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button 
                  onClick={handleNewTestimonial}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Testimonial</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total', value: testimonials.length, color: 'blue' },
                  { label: 'Active', value: testimonials.filter(t => t.is_active).length, color: 'green' },
                  { label: 'Inactive', value: testimonials.filter(t => !t.is_active).length, color: 'red' },
                  { label: 'Avg Rating', value: testimonials.length > 0 ? (testimonials.reduce((acc, t) => acc + parseInt(t.rating), 0) / testimonials.length).toFixed(1) : '0.0', color: 'yellow' }
                ].map((stat, index) => (
                  <div key={index} className="bg-[#0f172a] rounded-xl p-4 border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${
                      stat.color === 'blue' ? 'text-blue-400' :
                      stat.color === 'green' ? 'text-green-400' :
                      stat.color === 'red' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTestimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id}
                    className={`bg-[#0f172a] rounded-2xl border overflow-hidden transition-all ${
                      testimonial.is_active ? 'border-white/5 hover:border-blue-500/20' : 'border-red-500/20 opacity-60'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {testimonial.image_url ? (
                              <img src={testimonial.image_url} alt={testimonial.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              testimonial.name?.charAt(0).toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{testimonial.name}</h3>
                            <p className="text-sm text-gray-400">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleToggleActive(testimonial)}
                            className={`p-2 rounded-lg transition-colors ${
                              testimonial.is_active 
                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            }`}
                            title={testimonial.is_active ? 'Active' : 'Inactive'}
                          >
                            {testimonial.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => handleEditTestimonial(testimonial)}
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-1 mb-3">
                        {renderStars(parseInt(testimonial.rating))}
                      </div>

                      <div className="relative">
                        <Quote className="absolute -top-1 -left-2 w-6 h-6 text-blue-500/30" />
                        <p className="text-gray-300 text-sm leading-relaxed pl-4">
                          {testimonial.content}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                        <span>Order: {testimonial.display_order}</span>
                        <span>ID: {testimonial.id}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTestimonials.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No testimonials found</h3>
                  <p className="text-gray-400">Add your first testimonial to get started</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Testimonial Modal */}
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
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
            </div>
            <form onSubmit={handleSubmitTestimonial} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Role / Company</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                    placeholder="CEO, Company Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Testimonial Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={4}
                  placeholder="Write the testimonial content here..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Rating</label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className="p-1 transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formData.rating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-white font-medium">{formData.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Profile Image URL (Optional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm text-gray-400 mb-2">Status</label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
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
                  {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsAdmin;
