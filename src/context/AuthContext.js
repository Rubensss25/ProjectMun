import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = 'http://localhost/Project%20Mun/project-mun/backend/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [services, setServices] = useState([]);
  const [skills, setSkills] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      return { success: false, message: 'Server error. Please try again later.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/settings.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userData, action: 'update_profile' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser({ ...user, ...userData });
        localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Failed to update profile' };
      }
    } catch (err) {
      return { success: false, message: 'Server error. Please try again later.' };
    }
  };

  const updateSettings = async (settingsData) => {
    try {
      const response = await fetch(`${API_URL}/settings.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings({ ...settings, ...settingsData });
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Failed to update settings' };
      }
    } catch (err) {
      return { success: false, message: 'Server error. Please try again later.' };
    }
  };

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchWithDefault = async (endpoint, setState, defaultData) => {
          try {
            const response = await fetch(`${API_URL}/${endpoint}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setState(data.length > 0 ? data : defaultData);
          } catch (err) {
            console.error(`Error fetching ${endpoint}:`, err);
            setState(defaultData);
          }
        };

        await Promise.all([
          fetchWithDefault('settings.php', setSettings, {
            site_title: 'Project MUN',
            site_email: 'projectmun.team@gmail.com',
            site_phone: '+63 (XXX) XXX-XXXX',
            site_location: 'Philippines',
            site_github: '#',
            site_linkedin: '#',
            site_facebook: '#',
            site_twitter: '#'
          }),
          fetchWithDefault('team.php', setTeamMembers, [
            { name: 'Ruben Albao', role: 'Frontend Developer', description: 'Expert in React, JavaScript, and modern frontend frameworks.', initials: 'RA', socials: { linkedin: '#', github: '#', email: 'mailto:ruben@projectmun.com' } },
            { name: 'Kristian Gomez', role: 'Frontend Developer', description: 'Specialized in React.js and modern JavaScript.', initials: 'KG', socials: { linkedin: '#', github: '#', email: 'mailto:kristian@projectmun.com' } },
            { name: 'Jonelle Mayari', role: 'Project Manager', description: 'Oversees project timelines and client communication.', initials: 'JM', socials: { linkedin: '#', github: '#', email: 'mailto:jonelle@projectmun.com' } },
            { name: 'Alvin Panganiban', role: 'Backend Developer', description: 'Expert in server-side development and APIs.', initials: 'AP', socials: { linkedin: '#', github: '#', email: 'mailto:alvin@projectmun.com' } }
          ]),
          fetchWithDefault('services.php', setServices, [
            { title: 'Web Development', description: 'Custom web applications built with modern frameworks.', icon: 'Code', color: 'blue', features: ['React.js', 'Node.js', 'RESTful APIs'] },
            { title: 'UI/UX Design', description: 'User-centered design for intuitive digital experiences.', icon: 'Palette', color: 'purple', features: ['Wireframing', 'Prototyping'] },
            { title: 'System Development', description: 'Robust backend systems using PHP and MySQL.', icon: 'Database', color: 'green', features: ['PHP', 'MySQL'] },
            { title: 'E-Commerce Solutions', description: 'Complete online store development.', icon: 'Globe', color: 'orange', features: ['Payment Gateways'] },
            { title: 'Responsive Design', description: 'Mobile-first approach for all devices.', icon: 'Smartphone', color: 'pink', features: ['Mobile-First'] },
            { title: 'Website Maintenance', description: 'Ongoing support and updates.', icon: 'Layout', color: 'indigo', features: ['Security Updates'] }
          ]),
          fetchWithDefault('skills.php', setSkills, [
            { name: 'React.js', category: 'Frontend', color: '#61DAFB' },
            { name: 'JavaScript', category: 'Language', color: '#F7DF1E' },
            { name: 'PHP', category: 'Backend', color: '#777BB4' },
            { name: 'MySQL', category: 'Database', color: '#4479A1' },
            { name: 'Node.js', category: 'Backend', color: '#339933' },
            { name: 'Git', category: 'Tools', color: '#F05032' },
            { name: 'Python', category: 'Backend', color: '#3776AB' },
            { name: 'Laravel', category: 'Backend', color: '#FF2D20' },
            { name: 'Tailwind CSS', category: 'Styling', color: '#38BDF8' },
            { name: 'C++', category: 'Language', color: '#00599C' },
            { name: 'Java', category: 'Language', color: '#F8981D' },
            { name: 'Electron.js', category: 'Framework', color: '#47848F' }
          ]),
          fetchWithDefault('testimonials.php', setTestimonials, [
            { name: 'Maria Santos', role: 'CEO, TechStart Philippines', content: 'Project MUN delivered an exceptional e-commerce platform.', rating: 5, image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
            { name: 'John Reyes', role: 'Marketing Director, InnovateCorp', content: 'Working with the Project MUN team was a game-changer.', rating: 5, image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
            { name: 'Sarah Chen', role: 'Founder, EduLearn Platform', content: 'The learning management system they built is incredible.', rating: 5, image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
            { name: 'David Lim', role: 'Operations Manager, FoodHub PH', content: 'Our restaurant booking system has streamlined operations.', rating: 5, image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' }
          ]),
           fetchWithDefault('projects.php', setProjects, [])
        ]);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const value = {
    settings,
    teamMembers,
    services,
    skills,
    testimonials,
    projects,
    loading,
    error,
    user,
    login,
    logout,
    updateUser,
    updateSettings,
    API_URL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
