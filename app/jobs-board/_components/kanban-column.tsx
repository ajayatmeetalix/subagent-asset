"use client";

import type { Task, KanbanColumnDef } from "@/lib/jobs-board/types";
import { TaskCard } from "./task-card";
import { Inbox } from "lucide-react";

export function KanbanColumn({
  column,
  tasks,
  showEstate = false,
}: {
  column: KanbanColumnDef;
  tasks: Task[];
  showEstate?: boolean;
}) {
  return (
    <div className="flex min-w-[280px] flex-1 flex-col">
      {/* Column header */}
      <div
        className="mb-3 flex items-center gap-2 border-l-4 pl-3"
        style={{ borderColor: column.color }}
      >
        <h3 className="text-sm font-semibold">{column.title}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      {/* Card list */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 220px)" }}>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-muted-foreground">
            <Inbox className="mb-1 h-5 w-5" />
            <span className="text-xs">No tasks</span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} showEstate={showEstate} />
          ))
        )}
      </div>
    </div>
  );
}
