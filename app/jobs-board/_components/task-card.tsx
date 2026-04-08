"use client";

import { cn } from "@/lib/utils";
import { User, Bot, MessageCircle, Clock } from "lucide-react";
import type { Task } from "@/lib/jobs-board/types";
import { formatLastUpdated } from "@/lib/jobs-board/utils";
import { PriorityBadge } from "./priority-badge";
import { DueDateBadge } from "./due-date-badge";
import { StepProgress } from "./step-progress";

function isEmail(s: string) {
  return s.includes("@");
}

export function TaskCard({
  task,
  showEstate = false,
}: {
  task: Task;
  showEstate?: boolean;
}) {
  const estateName = task.estate.deceased
    ? `${task.estate.deceased.firstName} ${task.estate.deceased.lastName}`
    : task.estate.id;

  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Header row: job key + estate label */}
      <div className="mb-1.5 flex items-center gap-2">
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-muted-foreground">
          {task.jobKey}
        </span>
        {showEstate && (
          <span className="truncate text-xs text-muted-foreground">
            {estateName}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="mb-2 line-clamp-2 text-sm font-medium leading-snug">
        {task.title}
      </h4>

      {/* Badges row */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={task.priority} />
        <DueDateBadge dueBy={task.dueBy} />
      </div>

      {/* Step progress */}
      {task.steps.length > 0 && (
        <div className="mb-2">
          <StepProgress steps={task.steps} />
        </div>
      )}

      {/* Footer: executor, conversations, last updated */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {task.executor && (
          <div className="flex items-center gap-1 truncate">
            {isEmail(task.executor) ? (
              <User className="h-3 w-3 shrink-0" />
            ) : (
              <Bot className="h-3 w-3 shrink-0" />
            )}
            <span className="truncate">
              {isEmail(task.executor)
                ? task.executor.split("@")[0]
                : task.executor}
            </span>
          </div>
        )}

        {task._count.conversations > 0 && (
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>{task._count.conversations}</span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatLastUpdated(task.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
