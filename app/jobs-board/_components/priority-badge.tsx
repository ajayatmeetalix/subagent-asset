"use client";

import { cn } from "@/lib/utils";
import { TaskPriority } from "@/lib/jobs-board/types";

const priorityConfig: Record<
  string,
  { label: string; className: string }
> = {
  [TaskPriority.Low]: {
    label: "Low",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  [TaskPriority.Medium]: {
    label: "Medium",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  [TaskPriority.High]: {
    label: "High",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  [TaskPriority.Important]: {
    label: "Important",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
};

export function PriorityBadge({
  priority,
}: {
  priority: TaskPriority | null | undefined;
}) {
  if (!priority) return null;
  const config = priorityConfig[priority];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
