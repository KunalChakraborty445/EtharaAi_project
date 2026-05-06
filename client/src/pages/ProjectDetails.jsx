import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { format, isPast } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });
  const [memberEmail, setMemberEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all');

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`)
      ]);
      setProject(projectRes.data.data || null);
      setTasks(tasksRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post('/tasks', {
        title: taskForm.title,
        description: taskForm.description,
        projectId: id,
        assignedTo: taskForm.assignedTo || undefined,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate
      });
      
      toast.success('Task created! ✅');
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      toast.success('Member added successfully! 🎉');
      setShowMemberModal(false);
      setMemberEmail('');
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Task updated!');
      fetchProjectData();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const userRole = project?.members.find(m => m.user._id === user?.id)?.role;
  const isProjectAdmin = userRole === 'admin' || isAdmin;

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'my') return task.assignedTo?._id === user?.id;
    if (taskFilter === 'overdue') return isPast(new Date(task.dueDate)) && task.status !== 'completed';
    return task.status === taskFilter;
  });

  if (loading) return <LoadingSpinner text="Loading project..." />;
  if (!project) return null;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-2 text-surface-500 hover:text-surface-900 dark:hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="glass-card">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-extrabold text-surface-900 dark:text-white">
                {project.name}
              </h1>
              <span className={`badge text-xs ${
                project.status === 'active' ? 'badge-success' :
                project.status === 'completed' ? 'badge-info' :
                'badge-warning'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              {project.description}
            </p>
            
            {/* Members */}
            <div>
              <h3 className="text-sm font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-3">
                Team Members
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 p-2 pr-4 rounded-xl bg-surface-50 dark:bg-surface-800/50"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold ${
                      member.role === 'admin' 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                        : 'bg-gradient-to-br from-primary-400 to-primary-600'
                    }`}>
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        {member.user.name}
                        {member.user._id === user?.id && ' (You)'}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {member.role === 'admin' ? '👑 Admin' : 'Member'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {isProjectAdmin && (
              <>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="btn-primary group"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Task
                </button>
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="btn-secondary group"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Add Member
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
            Tasks ({filteredTasks.length})
          </h2>
          
          <div className="flex gap-2 flex-wrap">
            {['all', 'todo', 'in-progress', 'completed', 'my', 'overdue'].map(filter => (
              <button
                key={filter}
                onClick={() => setTaskFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  taskFilter === filter
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {filter === 'in-progress' ? 'In Progress' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task._id} className="glass-card-sm group">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                        {task.title}
                      </h3>
                      <span className={`badge text-xs ${
                        task.status === 'todo' ? 'badge-warning' :
                        task.status === 'in-progress' ? 'badge-info' :
                        'badge-success'
                      }`}>
                        {task.status}
                      </span>
                      <span className={`badge text-xs ${
                        task.priority === 'high' ? 'badge-danger' :
                        task.priority === 'medium' ? 'badge-warning' :
                        'badge-success'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-surface-500 dark:text-surface-400 text-sm mb-3">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-surface-400 dark:text-surface-500">
                      <span className={`flex items-center gap-1 ${
                        isPast(new Date(task.dueDate)) && task.status !== 'completed' 
                          ? 'text-rose-500 font-semibold' 
                          : ''
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                      className="text-sm rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="todo">📝 To Do</option>
                      <option value="in-progress">⚡ In Progress</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📝"
            title="No tasks found"
            description={taskFilter !== 'all' ? "Try changing the filter" : "Create your first task"}
            action={
              isProjectAdmin && taskFilter === 'all' && (
                <button onClick={() => setShowTaskModal(true)} className="btn-primary">
                  Create Task
                </button>
              )
            }
          />
        )}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTaskModal(false)}></div>
          
          <div className="relative glass-card w-full max-w-lg animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold gradient-text">Create Task</h2>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
                Add a new task to this project
              </p>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="input-label">Task Title *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter task title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Description</label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Task description (optional)"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Priority</label>
                  <select
                    className="input-field"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Due Date *</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Assign To</label>
                <select
                  className="input-field"
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {project.members.map((member) => (
                    <option key={member._id} value={member.user._id}>
                      {member.user.name} {member.role === 'admin' ? '(Admin)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
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
                      Create Task
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

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMemberModal(false)}></div>
          
          <div className="relative glass-card w-full max-w-md animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowMemberModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold gradient-text">Add Member</h2>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
                Invite a user by their email address
              </p>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">📧</span>
                  <input
                    type="email"
                    required
                    className="input-field pl-12"
                    placeholder="user@example.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 group"
                >
                  {submitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;