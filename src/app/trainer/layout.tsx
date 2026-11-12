import type { ReactNode } from "react";
import type { Metadata } from "next";
import { TrainerShell } from "@/components/trainer/shell";
import { organization } from "@/data/organization";

export const metadata: Metadata = {
  title: {
    default: "Trainer workspace",
    template: `%s | ${organization.shortName}`,
  },
};

export default function TrainerLayout({ children }: { children: ReactNode }) {
  return <TrainerShell>{children}</TrainerShell>;
}
