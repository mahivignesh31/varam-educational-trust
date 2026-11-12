import type { Metadata } from "next";
import { CatalogView } from "@/components/courses/catalog-view";

export const metadata: Metadata = {
  title: "Explore Courses",
  description: "Sample courses in the demonstration student workspace.",
};

export default function Page() {
  return <CatalogView />;
}
