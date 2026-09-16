import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { blockerService } from '../services/blocker.service';

export const BlockerModal = ({ story, isOpen, onClose, onBlockerReported }) => {
  if (!isOpen || !story) return null;

  const toast = useToast();
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for the blocker");
      return;
    }

    setSubmitting(true);
    try {
      await blockerService.createBlocker(story.id, reason);
      toast.success("Story marked as BLOCKED");
      if (onBlockerReported) onBlockerReported();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to flag blocker");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Flag Story Blocker</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">{story.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Flagging this story as blocked will update its Kanban column to <strong>BLOCKED</strong> and alert squad leads on the dashboard.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Blocker Reason / Dependency *</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Awaiting external sandbox credentials or schema confirmation..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none"
            />
          </div>

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
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm shadow-rose-600/30 transition"
            >
              {submitting ? 'Submitting...' : 'Mark as Blocked'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
