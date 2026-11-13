"use client";

import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { courseIconMap } from "@/components/course-icon";
import { CoursePhoto } from "@/components/courses/course-artwork";
import { CourseCard } from "@/components/courses/course-card";
import { CourseRoadmap } from "@/components/courses/course-roadmap";
import { CampusPhoto } from "@/components/gallery/photo";
import { SiteFrame } from "@/components/layout/chrome";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import { assignments } from "@/data/assignments";
import { flatLessons, findCourse, courses } from "@/data/courses";
import { galleryCategories, galleryItems } from "@/data/gallery";
import { aboutCopy, intendedOutcomes, organization } from "@/data/organization";
import { useCatalogState } from "@/hooks/use-catalog";
import { assembleGallery } from "@/lib/catalog";
import { supabase } from "@/lib/supabase";
import { formatHours } from "@/lib/format";

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}

export function AboutView() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PageIntro eyebrow="About us" title="Who we are" text={aboutCopy.who} />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="relative min-h-80 overflow-hidden rounded-[2rem]">
            <Image src={organization.images.group} alt="Training group gathered on campus steps" fill className="object-cover" />
          </div>
          <div className="grid gap-4">
            {[
              ["Our Mission", aboutCopy.mission],
              ["Our Vision", aboutCopy.vision],
              ["Our Commitment", aboutCopy.commitment],
            ].map(([title, text]) => (
              <article key={title} className="rounded-3xl border border-border bg-card p-6">
                <h2 className="font-display text-2xl">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
        <h2 className="mt-14 font-display text-3xl">Our values</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {aboutCopy.values.map((value) => (
            <article key={value.title} className="rounded-3xl bg-secondary p-5">
              <h3 className="font-display text-xl">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{value.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted-foreground">{organization.address}</p>
      </div>
    </SiteFrame>
  );
}

export function ProgramsView() {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(courses.map((course) => course.category)))];
  const visible = courses.filter((course) => category === "All" || course.category === category);
  return (
    <SiteFrame>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PageIntro
          eyebrow="Our programs"
          title="Courses and skill programs"
          text="Business covers entrepreneurship. Design & Publishing covers DTP and Photoshop. Finance & Accounts covers Tally ERP 9, Tally with GST, accounting, statements, payroll, and banking. Courses & Internship Technologies covers web, Java, Python, AWS, DevOps, data, AI, machine learning, and IoT."
        />
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter programs">
          {categories.map((item) => (
            <Button key={item} type="button" size="sm" variant={item === category ? "default" : "outline"} onClick={() => setCategory(item)}>
              {item}
            </Button>
          ))}
        </div>
        <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
          {visible.length === 1 ? "1 program" : `${visible.length} programs`}
        </p>
        {visible.length ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((course) => (
              <CourseCard key={course.id} course={course} href={`/programs/${course.slug}`}>
                <Button asChild>
                  <Link href={`/programs/${course.slug}`}>
                    Learn More <ArrowRight />
                  </Link>
                </Button>
              </CourseCard>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">No programs are in this category.</p>
        )}
      </div>
    </SiteFrame>
  );
}

export function ProgramDetail({ slug }: { slug: string }) {
  const course = findCourse(slug);
  if (!course) return null;
  const Icon = courseIconMap[course.icon];
  const lessons = flatLessons(course);
  const assignment = assignments.find((item) => item.courseSlug === course.slug || item.courseSlug === course.id);
  return (
    <SiteFrame>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
          <div className="flex flex-col justify-center rounded-[2rem] border border-border bg-card p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">{course.category}</p>
            <h1 className="mt-3 flex items-center gap-3 font-display text-4xl sm:text-5xl">
              <Icon className="h-9 w-9 shrink-0 text-brand-green" aria-hidden /> {course.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">{course.description}</p>
            <dl className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-2xl bg-muted p-4"><dt className="text-muted-foreground">Level</dt><dd className="mt-1 font-semibold">{course.difficulty}</dd></div>
              <div className="rounded-2xl bg-muted p-4"><dt className="text-muted-foreground">Time</dt><dd className="mt-1 font-semibold">{formatHours(course.hours)}</dd></div>
              <div className="rounded-2xl bg-muted p-4"><dt className="text-muted-foreground">Lessons</dt><dd className="mt-1 font-semibold">{lessons.length}</dd></div>
            </dl>
            <Button asChild className="mt-6 w-fit">
              <Link href={`/lms/courses/${course.slug}`}>Start Learning <ArrowRight /></Link>
            </Button>
          </div>
          <div className="h-full overflow-hidden rounded-[2rem] border border-border">
            <CoursePhoto icon={course.icon} />
          </div>
        </div>

        <CourseRoadmap className="mt-14" course={course} assignment={assignment} />

        <h2 className="mt-14 font-display text-3xl">What you will practise</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {course.outcomes.map((item) => (
            <li key={item} className="rounded-3xl border border-border bg-card p-5 text-sm leading-6">{item}</li>
          ))}
        </ul>

        <h2 className="mt-14 font-display text-3xl">Lessons</h2>
        <div className="mt-5 grid gap-4">
          {course.modules.map((module, moduleIndex) => (
            <article key={module.id} className="rounded-[2rem] border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">Part {moduleIndex + 1}</p>
              <h3 className="mt-2 font-display text-2xl">{module.title}</h3>
              <ul className="mt-4 divide-y divide-border">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                    <div>
                      <p className="font-semibold">{lesson.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{lesson.summary}</p>
                    </div>
                    <p className="text-sm font-semibold text-brand-blue">{lesson.minutes} min</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {assignment ? (
          <article className="mt-4 rounded-[2rem] border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">Written assignment</p>
            <h3 className="mt-2 font-display text-2xl">{assignment.title}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{assignment.prompt}</p>
            <p className="mt-3 text-sm font-semibold text-brand-blue">{assignment.minutes} min</p>
          </article>
        ) : null}
      </div>
    </SiteFrame>
  );
}

export function GalleryView() {
  const state = useCatalogState();
  const items = useMemo(() => assembleGallery(state), [state]);
  const [category, setCategory] = useState<(typeof galleryCategories)[number]>("All");
  const [open, setOpen] = useState<string | null>(null);
  const visible = items.filter((item) => category === "All" || item.category === category);
  const activeIndex = visible.findIndex((item) => item.id === open);
  const active = activeIndex >= 0 ? visible[activeIndex] : undefined;
  function step(direction: -1 | 1) {
    if (!visible.length || activeIndex < 0) return;
    const next = visible[(activeIndex + direction + visible.length) % visible.length];
    setOpen(next.id);
  }
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const direction = event.key === "ArrowRight" ? 1 : -1;
      setOpen((current) => {
        const index = visible.findIndex((item) => item.id === current);
        if (index < 0 || visible.length === 0) return current;
        return visible[(index + direction + visible.length) % visible.length].id;
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, visible]);
  return (
    <SiteFrame>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PageIntro
          eyebrow="Gallery"
          title="Photographs from the Trust"
          text="Classrooms, the campus, training gatherings, and community photographs supplied for this website."
        />
        <div className="mt-8 flex flex-wrap gap-2">
          {galleryCategories.map((item) => (
            <Button key={item} type="button" size="sm" variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)}>
              {item}
            </Button>
          ))}
        </div>
        {visible.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border p-10 text-center">
            <h2 className="font-display text-2xl">No photographs in this category</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try another category.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => (
              <button key={item.id} type="button" className="overflow-hidden rounded-[2rem] text-left" onClick={() => setOpen(item.id)}>
                <span className="relative block aspect-[16/10]">
                  <CampusPhoto src={item.src} alt={item.alt} className="object-cover transition duration-300 hover:scale-[1.02]" />
                </span>
                <span className="block bg-card px-4 py-4">
                  <span className="block font-display text-2xl">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{item.caption}</span>
                </span>
              </button>
            ))}
          </div>
        )}
        <Dialog open={Boolean(open)} onOpenChange={(next) => setOpen(next ? open : null)}>
          <DialogContent wide>
            {active ? (
              <>
                <DialogTitle className="font-display text-3xl">{active.title}</DialogTitle>
                <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-2xl">
                  <CampusPhoto src={active.src} alt={active.alt} className="object-cover" />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{active.caption}</p>
                <div className="mt-4 flex gap-2">
                  <Button type="button" variant="outline" onClick={() => step(-1)}>
                    <ChevronLeft /> Previous
                  </Button>
                  <Button type="button" variant="outline" onClick={() => step(1)}>
                    Next <ChevronRight />
                  </Button>
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </SiteFrame>
  );
}

export function AchievementsView() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PageIntro
          eyebrow="Achievements"
          title="Outcomes this work is designed to support"
          text="This page does not list awards, affiliations, or statistics. Those would need the Trust’s own verified records. The cards below are the kinds of learning the programs aim to support."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {intendedOutcomes.map((item) => (
            <article key={item.title} className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}

export function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState("");
  const mailto = ready
    ? `mailto:${organization.email}?subject=${encodeURIComponent("Message for Varam Educational & Charitable Trust")}&body=${encodeURIComponent(ready)}`
    : undefined;

  function prepare(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2 || !email.includes("@") || message.trim().length < 8) {
      toast.error("Add your name, a valid email, and a short message.");
      return;
    }
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;
    setReady(body);
    toast("Your email app can send this. Nothing was stored on a server.");
  }

  return (
    <SiteFrame>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <PageIntro eyebrow="Contact" title="Write to the Trust" text="The form opens your email app with the message filled in. This website has no server, so it cannot confirm that a message arrived." />
          <div className="mt-8 space-y-4 text-sm leading-6">
            <p className="flex gap-2"><MapPin className="mt-1 shrink-0 text-brand-green" /> {organization.address}</p>
            <p className="flex gap-2"><Mail className="mt-1 shrink-0 text-brand-green" /> <a className="font-semibold text-brand-blue" href={`mailto:${organization.email}`}>{organization.email}</a></p>
            <a className="inline-block font-semibold text-brand-blue" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(organization.address)}`} target="_blank" rel="noreferrer">Open this address in maps</a>
            <iframe
              title="Map of Varam Educational & Charitable Trust in Nellore"
              className="h-72 w-full rounded-3xl border border-border"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(organization.address)}&z=16&output=embed`}
            />
          </div>
        </div>
        <form onSubmit={prepare} className="rounded-[2rem] border border-border bg-card p-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" className="mt-2" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div>
              <Label htmlFor="contact-email">Your email</Label>
              <Input id="contact-email" type="email" className="mt-2" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div>
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" className="mt-2" value={message} onChange={(event) => setMessage(event.target.value)} required />
            </div>
            <Button type="submit">Prepare email</Button>
          </div>
          {mailto ? (
            <div className="mt-6 rounded-2xl bg-muted p-4 text-sm leading-6">
              <p className="font-semibold">Ready for your email app</p>
              <pre className="mt-2 whitespace-pre-wrap font-sans">{ready}</pre>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild>
                  <a href={mailto}>Open in your email app</a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(`To: ${organization.email}\n\n${ready}`);
                    toast("Copied. Paste it into an email if the app did not open.");
                  }}
                >
                  Copy message
                </Button>
              </div>
              <p className="mt-3 text-muted-foreground">If no email app opens, write directly to {organization.email}. This page will not say the message was sent.</p>
            </div>
          ) : null}
        </form>
      </div>
    </SiteFrame>
  );
}

async function destinationFor(userId: string) {
  const { data } = await supabase!.from("profiles").select("role,status").eq("id", userId).maybeSingle();
  if (data?.role === "admin") return "/admin";
  if (data?.role === "trainer") return "/trainer";
  return "/lms";
}

export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) {
      toast.error("The database is not configured on this site.");
      return;
    }
    setPending(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setPending(false);
    if (error || !data.user) {
      toast.error(error?.message === "Email not confirmed" ? "Confirm your email, then sign in." : "Email or password is not correct.");
      return;
    }
    toast.success("Signed in.");
    const dest = await destinationFor(data.user.id);
    const next = new URLSearchParams(window.location.search).get("next");
    const back = dest === "/lms" && next && next.startsWith("/lms") && !next.startsWith("//") ? next : dest;
    router.push(back);
  }

  return (
    <SiteFrame>
      <AuthSplit title="Sign in">
        <form onSubmit={submit} className="grid gap-4">
          <div>
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" autoComplete="email" className="mt-2" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <Label htmlFor="login-password">Password</Label>
            <Input id="login-password" type="password" autoComplete="current-password" className="mt-2" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <Link href="/forgot-password" className="font-semibold text-brand-blue">Forgot password</Link>
          <Link href="/register" className="font-semibold text-brand-blue">Create an account</Link>
        </div>
      </AuthSplit>
    </SiteFrame>
  );
}

async function notifyTrust(name: string, email: string) {
  const response = await fetch(`https://formsubmit.co/ajax/${organization.registrationEmail}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name,
      email,
      role: "student",
      _subject: `Varam student registered: ${name}`,
      message: `${name} (${email}) registered as a student and can use the LMS. Students do not need Trust approval.`,
      _template: "table",
      _captcha: "false",
    }),
  });
  if (!response.ok) throw new Error("Trust inbox was not notified.");
}

export function RegisterView() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "trainer">("student");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) {
      toast.error("The database is not configured on this site.");
      return;
    }
    if (name.trim().length < 2 || password.length < 8) {
      toast.error("Enter your name and a password of at least 8 characters.");
      return;
    }
    setPending(true);
    const trimmedName = name.trim().slice(0, 40);
    const trimmedEmail = email.trim();
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: { name: trimmedName, role, site: window.location.origin },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) {
      setPending(false);
      toast.error(error.message);
      return;
    }
    if (role === "student") {
      try {
        await notifyTrust(trimmedName, trimmedEmail);
      } catch {
        toast.error(`Account created, but the notice to ${organization.registrationEmail} did not send. Ask the Trust to confirm that inbox once.`);
      }
    }
    setPending(false);
    if (role === "trainer") {
      toast.success(`Account created. ${organization.registrationEmail} must approve you before the trainer workspace opens.`);
      router.push(data.session ? "/trainer" : "/login");
      return;
    }
    toast.success(data.session ? "Account created. You can use the LMS." : "Account created. Confirm your email, then sign in.");
    router.push(data.session ? "/lms" : "/login");
  }

  return (
    <SiteFrame>
      <AuthSplit title="Create your account" text={`Students can use the LMS as soon as they register. Trainers stay closed until ${organization.registrationEmail} approves them.`}>
        <form onSubmit={submit} className="grid gap-4">
          <div>
            <Label htmlFor="reg-role">I am registering as</Label>
            <select
              id="reg-role"
              className="mt-2 h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm"
              value={role}
              onChange={(event) => setRole(event.target.value as "student" | "trainer")}
            >
              <option value="student">Student</option>
              <option value="trainer">Trainer</option>
            </select>
          </div>
          <div>
            <Label htmlFor="reg-name">Full name</Label>
            <Input id="reg-name" autoComplete="name" className="mt-2" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div>
            <Label htmlFor="reg-email">Email</Label>
            <Input id="reg-email" type="email" autoComplete="email" className="mt-2" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <Label htmlFor="reg-password">Password</Label>
            <Input id="reg-password" type="password" autoComplete="new-password" className="mt-2" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          </div>
          <Button type="submit" disabled={pending}>{pending ? "Creating account…" : "Create account"}</Button>
        </form>
        <p className="mt-4 text-sm">
          Already registered? <Link href="/login" className="font-semibold text-brand-blue">Sign in</Link>
        </p>
      </AuthSplit>
    </SiteFrame>
  );
}

export function ForgotView() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) {
      toast.error("The database is not configured on this site.");
      return;
    }
    setPending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("If that email has an account, a reset link is on its way.");
  }

  return (
    <SiteFrame>
      <AuthSplit title="Reset your password" text="Enter the email on your account. A reset link is sent only when that account exists.">
        <form onSubmit={submit} className="grid gap-4">
          <div>
            <Label htmlFor="forgot-email">Email</Label>
            <Input id="forgot-email" type="email" autoComplete="email" className="mt-2" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <Button type="submit" disabled={pending}>{pending ? "Sending…" : "Send reset link"}</Button>
        </form>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </AuthSplit>
    </SiteFrame>
  );
}

function AuthSplit({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div className="relative hidden min-h-[28rem] overflow-hidden rounded-[2rem] lg:block">
        <Image src={organization.images.classroom} alt="Learners in a classroom at Varam Educational & Charitable Trust" fill className="object-cover" />
      </div>
      <div className="rounded-[2rem] border border-border bg-card p-6 sm:p-8">
        <h1 className="font-display text-4xl">{title}</h1>
        {text ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p> : null}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
