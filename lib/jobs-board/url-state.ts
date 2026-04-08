"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useRef, useEffect } from "react";
import type { GroupByMode } from "./types";
import { TaskPriority } from "./types";

export function useJobsBoardParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const search = searchParams.get("search") ?? "";
  const priority = (searchParams.get("priority") as TaskPriority) ?? null;
  const groupBy = (searchParams.get("groupBy") as GroupByMode) ?? "all";
  const taskId = searchParams.get("taskId");
  const myJobsEstate = searchParams.get("myJobsEstate");

  const setSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setParam("search", value || null);
      }, 300);
    },
    [setParam]
  );

  const setPriority = useCallback(
    (value: TaskPriority | null) => setParam("priority", value),
    [setParam]
  );

  const setGroupBy = useCallback(
    (value: GroupByMode) => setParam("groupBy", value === "all" ? null : value),
    [setParam]
  );

  const setTaskId = useCallback(
    (value: string | null) => setParam("taskId", value),
    [setParam]
  );

  const setMyJobsEstate = useCallback(
    (value: string | null) => setParam("myJobsEstate", value),
    [setParam]
  );

  return {
    search,
    priority,
    groupBy,
    taskId,
    myJobsEstate,
    setSearch,
    setPriority,
    setGroupBy,
    setTaskId,
    setMyJobsEstate,
  };
}
