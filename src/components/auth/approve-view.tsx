"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TrustLogo } from "@/components/layout/chrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/primitives";
import { organization } from "@/data/organization";
import { supabase } from "@/lib/supabase";

type Result = "working" | "approved" | "invalid" | "error";

export function ApproveView() {
  const params = useSearchParams();
  const token = params.get("token");
  const [result, setResult] = useState<Result>("working");

  useEffect(() => {
    if (!supabase || !token) {
      setResult("invalid");
      return;
    }
    let current = true;
    supabase.rpc("approve_trainer", { approval_token: token }).then(({ data, error }) => {
      if (!current) return;
      if (error) setResult("error");
      else setResult(data === "approved" ? "approved" : "invalid");
    });
    return () => {
      current = false;
    };
  }, [token]);

  const title =
    result === "approved"
      ? "Trainer approved"
      : result === "working"
        ? "Checking the approval link"
        : "This link did not approve anyone";

  const text =
    result === "approved"
      ? "This trainer can sign in and open the trainer workspace."
      : result === "working"
        ? "Confirming this request with the campus database."
        : result === "error"
          ? "The approval could not be saved. Run the latest account script in Supabase, then open the link again."
          : "The link is missing, already used, or no longer matches a waiting trainer.";

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-xl">
        <CardContent className="px-6 py-10 sm:px-10">
          <div className="w-fit rounded-3xl bg-white p-3">
            <TrustLogo size={72} priority />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">
            {organization.registrationEmail}
          </p>
          <h1 className="mt-2 font-display text-4xl text-foreground">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{text}</p>
          <Button asChild className="mt-6">
            <Link href="/">Back to the website</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
