import React, { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sprintService } from '../services/sprint.service';
import { backlogService } from '../services/backlog.service';
import { KanbanColumn } from '../components/KanbanColumn';
import { PrioritizationModal } from '../components/PrioritizationModal';
import { BlockerModal } from '../components/BlockerModal';
import { CreateStoryModal } from '../components/CreateStoryModal';
import {
  Kanban,
  FastForward,
  Plus,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check
} from 'lucide-react';

export const BoardPage = () => {
  const { selectedProduct } = useProduct();
  const { hasRole } = useAuth();
  const toast = useToast();

  const [activeSprint, setActiveSprint] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoryForPrioritize, setSelectedStoryForPrioritize] = useState(null);
  const [selectedStoryForBlocker, setSelectedStoryForBlocker] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const canManageSprint = hasRole('ADMIN', 'PRODUCT_MANAGER');

  const loadSprintData = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);
      const sprint = await sprintService.getActiveSprint(selectedProduct.id);
      setActiveSprint(sprint);

      if (sprint) {
        const storiesData = await backlogService.getStoriesBySprint(sprint.id);
        setStories(storiesData);
      } else {
        // If no active sprint, load all product stories for global board
        const allStories = await backlogService.getBacklogByProduct(selectedProduct.id);
        setStories(allStories);
      }
    } catch (err) {
      console.error("Board load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSprintData();
  }, [selectedProduct]);

  const handleStatusChange = async (storyId, newStatus) => {
    try {
      await backlogService.updateStatus(storyId, newStatus);
      toast.success(`Story moved to ${newStatus}`);
      loadSprintData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update story status");
    }
  };

  const handleSavePrioritization = async (storyId, factors) => {
    try {
      await backlogService.updatePrioritization(storyId, factors);
      toast.success("Prioritization updated");
      loadSprintData();
    } catch (err) {
      toast.error("Failed to update prioritization");
    }
  };

  const handleCompleteSprint = async () => {
    if (!activeSprint) return;
    if (!window.confirm(`Complete ${activeSprint.name}? Finished stories will remain closed, uncompleted items will stay in backlog.`)) return;
    try {
      await sprintService.completeSprint(activeSprint.id);
      toast.success(`Sprint "${activeSprint.name}" completed!`);
      loadSprintData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete sprint");
    }
  };

  const columns = [
    { title: 'To Do', status: 'TODO' },
    { title: 'In Progress', status: 'IN_PROGRESS' },
    { title: 'In Review', status: 'IN_REVIEW' },
    { title: 'Done', status: 'DONE' },
    { title: 'Blocked', status: 'BLOCKED' },
  ];

  return (
    <div className="p-8 max-w-full space-y-6">
      {/* Board Header & Sprint Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Kanban className="w-5 h-5 text-indigo-600" />
              <span>Sprint Kanban Board</span>
            </h1>
            {activeSprint ? (
              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE: {activeSprint.name}
              </span>
            ) : (
              <span className="badge bg-amber-50 text-amber-700 border border-amber-200">
                PRODUCT ROADMAP VIEW
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Drag & advance cards to update task status in real time through Spring Boot backend
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSprint && canManageSprint && (
            <button
              onClick={handleCompleteSprint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm shadow-emerald-600/20"
            >
              <Check className="w-4 h-4" />
              <span>Complete Sprint</span>
            </button>
          )}

          {canManageSprint && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Story</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Sprint Progress Banner */}
      {activeSprint && (
        <div className="saas-card p-4 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {activeSprint.completedPoints} of {activeSprint.totalPoints} points delivered ({activeSprint.completionPercentage}%)
              </p>
              <p className="text-[11px] text-slate-500">
                Target delivery date: {activeSprint.endDate || 'N/A'}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-72 bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, activeSprint.completionPercentage))}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Horizontal Scrollable Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
        {columns.map((col) => {
          const colStories = stories.filter((s) => s.status === col.status);
          return (
            <KanbanColumn
              key={col.status}
              title={col.title}
              status={col.status}
              stories={colStories}
              onStatusChange={handleStatusChange}
              onOpenPrioritization={(story) => setSelectedStoryForPrioritize(story)}
              onOpenBlocker={(story) => setSelectedStoryForBlocker(story)}
            />
          );
        })}
      </div>

      <PrioritizationModal
        story={selectedStoryForPrioritize}
        isOpen={!!selectedStoryForPrioritize}
        onClose={() => setSelectedStoryForPrioritize(null)}
        onSave={handleSavePrioritization}
      />

      <BlockerModal
        story={selectedStoryForBlocker}
        isOpen={!!selectedStoryForBlocker}
        onClose={() => setSelectedStoryForBlocker(null)}
        onBlockerReported={loadSprintData}
      />

      <CreateStoryModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={loadSprintData}
      />
    </div>
  );
};
