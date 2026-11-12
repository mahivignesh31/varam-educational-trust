export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type AssessmentCategory = "practice" | "fortnightly" | "monthly" | "final";

export type CourseIcon =
  | "monitor"
  | "sheet"
  | "table"
  | "globe"
  | "languages"
  | "messages"
  | "code"
  | "spark"
  | "briefcase"
  | "compass"
  | "layout"
  | "braces"
  | "terminal"
  | "cloud"
  | "workflow"
  | "chart"
  | "bot"
  | "cpu"
  | "radio";

export interface LessonMaterial {
  id: string;
  title: string;
  body: string;
}

export interface LessonVideo {
  kind: "youtube" | "local";
  youtubeId?: string;
  start?: number;
  credit?: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  objectives: string[];
  notes: string[];
  video: LessonVideo;
  materials: LessonMaterial[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  instructor: string;
  hours: number;
  summary: string;
  description: string;
  outcomes: string[];
  thumbnail: "classroom" | "group";
  icon: CourseIcon;
  custom?: boolean;
  modules: Module[];
}

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  added?: boolean;
}

export interface Quiz {
  id: string;
  courseSlug: string;
  title: string;
  category: AssessmentCategory;
  minutes: number;
  questions: Question[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  courseSlug: string;
  title: string;
  category: AssessmentCategory;
  answers: (number | null)[];
  correct: number;
  total: number;
  percent: number;
  submittedAt: string;
  timedOut: boolean;
}

export interface ActiveQuiz {
  quizId: string;
  answers: (number | null)[];
  reviews: boolean[];
  index: number;
  endsAt: number;
}

export interface Assignment {
  id: string;
  courseSlug: string;
  title: string;
  prompt: string;
  minutes: number;
}

export interface AssignmentDraft {
  text: string;
  savedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: "all" | "students" | "trainers";
  pinned: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: string;
  alt: string;
}

export interface SampleStudent {
  id: string;
  name: string;
  email: string;
  program: string;
  progress: number;
  status: string;
}

export interface SampleTrainer {
  id: string;
  name: string;
  focus: string;
  courses: string[];
}

export type LessonPatch = Partial<Pick<Lesson, "title" | "summary">>;

export type CoursePatch = Partial<
  Pick<
    Course,
    | "title"
    | "summary"
    | "description"
    | "category"
    | "difficulty"
    | "instructor"
    | "hours"
  >
>;
