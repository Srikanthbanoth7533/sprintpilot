import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Shield, User, Database, Server, Key, ExternalLink } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth();
  const cleanRole = user?.role ? user.role.replace('ROLE_', '') : 'VIEWER';

  const rolePermissions = {
    ADMIN: ['User management', 'Product creation & deletion', 'All sprint & story actions', 'Analytics oversight'],
    PRODUCT_MANAGER: ['Product creation', 'Requirements & stories', 'Backlog prioritization', 'Sprint planning & completion', 'AI story assistant'],
    DEVELOPER: ['Kanban board task updates', 'Task comments & blockers', 'Assigned work review', 'Read analytics'],
    VIEWER: ['Read-only view of products, sprints, backlog, and reports'],
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>Workspace Settings & Architecture</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Environment configuration, role authorizations, and API gateway specs
        </p>
      </div>

      {/* User Profile Info */}
      <div className="saas-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Current Session Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Name</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{user?.name}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Email</p>
            <p className="text-sm font-bold text-slate-900 mt-1 font-mono text-xs">{user?.email}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Assigned Role</p>
            <p className="text-sm font-bold text-indigo-600 mt-1">{cleanRole}</p>
          </div>
        </div>

        {/* Role Permissions Box */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-700 mb-2">Capabilities granted to {cleanRole}:</p>
          <div className="flex flex-wrap gap-2">
            {(rolePermissions[cleanRole] || rolePermissions.VIEWER).map((perm, idx) => (
              <span key={idx} className="text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100">
                ✓ {perm}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* System & Architecture Info */}
      <div className="saas-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Technical Architecture Specs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Backend Runtime</span>
            </div>
            <p className="text-slate-600">Java 17, Spring Boot 3.4.3, Spring Security 6, Spring Data JPA, Hibernate</p>
            <p className="text-[11px] text-slate-500 font-mono">Profile: dev (H2 PostgreSQL mode) / prod (PostgreSQL)</p>
          </div>

          <div className="p-4 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Key className="w-4 h-4 text-indigo-600" />
              <span>Security & JWT</span>
            </div>
            <p className="text-slate-600">Stateless HMAC-SHA256 JWT Bearer tokens with BCrypt password hashing</p>
            <p className="text-[11px] text-slate-500 font-mono">Header: Authorization: Bearer &lt;token&gt;</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-slate-500">Interactive API Documentation</span>
          <a
            href="/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
          >
            <span>Open Swagger UI</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
