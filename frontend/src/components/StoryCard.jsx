import React from 'react';
import {
  SlidersHorizontal,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  User as UserIcon,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StoryCard = ({
  story,
  onStatusChange,
  onOpenPrioritization,
  onOpenBlocker,
  columnType
}) => {
  const { hasRole } = useAuth();
  const canEdit = hasRole('ADMIN', 'PRODUCT_MANAGER', 'DEVELOPER');
  const canPrioritize = hasRole('ADMIN', 'PRODUCT_MANAGER');

  const priorityColors = {
    CRITICAL: 'bg-rose-100 text-rose-800 border-rose-200',
    HIGH: 'bg-amber-100 text-amber-800 border-amber-200',
    MEDIUM: 'bg-blue-100 text-blue-800 border-blue-200',
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const statusOrder = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'];
  const currentIndex = statusOrder.indexOf(story.status);

  const handleNext = () => {
    if (currentIndex < statusOrder.length - 2) { // don't cycle into BLOCKED
      onStatusChange(story.id, statusOrder[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && story.status !== 'BLOCKED') {
      onStatusChange(story.id, statusOrder[currentIndex - 1]);
    }
  };

  return (
    <div className={`saas-card saas-card-hover p-4 mb-3 border transition-all ${
      story.status === 'BLOCKED' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
    }`}>
      {/* Top badges: Priority & Story Points */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${priorityColors[story.priority] || priorityColors.MEDIUM}`}>
            {story.priority}
          </span>
          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
            {story.storyPoints} pts
          </span>
        </div>

        {/* Priority Score badge */}
        <div className="flex items-center gap-1">
          <span
            title="Objective Priority Score = (BV*1.5 + CI*1.2 + U*1.0 - C*0.8)"
            className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/80 cursor-help"
          >
            Score: {story.priorityScore}
          </span>
        </div>
      </div>

      {/* Story Title */}
      <h3 className="text-xs font-bold text-slate-900 leading-snug mb-2">
        {story.title}
      </h3>

      {/* User Story persona syntax preview if present */}
      {story.asA && story.iWant && (
        <p className="text-[11px] text-slate-500 line-clamp-2 italic mb-3 bg-slate-50 p-1.5 rounded border border-slate-100">
          "As a {story.asA}, I want {story.iWant}..."
        </p>
      )}

      {/* Blocker Banner */}
      {story.status === 'BLOCKED' && (
        <div className="mb-3 px-2 py-1.5 bg-rose-100/80 border border-rose-200 rounded text-[11px] font-semibold text-rose-800 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span>Story Blocked</span>
        </div>
      )}

      {/* Card Footer: Assignee & Quick Actions */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          {story.assignee ? (
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium" title={`Assigned to ${story.assignee.name}`}>
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center border border-indigo-200">
                {story.assignee.name.charAt(0)}
              </div>
              <span className="max-w-[70px] truncate text-[11px]">{story.assignee.name.split(' ')[0]}</span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 italic">Unassigned</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {canPrioritize && onOpenPrioritization && (
            <button
              onClick={() => onOpenPrioritization(story)}
              title="Adjust Priority Model Factors"
              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          )}

          {canEdit && onOpenBlocker && story.status !== 'BLOCKED' && (
            <button
              onClick={() => onOpenBlocker(story)}
              title="Flag Blocker"
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Kanban Transition Controls */}
          {canEdit && onStatusChange && (
            <div className="flex items-center gap-0.5 ml-1 bg-slate-100 rounded p-0.5">
              {currentIndex > 1 && story.status !== 'BLOCKED' && (
                <button
                  onClick={handlePrev}
                  title="Move to previous status"
                  className="p-0.5 rounded text-slate-500 hover:text-slate-900 hover:bg-white transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              {currentIndex < 4 && story.status !== 'BLOCKED' && (
                <button
                  onClick={handleNext}
                  title="Advance to next status"
                  className="p-0.5 rounded text-slate-500 hover:text-slate-900 hover:bg-white transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
