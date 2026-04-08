"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskPriority, type GroupByMode } from "@/lib/jobs-board/types";
import { PRIORITY_LABELS } from "@/lib/jobs-board/constants";

const GROUP_OPTIONS: { value: GroupByMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "priority", label: "By Priority" },
  { value: "estate", label: "By Estate" },
];

export function FilterBar({
  search,
  priority,
  groupBy,
  isMyJobs,
  onSearchChange,
  onPriorityChange,
  onGroupByChange,
}: {
  search: string;
  priority: TaskPriority | null;
  groupBy: GroupByMode;
  isMyJobs: boolean;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority | null) => void;
  onGroupByChange: (value: GroupByMode) => void;
}) {
  const [localSearch, setLocalSearch] = useState(search);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={localSearch}
          onChange={(e) => {
            setLocalSearch(e.target.value);
            onSearchChange(e.target.value);
          }}
          className="pl-9"
        />
      </div>

      {/* Priority filter */}
      <select
        value={priority ?? ""}
        onChange={(e) =>
          onPriorityChange(
            e.target.value ? (e.target.value as TaskPriority) : null
          )
        }
        className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All Priorities</option>
        {Object.values(TaskPriority).map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABELS[p]}
          </option>
        ))}
      </select>

      {/* Grouping toggle (My Jobs only) */}
      {isMyJobs && (
        <div className="ml-auto flex items-center gap-1">
          {GROUP_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={groupBy === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => onGroupByChange(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
