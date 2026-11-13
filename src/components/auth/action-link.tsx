"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { loginPath } from "@/lib/login-path";

export function ActionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { session } = useAuth();
  return (
    <Link href={session ? href : loginPath(href)} className={className}>
      {children}
    </Link>
  );
}
