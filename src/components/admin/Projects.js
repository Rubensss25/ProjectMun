import React, { useState } from 'react';
import { 
  Bell,
  Search,
  Menu,
  Plus,
  Filter,
  MoreHorizontal,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit3,
  Trash2,
  Eye,
  FolderKanban,
  X
} from 'lucide-react';
import Sidebar from '../Sidebar';
import { useAuth } from '../../context/AuthContext';

const Projects = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    status: 'Pending',
    category: 'Web Development',
    images: [],
    videos: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const { projects, loading, API_URL } = useAuth();

  const defaultProjects = [
    { 
      id: 1,
      name: 'E-Commerce Platform', 
      client: 'TechStore Inc.', 
      status: 'In Progress', 
      progress: 75, 
      deadline: 'Dec 15, 2024',
      budget: '$12,000',
      tasks: 24,
      completedTasks: 18
    },
    { 
      id: 2,
      name: 'Portfolio Website', 
      client: 'Design Studio', 
      status: 'Completed', 
      progress: 100, 
      deadline: 'Dec 10, 2024',
      budget: '$5,500',
      tasks: 12,
      completedTasks: 12
    },
    { 
      id: 3,
      name: 'Mobile App UI', 
      client: 'StartUp Hub', 
      status: 'In Review', 
      progress: 90, 
      deadline: 'Dec 20, 2024',
      budget: '$8,000',
      tasks: 20,
      completedTasks: 18
    },
    { 
      id: 4,
      name: 'Admin Dashboard', 
      client: 'Enterprise Co.', 
      status: 'In Progress', 
      progress: 60, 
      deadline: 'Dec 25, 2024',
      budget: '$15,000',
      tasks: 35,
      completedTasks: 21
    },
    { 
      id: 5,
      name: 'Landing Page', 
      client: 'Marketing Pro', 
      status: 'Pending', 
      progress: 10, 
      deadline: 'Jan 5, 2025',
      budget: '$3,000',
      tasks: 8,
      completedTasks: 1
    },
    { 
      id: 6,
      name: 'CRM System', 
      client: 'SalesForce Ltd.', 
      status: 'In Progress', 
      progress: 45, 
      deadline: 'Jan 15, 2025',
      budget: '$25,000',
      tasks: 50,
      completedTasks: 22
    }
  ];

  const projectsList = projects && projects.length > 0 ? projects : defaultProjects;

   // Map database fields to frontend fields
  const projectsListMapped = projectsList.map(project => ({
    id: project.id,
    name: project.title,
    client: project.description,
    status: project.category || 'Pending',
    image_url: project.image_url,
    project_url: project.project_url,
    video_url: project.video_url,
    video_two_url: project.video_two_url,
    created_at: project.created_at
  }));

  const filteredProjects = projectsListMapped.filter(project => {
    const matchesSearch = (project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.client || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (project.status || 'Pending') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      if (name === 'images') {
        const newFiles = Array.from(files);
        const newPreviews = newFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        });
        Promise.all(newPreviews).then(previews => {
          setImagePreviews(prev => [...prev, ...previews]);
          setFormData(prev => ({ ...prev, images: [...(Array.isArray(prev.images) ? prev.images : []), ...newFiles] }));
        });
      } else if (name === 'image') {
        const file = files[0];
        setFormData(prev => ({
          ...prev,
          images: [...(Array.isArray(prev.images) ? prev.images : []), file]
        }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]);
        reader.readAsDataURL(file);
      }
      if (name === 'video') {
        const newFiles = Array.from(files);
        const newPreviews = newFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        });
        Promise.all(newPreviews).then(previews => {
          setVideoPreviews(prev => [...prev, ...previews]);
          setFormData(prev => ({ ...prev, videos: [...(Array.isArray(prev.videos) ? prev.videos : []), ...newFiles] }));
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'progress' || name === 'tasks' || name === 'completedTasks' 
          ? parseInt(value) || 0 
          : value
      }));
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: Array.isArray(prev.images) ? prev.images.filter((_, i) => i !== index) : []
    }));
  };

  const removeVideo = (index) => {
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      videos: Array.isArray(prev.videos) ? prev.videos.filter((_, i) => i !== index) : []
    }));
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      client: '',
      status: 'Pending',
      category: 'Web Development',
      images: [],
      videos: []
    });
    setImagePreviews([]);
    setVideoPreviews([]);
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.title || project.name || '',
      client: project.description || project.client || '',
      status: project.status || 'Pending',
      category: project.category || 'Web Development',
      images: [],
      videos: []
    });
    setImagePreviews([]);
    setVideoPreviews([]);
    setShowModal(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await fetch(`${API_URL}/projects.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: projectId })
      });
      window.location.reload();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    
    const name = formData.name?.trim();
    const client = formData.client?.trim();
    
    if (!name) {
      alert('Please enter a project title.');
      return;
    }
    if (!client) {
      alert('Please enter a description.');
      return;
    }
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', name);
      formDataToSend.append('description', client);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('video_url', '');
      formDataToSend.append('video_two_url', '');
      
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(img => {
          formDataToSend.append('images[]', img);
        });
      } else if (formData.image) {
        formDataToSend.append('images[]', formData.image);
      }
      if (formData.videos && formData.videos.length > 0) {
        formData.videos.forEach(vid => {
          formDataToSend.append('videos[]', vid);
        });
      }
      
      if (editingProject) {
        formDataToSend.append('id', editingProject.id);
        formDataToSend.append('_method', 'PUT');
      }
        
      const response = await fetch(`${API_URL}/projects.php`, {
        method: 'POST',
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (response.ok && !result.error) {
        setShowModal(false);
        window.location.reload();
      } else {
        alert(result.error || 'Failed to save project. Please try again.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('An error occurred. Please try again.');
    }
  };


  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'In Review': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Pending': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return CheckCircle;
      case 'In Progress': return Clock;
      case 'In Review': return AlertCircle;
      case 'Pending': return Clock;
      default: return Clock;
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
              <h2 className="text-xl font-semibold text-white">Projects</h2>
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

         {/* Projects Content */}
         <div className="p-6">
           {loading ? (
             <div className="text-center py-12">
               <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
               <p className="text-gray-400">Loading projects...</p>
             </div>
           ) : (
             <>
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Projects', value: projectsListMapped.length, color: 'blue' },
              { label: 'In Progress', value: projectsListMapped.filter(p => p.status === 'In Progress').length, color: 'yellow' },
              { label: 'Completed', value: projectsListMapped.filter(p => p.status === 'Completed').length, color: 'green' },
              { label: 'Pending', value: projectsListMapped.filter(p => p.status === 'Pending').length, color: 'gray' }
            ].map((stat, index) => (
              <div key={index} className="bg-[#0f172a] rounded-xl p-4 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' :
                  stat.color === 'green' ? 'text-green-400' :
                  'text-gray-400'
                }`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="In Review">In Review</option>
                <option value="Pending">Pending</option>
              </select>

              <button 
                onClick={handleNewProject}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Project</span>
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {filteredProjects.map((project, index) => {
               const status = project.category || project.status || 'Pending';
               const StatusIcon = getStatusIcon(status);
               return (
                 <div 
                   key={project.id || index}
                   className="bg-[#0f172a] rounded-2xl border border-white/5 overflow-hidden hover:border-blue-500/20 transition-all group"
                 >
                   {/* Card Header */}
                   <div className="p-6 border-b border-white/5">
                     <div className="flex items-start justify-between mb-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(status)}`}>
                         <StatusIcon className="w-3 h-3" />
                         {status}
                       </span>
                       <button className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                         <MoreHorizontal className="w-4 h-4" />
                       </button>
                     </div>
                     <h3 className="text-lg font-semibold text-white mb-1">{project.title || project.name || 'Untitled Project'}</h3>
                     <p className="text-sm text-gray-400">{project.description || project.client || 'Unknown Client'}</p>
                   </div>

                     {/* Card Body */}
                     <div className="p-6 space-y-4">
                       <div className="pt-4">
                         <p className="text-sm text-gray-400">{project.category || ''}</p>
                       </div>
                       <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                         <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setViewingProject(project);
                              setShowViewModal(true);
                            }}
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                         <button 
                           onClick={() => handleEditProject(project)}
                           className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                         >
                           <Edit3 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleDeleteProject(project.id)}
                           className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

           {/* Empty State */}
           {filteredProjects.length === 0 && (
             <div className="text-center py-12">
               <FolderKanban className="w-12 h-12 text-gray-500 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
               <p className="text-gray-400">Try adjusting your search or filter</p>
             </div>
           )}
             </>
           )}
           
{/* Project Modal */}
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
                     {editingProject ? 'Edit Project' : 'New Project'}
                   </h3>
                 </div>
                 <form onSubmit={handleSubmitProject} className="p-6 space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm text-gray-400 mb-2">Title</label>
                     <input
                       type="text"
                       name="name"
                       value={formData.name}
                       onChange={handleFormChange}
                       required
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                     />
                   </div>
                   <div>
                     <label className="block text-sm text-gray-400 mb-2">Description</label>
                     <input
                       type="text"
                       name="client"
                       value={formData.client}
                       onChange={handleFormChange}
                       required
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                     />
                   </div>
                   <div>
                     <label className="block text-sm text-gray-400 mb-2">Status</label>
                     <select
                       name="status"
                       value={formData.status}
                       onChange={handleFormChange}
                       className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                       style={{
                         backgroundColor: '#0f172a',
                         backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                         backgroundPosition: 'right 0.5rem center',
                         backgroundRepeat: 'no-repeat',
                         backgroundSize: '1.5em 1.5em'
                       }}
                     >
                       <option value="Pending">Pending</option>
                       <option value="In Progress">In Progress</option>
                       <option value="In Review">In Review</option>
                       <option value="Completed">Completed</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm text-gray-400 mb-2">Category</label>
                     <select
                       name="category"
                       value={formData.category}
                       onChange={handleFormChange}
                       className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                       style={{
                         backgroundColor: '#0f172a',
                         backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                         backgroundPosition: 'right 0.5rem center',
                         backgroundRepeat: 'no-repeat',
                         backgroundSize: '1.5em 1.5em'
                       }}
                     >
                       <option value="Web Development">Web Development</option>
                       <option value="System Development">System Development</option>
                       <option value="UI/UX Design">UI/UX Design</option>
                     </select>
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Project Images (select multiple)</label>
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                      />
                      {imagePreviews.length > 0 && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {imagePreviews.map((src, index) => (
                            <div key={index} className="relative">
                              <img 
                                src={src} 
                                alt={`Preview ${index + 1}`} 
                                className="w-full h-20 object-cover rounded-lg border border-white/20"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Videos (select multiple)</label>
                      <input
                        type="file"
                        name="video"
                        accept="video/*"
                        multiple
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                      />
                      {videoPreviews.length > 0 && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {videoPreviews.map((src, index) => (
                            <div key={index} className="relative">
                              <video 
                                src={src} 
                                className="w-full h-20 object-cover rounded-lg border border-white/20"
                              />
                              <button
                                type="button"
                                onClick={() => removeVideo(index)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                 </div>
                 <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/10 bg-[#0f172a]">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setFormData({
                            name: '',
                            client: '',
                            status: 'Pending',
                            category: 'Web Development',
                            images: [],
                            videos: []
                          });
                          setImagePreviews([]);
                          setVideoPreviews([]);
                          setEditingProject(null);
                        }}
className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {editingProject ? 'Update Project' : 'Create Project'}
                      </button>
                   </div>
                 </form>
               </div>
             </div>
           )}
           
{/* View Project Details Modal */}
            {showViewModal && viewingProject && (
              <div 
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowViewModal(false);
                    setViewingProject(null);
                  }
                }}
              >
                <div className="bg-[#0f172a] rounded-2xl w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">Project Details</h3>
                    <button 
                      onClick={() => {
                        setShowViewModal(false);
                        setViewingProject(null);
                      }}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                 </div>
                 <div className="p-6 space-y-6">
                   {viewingProject.image_url && (
                     <div className="rounded-xl overflow-hidden">
                       <img 
                         src={viewingProject.image_url} 
                         alt={viewingProject.name}
                         className="w-full h-64 object-cover"
                       />
                     </div>
                   )}
                   
                   <div>
                     <h2 className="text-2xl font-bold text-white mb-2">{viewingProject.name || viewingProject.title}</h2>
                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewingProject.status)}`}>
                       {viewingProject.status}
                     </span>
                   </div>
                   
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm text-gray-400 mb-1">Description</label>
                       <p className="text-white">{viewingProject.client || viewingProject.description}</p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm text-gray-400 mb-1">Category</label>
                         <p className="text-white">{viewingProject.category || viewingProject.status}</p>
                       </div>
                       <div>
                         <label className="block text-sm text-gray-400 mb-1">Created</label>
                         <p className="text-white">{viewingProject.created_at ? new Date(viewingProject.created_at).toLocaleDateString() : 'N/A'}</p>
                       </div>
                     </div>
                     
                     {viewingProject.project_url && (
                       <div>
                         <label className="block text-sm text-gray-400 mb-1">Project URL</label>
                         <a 
                           href={viewingProject.project_url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-blue-400 hover:underline"
                         >
                           {viewingProject.project_url}
                         </a>
                       </div>
                     )}
                   </div>
                   
                   <div className="flex gap-3 pt-4 border-t border-white/10">
                     <button
                       type="button"
                       onClick={() => {
                         setShowViewModal(false);
                         handleEditProject(viewingProject);
                       }}
                       className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                     >
                       Edit Project
                     </button>
                     <button
                       type="button"
                       onClick={() => setShowViewModal(false)}
                       className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                     >
                       Close
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>
      </main>
    </div>
  );
};

export default Projects;
