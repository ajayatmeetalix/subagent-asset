"use client";

import type { Task, GroupByMode } from "@/lib/jobs-board/types";
import { STATUS_COLUMNS } from "@/lib/jobs-board/constants";
import { bucketByColumn, groupTasks } from "@/lib/jobs-board/filters";
import { KanbanColumn } from "./kanban-column";
import { GroupHeader } from "./group-header";

function ColumnRow({
  tasks,
  showEstate,
}: {
  tasks: Task[];
  showEstate: boolean;
}) {
  const buckets = bucketByColumn(tasks);
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {STATUS_COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          column={col}
          tasks={buckets[col.id] ?? []}
          showEstate={showEstate}
        />
      ))}
    </div>
  );
}

export function KanbanBoard({
  tasks,
  groupBy,
  showEstate,
}: {
  tasks: Task[];
  groupBy: GroupByMode;
  showEstate: boolean;
}) {
  if (groupBy === "all") {
    return <ColumnRow tasks={tasks} showEstate={showEstate} />;
  }

  const groups = groupTasks(tasks, groupBy);

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <GroupHeader key={group.key} label={group.label} count={group.tasks.length}>
          <ColumnRow tasks={group.tasks} showEstate={showEstate} />
        </GroupHeader>
      ))}
    </div>
  );
}
