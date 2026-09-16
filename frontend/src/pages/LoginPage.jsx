import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Compass, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Code, Eye } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { label: 'Admin', role: 'ROLE_ADMIN', email: 'admin@sprintpilot.demo', pass: 'DemoPassword123!', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { label: 'Product Manager', role: 'ROLE_PRODUCT_MANAGER', email: 'product@sprintpilot.demo', pass: 'DemoPassword123!', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'Developer', role: 'ROLE_DEVELOPER', email: 'developer@sprintpilot.demo', pass: 'DemoPassword123!', icon: Code, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { label: 'Viewer', role: 'ROLE_VIEWER', email: 'viewer@sprintpilot.demo', pass: 'DemoPassword123!', icon: Eye, color: 'text-slate-600 bg-slate-100 border-slate-200' },
  ];

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back to SprintPilot!");
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    login(demoEmail, demoPass)
      .then(() => {
        toast.success("Logged in via Demo Persona!");
        window.location.href = '/dashboard';
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Login failed");
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign in to SprintPilot
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          AI-Assisted Product & Engineering Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="saas-card p-8 shadow-xl">
          {/* Quick 1-Click Demo Personas */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Quick Demo Personas</span>
              <span className="text-[10px] text-indigo-600 font-semibold lowercase">1-click test</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((demo) => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.label}
                    type="button"
                    onClick={() => handleQuickLogin(demo.email, demo.pass)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs font-semibold transition hover:scale-[1.02] ${demo.color}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div className="truncate">
                      <p className="leading-tight truncate">{demo.label}</p>
                      <p className="text-[10px] opacity-75 font-normal truncate">{demo.email.split('@')[0]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white px-3 text-slate-400 font-medium">Or enter credentials</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sprintpilot.demo"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign in to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <a href="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
