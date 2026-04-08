import { Suspense } from "react";
import { JobsBoardClient } from "../_components/jobs-board-client";

export default async function EstateJobsBoardPage({
  params,
}: {
  params: Promise<{ estateId: string }>;
}) {
  const { estateId } = await params;

  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
      <JobsBoardClient isMyJobs={false} estateId={estateId} />
    </Suspense>
  );
}
