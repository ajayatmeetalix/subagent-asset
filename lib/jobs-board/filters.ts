import type { Task, GroupByMode } from "./types";
import { TaskPriority, TaskStatus } from "./types";
import {
  STATUS_COLUMNS,
  EXCLUDED_STATUSES,
  MY_JOBS_EXCLUDED_STATUSES,
  PRIORITY_ORDER,
  PRIORITY_LABELS,
} from "./constants";

export function filterExcludedStatuses(
  tasks: Task[],
  isMyJobs: boolean
): Task[] {
  const excluded = isMyJobs ? MY_JOBS_EXCLUDED_STATUSES : EXCLUDED_STATUSES;
  return tasks.filter((t) => !excluded.includes(t.status));
}

export function filterBySearch(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return tasks;
  const q = query.toLowerCase();
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.jobKey.toLowerCase().includes(q) ||
      t.executor?.toLowerCase().includes(q) ||
      t.reviewer?.toLowerCase().includes(q)
  );
}

export function filterByPriority(
  tasks: Task[],
  priority: TaskPriority | null
): Task[] {
  if (!priority) return tasks;
  return tasks.filter((t) => t.priority === priority);
}

export function bucketByColumn(
  tasks: Task[]
): Record<string, Task[]> {
  const buckets: Record<string, Task[]> = {};
  for (const col of STATUS_COLUMNS) {
    buckets[col.id] = tasks.filter((t) => col.statuses.includes(t.status));
  }
  return buckets;
}

export type TaskGroup = {
  key: string;
  label: string;
  tasks: Task[];
};

export function groupTasks(
  tasks: Task[],
  mode: GroupByMode
): TaskGroup[] {
  if (mode === "all") {
    return [{ key: "all", label: "All Tasks", tasks }];
  }

  if (mode === "priority") {
    return PRIORITY_ORDER.map((p) => ({
      key: p ?? "none",
      label: p ? PRIORITY_LABELS[p] : "No Priority",
      tasks: tasks.filter((t) => (t.priority ?? null) === p),
    })).filter((g) => g.tasks.length > 0);
  }

  // mode === "estate"
  const estateMap = new Map<string, { label: string; tasks: Task[] }>();
  for (const task of tasks) {
    const eid = task.estate.id;
    if (!estateMap.has(eid)) {
      const d = task.estate.deceased;
      const label = d ? `${d.firstName} ${d.lastName}` : eid;
      estateMap.set(eid, { label, tasks: [] });
    }
    estateMap.get(eid)!.tasks.push(task);
  }
  return Array.from(estateMap.entries()).map(([key, val]) => ({
    key,
    label: val.label,
    tasks: val.tasks,
  }));
}
