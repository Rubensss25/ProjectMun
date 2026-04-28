import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  Plus,
  Layers,
  MessageCircle,
  Cpu,
  Bell,
  User,
  Users,
  Image
} from 'lucide-react';
import munLogo from '../assets/images/MUN.png';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, projects, services, testimonials, skills } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Calculate notifications based on pending items
    const pendingProjects = projects?.filter(p => p.status === 'Pending').length || 0;
    const inactiveServices = services?.filter(s => !s.is_active).length || 0;
    setNotificationCount(pendingProjects + inactiveServices);
  }, [projects, services]);

  const handleLogout = () => {
    navigate('/login');
  };

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, path: '/projects' },
    { id: 'services', label: 'Services', icon: Layers, path: '/admin/services' },
    { id: 'testimonials', label: 'Testimonials', icon: MessageCircle, path: '/admin/testimonials' },
    { id: 'technologies', label: 'Technologies', icon: Cpu, path: '/admin/technologies' },
    { id: 'hero', label: 'Hero Slider', icon: Image, path: '/admin/hero' },
    { id: 'about', label: 'Our Team', icon: Users, path: '/admin/about' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/admin/services')) return 'services';
    if (path.includes('/admin/testimonials')) return 'testimonials';
    if (path.includes('/admin/technologies')) return 'technologies';
    if (path.includes('/admin/hero')) return 'hero';
    if (path.includes('/admin/about')) return 'about';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-[#0f172a] border-r border-white/5 transform transition-transform duration-300 lg:transform-none flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center ring-2 ring-blue-500/30 group-hover:ring-blue-500/50 transition-all">
              <img src={munLogo} alt="MUN Logo" className="w-12 h-12 object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Project MUN</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* User Profile */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              {getInitials(user?.name || 'User')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.role || 'Administrator'}</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</p>
        </div>
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen && setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {/* Active background glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-50" />
                )}
                
                <div className={`relative p-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="relative">{item.label}</span>
                {isActive && (
                  <div className="absolute right-3 w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50" />
                )}
              </Link>
            );
          })}
        </nav>


        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-gradient-to-t from-[#0f172a] to-transparent">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300 group border border-transparent hover:border-red-500/20"
          >
            <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="group-hover:text-red-300 transition-colors">Logout</span>
          </button>
        </div>
      </aside>

      {/* Enhanced Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
