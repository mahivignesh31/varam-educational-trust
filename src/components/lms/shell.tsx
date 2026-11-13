"use client";

import {
  Award,
  CalendarCheck,
  ClipboardList,
  Clapperboard,
  Compass,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  Medal,
  Menu,
  PenLine,
  PlayCircle,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TrainerPending } from "@/components/auth/trainer-pending";
import { TrustLogo, ThemeToggle } from "@/components/layout/chrome";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, RouteSkeleton } from "@/components/ui/primitives";
import { organization } from "@/data/organization";
import { useStoreHydrated } from "@/hooks/use-hydrated";
import { useAuth } from "@/lib/auth";
import { loginPath } from "@/lib/login-path";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/lms", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lms/courses", label: "Explore Courses", icon: Compass },
  { href: "/lms/my-courses", label: "My Courses", icon: Library },
  { href: "/lms/continue", label: "Continue Learning", icon: PlayCircle },
  { href: "/lms/lessons", label: "Video Lessons", icon: Clapperboard },
  { href: "/lms/materials", label: "Study Materials", icon: FileText },
  { href: "/lms/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/lms/practice", label: "Practice Tests", icon: PenLine },
  { href: "/lms/assessments", label: "Monthly Assessments", icon: CalendarCheck },
  { href: "/lms/exam", label: "Final Examination", icon: GraduationCap },
  { href: "/lms/certificates", label: "Certificates", icon: Award },
  { href: "/lms/achievements", label: "Achievements", icon: Medal },
  { href: "/lms/profile", label: "My Profile", icon: UserRound },
  { href: "/lms/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/lms") return pathname === "/lms";
  if (href === "/lms/courses") {
    return pathname === "/lms/courses" || pathname.startsWith("/lms/courses/") || pathname === "/lms/custom";
  }
  if (href === "/lms/continue") {
    return (
      pathname === "/lms/continue" ||
      pathname.startsWith("/lms/learn/") ||
      pathname === "/lms/custom-lesson"
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  pathname,
  tone,
  onNavigate,
}: {
  pathname: string;
  tone: "navy" | "card";
  onNavigate?: () => void;
}) {
  return (
    <>
      {links.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2",
              tone === "navy" && "text-white/80 hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[#14213D]",
              tone === "card" && "text-foreground hover:bg-muted focus-visible:ring-ring",
              active && "bg-brand-green text-white hover:bg-brand-green",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function SignInGate({ profileMissing }: { profileMissing: boolean }) {
  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-xl">
        <CardContent className="px-6 py-10 text-center sm:px-10">
          <div className="mx-auto w-fit rounded-3xl bg-white p-3">
            <TrustLogo size={88} priority />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
            {organization.shortName}
          </p>
          <h1 className="mt-3 font-display text-4xl text-foreground">Student LMS</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {profileMissing
              ? "Your sign-in worked, but the account table is not ready in the database yet. Run the account script in Supabase, then sign in again."
              : "Sign in with your account. Your courses, lesson progress, and quiz scores are saved to your record."}
          </p>
          <Button asChild className="mt-6">
            <Link href={profileMissing ? "/login" : "/login"}>{profileMissing ? "Back to sign in" : "Sign in"}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export function LmsShell({ children }: { children: React.ReactNode }) {
  const hydrated = useStoreHydrated();
  const { ready, session, profile, profileMissing, signOut } = useAuth();
  const signedInAs = profile?.role === "admin" ? "Trust admin" : profile?.role === "trainer" ? "Trainer" : "Student";
  const accountReady = useDemoStore((state) => state.accountReady);
  const studentName = useDemoStore((state) => state.studentName);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!hydrated || !ready || (session && !profileMissing && !accountReady)) {
    return (
      <main id="main" className="bg-background">
        <RouteSkeleton />
      </main>
    );
  }

  if (session && profileMissing) return <SignInGate profileMissing />;
  if (profile?.role === "trainer" && profile.status !== "active") return <TrainerPending />;

  const guest = !session;

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="no-print sticky top-0 hidden h-screen flex-col bg-[#14213D] text-white lg:flex">
        <div className="px-5 pb-4 pt-5">
          <Link href="/lms" className="inline-flex rounded-2xl bg-white p-2">
            <TrustLogo size={56} priority />
          </Link>
          <p className="mt-4 font-display text-xl">Student LMS</p>
          <p className="text-xs text-white/70">{guest ? "Look around, then sign in" : "Your account"}</p>
        </div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-6" aria-label="Student">
          <NavLinks pathname={pathname} tone="navy" />
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="no-print sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open student menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </Button>
          <Link href="/lms" className="inline-flex rounded-xl bg-white p-1 lg:hidden">
            <TrustLogo size={36} />
          </Link>
          <p className="min-w-0 truncate text-sm">
            {guest ? (
              <span className="font-semibold text-foreground">Visitor</span>
            ) : (
              <>
                <span className="text-muted-foreground">{signedInAs} </span>
                <span className="font-semibold text-foreground">{profile?.role === "student" ? studentName : profile?.name || studentName}</span>
              </>
            )}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {guest ? (
              <Button asChild size="sm">
                <Link href={loginPath(pathname)}>Sign in</Link>
              </Button>
            ) : (
              <button
                type="button"
                onClick={() => void signOut().then(() => { window.location.href = "/"; })}
                className="rounded-full px-3 py-2 text-sm font-semibold text-secondary-foreground underline-offset-4 hover:underline"
              >
                Sign out
              </button>
            )}
          </div>
        </header>
        <p className="border-b border-border bg-secondary px-4 py-3 text-sm leading-6 text-secondary-foreground sm:px-6">
          {guest
            ? "You can look through the campus. Sign in to enroll, open a lesson, or start a quiz."
            : "Signed in. Your progress is saved to your account."}
        </p>
        <main id="main" className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent>
          <div className="mb-4 w-fit rounded-2xl bg-white p-2">
            <TrustLogo size={48} />
          </div>
          <DialogTitle className="font-display text-2xl">Student menu</DialogTitle>
          <nav className="mt-4 grid gap-1" aria-label="Student">
            <NavLinks pathname={pathname} tone="card" onNavigate={() => setMenuOpen(false)} />
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
}
