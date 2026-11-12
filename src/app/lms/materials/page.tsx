import type { Metadata } from "next";
import { MaterialsView } from "@/components/lms/materials-view";

export const metadata: Metadata = {
  title: "Study Materials",
  description: "Sample study notes for enrolled courses, saved in this browser.",
};

export default function Page() {
  return <MaterialsView />;
}
