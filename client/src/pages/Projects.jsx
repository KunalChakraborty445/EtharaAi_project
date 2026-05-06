import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/projects', formData);
      toast.success('Project created successfully! 🎉');
      setShowModal(false);
      setFormData({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return '🟢';
      case 'completed': return '✅';
      case 'on-hold': return '⏸️';
      default: return '📋';
    }
  };

  if (loading) return <LoadingSpinner text="Loading projects..." />;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white">
            Projects
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Manage and track your team projects
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn-primary group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search projects..."
            className="input-field pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="input-field sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="glass-card group glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`badge text-xs ${
                  project.status === 'active' ? 'badge-success' :
                  project.status === 'completed' ? 'badge-info' :
                  'badge-warning'
                }`}>
                  {getStatusIcon(project.status)} {project.status}
                </span>
                <span className="text-xs text-surface-400 dark:text-surface-500">
                  {format(new Date(project.createdAt), 'MMM dd')}
                </span>
              </div>

              {/* Project Info */}
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-1">
                {project.name}
              </h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm mb-6 line-clamp-2">
                {project.description}
              </p>

              {/* Members & Creator */}
              <div className="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((member) => (
                      <div
                        key={member._id}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white dark:border-surface-800 flex items-center justify-center text-white text-xs font-bold"
                        title={member.user.name}
                      >
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {project.members.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-600 border-2 border-white dark:border-surface-800 flex items-center justify-center text-xs font-medium text-surface-600 dark:text-surface-300">
                        +{project.members.length - 4}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-surface-400 dark:text-surface-500">
                  {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📁"
          title={searchTerm ? "No projects found" : "No projects yet"}
          description={searchTerm ? "Try a different search term" : "Create your first project to get started"}
          action={
            !searchTerm && (
              <button onClick={() => setShowModal(true)} className="btn-primary">
                Create Project
              </button>
            )
          }
        />
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
          <div className="relative glass-card w-full max-w-lg animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold gradient-text">Create New Project</h2>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
                Fill in the details to create a new project
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="input-label">Project Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">📁</span>
                  <input
                    type="text"
                    required
                    className="input-field pl-12"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    maxLength={100}
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Description</label>
                <textarea
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Describe your project..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={500}
                />
                <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 group"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Project
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;