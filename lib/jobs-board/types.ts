export enum TaskStatus {
  Todo = "TODO",
  InProgress = "IN_PROGRESS",
  ReadyForReview = "READY_FOR_REVIEW",
  InReview = "IN_REVIEW",
  ReviewComplete = "REVIEW_COMPLETE",
  Completed = "COMPLETED",
  Blocked = "BLOCKED",
  Failed = "FAILED",
  Pending = "PENDING",
  InitializationFailed = "INITIALIZATION_FAILED",
  Deleted = "DELETED",
}

export enum TaskPriority {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
  Important = "IMPORTANT",
}

export enum TaskStepStatus {
  Todo = "TODO",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
}

export type TaskStep = {
  id: string;
  order: number;
  status: TaskStepStatus;
  title: string;
  description?: string | null;
};

export type Task = {
  id: string;
  createdAt: string;
  updatedAt: string;
  dueBy?: string | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority?: TaskPriority | null;
  jobKey: string;
  executor?: string | null;
  reviewer?: string | null;
  estate: {
    id: string;
    deceased?: {
      firstName: string;
      lastName: string;
    } | null;
  };
  steps: TaskStep[];
  _count: {
    conversations: number;
  };
};

export type KanbanColumnDef = {
  id: string;
  title: string;
  color: string;
  statuses: TaskStatus[];
};

export type GroupByMode = "all" | "priority" | "estate";
