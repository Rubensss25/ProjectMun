import React, { useState, useEffect } from 'react';
import { 
  Bell,
  Search,
  Menu,
  User,
  Shield,
  Palette,
  Mail,
  Smartphone,
  Globe,
  Save,
  Camera,
  Eye,
  EyeOff,
  ChevronRight,
  Check,
  Loader2
} from 'lucide-react';
import Sidebar from '../Sidebar';
import munLogo from '../../assets/images/MUN.png';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user, updateUser } = useAuth();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    location: '',
    bio: ''
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    newsletter: false
  });
  const [darkMode, setDarkMode] = useState(true);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(profileData);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ];

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
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-white">Settings</h2>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleProfileUpdate}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              {/* User */}
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">RA</span>
              </div>
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Settings Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#0f172a] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center ring-4 ring-blue-500/20">
                        <img src={munLogo} alt="Profile" className="w-20 h-20 object-cover" />
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-semibold text-white">{profileData.name || 'Admin User'}</h3>
                      <p className="text-gray-400">{profileData.role || 'Administrator'}</p>
                      <p className="text-sm text-gray-500 mt-1">{profileData.email || 'admin@projectmun.com'}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                  <h4 className="text-lg font-semibold text-white mb-6">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                      <input
                        type="text"
                        value={profileData.role}
                        onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                      <textarea
                        rows="3"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                <h4 className="text-lg font-semibold text-white mb-6">Notification Preferences</h4>
                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
                    { id: 'push', label: 'Push Notifications', desc: 'Receive push notifications', icon: Smartphone },
                    { id: 'updates', label: 'Project Updates', desc: 'Get notified about project changes', icon: Bell },
                    { id: 'newsletter', label: 'Weekly Newsletter', desc: 'Receive our weekly digest', icon: Globe }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{item.label}</p>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            notifications[item.id] ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            notifications[item.id] ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                  <h4 className="text-lg font-semibold text-white mb-6">Theme</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setDarkMode(true)}
                      className={`p-4 rounded-xl border transition-all ${
                        darkMode 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-full h-24 rounded-lg bg-[#0a1628] mb-3 border border-white/10"></div>
                      <p className="font-medium text-white">Dark Mode</p>
                      <p className="text-sm text-gray-400">Default dark theme</p>
                      {darkMode && <Check className="w-5 h-5 text-blue-400 mt-2" />}
                    </button>
                    <button
                      onClick={() => setDarkMode(false)}
                      className={`p-4 rounded-xl border transition-all ${
                        !darkMode 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-full h-24 rounded-lg bg-gray-100 mb-3 border border-gray-300"></div>
                      <p className="font-medium text-white">Light Mode</p>
                      <p className="text-sm text-gray-400">Light theme</p>
                      {!darkMode && <Check className="w-5 h-5 text-blue-400 mt-2" />}
                    </button>
                  </div>
                </div>

                <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                  <h4 className="text-lg font-semibold text-white mb-6">Accent Color</h4>
                  <div className="flex flex-wrap gap-3">
                    {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500'].map((color, index) => (
                      <button
                        key={index}
                        className={`w-10 h-10 rounded-full ${color} ring-2 ring-offset-2 ring-offset-[#0f172a] transition-all ${
                          index === 0 ? 'ring-white' : 'ring-transparent hover:ring-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                  <h4 className="text-lg font-semibold text-white mb-6">Change Password</h4>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors font-medium">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
                  <h4 className="text-lg font-semibold text-white mb-6">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">2FA is enabled</p>
                        <p className="text-sm text-gray-400">Your account is protected</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium">
                      Disable
                    </button>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h4>
                  <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back.</p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
