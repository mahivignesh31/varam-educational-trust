import type { Metadata } from "next";
import { GalleryView } from "@/components/marketing/views";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Training photographs from Varam Educational & Charitable Trust.",
};

export default function Page() {
  return <GalleryView />;
}
