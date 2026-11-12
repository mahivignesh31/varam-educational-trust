import type { Metadata } from "next";
import { ContactView } from "@/components/marketing/views";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Varam Educational & Charitable Trust in Nellore.",
};

export default function Page() {
  return <ContactView />;
}
