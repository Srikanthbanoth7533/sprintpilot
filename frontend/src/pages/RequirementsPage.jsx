import React, { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { requirementService } from '../services/requirement.service';
import { FileText, Plus, CheckCircle, Clock, Trash2, Tag, Layers } from 'lucide-react';

export const RequirementsPage = () => {
  const { selectedProduct } = useProduct();
  const { hasRole } = useAuth();
  const toast = useToast();

  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [businessValue, setBusinessValue] = useState(8);
  const [priority, setPriority] = useState('HIGH');
  const [status, setStatus] = useState('DRAFT');
  const [stakeholder, setStakeholder] = useState('');
  const [targetRelease, setTargetRelease] = useState('v1.0.0');
  const [submitting, setSubmitting] = useState(false);

  const canEdit = hasRole('ADMIN', 'PRODUCT_MANAGER');

  const loadRequirements = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);
      const data = await requirementService.getRequirementsByProduct(selectedProduct.id);
      setRequirements(data);
    } catch (err) {
      console.error("Requirements load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequirements();
  }, [selectedProduct]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Requirement title is required");
      return;
    }

    setSubmitting(true);
    try {
      await requirementService.createRequirement({
        productId: selectedProduct.id,
        title,
        description,
        businessValue: Number(businessValue),
        priority,
        status,
        stakeholder,
        targetRelease,
      });
      toast.success("Product Requirement added!");
      setTitle('');
      setDescription('');
      setShowCreateForm(false);
      loadRequirements();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create requirement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete requirement?")) return;
    try {
      await requirementService.deleteRequirement(id);
      toast.success("Requirement deleted");
      loadRequirements();
    } catch (err) {
      toast.error("Failed to delete requirement");
    }
  };

  const statusColors = {
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    IN_DEVELOPMENT: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    DELIVERED: 'bg-teal-50 text-teal-700 border-teal-200',
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Product Requirements Document (PRD)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Define high-level business objectives and customer specifications for {selectedProduct?.name}
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{showCreateForm ? 'Close Form' : 'New Requirement'}</span>
          </button>
        )}
      </div>

      {/* Inline Create Form */}
      {showCreateForm && (
        <form onSubmit={handleCreate} className="saas-card p-6 border-2 border-indigo-200 bg-indigo-50/10 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Add Business Requirement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Requirement Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Automated recurring merchant settlement engine"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:border-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stakeholder / Sponsor</label>
              <input
                type="text"
                value={stakeholder}
                onChange={(e) => setStakeholder(e.target.value)}
                placeholder="e.g. Finance & Compliance"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What core business problem does this solve?"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:border-indigo-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Business Value (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={businessValue}
                onChange={(e) => setBusinessValue(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEW">REVIEW</option>
                <option value="APPROVED">APPROVED</option>
                <option value="IN_DEVELOPMENT">IN DEVELOPMENT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Release</label>
              <input
                type="text"
                value={targetRelease}
                onChange={(e) => setTargetRelease(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
            >
              {submitting ? 'Saving...' : 'Save Requirement'}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="saas-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Title & Description</th>
              <th className="py-3 px-4 w-28">Status</th>
              <th className="py-3 px-4 w-24">Priority</th>
              <th className="py-3 px-4 w-28">Business Value</th>
              <th className="py-3 px-4 w-32">Stakeholder</th>
              <th className="py-3 px-4 w-24">Release</th>
              {canEdit && <th className="py-3 px-4 w-16 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">Loading requirements...</td>
              </tr>
            ) : requirements.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">No requirements defined yet</td>
              </tr>
            ) : (
              requirements.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 leading-snug">{req.title}</div>
                    {req.description && (
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{req.description}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[req.status] || statusColors.DRAFT}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {req.priority}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {req.businessValue} / 10
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {req.stakeholder || 'Unspecified'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {req.targetRelease || 'N/A'}
                  </td>
                  {canEdit && (
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
