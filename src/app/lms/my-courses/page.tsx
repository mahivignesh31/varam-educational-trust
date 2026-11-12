import type { Metadata } from "next";
import { MyCoursesView } from "@/components/courses/my-courses-view";

export const metadata: Metadata = {
  title: "My Courses",
  description: "Courses enrolled in this browser.",
};

export default function Page() {
  return <MyCoursesView />;
}
