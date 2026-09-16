import React, { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import { analyticsService } from '../services/analytics.service';
import { blockerService } from '../services/blocker.service';
import { MetricCard } from '../components/MetricCard';
import { useToast } from '../context/ToastContext';
import {
  FastForward,
  ListTodo,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Kanban,
  Flag,
  Check
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

export const DashboardPage = () => {
  const { selectedProduct } = useProduct();
  const toast = useToast();

  const [metrics, setMetrics] = useState(null);
  const [activeBlockers, setActiveBlockers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getDashboardMetrics(selectedProduct?.id);
      setMetrics(data);
      const blockers = await blockerService.getActiveBlockers();
      setActiveBlockers(blockers);
    } catch (err) {
      console.error("Dashboard metrics load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [selectedProduct]);

  const handleResolveBlocker = async (id) => {
    try {
      await blockerService.resolveBlocker(id);
      toast.success("Blocker resolved!");
      loadDashboard();
    } catch (err) {
      toast.error("Failed to resolve blocker");
    }
  };

  if (loading && !metrics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Computing product and sprint metrics...</p>
        </div>
      </div>
    );
  }

  const activeSprint = metrics?.activeSprint;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Product & Engineering Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active workspace: <strong className="text-indigo-600 font-bold">{selectedProduct?.name || 'All Products'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/board"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-600/30 transition"
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Open Sprint Board</span>
          </a>
          <a
            href="/ai-assistant"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Story Generator</span>
          </a>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Sprint Status"
          value={activeSprint ? `${activeSprint.completionPercentage}%` : 'Planning'}
          subtitle={activeSprint ? activeSprint.name : 'No active sprint running'}
          icon={FastForward}
          color="indigo"
          badge={activeSprint ? `${activeSprint.completedPoints}/${activeSprint.totalPoints} pts` : null}
        />
        <MetricCard
          title="Product Backlog"
          value={metrics?.totalBacklogStories ?? 0}
          subtitle="Groomed & scored stories"
          icon={ListTodo}
          color="blue"
        />
        <MetricCard
          title="Active Blockers"
          value={metrics?.activeBlockersCount ?? 0}
          subtitle="Dependencies flagged"
          icon={AlertTriangle}
          color={metrics?.activeBlockersCount > 0 ? 'rose' : 'emerald'}
          badge={metrics?.activeBlockersCount > 0 ? 'Needs Attention' : 'Clear'}
        />
        <MetricCard
          title="Team Velocity"
          value={`${metrics?.teamVelocity ?? 18} pts`}
          subtitle="Average completed pts / sprint"
          icon={Flame}
          color="amber"
          badge="Scrum Baseline"
        />
      </div>

      {/* Active Sprint Delivery Card */}
      {activeSprint && (
        <div className="saas-card p-6 bg-gradient-to-r from-white via-indigo-50/20 to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge bg-indigo-100 text-indigo-800 border border-indigo-200">ACTIVE SPRINT</span>
                <h2 className="text-base font-bold text-slate-900">{activeSprint.name}</h2>
              </div>
              <p className="text-xs text-slate-600 mt-1 italic max-w-xl">
                Goal: "{activeSprint.goal || 'Ship core milestone features'}"
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Points Burned</p>
                <p className="text-lg font-black text-slate-900">
                  {activeSprint.completedPoints} / {activeSprint.totalPoints} pts
                </p>
              </div>
              <a
                href="/board"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
              >
                <span>Board</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, activeSprint.completionPercentage))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-medium mt-1.5">
            <span>Started: {activeSprint.startDate || 'N/A'}</span>
            <span>Target End: {activeSprint.endDate || 'N/A'}</span>
          </div>
        </div>
      )}

      {/* Two Column Grid: Velocity Analytics & Active Blockers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sprint Velocity Trend Chart */}
        <div className="lg:col-span-2 saas-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Sprint Delivery Velocity</h2>
              <p className="text-xs text-slate-500">Planned vs. completed story points across sprint cycles</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Live DB Telemetry
            </span>
          </div>

          <div className="h-64 w-full">
            {metrics?.velocityTrend && metrics.velocityTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.velocityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="sprintName" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="plannedPoints" name="Planned Points" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completedPoints" name="Completed Points" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No completed sprints recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Active Blockers & Squad Dependencies */}
        <div className="saas-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Active Blockers</span>
              </h2>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {activeBlockers.length} open
              </span>
            </div>

            {activeBlockers.length === 0 ? (
              <div className="p-6 text-center bg-emerald-50/50 rounded-xl border border-emerald-100 my-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-emerald-900">Sprint Path Clear</p>
                <p className="text-[11px] text-emerald-700/80 mt-0.5">No unresolved blockers or dependencies flagged.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {activeBlockers.map((b) => (
                  <div key={b.id} className="p-3 bg-rose-50/50 border border-rose-200/80 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-rose-900 line-clamp-1">{b.storyTitle}</p>
                      <button
                        onClick={() => handleResolveBlocker(b.id)}
                        className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                      >
                        <Check className="w-3 h-3" />
                        <span>Resolve</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600">{b.reason}</p>
                    <p className="text-[10px] text-slate-400">Reported by {b.reportedBy?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Need to inspect tasks?</span>
            <a href="/board" className="text-indigo-600 font-bold hover:underline">
              View Board →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
