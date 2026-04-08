"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

export function GroupHeader({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mb-2 flex items-center gap-2 text-sm font-semibold hover:text-foreground/80"
      >
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        {label}
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {count}
        </span>
      </button>
      {open && children}
    </div>
  );
}
