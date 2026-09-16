import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { teamService } from '../services/team.service';
import { sprintService } from '../services/sprint.service';
import { useProduct } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { backlogService } from '../services/backlog.service';

export const CreateStoryModal = ({ isOpen, onClose, onCreated, initialData }) => {
  if (!isOpen) return null;

  const { selectedProduct } = useProduct();
  const toast = useToast();

  const [title, setTitle] = useState(initialData?.title || '');
  const [asA, setAsA] = useState(initialData?.asA || 'User');
  const [iWant, setIWant] = useState(initialData?.iWant || '');
  const [soThat, setSoThat] = useState(initialData?.soThat || '');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(
    Array.isArray(initialData?.acceptanceCriteria)
      ? initialData.acceptanceCriteria.join('\n')
      : initialData?.acceptanceCriteria || ''
  );
  const [priority, setPriority] = useState(initialData?.suggestedPriority || 'MEDIUM');
  const [storyPoints, setStoryPoints] = useState(initialData?.suggestedStoryPoints || 3);
  const [labels, setLabels] = useState(
    Array.isArray(initialData?.suggestedLabels)
      ? initialData.suggestedLabels.join(', ')
      : initialData?.labels || 'frontend, backend'
  );
  const [assigneeId, setAssigneeId] = useState('');
  const [sprintId, setSprintId] = useState('');
  const [users, setUsers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const usersData = await teamService.getUsers();
        setUsers(usersData);
        if (selectedProduct) {
          const sprintsData = await sprintService.getSprintsByProduct(selectedProduct.id);
          setSprints(sprintsData);
        }
      } catch (err) {
        console.error("Error loading modal metadata", err);
      }
    };
    loadMetadata();
  }, [selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Story title is required");
      return;
    }
    if (!selectedProduct) {
      toast.error("Please select an active product first");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        productId: selectedProduct.id,
        title,
        asA,
        iWant,
        soThat,
        acceptanceCriteria,
        priority,
        storyPoints: Number(storyPoints),
        labels,
        assigneeId: assigneeId ? Number(assigneeId) : null,
        sprintId: sprintId ? Number(sprintId) : null,
        businessValue: 5,
        customerImpact: 5,
        urgency: 5,
        complexity: 5,
      };

      await backlogService.createStory(payload);
      toast.success("User story created successfully!");
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create story");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create New User Story</h3>
              <p className="text-[11px] text-slate-500">Add feature requirement to {selectedProduct?.name || 'backlog'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(85vh-8rem)] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Story Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement assignment deadline push notifications"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
            />
          </div>

          {/* Persona Syntax Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">As a</label>
              <input
                type="text"
                value={asA}
                onChange={(e) => setAsA(e.target.value)}
                placeholder="Student / Admin"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:border-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">I want to</label>
              <input
                type="text"
                value={iWant}
                onChange={(e) => setIWant(e.target.value)}
                placeholder="receive deadline reminders"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:border-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">So that</label>
              <input
                type="text"
                value={soThat}
                onChange={(e) => setSoThat(e.target.value)}
                placeholder="I don't miss submissions"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs bg-white focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Acceptance Criteria (Gherkin / Bullets)</label>
            <textarea
              rows={4}
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              placeholder="Given an authenticated user, when ... then ..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
            />
          </div>

          {/* Priority & Story Points & Sprint & Assignee Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:border-indigo-600 outline-none"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Story Points</label>
              <select
                value={storyPoints}
                onChange={(e) => setStoryPoints(e.target.value)}
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:border-indigo-600 outline-none"
              >
                {[1, 2, 3, 5, 8, 13, 21].map((pt) => (
                  <option key={pt} value={pt}>{pt} points</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sprint</label>
              <select
                value={sprintId}
                onChange={(e) => setSprintId(e.target.value)}
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:border-indigo-600 outline-none"
              >
                <option value="">None (Backlog)</option>
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:border-indigo-600 outline-none"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Labels (comma-separated)</label>
            <input
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="notifications, payments, frontend"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs focus:border-indigo-600 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{submitting ? 'Creating...' : 'Create User Story'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
