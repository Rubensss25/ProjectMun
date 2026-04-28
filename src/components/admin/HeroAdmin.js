import React, { useState, useEffect } from 'react';
import { 
  Bell,
  Menu,
  Plus,
  Edit3,
  Trash2,
  X,
  Upload,
  Image,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import Sidebar from '../Sidebar';
import { useAuth } from '../../context/AuthContext';

const HeroAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { API_URL } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_text: 'Learn More',
    button_link: '#portfolio',
    image: null,
    image_url: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch(`${API_URL}/hero.php`);
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (err) {
      console.error('Error fetching slides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleNewSlide = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      button_text: 'Learn More',
      button_link: '#portfolio',
      image: null,
      image_url: '',
      display_order: slides.length,
      is_active: true
    });
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEditSlide = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
      button_text: item.button_text || 'Learn More',
      button_link: item.button_link || '#portfolio',
      image: null,
      image_url: item.image_url || '',
      display_order: item.display_order || 0,
      is_active: item.is_active ?? true
    });
    setImagePreview(item.image_url || null);
    setShowModal(true);
  };

  const handleDeleteSlide = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      await fetch(`${API_URL}/hero.php?id=${id}`, {
        method: 'DELETE'
      });
      fetchSlides();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      alert('Please enter a title.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('button_text', formData.button_text);
      formDataToSend.append('button_link', formData.button_link);
      formDataToSend.append('display_order', formData.display_order);
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      if (editingItem) {
        formDataToSend.append('id', editingItem.id);
        formDataToSend.append('_method', 'PUT');
      }
      
      const response = await fetch(`${API_URL}/hero.php`, {
        method: 'POST',
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (response.ok && !result.error) {
        setShowModal(false);
        setImagePreview(null);
        fetchSlides();
      } else {
        alert(result.error || 'Failed to save slide. Please try again.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const moveSlide = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;
    
    const newSlides = [...slides];
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    
    // Update display order
    try {
      await Promise.all(newSlides.map((slide, i) => 
        fetch(`${API_URL}/hero.php`, {
          method: 'POST',
          body: new URLSearchParams({
            id: slide.id,
            _method: 'PUT',
            title: slide.title,
            subtitle: slide.subtitle || '',
            description: slide.description || '',
            button_text: slide.button_text || '',
            button_link: slide.button_link || '',
            display_order: i,
            is_active: slide.is_active ? '1' : '0'
          })
        })
      ));
      fetchSlides();
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#0a1628]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-white">Hero Slider Management</h2>
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

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading slides...</p>
            </div>
          ) : (
            <>
              {/* Actions Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-gray-400 text-sm">
                  {slides.length} slide{slides.length !== 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleNewSlide}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Slide
                  </button>
                </div>
              </div>

              {/* Slides Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((slide, index) => (
                  <div 
                    key={slide.id}
                    className={`bg-[#0f172a] rounded-2xl border overflow-hidden transition-all ${slide.is_active ? 'border-white/10' : 'border-red-500/30 opacity-60'}`}
                  >
                    {/* Image */}
                    <div className="relative h-40 bg-gray-800">
                      {slide.image_url ? (
                        <img 
                          src={slide.image_url} 
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Image className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {!slide.is_active && (
                          <span className="px-2 py-1 bg-red-500/80 text-white text-xs rounded">
                            Inactive
                          </span>
                        )}
                        <span className="px-2 py-1 bg-black/50 text-white text-xs rounded">
                          #{slide.display_order + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-1 truncate">{slide.title}</h3>
                      {slide.subtitle && (
                        <p className="text-blue-400 text-sm mb-2">{slide.subtitle}</p>
                      )}
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{slide.description}</p>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveSlide(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveSlide(index, 'down')}
                            disabled={index === slides.length - 1}
                            className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSlide(slide)}
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {slides.length === 0 && (
                <div className="text-center py-12">
                  <Image className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No slides yet</h3>
                  <p className="text-gray-400 mb-4">Create your first hero slide to get started</p>
                  <button
                    onClick={handleNewSlide}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Slide
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <div className="bg-[#0f172a] rounded-2xl w-full max-w-lg mx-auto border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {editingItem ? 'Edit' : 'Add'} Slide
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Background Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview"
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Image</span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFormChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Main headline"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Secondary headline"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 resize-none"
                    rows="3"
                    placeholder="Slide description"
                  />
                </div>

                {/* Button Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Button Text</label>
                    <input
                      type="text"
                      name="button_text"
                      value={formData.button_text}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                      placeholder="Learn More"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Button Link</label>
                    <input
                      type="text"
                      name="button_link"
                      value={formData.button_link}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                      placeholder="#portfolio"
                    />
                  </div>
                </div>

                {/* Display Order & Active */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Display Order</label>
                    <input
                      type="number"
                      name="display_order"
                      value={formData.display_order}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleFormChange}
                        className="w-4 h-4 rounded border-gray-600"
                      />
                      <span className="text-gray-300 text-sm">Active</span>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setImagePreview(null);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {editingItem ? 'Update Slide' : 'Add Slide'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setShowPreview(false)}
          >
            <div className="relative w-full max-w-4xl bg-[#0f172a] rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                <p className="text-gray-400">Preview will show here when Hero slider is implemented</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HeroAdmin;
