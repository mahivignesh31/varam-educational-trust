import type { Metadata } from "next";
import { AssignmentsView } from "@/components/lms/assignments-view";

export const metadata: Metadata = {
  title: "Assignments",
  description: "Sample assignment drafts stored on this device only.",
};

export default function Page() {
  return <AssignmentsView />;
}
