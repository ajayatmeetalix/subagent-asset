"use client";

import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { getDueDateUrgency, formatDueDate } from "@/lib/jobs-board/utils";

const urgencyStyles: Record<string, string> = {
  overdue:
    "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  urgent:
    "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  warning:
    "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  normal:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export function DueDateBadge({
  dueBy,
}: {
  dueBy: string | null | undefined;
}) {
  if (!dueBy) return null;
  const urgency = getDueDateUrgency(dueBy);
  if (!urgency) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        urgencyStyles[urgency]
      )}
    >
      <CalendarDays className="h-3 w-3" />
      {urgency === "overdue" ? "Overdue" : formatDueDate(dueBy)}
    </span>
  );
}
