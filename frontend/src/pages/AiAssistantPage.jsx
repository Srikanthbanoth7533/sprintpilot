import React, { useState } from 'react';
import { aiService } from '../services/ai.service';
import { useProduct } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { CreateStoryModal } from '../components/CreateStoryModal';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Plus,
  ArrowRight,
  Lightbulb,
  Cpu,
  Flame,
  Check
} from 'lucide-react';

export const AiAssistantPage = () => {
  const { selectedProduct } = useProduct();
  const toast = useToast();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const samplePrompts = [
    "We need a feature that allows students to receive notifications when their assignment deadline is approaching.",
    "We need Stripe and UPI checkout integration with instant refunds and webhooks for failed charges.",
    "Export sprint retrospectives and engineering velocity charts to branded PDF and CSV reports.",
    "Add multi-attribute search and tag filtering to the product backlog view."
  ];

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a feature description");
      return;
    }

    setLoading(true);
    try {
      const data = await aiService.generateStory(prompt, selectedProduct?.id);
      setResult(data);
      toast.success("User story synthesized!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white rounded-lg shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            AI Product Management Assistant
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Transform unstructured product feature ideas into structured Agile user stories with Gherkin acceptance criteria, estimated points, and edge cases.
        </p>
      </div>

      {/* Input Box */}
      <div className="saas-card p-6 border-indigo-100 shadow-md">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Enter Feature Request or Stakeholder Requirement</span>
              <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Offline Heuristic Engine + LLM fallback</span>
              </span>
            </label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. We need a feature that allows students to receive notifications when their assignment deadline is approaching..."
              className="w-full p-3.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none leading-relaxed transition"
            />
          </div>

          {/* Sample Prompts */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Or click a sample requirement to test:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(s)}
                  className="text-left text-[11px] px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg text-slate-700 hover:text-indigo-700 transition"
                >
                  "{s.slice(0, 65)}..."
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Story...' : 'Generate User Story'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Results Card */}
      {result && (
        <div className="saas-card p-8 space-y-6 border-indigo-200 bg-gradient-to-b from-white via-indigo-50/10 to-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Top Result Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Generated via {result.generationSource}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1.5">{result.title}</h2>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/30 transition flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Product Backlog</span>
            </button>
          </div>

          {/* Formatted User Story Persona */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-1">Standard Agile User Story</p>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              "{result.userStory}"
            </p>
          </div>

          {/* Objective & Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Business Objective</p>
              <p className="text-xs text-slate-700 leading-relaxed">{result.businessObjective}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Suggested Priority:</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200">
                  {result.suggestedPriority}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Story Points:</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-200">
                  {result.suggestedStoryPoints} points
                </span>
              </div>
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Acceptance Criteria (Gherkin Scenarios)</span>
            </h3>
            <div className="space-y-2">
              {result.acceptanceCriteria.map((ac, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 leading-relaxed">
                  <span className="text-indigo-600 font-bold mr-2">AC {idx + 1}:</span>
                  <span>{ac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Edge Cases & Labels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Identified Edge Cases</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 bg-amber-50/40 p-3 rounded-lg border border-amber-100">
                {result.edgeCases.map((ec, idx) => (
                  <li key={idx}>{ec}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-slate-500" />
                <span>Suggested Classification Labels</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                {result.suggestedLabels.map((lbl) => (
                  <span key={lbl} className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md">
                    #{lbl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {result && (
        <CreateStoryModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          initialData={result}
        />
      )}
    </div>
  );
};
