import type { Metadata } from "next";
import { SettingsView } from "@/components/lms/settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Appearance and demonstration data stored in this browser.",
};

export default function Page() {
  return <SettingsView />;
}
