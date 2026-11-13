import type { Course, Lesson, Module } from "@/types";

interface LessonSeed {
  title: string;
  minutes: number;
  summary: string;
  objectives: string[];
  notes: string[];
}

function lesson(title: string, summary: string, notes: string[]): LessonSeed {
  return {
    title,
    minutes: 25,
    summary,
    objectives: [
      `Explain what ${title.toLowerCase()} is for`,
      "Complete the practice task in the notes",
      "Check the result before moving to the next lesson",
    ],
    notes,
  };
}

function build(seed: {
  slug: string;
  title: string;
  difficulty: Course["difficulty"];
  hours: number;
  summary: string;
  description: string;
  outcomes: string[];
  icon: Course["icon"];
  modules: { title: string; lessons: LessonSeed[] }[];
}): Course {
  let count = 0;
  const modules: Module[] = seed.modules.map((module, moduleIndex) => ({
    id: `${seed.slug}-m${moduleIndex + 1}`,
    title: module.title,
    lessons: module.lessons.map((item) => {
      count += 1;
      const id = `${seed.slug}-l${count}`;
      const built: Lesson = {
        id,
        title: item.title,
        minutes: item.minutes,
        summary: item.summary,
        objectives: item.objectives,
        notes: item.notes,
        video: { kind: "local" },
        materials: [
          {
            id: `${id}-notes`,
            title: `${item.title} — study notes`,
            body: [item.summary, "", "Study notes", ...item.notes.map((note) => `• ${note}`)].join("\n"),
          },
        ],
      };
      return built;
    }),
  }));

  return {
    id: seed.slug,
    slug: seed.slug,
    title: seed.title,
    category: "Business",
    difficulty: seed.difficulty,
    instructor: "Varam faculty",
    hours: seed.hours,
    summary: seed.summary,
    description: seed.description,
    outcomes: seed.outcomes,
    thumbnail: "classroom",
    icon: seed.icon,
    modules,
  };
}

export const businessCourses: Course[] = [
  build({
    slug: "entrepreneurship",
    title: "Entrepreneurship",
    difficulty: "Beginner",
    hours: 30,
    summary: "Shape one small offer, name what it costs, and plan a short trial with real customers.",
    description:
      "Learners start from a problem they have actually seen, name who would pay, and write one offer. The course ends with a small trial plan: the costs they can list, how they would reach the first customers, and what they would write down afterwards. A class plan is not a registered business and not a promise of profit.",
    outcomes: [
      "Describe one customer and one problem they have",
      "Write a single offer and the costs of trying it",
      "Plan a short trial and say how you would judge it",
    ],
    icon: "store",
    modules: [
      {
        title: "An offer someone can buy",
        lessons: [
          lesson("A problem you have seen", "Start from a difficulty a real person already has, not from a product name.", [
            "Write the problem in one sentence a neighbour could recognise.",
            "If you have not watched someone meet that problem, you do not know it yet.",
            "A clever idea with no person attached is still only an idea.",
          ]),
          lesson("The person who has that problem", "Name who would use the offer, where they are, and how they solve it today.", [
            "One kind of customer is enough for a first trial. Do not say everyone.",
            "Note what they already pay, or the time they already spend, on the current fix.",
            "Ask two of those people before you spend money. Their answer can change the offer.",
          ]),
          lesson("One offer, not five", "Say what the customer receives, what they pay, and what you will not do yet.", [
            "The offer is a thing or a service with a price, not a list of future ideas.",
            "Leave out extras until the first version has been tried.",
            "Write the price as a number you can explain, even if you change it after the trial.",
          ]),
        ],
      },
      {
        title: "A small trial",
        lessons: [
          lesson("Costs you can name", "List what you must spend to try the offer once, and what you can borrow or already own.", [
            "Separate a one-time cost, such as a tool, from a cost that repeats, such as materials.",
            "If a number is a guess, label it as a guess.",
            "A class sheet is not a bank loan and not a registration. Check the local rule before you sell regularly.",
          ]),
          lesson("The first few customers", "Decide how you will reach a small number of people and what you will ask them.", [
            "A trial can be ten people, not a crowd.",
            "Tell them it is a trial. Say what they get and what it costs.",
            "Write down what they say, including a no.",
          ]),
          lesson("What you write down afterwards", "Compare what you expected with what happened, and decide the next small step.", [
            "Count how many people were offered it, how many accepted, and what they paid.",
            "A loss on a trial is a result. It is not hidden by leaving out a cost.",
            "The next step is one change or a stop. It is not a promise that the business will grow.",
          ]),
        ],
      },
    ],
  }),
];