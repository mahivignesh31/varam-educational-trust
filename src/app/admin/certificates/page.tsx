import type { Metadata } from "next";
import { AdminCertificates } from "@/components/admin/certificates";

export const metadata: Metadata = { title: "Admin certificates" };

export default function Page() {
  return <AdminCertificates />;
}
