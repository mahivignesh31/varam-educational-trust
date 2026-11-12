"use client";

import { Menu, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { mainNav, organization } from "@/data/organization";
import { cn } from "@/lib/utils";

export function TrustLogo({ size = 64, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image
      src={organization.images.logo}
      alt="Varam Educational & Charitable Trust logo"
      width={size}
      height={size}
      priority={priority}
      className="bg-white object-contain"
      style={{ width: size, height: size }}
    />
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

function active(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[96rem] items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-full">
          <TrustLogo size={52} priority />
          <span className="hidden whitespace-nowrap font-display text-[15px] text-foreground sm:block">
            {organization.shortName}
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-0.5 min-[1180px]:flex" aria-label="Primary">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-2 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground",
                active(pathname, item.href) && "bg-accent text-accent-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 min-[1180px]:ml-3">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="hidden min-[1360px]:inline-flex">
            <Link href="/programs">Explore Courses</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="min-[1180px]:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className="font-display text-2xl">Menu</DialogTitle>
          <nav className="mt-4 grid gap-2" aria-label="Mobile">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 font-semibold hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            <Button asChild>
              <Link href="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/programs" onClick={() => setOpen(false)}>
                Explore Courses
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[#14213D] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="w-fit rounded-full bg-white p-1">
            <TrustLogo size={72} />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
            {organization.shortName}. {organization.tagline}
          </p>
          <p className="mt-4 text-sm leading-6 text-white/70">{organization.address}</p>
          <a className="mt-2 inline-block text-sm font-semibold text-[#8dffa8]" href={`mailto:${organization.email}`}>
            {organization.email}
          </a>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Visit</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[#8dffa8]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Campus</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/lms" className="hover:text-[#8dffa8]">Student LMS</Link></li>
            <li><Link href="/trainer" className="hover:text-[#8dffa8]">Trainer workspace</Link></li>
            <li><Link href="/login" className="hover:text-[#8dffa8]">Admin sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {organization.shortName}
      </div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
