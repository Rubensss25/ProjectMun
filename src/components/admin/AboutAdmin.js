import React, { useState, useEffect } from 'react';
import { 
  Bell,
  Menu,
  Plus,
  Edit3,
  Trash2,
  X,
  Users,
  Linkedin,
  Github,
  Mail,
  Upload,
  Image
} from 'lucide-react';
import Sidebar from '../Sidebar';
import { useAuth } from '../../context/AuthContext';


const AboutAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('team');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { API_URL } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Target',
    value: 0,
    suffix: '',
    name: '',
    role: '',
    initials: '',
    linkedin: '',
    github: '',
    email: '',
    image: null,
    image_url: ''
  });

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const teamRes = await fetch(`${API_URL}/team.php`);

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        setTeamMembers(teamData);
      }
    } catch (err) {
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMember = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Target',
      value: 0,
      suffix: '',
      name: '',
      role: '',
      initials: '',
      linkedin: '',
      github: '',
      email: '',
      image: null,
      image_url: ''
    });
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditMember = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || item.label || '',
      description: item.description || '',
      icon: item.icon || 'Target',
      value: item.value || 0,
      suffix: item.suffix || '',
      name: item.name || '',
      role: item.role || '',
      initials: item.initials || '',
      linkedin: item.linkedin || item.socials?.linkedin || '',
      github: item.github || item.socials?.github || '',
      email: item.email || item.socials?.email || '',
      image: null,
      image_url: item.image_url || ''
    });
    setShowModal(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    try {
      const response = await fetch(`${API_URL}/team.php?id=${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        fetchTeamData();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingItem ? 'PUT' : 'POST';
    const body = editingItem
      ? { ...formData, id: editingItem.id }
      : formData;

    try {
      const response = await fetch(`${API_URL}/team.php`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setShowModal(false);
        fetchTeamData();
      }
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const tabs = [
    { id: 'team', label: 'Team Members', icon: Users }
  ];

  const renderTeamTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Team Members</h3>
        <button
          onClick={handleNewMember}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {member.image_url ? (
                  <img 
                    src={member.image_url} 
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                    {member.initials}
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-semibold text-white">{member.name}</h4>
                  <p className="text-blue-400 text-sm">{member.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditMember(member)}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem(member.id)}
                  className="p-2 rounded-lg bg-white/5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">{member.description}</p>
            <div className="flex gap-3">
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className="p-2 rounded-lg bg-white/5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-[#0f172a] rounded-2xl w-full max-w-md mx-auto border border-white/10" style={{ maxWidth: '75vw', transform: 'scale(0.8)', transformOrigin: 'center' }}>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {editingItem ? 'Edit' : 'Add'} Team Member
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="Full Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="Job Title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Initials</label>
              <input
                type="text"
                value={formData.initials}
                onChange={(e) => setFormData({ ...formData, initials: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="RA"
                maxLength="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                rows="3"
                placeholder="Enter description..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
              <div className="flex items-center gap-4">
                {(formData.image || formData.image_url) && (
                  <img 
                    src={formData.image || formData.image_url} 
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors text-sm font-medium"
              >
                {editingItem ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 min-w-0 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#0a1628]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">About Management</h1>
                <p className="text-gray-400 text-sm">Manage your about page content</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'team' && renderTeamTab()}
        </div>
      </main>

      {renderModal()}
    </div>
  );
};

export default AboutAdmin;
