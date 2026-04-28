import React, { useState } from 'react';
import { 
  Bell,
  Search,
  Menu,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  ArrowUpRight,
  Filter,
  Briefcase,
  Users
} from 'lucide-react';
import Sidebar from '../Sidebar';

const Clients = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const clients = [
    { 
      id: 1,
      name: 'TechStore Inc.', 
      contact: 'John Smith',
      email: 'john@techstore.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      status: 'Active',
      projects: 3,
      totalSpent: '$35,000',
      lastContact: '2 days ago',
      industry: 'E-Commerce'
    },
    { 
      id: 2,
      name: 'Design Studio', 
      contact: 'Sarah Johnson',
      email: 'sarah@designstudio.com',
      phone: '+1 (555) 987-6543',
      location: 'Los Angeles, USA',
      status: 'Active',
      projects: 2,
      totalSpent: '$12,500',
      lastContact: '1 week ago',
      industry: 'Creative'
    },
    { 
      id: 3,
      name: 'StartUp Hub', 
      contact: 'Mike Chen',
      email: 'mike@startuphub.com',
      phone: '+1 (555) 456-7890',
      location: 'San Francisco, USA',
      status: 'Active',
      projects: 1,
      totalSpent: '$8,000',
      lastContact: '3 days ago',
      industry: 'Technology'
    },
    { 
      id: 4,
      name: 'Enterprise Co.', 
      contact: 'Emily Davis',
      email: 'emily@enterprise.com',
      phone: '+1 (555) 234-5678',
      location: 'Chicago, USA',
      status: 'Inactive',
      projects: 0,
      totalSpent: '$45,000',
      lastContact: '1 month ago',
      industry: 'Enterprise'
    },
    { 
      id: 5,
      name: 'Marketing Pro', 
      contact: 'David Wilson',
      email: 'david@marketingpro.com',
      phone: '+1 (555) 876-5432',
      location: 'Miami, USA',
      status: 'Active',
      projects: 1,
      totalSpent: '$5,500',
      lastContact: '5 days ago',
      industry: 'Marketing'
    },
    { 
      id: 6,
      name: 'SalesForce Ltd.', 
      contact: 'Lisa Anderson',
      email: 'lisa@salesforce.com',
      phone: '+1 (555) 345-6789',
      location: 'Boston, USA',
      status: 'Active',
      projects: 2,
      totalSpent: '$52,000',
      lastContact: '1 day ago',
      industry: 'Sales'
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Clients', value: clients.length, icon: Users, color: 'blue' },
    { label: 'Active', value: clients.filter(c => c.status === 'Active').length, icon: Briefcase, color: 'green' },
    { label: 'Inactive', value: clients.filter(c => c.status === 'Inactive').length, icon: Building2, color: 'gray' },
    { label: 'Total Revenue', value: '$158,000', icon: ArrowUpRight, color: 'purple' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Inactive': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

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
              <h2 className="text-xl font-semibold text-white">Clients</h2>
            </div>

            <div className="flex items-center gap-4">
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

        {/* Clients Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-[#0f172a] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                      stat.color === 'green' ? 'bg-green-500/10 text-green-400' :
                      stat.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter & Add */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Client</span>
              </button>
            </div>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div 
                key={client.id}
                className="bg-[#0f172a] rounded-2xl border border-white/5 overflow-hidden hover:border-blue-500/20 transition-all group"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{client.name}</h3>
                        <p className="text-sm text-gray-400">{client.industry}</p>
                      </div>
                    </div>
                    <button className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{client.contact}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{client.location}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 border-t border-white/5 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-white">{client.projects}</p>
                        <p className="text-xs text-gray-400">Projects</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-white">{client.totalSpent}</p>
                        <p className="text-xs text-gray-400">Total</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {client.lastContact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No clients found</h3>
              <p className="text-gray-400">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Clients;
