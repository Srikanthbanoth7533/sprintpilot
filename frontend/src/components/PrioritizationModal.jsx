import React, { useState } from 'react';
import { X, SlidersHorizontal, Info, Calculator, Check } from 'lucide-react';

export const PrioritizationModal = ({ story, isOpen, onClose, onSave }) => {
  if (!isOpen || !story) return null;

  const [businessValue, setBusinessValue] = useState(story.businessValue || 5);
  const [customerImpact, setCustomerImpact] = useState(story.customerImpact || 5);
  const [urgency, setUrgency] = useState(story.urgency || 5);
  const [complexity, setComplexity] = useState(story.complexity || 5);
  const [submitting, setSubmitting] = useState(false);

  // Formula: (BV * 1.5) + (CI * 1.2) + (U * 1.0) - (Complexity * 0.8)
  const calculateScore = (bv, ci, u, comp) => {
    const raw = (bv * 1.5) + (ci * 1.2) + (u * 1.0) - (comp * 0.8);
    return Math.round(raw * 10) / 10;
  };

  const currentScore = calculateScore(businessValue, customerImpact, urgency, complexity);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(story.id, {
        businessValue,
        customerImpact,
        urgency,
        complexity,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Backlog Prioritization Model</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">{story.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Live Score Output Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/60 border border-indigo-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-indigo-900 uppercase tracking-wider">Calculated Priority Score</p>
              <p className="text-[11px] text-indigo-700/80 mt-0.5">
                (BV × 1.5) + (CI × 1.2) + (U × 1.0) - (Complexity × 0.8)
              </p>
            </div>
            <div className="text-3xl font-black text-indigo-600">
              {currentScore}
            </div>
          </div>

          {/* Dimension Sliders */}
          <div className="space-y-4">
            {/* Business Value */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  Business Value <span className="text-[10px] text-indigo-600 font-bold">(Weight: 1.5x)</span>
                </span>
                <span className="text-indigo-600 font-bold">{businessValue}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={businessValue}
                onChange={(e) => setBusinessValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Low ROI (1)</span>
                <span>Revenue/Strategic (10)</span>
              </div>
            </div>

            {/* Customer Impact */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  Customer Impact <span className="text-[10px] text-indigo-600 font-bold">(Weight: 1.2x)</span>
                </span>
                <span className="text-indigo-600 font-bold">{customerImpact}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={customerImpact}
                onChange={(e) => setCustomerImpact(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Niche impact (1)</span>
                <span>Entire userbase (10)</span>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  Urgency / Timeliness <span className="text-[10px] text-indigo-600 font-bold">(Weight: 1.0x)</span>
                </span>
                <span className="text-indigo-600 font-bold">{urgency}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={urgency}
                onChange={(e) => setUrgency(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Can wait (1)</span>
                <span>Immediate deadline (10)</span>
              </div>
            </div>

            {/* Complexity */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  Technical Complexity <span className="text-[10px] text-rose-600 font-bold">(Penalty: -0.8x)</span>
                </span>
                <span className="text-rose-600 font-bold">{complexity}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={complexity}
                onChange={(e) => setComplexity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Simple tweak (1)</span>
                <span>High architectural risk (10)</span>
              </div>
            </div>
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
              <Check className="w-3.5 h-3.5" />
              <span>{submitting ? 'Updating...' : 'Save Prioritization'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
