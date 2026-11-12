import Link from "next/link";
import { SiteFrame } from "@/components/layout/chrome";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">404</p>
        <h1 className="mt-3 font-display text-5xl">That page is not on this campus</h1>
        <p className="mt-4 text-muted-foreground">The link may be mistyped. The home page and programs are available.</p>
        <Button asChild className="mt-6">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </SiteFrame>
  );
}
