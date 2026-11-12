import type { Metadata } from "next";
import { ProgramsView } from "@/components/marketing/views";

export const metadata: Metadata = {
  title: "Our Programs",
  description: "Sample training programs offered on the Varam learning website.",
};

export default function Page() {
  return <ProgramsView />;
}
