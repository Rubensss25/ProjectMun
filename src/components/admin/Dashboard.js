import React, { useState, useEffect } from 'react';
import { 
  Bell,
  Search,
  Menu,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Users,
  FolderKanban,
  Code,
  Layout,
  MessageSquare,
  Zap
} from 'lucide-react';
import Sidebar from '../Sidebar';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState([
    { title: 'Total Projects', value: '0', change: '0%', trend: 'up', icon: FolderKanban, color: 'blue', loading: true },
    { title: 'Services', value: '0', change: '0%', trend: 'up', icon: Layout, color: 'green', loading: true },
    { title: 'Testimonials', value: '0', change: '0%', trend: 'up', icon: MessageSquare, color: 'purple', loading: true },
    { title: 'Technologies', value: '0', change: '0%', trend: 'up', icon: Zap, color: 'orange', loading: true }
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const { API_URL } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, servicesRes, testimonialsRes, skillsRes] = await Promise.all([
        fetch(`${API_URL}/projects.php`),
        fetch(`${API_URL}/services.php`),
        fetch(`${API_URL}/testimonials.php`),
        fetch(`${API_URL}/skills.php`)
      ]);

      const projects = projectsRes.ok ? await projectsRes.json() : [];
      const services = servicesRes.ok ? await servicesRes.json() : [];
      const testimonials = testimonialsRes.ok ? await testimonialsRes.json() : [];
      const skills = skillsRes.ok ? await skillsRes.json() : [];

      const activeProjects = projects.filter(p => p.status !== 'Completed').length;
      const activeServices = services.filter(s => s.is_active !== false).length;
      const activeTestimonials = testimonials.filter(t => t.is_active !== false).length;
      const activeSkills = skills.filter(s => s.is_active !== false).length;

      setStats([
        { 
          title: 'Total Projects', 
          value: projects.length.toString(), 
          change: `${activeProjects} active`, 
          trend: 'up',
          icon: FolderKanban,
          color: 'blue',
          loading: false
        },
        { 
          title: 'Services', 
          value: services.length.toString(), 
          change: `${activeServices} active`, 
          trend: 'up',
          icon: Layout,
          color: 'green',
          loading: false
        },
        { 
          title: 'Testimonials', 
          value: testimonials.length.toString(), 
          change: `${activeTestimonials} active`, 
          trend: 'up',
          icon: MessageSquare,
          color: 'purple',
          loading: false
        },
        { 
          title: 'Technologies', 
          value: skills.length.toString(), 
          change: `${activeSkills} active`, 
          trend: 'up',
          icon: Zap,
          color: 'orange',
          loading: false
        }
      ]);

      // Create recent activity from the data
      const activity = [
        ...projects.slice(0, 3).map(p => ({ 
          action: p.title || p.name,
          project: p.status,
          time: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recently'
        })),
        ...services.slice(0, 2).map(s => ({ 
          action: s.title,
          project: 'Active Service',
          time: 'Active'
        }))
      ].slice(0, 5);
      
      setRecentActivity(activity);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setStats(prev => prev.map(s => ({ ...s, loading: false })));
    }
  };

  const recentProjects = [
    { name: 'E-Commerce Platform', client: 'TechStore Inc.', status: 'In Progress', progress: 75, deadline: 'Dec 15' },
    { name: 'Portfolio Website', client: 'Design Studio', status: 'Completed', progress: 100, deadline: 'Dec 10' },
    { name: 'Mobile App UI', client: 'StartUp Hub', status: 'In Review', progress: 90, deadline: 'Dec 20' },
    { name: 'Admin Dashboard', client: 'Enterprise Co.', status: 'In Progress', progress: 60, deadline: 'Dec 25' }
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
              <h2 className="text-xl font-semibold text-white">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User */}
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">RA</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
              return (
                <div 
                  key={index}
                  className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 hover:border-blue-500/20 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                      stat.color === 'green' ? 'bg-green-500/10 text-green-400' :
                      stat.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-orange-500/10 text-orange-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendIcon className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {stat.loading ? (
                      <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                    ) : (
                      stat.value
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="lg:col-span-2 bg-[#0f172a] rounded-2xl border border-white/5">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
                <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {recentProjects.map((project, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{project.name}</h4>
                      <p className="text-sm text-gray-400">{project.client}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                        project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {project.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Due {project.deadline}</p>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-24">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">{project.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#0f172a] rounded-2xl border border-white/5">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              </div>
              <div className="p-6 space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-gray-400 text-sm">No recent activity</p>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-400 truncate">{activity.project}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-left">
              <Calendar className="w-6 h-6 mb-2" />
              <span className="font-medium">Schedule Meeting</span>
            </button>
            <button className="p-4 rounded-xl bg-green-600/10 border border-green-500/20 text-green-400 hover:bg-green-600 hover:text-white transition-all text-left">
              <FolderKanban className="w-6 h-6 mb-2" />
              <span className="font-medium">New Project</span>
            </button>
            <button className="p-4 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 hover:bg-purple-600 hover:text-white transition-all text-left">
              <Users className="w-6 h-6 mb-2" />
              <span className="font-medium">Add Client</span>
            </button>
            <button className="p-4 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-400 hover:bg-orange-600 hover:text-white transition-all text-left">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span className="font-medium">View Reports</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
