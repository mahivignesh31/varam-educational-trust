"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CourseCard } from "@/components/courses/course-card";
import { resumeLesson } from "@/components/courses/resume-lesson";
import { EmptyState } from "@/components/lms/empty-state";
import { PageHeader } from "@/components/lms/page-header";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/primitives";
import { coursePath, courseProgress, findPresentedCourse, lessonPath } from "@/lib/catalog";
import type { Difficulty } from "@/types";

type SortKey = "title" | "hours" | "difficulty";
type DifficultyFilter = "All" | Difficulty;

const difficultyRank: Record<Difficulty, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

export function CatalogView() {
  const {
    catalog,
    catalogState,
    enrolledIds,
    completedLessonIds,
    lastLesson,
    enroll,
    restoreCourse,
  } = useStudentWorkspace();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("All");
  const [sort, setSort] = useState<SortKey>("title");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(catalog.map((course) => course.category))).sort((a, b) => a.localeCompare(b, "en"))],
    [catalog],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return catalog
      .filter((course) => {
        const haystack = [course.title, course.summary, course.instructor, course.category, course.description]
          .join(" ")
          .toLowerCase();
        const matchesQuery = !needle || haystack.includes(needle);
        const matchesCategory = category === "All" || course.category === category;
        const matchesDifficulty = difficulty === "All" || course.difficulty === difficulty;
        return matchesQuery && matchesCategory && matchesDifficulty;
      })
      .sort((a, b) => {
        if (sort === "hours") return a.hours - b.hours || a.title.localeCompare(b.title, "en");
        if (sort === "difficulty") {
          return difficultyRank[a.difficulty] - difficultyRank[b.difficulty] || a.title.localeCompare(b.title, "en");
        }
        return a.title.localeCompare(b.title, "en");
      });
  }, [catalog, category, difficulty, query, sort]);

  const hiddenCourses = catalogState.deletedCourseIds.flatMap((id) => {
    const found = findPresentedCourse(id, catalogState);
    return found ? [found.course] : [];
  });

  const dirty = query.trim() !== "" || category !== "All" || difficulty !== "All" || sort !== "title";

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setDifficulty("All");
    setSort("title");
  }

  function enrollIn(courseId: string) {
    enroll(courseId);
    const course = catalog.find((item) => item.id === courseId);
    toast.success(course ? `Enrolled in ${course.title}.` : "Enrolled.");
    if (course) router.push(coursePath(course));
  }

  function restore(courseId: string) {
    restoreCourse(courseId);
    toast.success("Course restored in this browser.");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Explore Courses">
        <p>Every course is listed here. Enroll to open that course’s description, outcomes, and lessons. They also stay under My Courses.</p>
      </PageHeader>
      <form className="grid gap-3 md:grid-cols-4" onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="course-search">Search</Label>
          <Input
            id="course-search"
            value={query}
            placeholder="Title, instructor, or topic"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-category">Category</Label>
          <Select id="course-category" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-difficulty">Difficulty</Label>
          <Select
            id="course-difficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as DifficultyFilter)}
          >
            <option value="All">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="course-sort">Sort</Label>
          <Select id="course-sort" value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="title">Title (A–Z)</option>
            <option value="hours">Duration (shorter first)</option>
            <option value="difficulty">Difficulty (beginner first)</option>
          </Select>
        </div>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {filtered.length === 1 ? "1 course" : `${filtered.length} courses`}
        </p>
        {dirty ? (
          <Button type="button" variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : null}
      </div>
      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => {
            const enrolled = enrolledIds.includes(course.id);
            const lesson = resumeLesson(course, completedLessonIds, lastLesson[course.id]);
            const progress = courseProgress(course, completedLessonIds);
            return (
              <CourseCard key={course.id} course={course} progress={enrolled ? progress : undefined}>
                {enrolled && lesson ? (
                  <Button asChild>
                    <Link href={lessonPath(course, lesson.id)}>Continue</Link>
                  </Button>
                ) : null}
                {enrolled && !lesson ? (
                  <Button asChild variant="outline">
                    <Link href={coursePath(course)}>Open course</Link>
                  </Button>
                ) : null}
                {!enrolled ? (
                  <Button type="button" onClick={() => enrollIn(course.id)}>
                    Enroll
                  </Button>
                ) : null}
              </CourseCard>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No courses match"
          body={
            dirty
              ? "Nothing in this browser matches that search, category, or difficulty. Clear the filters to see the sample courses again."
              : hiddenCourses.length
                ? "No visible courses are stored in this browser. Restore a hidden course below if you hid one earlier."
                : "No courses are visible in this browser."
          }
        >
          {dirty ? (
            <Button type="button" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : null}
        </EmptyState>
      )}
      {hiddenCourses.length ? (
        <section className="space-y-4" aria-labelledby="hidden-courses-heading">
          <h2 id="hidden-courses-heading" className="font-display text-3xl">
            Hidden in this browser
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {hiddenCourses.map((course) => (
              <CourseCard key={course.id} course={course}>
                <Button type="button" onClick={() => restore(course.id)}>
                  Restore
                </Button>
              </CourseCard>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
