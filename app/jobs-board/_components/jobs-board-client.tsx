"use client";

import { useMemo } from "react";
import { useJobsBoardParams } from "@/lib/jobs-board/url-state";
import { MOCK_TASKS } from "@/lib/jobs-board/mock-data";
import {
  filterExcludedStatuses,
  filterBySearch,
  filterByPriority,
} from "@/lib/jobs-board/filters";
import { FilterBar } from "./filter-bar";
import { KanbanBoard } from "./kanban-board";

export function JobsBoardClient({
  isMyJobs,
  estateId,
}: {
  isMyJobs: boolean;
  estateId?: string;
}) {
  const {
    search,
    priority,
    groupBy,
    setSearch,
    setPriority,
    setGroupBy,
  } = useJobsBoardParams();

  const tasks = useMemo(() => {
    let result = filterExcludedStatuses(MOCK_TASKS, isMyJobs);

    if (estateId) {
      result = result.filter((t) => t.estate.id === estateId);
    }

    result = filterBySearch(result, search);
    result = filterByPriority(result, priority);

    return result;
  }, [isMyJobs, estateId, search, priority]);

  const pageTitle = isMyJobs
    ? "My Jobs Board"
    : `Jobs Board`;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">{pageTitle}</h1>
      <FilterBar
        search={search}
        priority={priority}
        groupBy={groupBy}
        isMyJobs={isMyJobs}
        onSearchChange={setSearch}
        onPriorityChange={setPriority}
        onGroupByChange={setGroupBy}
      />
      <KanbanBoard
        tasks={tasks}
        groupBy={isMyJobs ? groupBy : "all"}
        showEstate={isMyJobs && !estateId}
      />
    </div>
  );
}
