import type { Metadata } from "next";
import { LoginView } from "@/components/marketing/views";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Varam admin, trainer, or student account.",
};

export default function Page() {
  return <LoginView />;
}
