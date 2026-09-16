import React, { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { backlogService } from '../services/backlog.service';
import { sprintService } from '../services/sprint.service';
import { PrioritizationModal } from '../components/PrioritizationModal';
import { CreateStoryModal } from '../components/CreateStoryModal';
import {
  ListTodo,
  Plus,
  SlidersHorizontal,
  Search,
  Filter,
  Calculator,
  FastForward,
  Trash2,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

export const BacklogPage = () => {
  const { selectedProduct } = useProduct();
  const { hasRole } = useAuth();
  const toast = useToast();

  const [stories, setStories] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedStoryForPrioritize, setSelectedStoryForPrioritize] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const canEdit = hasRole('ADMIN', 'PRODUCT_MANAGER');

  const loadBacklog = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);
      const [storiesData, sprintsData] = await Promise.all([
        backlogService.getBacklogByProduct(selectedProduct.id),
        sprintService.getSprintsByProduct(selectedProduct.id)
      ]);
      setStories(storiesData);
      setSprints(sprintsData);
    } catch (err) {
      console.error("Backlog load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBacklog();
  }, [selectedProduct]);

  const handleSavePrioritization = async (storyId, factors) => {
    try {
      await backlogService.updatePrioritization(storyId, factors);
      toast.success("Prioritization updated! Backlog reordered.");
      loadBacklog();
    } catch (err) {
      toast.error("Failed to update prioritization");
    }
  };

  const handleAssignSprint = async (storyId, sprintId) => {
    try {
      if (sprintId) {
        await backlogService.assignSprint(storyId, sprintId);
        toast.success("Story assigned to sprint");
      } else {
        await backlogService.removeFromSprint(storyId);
        toast.success("Story moved back to backlog");
      }
      loadBacklog();
    } catch (err) {
      toast.error("Failed to update sprint assignment");
    }
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user story?")) return;
    try {
      await backlogService.deleteStory(id);
      toast.success("Story deleted");
      loadBacklog();
    } catch (err) {
      toast.error("Failed to delete story");
    }
  };

  const filteredStories = stories.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.labels && s.labels.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'ALL' || s.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const priorityColors = {
    CRITICAL: 'bg-rose-100 text-rose-800 border-rose-200',
    HIGH: 'bg-amber-100 text-amber-800 border-amber-200',
    MEDIUM: 'bg-blue-100 text-blue-800 border-blue-200',
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Product Backlog</span>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              {stories.length} stories
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by Priority Score = (Business Value × 1.5) + (Customer Impact × 1.2) + (Urgency × 1.0) - (Complexity × 0.8)
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create User Story</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories by title or tag..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-indigo-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-medium outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Backlog Table */}
      <div className="saas-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">User Story</th>
                <th className="py-3 px-4 w-28">Priority</th>
                <th className="py-3 px-4 w-24">Points</th>
                <th className="py-3 px-4 w-36">Priority Score</th>
                <th className="py-3 px-4 w-40">Assigned Sprint</th>
                <th className="py-3 px-4 w-32">Assignee</th>
                <th className="py-3 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">Loading backlog stories...</td>
                </tr>
              ) : filteredStories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">No stories match your search or filter</td>
                </tr>
              ) : (
                filteredStories.map((story, index) => (
                  <tr key={story.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-center font-bold text-slate-400">
                      #{index + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 leading-snug">{story.title}</div>
                      {story.asA && story.iWant && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5">
                          As a {story.asA}, I want {story.iWant}
                        </div>
                      )}
                      {story.labels && (
                        <div className="flex items-center gap-1 mt-1">
                          {story.labels.split(',').map((tag) => (
                            <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${priorityColors[story.priority] || priorityColors.MEDIUM}`}>
                        {story.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-700">
                      {story.storyPoints} pts
                    </td>

                    {/* Priority Score Breakdown */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedStoryForPrioritize(story)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 text-indigo-700 transition"
                        title="Click to adjust prioritization sliders"
                      >
                        <span className="font-black text-xs">{story.priorityScore}</span>
                        <SlidersHorizontal className="w-3 h-3 text-indigo-500" />
                      </button>
                    </td>

                    {/* Sprint Assignment Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={story.sprintId || ''}
                        disabled={!canEdit}
                        onChange={(e) => handleAssignSprint(story.id, e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white text-slate-800 focus:border-indigo-600 outline-none"
                      >
                        <option value="">Backlog</option>
                        {sprints.map((sp) => (
                          <option key={sp.id} value={sp.id}>
                            {sp.name} ({sp.status})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      {story.assignee ? (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                            {story.assignee.name.charAt(0)}
                          </div>
                          <span className="truncate">{story.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {canEdit && (
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="Delete story"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PrioritizationModal
        story={selectedStoryForPrioritize}
        isOpen={!!selectedStoryForPrioritize}
        onClose={() => setSelectedStoryForPrioritize(null)}
        onSave={handleSavePrioritization}
      />

      <CreateStoryModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={loadBacklog}
      />
    </div>
  );
};
