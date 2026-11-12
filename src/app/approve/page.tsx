import type { Metadata } from "next";
import { Suspense } from "react";
import { ApproveView } from "@/components/auth/approve-view";
import { RouteSkeleton } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Approve trainer",
  description: "Approve a Varam trainer from the Trust inbox.",
};

export default function Page() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <ApproveView />
    </Suspense>
  );
}
