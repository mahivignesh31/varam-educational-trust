import type { Metadata } from "next";
import { CertificateList } from "@/components/certificates/certificate-list";

export const metadata: Metadata = {
  title: "Sample certificates",
  description: "Sample certificates drawn in this browser. Not official or verifiable credentials.",
};

export default function Page() {
  return <CertificateList />;
}
