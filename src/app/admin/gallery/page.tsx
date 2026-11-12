import type { Metadata } from "next";
import { AdminGallery } from "@/components/admin/gallery";

export const metadata: Metadata = { title: "Admin gallery" };

export default function Page() {
  return <AdminGallery />;
}
