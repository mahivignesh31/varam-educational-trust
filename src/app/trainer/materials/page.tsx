import type { Metadata } from "next";
import { TrainerMaterials } from "@/components/trainer/materials";

export const metadata: Metadata = { title: "Trainer materials" };

export default function Page() {
  return <TrainerMaterials />;
}
