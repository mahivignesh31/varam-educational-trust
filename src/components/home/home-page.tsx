"use client";

import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, HeartHandshake, Laptop, Library, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { courseIconMap } from "@/components/course-icon";
import { CoursePhoto } from "@/components/courses/course-artwork";
import { useSlideshow } from "@/components/slideshow";
import { cn } from "@/lib/utils";
import { SiteFrame, TrustLogo } from "@/components/layout/chrome";
import { Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import { galleryItems } from "@/data/gallery";
import { aboutCopy, learningPath, organization, whyChoose } from "@/data/organization";

const whyIcons = {
  laptop: Laptop,
  briefcase: courseIconMap.briefcase,
  users: Users,
  library: Library,
  compass: courseIconMap.compass,
  heart: HeartHandshake,
};

const heroSlides = ["classroom", "hall-session", "celebration", "campus-building", "community-gathering", "learners-uniform"]
  .map((id) => galleryItems.find((item) => item.id === id))
  .filter((item) => item != null);

export function HomePage() {
  const reduce = useReducedMotion();
  const hero = useSlideshow(heroSlides.length, 4500);
  const technology = courses.filter((course) => course.category === "Courses & Internship Technologies");
  const programs = useSlideshow(technology.length, 6000);
  const featured = technology[programs.index];
  const FeaturedIcon = featured ? courseIconMap[featured.icon] : null;
  const heroSlide = heroSlides[hero.index];
  return (
    <SiteFrame>
      <section id="hero" className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(0,166,81,0.16),transparent_32%),radial-gradient(circle_at_88%_8%,rgba(48,63,145,0.14),transparent_28%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
          <motion.div
            className="lg:col-span-6"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <TrustLogo size={76} priority />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
                Varam Educational & Charitable Trust
              </p>
            </div>
            <h1 className="max-w-xl font-display text-5xl leading-[1.05] text-foreground sm:text-6xl">
              Empowering Education. <span className="text-brand-green">Transforming Lives.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{organization.support}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/programs">
                  Explore Our Programs <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/lms">Start Learning</Link>
              </Button>
            </div>
            <a href="#introduction" className="mt-12 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Scroll
              <ChevronDown className="motion-safe:animate-bounce" aria-hidden />
            </a>
          </motion.div>
          <div
            className="lg:col-span-6"
            onMouseEnter={() => hero.setPaused(true)}
            onMouseLeave={() => hero.setPaused(false)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#14213D] shadow-[0_32px_70px_-40px_rgba(20,33,61,0.55)]">
              {heroSlides.map((slide, index) => (
                <Image
                  key={slide.id}
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className={cn(
                    "object-cover object-center transition-opacity duration-700",
                    index === hero.index ? "opacity-100" : "opacity-0",
                  )}
                  sizes="(min-width: 1024px) 46vw, 100vw"
                />
              ))}
            </div>
            <div className="relative z-10 -mt-14 mx-4 rounded-[1.4rem] border border-white/70 bg-white/95 px-4 py-3 shadow-[0_18px_40px_-28px_rgba(20,33,61,0.45)] backdrop-blur sm:mx-6 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-green">From the campus</p>
                <p className="mt-0.5 truncate font-display text-2xl text-[#14213D]">{heroSlide?.title}</p>
              </div>
              <div className="mt-3 flex items-center gap-2 sm:mt-0">
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#14213D] text-white hover:bg-[#1d3058]"
                  aria-label="Previous campus photograph"
                  onClick={hero.previous}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1.5 px-1" role="tablist" aria-label="Campus photographs">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={index === hero.index}
                      aria-label={slide.title}
                      onClick={() => hero.setIndex(index)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        index === hero.index ? "w-7 bg-brand-green" : "w-2.5 bg-[#14213D]/20 hover:bg-[#14213D]/40",
                      )}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#14213D] text-white hover:bg-[#1d3058]"
                  aria-label="Next campus photograph"
                  onClick={hero.next}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="introduction" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">About the Trust</p>
            <h2 className="mt-3 font-display text-4xl text-foreground">A Nellore learning community, introduced with care.</h2>
          </div>
          <p className="text-base leading-7 text-muted-foreground">{aboutCopy.who}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Our Mission", aboutCopy.mission],
            ["Our Vision", aboutCopy.vision],
            ["Our Commitment", aboutCopy.commitment],
          ].map(([title, text]) => (
            <article key={title} className="rounded-3xl border border-border bg-card p-6">
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {aboutCopy.values.map((value) => (
            <article key={value.title} className="rounded-3xl bg-secondary/70 p-5">
              <h3 className="font-display text-xl text-brand-blue">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="programs" className="bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">Training programs</p>
              <h2 className="mt-3 font-display text-4xl">Courses & Internship Technologies</h2>
            </div>
          </div>
          {featured && FeaturedIcon ? (
            <div
              className="mt-10"
              onMouseEnter={() => programs.setPaused(true)}
              onMouseLeave={() => programs.setPaused(false)}
            >
              <article className="grid overflow-hidden rounded-[2rem] border border-border bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <CoursePhoto icon={featured.icon} />
                <div className="flex flex-col justify-center p-6 sm:p-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-brand-green">
                      <FeaturedIcon className="h-6 w-6" aria-hidden />
                    </span>
                    <Badge>{featured.category}</Badge>
                    <Badge tone="blue">{featured.difficulty}</Badge>
                  </div>
                  <h3 className="mt-4 font-display text-4xl">{featured.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{featured.summary}</p>
                  <ul className="mt-5 space-y-2">
                    {featured.outcomes.map((item) => (
                      <li key={item} className="text-sm leading-6 text-foreground">{item}</li>
                    ))}
                  </ul>
                  <Button asChild className="mt-6 w-fit">
                    <Link href={`/programs/${featured.slug}`}>
                      Learn More <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </article>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-background"
                  aria-label="Previous course"
                  onClick={programs.previous}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <p className="truncate font-semibold">{featured.title}</p>
                    <p className="shrink-0 text-muted-foreground">
                      {programs.index + 1} of {technology.length}
                    </p>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-brand-green"
                      style={{ width: `${((programs.index + 1) / technology.length) * 100}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-background"
                  aria-label="Next course"
                  onClick={programs.next}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : null}
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/programs">View all programs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">Why learn here</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl">A practical way of teaching.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {whyChoose.map((item) => {
            const Icon = whyIcons[item.icon];
            return (
              <article key={item.title} className="overflow-hidden rounded-[2rem] border border-border bg-card">
                <div className="relative h-44">
                  <Image src={item.image} alt={item.alt} fill className="object-cover" sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" />
                  <span className="absolute bottom-3 left-3 grid h-11 w-11 place-items-center rounded-2xl bg-white text-brand-green shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">Training gallery</p>
              <h2 className="mt-3 font-display text-4xl">Photographs from the Trust</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/gallery">Open gallery</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["classroom", "campus-building", "hall-session", "celebration", "campus-ground", "community-gathering"]
              .map((id) => galleryItems.find((item) => item.id === id))
              .filter((item) => item != null)
              .map((item) => (
              <Link key={item.id} href="/gallery" className="group relative block aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image src={item.src} alt={item.alt} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 33vw, 100vw" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#14213D] to-transparent p-4 font-semibold text-white">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-4xl">How learning works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {learningPath.map((item) => (
            <article key={item.step} className="rounded-3xl border border-border p-5">
              <p className="font-display text-3xl text-brand-green">{item.step}</p>
              <h3 className="mt-3 font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#14213D] px-8 py-10 text-white md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-4xl">Visit the learning platform</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
              Sign in to the student campus, or open the trainer and admin workspaces with a staff account. Progress is saved to your account.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="accent">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild className="bg-white text-[#14213D] hover:bg-white/90">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
