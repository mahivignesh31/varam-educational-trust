"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CourseCard } from "@/components/courses/course-card";
import { EmptyState } from "@/components/lms/empty-state";
import { useStudentWorkspace } from "@/components/lms/use-student";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardContent, Progress } from "@/components/ui/primitives";
import { weeklySample } from "@/data/people";
import {
  assembleAnnouncements,
  assembleQuizzes,
  continueTarget,
  coursePath,
  courseProgress,
  learningHours,
  lessonPath,
} from "@/lib/catalog";
import { formatDate, formatMinutes } from "@/lib/format";
import { toast } from "sonner";

function formatLearningHours(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function DashboardView() {
  const workspace = useStudentWorkspace();
  const {
    studentName,
    catalog,
    catalogState,
    enrolled,
    enrolledIds,
    completedLessonIds,
    lastLesson,
    attempts,
    learningCatalog,
    courseCompletedAt,
    enroll,
  } = workspace;
  const router = useRouter();

  const enrolledCourses = enrolled.map((item) => item.course);
  const progresses = enrolledCourses.map((course) => courseProgress(course, completedLessonIds));
  const average = progresses.length
    ? Math.round(progresses.reduce((sum, value) => sum + value, 0) / progresses.length)
    : 0;
  const completed = progresses.filter((value) => value === 100).length;
  const hours = learningHours(enrolledCourses, completedLessonIds);
  const quizzes = assembleQuizzes(catalogState);
  const pending = quizzes.filter((quiz) => {
    const onEnrolledCourse = enrolledCourses.some(
      (course) => course.slug === quiz.courseSlug || course.id === quiz.courseSlug,
    );
    return onEnrolledCourse && !attempts.some((attempt) => attempt.quizId === quiz.id);
  }).length;
  const certificates = Object.keys(courseCompletedAt).filter((id) => {
    const course = enrolledCourses.find((item) => item.id === id) ?? learningCatalog.find((item) => item.id === id);
    return Boolean(course && courseProgress(course, completedLessonIds) === 100);
  }).length;
  const target = continueTarget(learningCatalog, enrolledIds, completedLessonIds, lastLesson);
  const recommended = catalog.filter((course) => !enrolledIds.includes(course.id)).slice(0, 3);
  const announcements = assembleAnnouncements(catalogState).filter(
    (item) => item.audience === "all" || item.audience === "students",
  );
  const chartRows = enrolledCourses.map((course) => ({
    id: course.id,
    name: course.title.length > 24 ? `${course.title.slice(0, 22)}…` : course.title,
    fullName: course.title,
    progress: courseProgress(course, completedLessonIds),
  }));

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <h1 className="font-display text-4xl text-foreground">Welcome Back, {studentName}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Counts on this page come from lessons, enrollments, and quiz attempts saved to the free database for this browser.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat
          label="Enrolled courses"
          value={String(enrolled.length)}
          detail="Courses kept in My Courses on this device."
          href="/lms/my-courses"
        />
        <Stat
          label="Completed courses"
          value={String(completed)}
          detail="Enrolled courses whose lessons are all marked complete."
          href="/lms/my-courses"
        />
        <Stat
          label="Learning hours"
          value={formatLearningHours(hours)}
          detail="From the minutes of lessons you marked complete."
          href="/lms/lessons"
        />
        <Stat
          label="Pending assessments"
          value={String(pending)}
          detail="Sample quizzes for enrolled courses with no saved attempt."
        />
        <Stat
          label="Certificates earned"
          value={String(certificates)}
          detail="Courses still at 100% in this browser. Preview count only."
        />
      </div>
      <Card>
        <CardContent className="space-y-3">
          <h2 className="font-display text-2xl">Overall progress</h2>
          <Progress value={average} label="Average of enrolled courses" />
          <p className="text-sm text-muted-foreground">
            {enrolled.length
              ? "The average follows lesson ticks saved in this browser."
              : "Enroll in a course to start an average."}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl">Continue learning</h2>
            {target ? (
              <>
                <p className="mt-2 font-semibold">{target.lesson.title}</p>
                <p className="text-sm text-muted-foreground">
                  {target.course.title} · {formatMinutes(target.lesson.minutes)}
                </p>
              </>
            ) : (
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                {enrolled.length
                  ? "Every lesson in your enrolled courses is marked complete in this browser."
                  : "Enroll in a course and this card will open the next lesson."}
              </p>
            )}
          </div>
          {target ? (
            <Button asChild>
              <Link href={lessonPath(target.course, target.lesson.id)}>Continue</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/lms/courses">Explore courses</Link>
            </Button>
          )}
        </CardContent>
      </Card>
      <section className="grid gap-4 lg:grid-cols-2" aria-label="Charts">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-display text-2xl">Your course progress</h2>
            {chartRows.length ? (
              <figure>
                <figcaption className="text-sm leading-6 text-muted-foreground">
                  Progress for courses you are enrolled in, calculated from lessons marked complete in this browser.
                </figcaption>
                <div className="mt-4 w-full min-w-0" style={{ height: Math.max(240, chartRows.length * 46) }} aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartRows} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                      <CartesianGrid stroke="currentColor" strokeOpacity={0.12} horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: "currentColor", fontSize: 12 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={128}
                        tick={{ fill: "currentColor", fontSize: 11 }}
                      />
                      <Tooltip
                        cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                        content={({ active, payload }) => {
                          const row = payload?.[0]?.payload as { fullName?: string; progress?: number } | undefined;
                          if (!active || !row) return null;
                          return (
                            <div className="rounded-2xl border border-border bg-card px-3 py-2 text-sm text-card-foreground shadow">
                              <p className="font-semibold">{row.fullName}</p>
                              <p>{row.progress}% complete</p>
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="progress" fill="#00A651" radius={[0, 8, 8, 0]} name="Progress" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <table className="sr-only">
                  <caption>Progress for enrolled courses from lessons marked complete in this browser</caption>
                  <thead>
                    <tr>
                      <th scope="col">Course</th>
                      <th scope="col">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartRows.map((row) => (
                      <tr key={row.id}>
                        <th scope="row">{row.fullName}</th>
                        <td>{row.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
            ) : (
              <EmptyState
                title="No enrolled progress yet"
                body="Enroll in a course and the bars will show how many lessons you have marked complete in this browser."
              >
                <Button asChild>
                  <Link href="/lms/courses">Explore courses</Link>
                </Button>
              </EmptyState>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="font-display text-2xl">Weekly rhythm</h2>
            <figure className="mt-4">
              <figcaption className="text-sm leading-6 text-muted-foreground">
                Illustrative weekly rhythm for the demonstration dashboard. Not attendance records.
              </figcaption>
              <div className="mt-4 h-72 w-full min-w-0" aria-hidden="true">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySample} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="currentColor" strokeOpacity={0.12} vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "currentColor", fontSize: 12 }} />
                    <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                      formatter={(value) => [`${value ?? 0} hours`, "Sample hours"]}
                    />
                    <Bar dataKey="hours" fill="#F58220" radius={[8, 8, 0, 0]} name="Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <table className="sr-only">
                <caption>Illustrative weekly rhythm for the demonstration dashboard. Not attendance records.</caption>
                <thead>
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklySample.map((row) => (
                    <tr key={row.day}>
                      <th scope="row">{row.day}</th>
                      <td>{row.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          </CardContent>
        </Card>
      </section>
      <section className="space-y-4" aria-labelledby="recommended-heading">
        <h2 id="recommended-heading" className="font-display text-3xl">
          Recommended
        </h2>
        {recommended.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {recommended.map((course) => (
              <CourseCard key={course.id} course={course}>
                <Button
                  type="button"
                  onClick={() => {
                    enroll(course.id);
                    toast.success(`Enrolled in ${course.title}.`);
                    router.push(coursePath(course));
                  }}
                >
                  Enroll
                </Button>
              </CourseCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="You are enrolled in every visible course"
            body="Courses you add in this browser will appear here until you enroll."
          >
            <Button asChild>
              <Link href="/lms/my-courses">Review my courses</Link>
            </Button>
          </EmptyState>
        )}
      </section>
      <section className="space-y-4" aria-labelledby="announcements-heading">
        <h2 id="announcements-heading" className="font-display text-3xl">
          Announcements
        </h2>
        {announcements.length ? (
          <ul className="grid gap-4">
            {announcements.map((item) => (
              <li key={item.id}>
                <Card>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.pinned ? <Badge tone="green">Pinned</Badge> : <Badge tone="muted">Notice</Badge>}
                      <Badge tone="blue">{item.audience === "all" ? "Everyone" : "Students"}</Badge>
                      <time dateTime={item.createdAt} className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </time>
                    </div>
                    <h3 className="font-display text-2xl">{item.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No announcements for students are saved in this browser.</p>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
  href,
}: {
  label: string;
  value: string;
  detail: string;
  href?: string;
}) {
  const body = (
    <Card className="h-full">
      <CardContent>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="mt-2 font-display text-4xl text-foreground">{value}</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
  if (!href) return body;
  return (
    <Link href={href} className="block h-full rounded-3xl">
      {body}
    </Link>
  );
}
