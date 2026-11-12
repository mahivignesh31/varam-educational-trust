"use client";

import { toast } from "sonner";
import type { DemoStore } from "@/lib/store";
import { useDemoStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

const CAMPUS_ID = "main";

type LearnerRow = {
  id: string;
  name: string;
  goal: string;
  enrolled_ids: DemoStore["enrolledIds"];
  completed_lesson_ids: DemoStore["completedLessonIds"];
  course_completed_at: DemoStore["courseCompletedAt"];
  last_lesson: DemoStore["lastLesson"];
  attempts: DemoStore["attempts"];
  assignment_drafts: DemoStore["assignmentDrafts"];
  updated_at: string;
};

type CampusRow = {
  id: string;
  course_patches: DemoStore["coursePatches"];
  deleted_course_ids: DemoStore["deletedCourseIds"];
  custom_courses: DemoStore["customCourses"];
  lesson_patches: DemoStore["lessonPatches"];
  hidden_lesson_ids: DemoStore["hiddenLessonIds"];
  custom_lessons: DemoStore["customLessons"];
  extra_questions: DemoStore["extraQuestions"];
  hidden_question_ids: DemoStore["hiddenQuestionIds"];
  announcement_extras: DemoStore["announcementExtras"];
  announcement_patches: DemoStore["announcementPatches"];
  deleted_announcement_ids: DemoStore["deletedAnnouncementIds"];
  gallery_patches: DemoStore["galleryPatches"];
  hidden_gallery_ids: DemoStore["hiddenGalleryIds"];
  updated_at: string;
};

let started = false;
let applying = false;
let ready = false;
let accountRole: "student" | "trainer" | "admin" | null = null;
let learnerTimer: ReturnType<typeof setTimeout> | undefined;
let campusTimer: ReturnType<typeof setTimeout> | undefined;
let warned = false;

function warnOnce(message: string) {
  if (warned) return;
  warned = true;
  toast.error(message);
}

function learnerPayload(state: DemoStore): LearnerRow {
  return {
    id: state.learnerId,
    name: state.studentName,
    goal: state.studentGoal,
    enrolled_ids: state.enrolledIds,
    completed_lesson_ids: state.completedLessonIds,
    course_completed_at: state.courseCompletedAt,
    last_lesson: state.lastLesson,
    attempts: state.attempts,
    assignment_drafts: state.assignmentDrafts,
    updated_at: new Date().toISOString(),
  };
}

function campusPayload(state: DemoStore): CampusRow {
  return {
    id: CAMPUS_ID,
    course_patches: state.coursePatches,
    deleted_course_ids: state.deletedCourseIds,
    custom_courses: state.customCourses,
    lesson_patches: state.lessonPatches,
    hidden_lesson_ids: state.hiddenLessonIds,
    custom_lessons: state.customLessons,
    extra_questions: state.extraQuestions,
    hidden_question_ids: state.hiddenQuestionIds,
    announcement_extras: state.announcementExtras,
    announcement_patches: state.announcementPatches,
    deleted_announcement_ids: state.deletedAnnouncementIds,
    gallery_patches: state.galleryPatches,
    hidden_gallery_ids: state.hiddenGalleryIds,
    updated_at: new Date().toISOString(),
  };
}

function learnerChanged(next: DemoStore, prev: DemoStore) {
  return (
    next.studentName !== prev.studentName ||
    next.studentGoal !== prev.studentGoal ||
    next.enrolledIds !== prev.enrolledIds ||
    next.completedLessonIds !== prev.completedLessonIds ||
    next.courseCompletedAt !== prev.courseCompletedAt ||
    next.lastLesson !== prev.lastLesson ||
    next.attempts !== prev.attempts ||
    next.assignmentDrafts !== prev.assignmentDrafts
  );
}

function campusChanged(next: DemoStore, prev: DemoStore) {
  return (
    next.coursePatches !== prev.coursePatches ||
    next.deletedCourseIds !== prev.deletedCourseIds ||
    next.customCourses !== prev.customCourses ||
    next.lessonPatches !== prev.lessonPatches ||
    next.hiddenLessonIds !== prev.hiddenLessonIds ||
    next.customLessons !== prev.customLessons ||
    next.extraQuestions !== prev.extraQuestions ||
    next.hiddenQuestionIds !== prev.hiddenQuestionIds ||
    next.announcementExtras !== prev.announcementExtras ||
    next.announcementPatches !== prev.announcementPatches ||
    next.deletedAnnouncementIds !== prev.deletedAnnouncementIds ||
    next.galleryPatches !== prev.galleryPatches ||
    next.hiddenGalleryIds !== prev.hiddenGalleryIds
  );
}

async function pushLearner(state: DemoStore) {
  if (!supabase || !state.learnerId) return;
  const { error } = await supabase.from("learner_records").upsert(learnerPayload(state));
  if (error) warnOnce("Progress could not be saved to your account.");
  await supabase
    .from("profiles")
    .update({ name: state.studentName, goal: state.studentGoal })
    .eq("id", state.learnerId);
}

async function pushCampus(state: DemoStore) {
  if (!supabase) return;
  const { error } = await supabase.from("campus_content").upsert(campusPayload(state));
  if (error) warnOnce("Campus edits could not be saved to the database. They remain on this device.");
}

function scheduleLearner() {
  clearTimeout(learnerTimer);
  learnerTimer = setTimeout(() => {
    void pushLearner(useDemoStore.getState());
  }, 400);
}

function scheduleCampus() {
  if (accountRole !== "admin" && accountRole !== "trainer") return;
  clearTimeout(campusTimer);
  campusTimer = setTimeout(() => {
    void pushCampus(useDemoStore.getState());
  }, 400);
}

async function refresh() {
  if (!supabase || !ready || applying) return;
  const state = useDemoStore.getState();
  const [campusRes, learnerRes] = await Promise.all([
    supabase.from("campus_content").select("*").eq("id", CAMPUS_ID).maybeSingle(),
    supabase.from("learner_records").select("*").eq("id", state.learnerId).maybeSingle(),
  ]);
  if (campusRes.error || learnerRes.error) return;
  applying = true;
  const campus = campusRes.data as CampusRow | null;
  const learner = learnerRes.data as LearnerRow | null;
  useDemoStore.setState({
    ...(campus
      ? {
          coursePatches: campus.course_patches ?? {},
          deletedCourseIds: campus.deleted_course_ids ?? [],
          customCourses: campus.custom_courses ?? [],
          lessonPatches: campus.lesson_patches ?? {},
          hiddenLessonIds: campus.hidden_lesson_ids ?? [],
          customLessons: campus.custom_lessons ?? {},
          extraQuestions: campus.extra_questions ?? [],
          hiddenQuestionIds: campus.hidden_question_ids ?? [],
          announcementExtras: campus.announcement_extras ?? [],
          announcementPatches: campus.announcement_patches ?? {},
          deletedAnnouncementIds: campus.deleted_announcement_ids ?? [],
          galleryPatches: campus.gallery_patches ?? {},
          hiddenGalleryIds: campus.hidden_gallery_ids ?? [],
        }
      : {}),
    ...(learner
      ? {
          studentName: learner.name,
          studentGoal: learner.goal,
          enrolledIds: learner.enrolled_ids ?? [],
          completedLessonIds: learner.completed_lesson_ids ?? [],
          courseCompletedAt: learner.course_completed_at ?? {},
          lastLesson: learner.last_lesson ?? {},
          attempts: learner.attempts ?? [],
          assignmentDrafts: learner.assignment_drafts ?? {},
        }
      : {}),
  });
  applying = false;
}

const emptyProgress = {
  enrolledIds: [] as DemoStore["enrolledIds"],
  completedLessonIds: [] as DemoStore["completedLessonIds"],
  courseCompletedAt: {} as DemoStore["courseCompletedAt"],
  lastLesson: {} as DemoStore["lastLesson"],
  attempts: [] as DemoStore["attempts"],
  assignmentDrafts: {} as DemoStore["assignmentDrafts"],
};

async function bindSession() {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) {
    ready = false;
    accountRole = null;
    applying = true;
    useDemoStore.setState({ learnerId: "", accountReady: false, ...emptyProgress });
    applying = false;
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name,role,goal,status")
    .eq("id", session.user.id)
    .maybeSingle();
  const role = profile?.role;
  const trainerWaiting = role === "trainer" && profile?.status !== "active";
  accountRole = trainerWaiting
    ? "student"
    : role === "admin" || role === "trainer" || role === "student"
      ? role
      : "student";
  const previous = useDemoStore.getState();
  if (previous.learnerId === session.user.id && previous.accountReady) return;
  applying = true;
  useDemoStore.setState({
    learnerId: session.user.id,
    studentName: profile?.name || session.user.user_metadata?.name || "Learner",
    studentGoal: profile?.goal || "",
    accountReady: false,
    ...(previous.learnerId !== session.user.id ? emptyProgress : {}),
  });
  applying = false;
  await pull();
}

async function pull() {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  if (!data.session) return;
  const state = useDemoStore.getState();

  const [campusRes, learnerRes] = await Promise.all([
    supabase.from("campus_content").select("*").eq("id", CAMPUS_ID).maybeSingle(),
    supabase.from("learner_records").select("*").eq("id", state.learnerId).maybeSingle(),
  ]);

  if (campusRes.error || learnerRes.error) {
    warnOnce("Your account could not be loaded from the database yet.");
    applying = true;
    useDemoStore.setState({ accountReady: true });
    applying = false;
    return;
  }

  const campus = campusRes.data as CampusRow | null;
  const learner = learnerRes.data as LearnerRow | null;
  applying = true;
  useDemoStore.setState({
    ...(campus
      ? {
          coursePatches: campus.course_patches ?? {},
          deletedCourseIds: campus.deleted_course_ids ?? [],
          customCourses: campus.custom_courses ?? [],
          lessonPatches: campus.lesson_patches ?? {},
          hiddenLessonIds: campus.hidden_lesson_ids ?? [],
          customLessons: campus.custom_lessons ?? {},
          extraQuestions: campus.extra_questions ?? [],
          hiddenQuestionIds: campus.hidden_question_ids ?? [],
          announcementExtras: campus.announcement_extras ?? [],
          announcementPatches: campus.announcement_patches ?? {},
          deletedAnnouncementIds: campus.deleted_announcement_ids ?? [],
          galleryPatches: campus.gallery_patches ?? {},
          hiddenGalleryIds: campus.hidden_gallery_ids ?? [],
        }
      : {}),
    ...(learner
      ? {
          studentName: learner.name,
          studentGoal: learner.goal,
          enrolledIds: learner.enrolled_ids ?? [],
          completedLessonIds: learner.completed_lesson_ids ?? [],
          courseCompletedAt: learner.course_completed_at ?? {},
          lastLesson: learner.last_lesson ?? {},
          attempts: learner.attempts ?? [],
          assignmentDrafts: learner.assignment_drafts ?? {},
        }
      : {}),
  });
  applying = false;

  const next = useDemoStore.getState();
  if (!campus && (accountRole === "admin" || accountRole === "trainer")) await pushCampus(next);
  if (!learner) await pushLearner(next);
  applying = true;
  useDemoStore.setState({ accountReady: true });
  applying = false;
  ready = true;
}

export function startCampusSync() {
  if (started || !supabase) return;
  started = true;

  const boot = () => {
    void bindSession();
    supabase?.auth.onAuthStateChange(() => {
      void bindSession();
    });
  };
  if (useDemoStore.persist.hasHydrated()) boot();
  else useDemoStore.persist.onFinishHydration(boot);

  useDemoStore.subscribe((next, prev) => {
    if (!ready || applying) return;
    if (learnerChanged(next, prev)) scheduleLearner();
    if (campusChanged(next, prev)) scheduleCampus();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    if (ready) void refresh();
    else void bindSession();
  });
}
