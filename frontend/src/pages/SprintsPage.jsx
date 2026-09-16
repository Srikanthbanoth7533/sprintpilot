import React, { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sprintService } from '../services/sprint.service';
import { CreateSprintModal } from '../components/CreateSprintModal';
import {
  FastForward,
  Plus,
  Play,
  CheckCircle2,
  Calendar,
  Clock,
  Trash2,
  Flame,
  ArrowRight
} from 'lucide-react';

export const SprintsPage = () => {
  const { selectedProduct } = useProduct();
  const { hasRole } = useAuth();
  const toast = useToast();

  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const canManage = hasRole('ADMIN', 'PRODUCT_MANAGER');

  const loadSprints = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);
      const data = await sprintService.getSprintsByProduct(selectedProduct.id);
      setSprints(data);
    } catch (err) {
      console.error("Sprints load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSprints();
  }, [selectedProduct]);

  const handleStartSprint = async (id, name) => {
    try {
      await sprintService.startSprint(id);
      toast.success(`Sprint "${name}" is now ACTIVE!`);
      loadSprints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start sprint");
    }
  };

  const handleCompleteSprint = async (id, name) => {
    if (!window.confirm(`Complete sprint "${name}"?`)) return;
    try {
      await sprintService.completeSprint(id);
      toast.success(`Sprint "${name}" COMPLETED!`);
      loadSprints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete sprint");
    }
  };

  const handleDeleteSprint = async (id) => {
    if (!window.confirm("Delete sprint? Unfinished stories will return to product backlog.")) return;
    try {
      await sprintService.deleteSprint(id);
      toast.success("Sprint deleted");
      loadSprints();
    } catch (err) {
      toast.error("Failed to delete sprint");
    }
  };

  const statusColors = {
    ACTIVE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    PLANNING: 'bg-blue-100 text-blue-800 border-blue-200',
    COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sprint Cadence & Iterations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Plan, execute, and review bi-weekly engineering delivery cycles
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Sprint</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading sprints...</div>
      ) : sprints.length === 0 ? (
        <div className="p-12 saas-card text-center">
          <FastForward className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No sprints created yet</h3>
          <p className="text-xs text-slate-500 mt-1">Start by creating your first sprint iteration</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sprints.map((sprint) => (
            <div key={sprint.id} className="saas-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColors[sprint.status]}`}>
                    {sprint.status}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 truncate">{sprint.name}</h3>
                </div>

                {sprint.goal && (
                  <p className="text-xs text-slate-600 italic mb-3">"{sprint.goal}"</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sprint.startDate || 'TBD'} → {sprint.endDate || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-bold text-slate-800">{sprint.completedPoints} / {sprint.totalPoints} points</span>
                  </div>
                  <div>
                    <span>{sprint.completedStories || 0} of {sprint.totalStories || 0} stories closed</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden mt-3 border border-slate-200">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${sprint.completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {sprint.status === 'PLANNING' && canManage && (
                  <button
                    onClick={() => handleStartSprint(sprint.id, sprint.name)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Sprint</span>
                  </button>
                )}

                {sprint.status === 'ACTIVE' && canManage && (
                  <button
                    onClick={() => handleCompleteSprint(sprint.id, sprint.name)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Sprint</span>
                  </button>
                )}

                <a
                  href="/board"
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                >
                  <span>View Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                {canManage && (
                  <button
                    onClick={() => handleDeleteSprint(sprint.id)}
                    title="Delete Sprint"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateSprintModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={loadSprints}
      />
    </div>
  );
};
