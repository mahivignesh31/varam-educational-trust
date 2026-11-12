import type { Metadata } from "next";
import { ContinueView } from "@/components/lms/continue-view";

export const metadata: Metadata = {
  title: "Continue Learning",
  description: "Open the next lesson saved in this browser.",
};

export default function Page() {
  return <ContinueView />;
}
