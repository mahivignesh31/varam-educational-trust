"use client";

import Link from "next/link";
import { TrustLogo } from "@/components/layout/chrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/primitives";
import { organization } from "@/data/organization";
import { useAuth } from "@/lib/auth";

export function TrainerPending() {
  const { signOut } = useAuth();

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-xl">
        <CardContent className="px-6 py-10 sm:px-10">
          <div className="w-fit rounded-3xl bg-white p-3">
            <TrustLogo size={72} priority />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">
            {organization.shortName}
          </p>
          <h1 className="mt-2 font-display text-4xl text-foreground">Waiting for approval</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Your trainer account is created, but the workspace stays closed until {organization.registrationEmail} approves
            you. Open the approval email in that inbox and use the link. Students do not wait for this step.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="button" onClick={() => window.location.reload()}>
              I was approved — check again
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void signOut().then(() => { window.location.href = "/"; })}
            >
              Sign out
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to the website</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
