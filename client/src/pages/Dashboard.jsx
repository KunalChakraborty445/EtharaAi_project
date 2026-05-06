import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/tasks/stats/dashboard'),
        api.get('/tasks')
      ]);
      setStats(statsRes.data.data);
      setRecentTasks(tasksRes.data.data.slice(0, 6));
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDateLabel = (date) => {
    if (isToday(new Date(date))) return 'Today';
    if (isTomorrow(new Date(date))) return 'Tomorrow';
    if (isPast(new Date(date))) return 'Overdue';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const statCards = stats ? [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: (
        <svg className="w-8 h-8 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/10 to-orange-500/10',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-500/10 to-green-500/10',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      gradient: 'from-rose-500 to-red-500',
      bgGradient: 'from-rose-500/10 to-red-500/10',
      textColor: 'text-rose-600 dark:text-rose-400'
    }
  ] : [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden glass-card">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">
              {format(new Date(), 'EEEE, MMMM dd, yyyy')}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white mt-1">
              {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mt-2">
              Here's what's happening with your projects today.
            </p>
          </div>
          <Link to="/projects" className="btn-primary group shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="glass-card-sm group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} ${stat.textColor}`}>
                {stat.icon}
              </div>
              <span className={`text-3xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">
              {stat.label}
            </h3>
            {stat.label === 'Completed' && stats.total > 0 && (
              <div className="mt-3 w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress & Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Progress */}
        <div className="glass-card lg:col-span-1">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-6">
            Completion Rate
          </h3>
          
          {stats && stats.total > 0 ? (
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="currentColor"
                    className="text-surface-200 dark:text-surface-700"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${stats.completionRate * 2.51} 251`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold gradient-text">
                      {stats.completionRate}%
                    </span>
                    <p className="text-xs text-surface-500 dark:text-surface-400">Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Todo</span>
                  <span className="font-semibold text-surface-900 dark:text-white">{stats.todo}</span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" 
                    style={{ width: `${stats.total > 0 ? (stats.todo / stats.total) * 100 : 0}%` }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">In Progress</span>
                  <span className="font-semibold text-surface-900 dark:text-white">{stats.inProgress}</span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Completed</span>
                  <span className="font-semibold text-surface-900 dark:text-white">{stats.completed}</span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState 
              icon="📊" 
              title="No data yet"
              description="Create tasks to see your progress" 
            />
          )}
        </div>

        {/* Recent Tasks */}
        <div className="glass-card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-surface-900 dark:text-white">
              Recent Tasks
            </h3>
            <Link 
              to="/tasks" 
              className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task, index) => (
                <div
                  key={task._id}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-300"
                >
                  {/* Priority Indicator */}
                  <div className={`w-2 h-12 rounded-full flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-gradient-to-b from-rose-500 to-red-500' :
                    task.priority === 'medium' ? 'bg-gradient-to-b from-amber-500 to-orange-500' :
                    'bg-gradient-to-b from-emerald-500 to-green-500'
                  }`}></div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-surface-900 dark:text-white truncate">
                        {task.title}
                      </h4>
                      <span className={`badge text-[10px] ${
                        task.status === 'todo' ? 'badge-warning' :
                        task.status === 'in-progress' ? 'badge-info' :
                        'badge-success'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        {task.project?.name}
                      </span>
                      <span className={`flex items-center gap-1 ${
                        isPast(new Date(task.dueDate)) && task.status !== 'completed' 
                          ? 'text-rose-500 font-semibold' 
                          : ''
                      }`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {getDateLabel(task.dueDate)}
                      </span>
                    </div>
                  </div>

                  {task.assignedTo && (
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                        {task.assignedTo.name.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon="📝" 
              title="No tasks yet"
              description="Create your first task to get started"
              action={
                <Link to="/projects" className="btn-primary">
                  Browse Projects
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;