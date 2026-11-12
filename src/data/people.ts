import type { SampleStudent, SampleTrainer } from "@/types";

export const sampleStudents: SampleStudent[] = [
  {
    id: "sample-01",
    name: "Sample Learner 01",
    email: "learner.01@example.com",
    program: "Computer Fundamentals",
    progress: 72,
    status: "Sample roster",
  },
  {
    id: "sample-02",
    name: "Sample Learner 02",
    email: "learner.02@example.com",
    program: "Advanced Excel",
    progress: 46,
    status: "Sample roster",
  },
  {
    id: "sample-03",
    name: "Sample Learner 03",
    email: "learner.03@example.com",
    program: "Python Programming",
    progress: 88,
    status: "Sample roster",
  },
  {
    id: "sample-04",
    name: "Sample Learner 04",
    email: "learner.04@example.com",
    program: "Spoken English",
    progress: 35,
    status: "Sample roster",
  },
  {
    id: "sample-05",
    name: "Sample Learner 05",
    email: "learner.05@example.com",
    program: "Digital Literacy",
    progress: 64,
    status: "Sample roster",
  },
  {
    id: "sample-06",
    name: "Sample Learner 06",
    email: "learner.06@example.com",
    program: "Employability Skills",
    progress: 21,
    status: "Sample roster",
  },
  {
    id: "sample-07",
    name: "Sample Learner 07",
    email: "learner.07@example.com",
    program: "Microsoft Office",
    progress: 54,
    status: "Sample roster",
  },
  {
    id: "sample-08",
    name: "Sample Learner 08",
    email: "learner.08@example.com",
    program: "Artificial Intelligence Fundamentals",
    progress: 15,
    status: "Sample roster",
  },
];

export const sampleTrainers: SampleTrainer[] = [
  {
    id: "trainer-digital",
    name: "Sample faculty, Digital Skills",
    focus: "Computers, internet safety, and first office tasks",
    courses: ["Computer Fundamentals", "Digital Literacy", "Microsoft Office"],
  },
  {
    id: "trainer-data",
    name: "Sample faculty, Data & Spreadsheets",
    focus: "Worksheets, formulas, and charts that can be checked",
    courses: ["Advanced Excel"],
  },
  {
    id: "trainer-language",
    name: "Sample faculty, Communication",
    focus: "Spoken English and everyday workplace communication",
    courses: ["Spoken English", "Communication Skills"],
  },
  {
    id: "trainer-code",
    name: "Sample faculty, Programming",
    focus: "Python basics and a careful introduction to AI tools",
    courses: ["Python Programming", "Artificial Intelligence Fundamentals"],
  },
  {
    id: "trainer-career",
    name: "Sample faculty, Career Studio",
    focus: "Employability habits and choosing a next learning step",
    courses: ["Employability Skills", "Career Guidance"],
  },
];

export const weeklySample = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 1 },
  { day: "Wed", hours: 2 },
  { day: "Thu", hours: 0.5 },
  { day: "Fri", hours: 1.5 },
  { day: "Sat", hours: 2.5 },
  { day: "Sun", hours: 0.5 },
];
