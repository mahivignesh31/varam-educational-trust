import type { Metadata } from "next";
import { ProfileView } from "@/components/lms/profile-view";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Display name and learning goal stored in this browser.",
};

export default function Page() {
  return <ProfileView />;
}
