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
  Cpu,
  Palette,
  Code,
  Database,
  Globe,
  Layout,
  GitBranch,
  Terminal,
  Layers,
  Zap,
  Box,
  Monitor,
  Smartphone,
  Server,
  HardDrive,
  Wifi,
  Eye,
  EyeOff,
  Sliders
} from 'lucide-react';
import Sidebar from '../Sidebar';
import { useAuth } from '../../context/AuthContext';

const iconMap = {
  Code, Database, Globe, Layout, Terminal, GitBranch, Layers, Zap, Box, 
  Monitor, Smartphone, Server, HardDrive, Wifi, Cpu, Palette
};

const categoryOptions = [
  'Frontend', 'Backend', 'Database', 'Language', 'Tools', 'Styling', 'Framework', 'Mobile'
];

const colorPresets = [
  { value: '#61DAFB', label: 'React Blue' },
  { value: '#F7DF1E', label: 'JavaScript Yellow' },
  { value: '#777BB4', label: 'PHP Purple' },
  { value: '#4479A1', label: 'MySQL Blue' },
  { value: '#339933', label: 'Node Green' },
  { value: '#F05032', label: 'Git Orange' },
  { value: '#3776AB', label: 'Python Blue' },
  { value: '#FF2D20', label: 'Laravel Red' },
  { value: '#38BDF8', label: 'Tailwind Cyan' },
  { value: '#00599C', label: 'C++ Blue' },
  { value: '#F8981D', label: 'Java Orange' },
  { value: '#47848F', label: 'Electron Teal' },
  { value: '#3B82F6', label: 'Default Blue' },
  { value: '#10B981', label: 'Green' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' }
];

const TechnologiesAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { API_URL } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    color: '#3B82F6',
    proficiency: 80,
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/skills.php`);
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSkill = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Frontend',
      color: '#3B82F6',
      proficiency: 80,
      is_active: true,
      display_order: skills.length
    });
    setShowModal(true);
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'Frontend',
      color: skill.color || '#3B82F6',
      proficiency: parseInt(skill.proficiency) || 80,
      is_active: skill.is_active !== false,
      display_order: skill.display_order || 0
    });
    setShowModal(true);
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      const response = await fetch(`${API_URL}/skills.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: skillId })
      });
      
      if (response.ok) {
        fetchSkills();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSubmitSkill = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a skill name.');
      return;
    }
    
    try {
      const url = `${API_URL}/skills.php`;
      const method = editingSkill ? 'PUT' : 'POST';
      const body = editingSkill 
        ? { ...formData, id: editingSkill.id }
        : formData;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchSkills();
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to save skill.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleToggleActive = async (skill) => {
    try {
      const response = await fetch(`${API_URL}/skills.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: skill.id,
          is_active: !skill.is_active
        })
      });
      
      if (response.ok) {
        fetchSkills();
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const filteredSkills = skills.filter(skill => 
    (skill.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (skill.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

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
              <h2 className="text-xl font-semibold text-white">Technologies & Skills</h2>
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
              <p className="text-gray-400">Loading skills...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search technologies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button 
                  onClick={handleNewSkill}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Skill</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {[
                  { label: 'Total', value: skills.length, color: 'blue' },
                  { label: 'Active', value: skills.filter(s => s.is_active).length, color: 'green' },
                  { label: 'Inactive', value: skills.filter(s => !s.is_active).length, color: 'red' },
                  { label: 'Categories', value: Object.keys(groupedSkills).length, color: 'purple' },
                  { label: 'Avg Proficiency', value: skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + parseInt(s.proficiency), 0) / skills.length) + '%' : '0%', color: 'yellow' }
                ].map((stat, index) => (
                  <div key={index} className="bg-[#0f172a] rounded-xl p-4 border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${
                      stat.color === 'blue' ? 'text-blue-400' :
                      stat.color === 'green' ? 'text-green-400' :
                      stat.color === 'red' ? 'text-red-400' :
                      stat.color === 'purple' ? 'text-purple-400' :
                      'text-yellow-400'
                    }`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Skills by Category */}
              <div className="space-y-8">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      {category}
                      <span className="text-sm text-gray-500 font-normal">({categorySkills.length})</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {categorySkills.map((skill) => (
                        <div 
                          key={skill.id}
                          className={`relative group rounded-2xl border p-4 transition-all ${
                            skill.is_active 
                              ? 'border-white/10 hover:border-blue-500/30 bg-[#0f172a]' 
                              : 'border-red-500/20 bg-red-900/10 opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: skill.color + '20' }}
                            >
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: skill.color }}
                              />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleToggleActive(skill)}
                                className={`p-1.5 rounded transition-colors ${
                                  skill.is_active 
                                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                }`}
                              >
                                {skill.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              </button>
                              <button 
                                onClick={() => handleEditSkill(skill)}
                                className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-semibold text-white text-sm mb-1">{skill.name}</h4>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 bg-white/10 rounded-full h-1.5">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${skill.proficiency}%`,
                                  backgroundColor: skill.color
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{skill.proficiency}%</span>
                          </div>

                          <div className="mt-2 text-xs text-gray-500">
                            Order: {skill.display_order}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {filteredSkills.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Cpu className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No skills found</h3>
                  <p className="text-gray-400">Add your first skill to get started</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Skill Modal */}
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
                {editingSkill ? 'Edit Skill' : 'Add Skill'}
              </h3>
            </div>
            <form onSubmit={handleSubmitSkill} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Skill Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="React.js"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                >
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: preset.value }))}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        formData.color === preset.value 
                          ? 'border-white' 
                          : 'border-transparent hover:border-white/30'
                      }`}
                      style={{ backgroundColor: preset.value + '20' }}
                      title={preset.label}
                    >
                      <div 
                        className="w-6 h-6 rounded mx-auto"
                        style={{ backgroundColor: preset.value }}
                      />
                    </button>
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full mt-2 h-10 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Proficiency: {formData.proficiency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
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
                  {editingSkill ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologiesAdmin;
