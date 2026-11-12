import type { Course, QuizAttempt } from "@/types";
import { courseProgress } from "@/lib/catalog";
import { supabase } from "@/lib/supabase";

export type StudentStat = {
  id: string;
  name: string;
  email: string;
  program: string;
  progress: number;
  enrolled: number;
  attempts: number;
};

type ProfileRow = { id: string; name: string | null; role: string; goal: string | null };
type LearnerRow = {
  id: string;
  enrolled_ids: unknown;
  completed_lesson_ids: unknown;
  attempts: unknown;
};

function asStrings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export async function loadStudentStats(catalog: Course[]): Promise<StudentStat[]> {
  if (!supabase) throw new Error("The database is not configured.");
  const [profilesRes, learnersRes] = await Promise.all([
    supabase.from("profiles").select("id,name,role,goal").eq("role", "student"),
    supabase.from("learner_records").select("id,enrolled_ids,completed_lesson_ids,attempts"),
  ]);
  if (profilesRes.error || learnersRes.error) {
    throw new Error("Registered students could not be loaded.");
  }
  const learners = new Map((learnersRes.data as LearnerRow[] | null ?? []).map((row) => [row.id, row]));
  const coursesById = new Map(catalog.map((course) => [course.id, course]));
  return ((profilesRes.data as ProfileRow[] | null) ?? []).map((profile) => {
    const record = learners.get(profile.id);
    const enrolledIds = asStrings(record?.enrolled_ids);
    const completed = asStrings(record?.completed_lesson_ids);
    const courses = enrolledIds.map((id) => coursesById.get(id)).filter((course): course is Course => Boolean(course));
    const progress = courses.length
      ? Math.round(courses.reduce((sum, course) => sum + courseProgress(course, completed), 0) / courses.length)
      : 0;
    return {
      id: profile.id,
      name: profile.name?.trim() || "Student",
      email: "",
      program: courses.map((course) => course.title).join(", ") || profile.goal?.trim() || "Not enrolled",
      progress,
      enrolled: courses.length,
      attempts: Array.isArray(record?.attempts) ? record.attempts.length : 0,
    };
  });
}

export type CampusAttempt = QuizAttempt & { studentName: string };

function isAttempt(value: unknown): value is QuizAttempt {
  if (!value || typeof value !== "object") return false;
  const attempt = value as Partial<QuizAttempt>;
  return typeof attempt.id === "string" && typeof attempt.title === "string" && typeof attempt.percent === "number";
}

export async function loadCampusAttempts(): Promise<CampusAttempt[]> {
  if (!supabase) throw new Error("The database is not configured.");
  const [profilesRes, learnersRes] = await Promise.all([
    supabase.from("profiles").select("id,name,role").eq("role", "student"),
    supabase.from("learner_records").select("id,name,attempts"),
  ]);
  if (profilesRes.error || learnersRes.error) throw new Error("Quiz attempts could not be loaded.");
  const names = new Map(
    ((profilesRes.data as { id: string; name: string | null }[] | null) ?? []).map((row) => [row.id, row.name?.trim() || "Student"]),
  );
  const attempts: CampusAttempt[] = [];
  for (const row of (learnersRes.data as { id: string; name: string | null; attempts: unknown }[] | null) ?? []) {
    if (!names.has(row.id) || !Array.isArray(row.attempts)) continue;
    for (const attempt of row.attempts) {
      if (isAttempt(attempt)) attempts.push({ ...attempt, studentName: names.get(row.id) || row.name || "Student" });
    }
  }
  return attempts.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}
