"use client";

import {
  Award,
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  Images,
  LayoutDashboard,
  Megaphone,
  Menu,
  PieChart,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { TrainerPending } from "@/components/auth/trainer-pending";
import { ThemeToggle, TrustLogo } from "@/components/layout/chrome";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, RouteSkeleton } from "@/components/ui/primitives";
import { organization } from "@/data/organization";
import { useStoreHydrated } from "@/hooks/use-hydrated";
import { useAuth } from "@/lib/auth";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export type WorkspaceLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const adminNav: WorkspaceLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/trainers", label: "Trainers", icon: GraduationCap },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/lessons", label: "Lessons", icon: FileText },
  { href: "/admin/assessments", label: "Assessments", icon: ClipboardList },
  { href: "/admin/results", label: "Results", icon: BarChart3 },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/reports", label: "Reports", icon: PieChart },
];

function isCurrent(pathname: string, href: string, home: string) {
  if (href === home) return pathname === home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  nav,
  pathname,
  home,
  tone,
  onNavigate,
}: {
  nav: WorkspaceLink[];
  pathname: string;
  home: string;
  tone: "navy" | "light";
  onNavigate?: () => void;
}) {
  return nav.map((item) => {
    const current = isCurrent(pathname, item.href, home);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={current ? "page" : undefined}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold",
          tone === "navy" && "text-white/80 hover:bg-white/10 hover:text-white",
          tone === "navy" && current && "bg-white text-[#14213D] hover:bg-white hover:text-[#14213D]",
          tone === "light" && "text-foreground hover:bg-muted",
          tone === "light" && current && "bg-accent text-accent-foreground",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {item.label}
      </Link>
    );
  });
}

export function WorkspaceShell({
  role,
  home,
  title,
  nav,
  children,
}: {
  role: "admin" | "trainer";
  home: string;
  title: string;
  nav: WorkspaceLink[];
  children: ReactNode;
}) {
  const hydrated = useStoreHydrated();
  const { ready, session, profile, profileMissing, signOut } = useAuth();
  const accountReady = useDemoStore((state) => state.accountReady);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const allowed =
    profile?.role === role || (role === "trainer" && profile?.role === "admin");

  if (!hydrated || !ready || (session && profile && !accountReady)) {
    return (
      <main id="main">
        <RouteSkeleton />
      </main>
    );
  }

  if (session && profile?.role === "trainer" && profile.status !== "active") return <TrainerPending />;

  if (!session || profileMissing || !allowed) {
    return (
      <main id="main" className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
        <Card className="w-full max-w-lg">
          <CardContent className="space-y-5">
            <div className="w-fit rounded-2xl bg-white p-2">
              <TrustLogo size={72} priority />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">
                {organization.shortName}
              </p>
              <h1 className="mt-2 font-display text-4xl text-foreground">{title}</h1>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {profileMissing
                ? "Sign-in is on, but the account table is not ready. Run the account script in Supabase, then sign in again."
                : session
                  ? `This workspace is for the ${role} account. You are signed in as ${profile?.role ?? "a user"}.`
                  : "Sign in with the staff account for this workspace."}
            </p>
            <Button asChild>
              <Link href="/login">{session ? "Use another account" : "Sign in"}</Link>
            </Button>
            <div>
              <Button asChild variant="outline">
                <Link href="/">Back to the website</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <aside className="no-print sticky top-0 hidden h-screen flex-col bg-[#14213D] lg:flex">
        <div className="p-3">
          <Link href="/" className="flex items-center gap-3 rounded-2xl bg-white p-3">
            <TrustLogo size={52} />
            <span className="text-sm font-semibold leading-5 text-[#14213D]">
              {organization.shortName}
              <span className="mt-1 block text-xs font-medium text-[#303f91]">{title}</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-3" aria-label={title}>
          <NavLinks nav={nav} pathname={pathname} home={home} tone="navy" />
        </nav>
        <div className="space-y-2 p-3">
          <Link
            href="/"
            className="block rounded-2xl px-3 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            Website
          </Link>
          <Button
            type="button"
            variant="outline"
            className="w-full border-white/20 bg-transparent text-white hover:bg-white/10"
            onClick={() => void signOut().then(() => { window.location.href = "/"; })}
          >
            Sign out
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="no-print sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2 px-4 py-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </Button>
            <p className="mr-auto text-sm font-semibold text-foreground lg:hidden">{title}</p>
            <ThemeToggle />
            <Button type="button" variant="outline" onClick={() => void signOut().then(() => { window.location.href = "/"; })}>
              Sign out
            </Button>
          </div>
        </div>
        <main id="main" className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="no-print">
          <div className="w-fit rounded-2xl bg-white p-1">
            <TrustLogo size={56} />
          </div>
          <DialogTitle className="mt-4 pr-8 font-display text-2xl">{title}</DialogTitle>
          <nav className="mt-4 grid gap-1" aria-label={`${title} menu`}>
            <NavLinks
              nav={nav}
              pathname={pathname}
              home={home}
              tone="light"
              onNavigate={() => setMenuOpen(false)}
            />
          </nav>
          <div className="mt-4 grid gap-2">
            <Button asChild variant="outline">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Website
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMenuOpen(false);
                void signOut().then(() => { window.location.href = "/"; });
              }}
            >
              Sign out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <WorkspaceShell
      role="admin"
      home="/admin"
      title="Admin workspace"
      nav={adminNav}
    >
      {children}
    </WorkspaceShell>
  );
}
