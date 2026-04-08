import { formatDistanceToNow, differenceInDays, isPast, format } from "date-fns";
import type { TaskStep } from "./types";
import { TaskStepStatus } from "./types";

export type DueDateUrgency = "overdue" | "urgent" | "warning" | "normal";

export function getDueDateUrgency(
  dueBy: string | null | undefined
): DueDateUrgency | null {
  if (!dueBy) return null;
  const due = new Date(dueBy);
  if (isPast(due)) return "overdue";
  const days = differenceInDays(due, new Date());
  if (days <= 1) return "urgent";
  if (days <= 3) return "warning";
  return "normal";
}

export function formatDueDate(dueBy: string): string {
  return format(new Date(dueBy), "MMM d, yyyy");
}

export function getStepProgress(steps: TaskStep[]): {
  completed: number;
  total: number;
  nextStep: string | null;
} {
  const completed = steps.filter(
    (s) => s.status === TaskStepStatus.Completed
  ).length;
  const sorted = [...steps].sort((a, b) => a.order - b.order);
  const next = sorted.find((s) => s.status === TaskStepStatus.Todo);
  return {
    completed,
    total: steps.length,
    nextStep: next?.title ?? null,
  };
}

export function formatLastUpdated(updatedAt: string): string {
  return formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
}
