import React from 'react';
import { StoryCard } from './StoryCard';

export const KanbanColumn = ({
  title,
  status,
  stories,
  onStatusChange,
  onOpenPrioritization,
  onOpenBlocker
}) => {
  const columnStyles = {
    BACKLOG: { border: 'border-t-slate-400', badge: 'bg-slate-100 text-slate-700' },
    TODO: { border: 'border-t-indigo-400', badge: 'bg-indigo-50 text-indigo-700' },
    IN_PROGRESS: { border: 'border-t-blue-500', badge: 'bg-blue-50 text-blue-700' },
    IN_REVIEW: { border: 'border-t-amber-500', badge: 'bg-amber-50 text-amber-700' },
    DONE: { border: 'border-t-emerald-500', badge: 'bg-emerald-50 text-emerald-700' },
    BLOCKED: { border: 'border-t-rose-500', badge: 'bg-rose-50 text-rose-700' },
  };

  const style = columnStyles[status] || columnStyles.TODO;
  const totalPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);

  return (
    <div className={`w-80 flex-shrink-0 bg-slate-100/70 rounded-xl p-3 flex flex-col max-h-[calc(100vh-12rem)] border-t-4 ${style.border}`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">{title}</h2>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
            {stories.length}
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-500">
          {totalPoints} pts
        </span>
      </div>

      {/* Cards container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {stories.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs font-medium">
            No items in {title.toLowerCase()}
          </div>
        ) : (
          stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              columnType={status}
              onStatusChange={onStatusChange}
              onOpenPrioritization={onOpenPrioritization}
              onOpenBlocker={onOpenBlocker}
            />
          ))
        )}
      </div>
    </div>
  );
};
