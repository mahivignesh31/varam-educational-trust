import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/shell";
import { organization } from "@/data/organization";

export const metadata: Metadata = {
  title: {
    default: "Admin demonstration",
    template: `%s | ${organization.shortName}`,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
