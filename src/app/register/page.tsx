import type { Metadata } from "next";
import { RegisterView } from "@/components/marketing/views";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Varam student or trainer account. Trainers need Trust approval.",
};

export default function Page() {
  return <RegisterView />;
}
