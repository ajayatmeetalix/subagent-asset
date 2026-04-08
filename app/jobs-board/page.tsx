import { Suspense } from "react";
import { JobsBoardClient } from "./_components/jobs-board-client";

export default function MyJobsBoardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
      <JobsBoardClient isMyJobs={true} />
    </Suspense>
  );
}
