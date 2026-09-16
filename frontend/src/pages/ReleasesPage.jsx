import React, { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { releaseService } from '../services/release.service';
import { Flag, Plus, Calendar, CheckCircle, Clock, Trash2, Layers } from 'lucide-react';

export const ReleasesPage = () => {
  const { selectedProduct } = useProduct();
  const { hasRole } = useAuth();
  const toast = useToast();

  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const [version, setVersion] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('PLANNED');
  const [submitting, setSubmitting] = useState(false);

  const canManage = hasRole('ADMIN', 'PRODUCT_MANAGER');

  const loadReleases = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);
      const data = await releaseService.getReleasesByProduct(selectedProduct.id);
      setReleases(data);
    } catch (err) {
      console.error("Releases load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReleases();
  }, [selectedProduct]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!version.trim() || !name.trim()) {
      toast.error("Version and Name are required");
      return;
    }

    setSubmitting(true);
    try {
      await releaseService.createRelease({
        productId: selectedProduct.id,
        version,
        name,
        description,
        targetDate,
        status,
      });
      toast.success(`Release ${version} created!`);
      setVersion('');
      setName('');
      setDescription('');
      setShowCreate(false);
      loadReleases();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create release");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this release track?")) return;
    try {
      await releaseService.deleteRelease(id);
      toast.success("Release deleted");
      loadReleases();
    } catch (err) {
      toast.error("Failed to delete release");
    }
  };

  const statusColors = {
    RELEASED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ACTIVE: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    PLANNED: 'bg-blue-50 text-blue-700 border-blue-200',
    DELAYED: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Product Releases & Milestones
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track version deliverables, target rollout dates, and feature completion for {selectedProduct?.name}
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{showCreate ? 'Close Form' : 'New Release'}</span>
          </button>
        )}
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="saas-card p-6 border-2 border-indigo-200 bg-indigo-50/10 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Schedule Product Release</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Version *</label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. v1.2.0"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Release Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Instant Payouts & Webhooks Release"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Scope</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of customer-facing changes and bug fixes"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Ship Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="PLANNED">PLANNED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="RELEASED">RELEASED</option>
                <option value="DELAYED">DELAYED</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
            >
              {submitting ? 'Creating...' : 'Create Release'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading releases...</div>
      ) : releases.length === 0 ? (
        <div className="p-12 saas-card text-center">
          <Flag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No releases scheduled</h3>
          <p className="text-xs text-slate-500 mt-1">Create a target milestone version for this product</p>
        </div>
      ) : (
        <div className="space-y-4">
          {releases.map((release) => {
            const completionRate = release.storyCount > 0
              ? Math.round((release.completedStoryCount / release.storyCount) * 100)
              : 0;

            return (
              <div key={release.id} className="saas-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {release.version}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 truncate">{release.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[release.status]}`}>
                      {release.status}
                    </span>
                  </div>

                  {release.description && (
                    <p className="text-xs text-slate-600 mb-3">{release.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target: <strong className="text-slate-800">{release.targetDate || 'TBD'}</strong></span>
                    </div>
                    <div>
                      <span>{release.completedStoryCount || 0} of {release.storyCount || 0} stories shipped ({completionRate}%)</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden mt-3 border border-slate-200">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {canManage && (
                  <div>
                    <button
                      onClick={() => handleDelete(release.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition"
                      title="Delete Release"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
