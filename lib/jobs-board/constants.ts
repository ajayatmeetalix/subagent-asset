import { TaskStatus, TaskPriority, type KanbanColumnDef } from "./types";

export const STATUS_COLUMNS: KanbanColumnDef[] = [
  {
    id: "todo",
    title: "To Do",
    color: "#E4DAC4",
    statuses: [TaskStatus.Todo, TaskStatus.Failed, TaskStatus.Blocked],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#7495FF",
    statuses: [TaskStatus.InProgress],
  },
  {
    id: "awaiting-review",
    title: "Awaiting Review",
    color: "#E2B444",
    statuses: [
      TaskStatus.ReadyForReview,
      TaskStatus.InReview,
      TaskStatus.ReviewComplete,
    ],
  },
  {
    id: "completed",
    title: "Completed",
    color: "#326E5E",
    statuses: [TaskStatus.Completed],
  },
];

export const EXCLUDED_STATUSES: TaskStatus[] = [
  TaskStatus.Pending,
  TaskStatus.InitializationFailed,
  TaskStatus.Deleted,
];

export const MY_JOBS_EXCLUDED_STATUSES: TaskStatus[] = [
  ...EXCLUDED_STATUSES,
  TaskStatus.Completed,
];

export const PRIORITY_ORDER: (TaskPriority | null)[] = [
  TaskPriority.Important,
  TaskPriority.High,
  TaskPriority.Medium,
  TaskPriority.Low,
  null,
];

export const PRIORITY_LABELS: Record<string, string> = {
  [TaskPriority.Important]: "Important",
  [TaskPriority.High]: "High",
  [TaskPriority.Medium]: "Medium",
  [TaskPriority.Low]: "Low",
};
