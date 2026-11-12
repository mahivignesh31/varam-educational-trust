import type { Metadata } from "next";
import { ForgotView } from "@/components/marketing/views";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Send a password reset link for your Varam account.",
};

export default function Page() {
  return <ForgotView />;
}
