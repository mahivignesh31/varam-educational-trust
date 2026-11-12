import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: { absolute: "Varam Educational & Charitable Trust" },
  description:
    "Empowering Education. Transforming Lives. Varam Educational & Charitable Trust, Nellore.",
};

export default function Page() {
  return <HomePage />;
}
