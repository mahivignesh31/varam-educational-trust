import type { Metadata } from "next";
import { AboutView } from "@/components/marketing/views";

export const metadata: Metadata = {
  title: "About Us",
  description: "Who we are, and the mission, vision, values, and commitment of Varam Educational & Charitable Trust.",
};

export default function Page() {
  return <AboutView />;
}
