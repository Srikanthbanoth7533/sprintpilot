import React, { useState, useEffect } from 'react';
import { teamService } from '../services/team.service';
import { Users, Shield, Briefcase, Mail, Building, UserCheck } from 'lucide-react';

export const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setLoading(true);
        const [teamsData, usersData] = await Promise.all([
          teamService.getTeams(),
          teamService.getUsers()
        ]);
        setTeams(teamsData);
        setUsers(usersData);
      } catch (err) {
        console.error("Team load error", err);
      } finally {
        setLoading(false);
      }
    };
    loadTeamData();
  }, []);

  const roleBadges = {
    ROLE_ADMIN: 'bg-purple-50 text-purple-700 border-purple-200',
    ROLE_PRODUCT_MANAGER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ROLE_DEVELOPER: 'bg-blue-50 text-blue-700 border-blue-200',
    ROLE_VIEWER: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <span>Team Roster & Workload</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Engineering squads, cross-functional roles, and account permissions
        </p>
      </div>

      {/* Teams Overview */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Squads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((t) => (
            <div key={t.id} className="saas-card p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.department || 'Product Engineering'}</span>
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  {t.memberCount} members
                </span>
              </div>

              {t.lead && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-4 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Squad Lead</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.lead.name}</span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Members</p>
                <div className="flex flex-wrap gap-2">
                  {t.members && t.members.map((m) => (
                    <div key={m.id} className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
                      <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[9px] flex items-center justify-center">
                        {m.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Members Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">All Workspace Members</h2>
        <div className="saas-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Workspace Role</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {u.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${roleBadges[u.role] || roleBadges.ROLE_DEVELOPER}`}>
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {u.title || 'Staff'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {u.department || 'Engineering'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
