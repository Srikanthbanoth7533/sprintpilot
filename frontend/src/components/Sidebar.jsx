import React from 'react';
import {
  LayoutDashboard,
  Package,
  FileText,
  ListTodo,
  FastForward,
  Kanban,
  Flag,
  Users,
  BarChart3,
  Sparkles,
  Settings,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ currentPath }) => {
  const { user } = useAuth();
  const cleanRole = user?.role ? user.role.replace('ROLE_', '') : 'VIEWER';

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Products', icon: Package, path: '/products' },
    { label: 'Requirements', icon: FileText, path: '/requirements' },
    { label: 'Product Backlog', icon: ListTodo, path: '/backlog' },
    { label: 'Sprints', icon: FastForward, path: '/sprints' },
    { label: 'Kanban Board', icon: Kanban, path: '/board' },
    { label: 'Releases', icon: Flag, path: '/releases' },
    { label: 'Team & Roster', icon: Users, path: '/team' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'AI Assistant', icon: Sparkles, path: '/ai-assistant', highlight: true },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-lg">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            SprintPilot
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-1.5 py-0.5 rounded border border-indigo-500/30">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Product & Engineering</p>
        </div>
      </div>

      {/* Role Badge Container */}
      <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Access Tier</span>
          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] tracking-wide uppercase ${
            cleanRole === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
            cleanRole === 'PRODUCT_MANAGER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            cleanRole === 'DEVELOPER' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
            'bg-slate-700/50 text-slate-300 border border-slate-600/30'
          }`}>
            {cleanRole}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : item.highlight
                  ? 'text-indigo-300 hover:bg-slate-800/80 hover:text-white'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${
                isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'
              }`} />
              <span className="flex-1">{item.label}</span>
              {item.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              )}
            </a>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white border border-slate-700">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || 'user@sprintpilot.demo'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
