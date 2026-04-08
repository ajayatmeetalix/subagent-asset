"use client";

import { getStepProgress } from "@/lib/jobs-board/utils";
import type { TaskStep } from "@/lib/jobs-board/types";

export function StepProgress({ steps }: { steps: TaskStep[] }) {
  if (steps.length === 0) return null;
  const { completed, total, nextStep } = getStepProgress(steps);
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {completed}/{total} steps
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {nextStep && (
        <p className="truncate text-xs text-muted-foreground">
          Next: {nextStep}
        </p>
      )}
    </div>
  );
}
