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
    category: "Design & Publishing",
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

export const designCourses: Course[] = [
  build({
    slug: "desktop-publishing",
    title: "DTP",
    difficulty: "Beginner",
    hours: 36,
    summary: "Lay out a visiting card and a pamphlet, then export a file a printer can use.",
    description:
      "Desktop publishing is arranging type and pictures on a page that will be printed. Learners set the page size, place text and images, and check the file before it goes to print. The same steps apply in a page-layout program, whether the class uses an older DTP tool or a current one.",
    outcomes: [
      "Set a page size, margins, and a simple grid",
      "Place text and a picture so they do not collide",
      "Export a print-ready file and name what to check",
    ],
    icon: "type",
    modules: [
      {
        title: "A page",
        lessons: [
          lesson("Page size and margins", "Choose the finished size before you design anything inside it.", [
            "A visiting card, an A4 sheet, and a pamphlet cover are different page sizes. Write the size down first.",
            "Margins keep text off the edge that a cutter might trim.",
            "Bleed is the extra colour that runs past the trim so a white line does not appear after cutting.",
          ]),
          lesson("Text frames and type", "Put words in a frame, then choose a size and a line length a person can read.", [
            "One page needs one main typeface for the words and, if needed, one more for a heading.",
            "Body text that is too wide is hard to read. Keep the line short enough to follow.",
            "Check spelling on the page. A printed mistake is expensive to recall.",
          ]),
          lesson("Pictures on the page", "Place a picture in a frame and keep it from hiding the words.", [
            "Link or embed the picture so it still appears when the file moves to another computer.",
            "Do not stretch a photo until faces look wide. Scale it evenly.",
            "Leave space between the picture and the nearest line of text.",
          ]),
        ],
      },
      {
        title: "A print job",
        lessons: [
          lesson("A visiting card", "Design one card with a name, a role, a phone number, and one clear mark.", [
            "The name is the largest line. The phone number must be readable at arm's length.",
            "Use the real size of the card, not a giant page you plan to shrink later.",
            "Print one copy and read it before you order a stack.",
          ]),
          lesson("A pamphlet", "Fold the plan before you design, so the cover and the inside pages land in the right place.", [
            "A folded sheet has a front, a back, and inside panels. Label them before you add text.",
            "The cover carries the title. The inside carries the detail.",
            "Check that a sentence is not cut in half by the fold.",
          ]),
          lesson("Export for print", "Hand over a PDF with the fonts and pictures included, and say the page size.", [
            "A PDF keeps the layout. A loose collection of pictures does not.",
            "Include fonts or outline the type so a missing font does not substitute another.",
            "Write the trim size and whether the file includes bleed. The printer should not have to guess.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "photoshop",
    title: "Photoshop",
    difficulty: "Intermediate",
    hours: 40,
    summary: "Open a photograph in Photoshop, correct it on layers, and save a copy for the screen and a copy for print.",
    description:
      "Learners work in Photoshop on a practice photograph: the workspace, layers, crop, tone, a small retouch, and the two ways a file is usually saved. The course treats the original as something to keep. Corrections sit on copies and layers.",
    outcomes: [
      "Open a photograph and keep the original file untouched",
      "Crop, resize, and adjust tone on layers",
      "Save one file for the screen and one for print",
    ],
    icon: "image",
    modules: [
      {
        title: "The picture",
        lessons: [
          lesson("The Photoshop workspace", "Find the canvas, the tools, the layers panel, and the place a file is saved.", [
            "The canvas is the picture. Panels around it are controls, not part of the image.",
            "Save a working copy. Leave the camera original in its folder.",
            "Zoom in to judge an edge. Zoom out to judge the whole picture.",
          ]),
          lesson("Layers", "A layer is one sheet. The picture you see is the stack of sheets.", [
            "Name a layer for what it does, such as sky or text.",
            "Hide a layer to see what is underneath. Do not delete it until you are sure.",
            "Text and adjustments belong on their own layers so the photograph stays recoverable.",
          ]),
          lesson("Crop and resize", "Cut away what the picture does not need, then set the pixel size for where it will be used.", [
            "Crop for the subject. Do not leave a large empty corner unless it is deliberate.",
            "Resizing for a website and resizing for a large print are different jobs.",
            "Enlarging a small photo does not add detail. It only makes the existing pixels bigger.",
          ]),
        ],
      },
      {
        title: "Corrections and output",
        lessons: [
          lesson("Tone and colour", "Adjust brightness, contrast, and colour so the subject looks like the scene, not a different scene.", [
            "Look at skin, sky, and white paper. Those show a colour cast quickly.",
            "Make the change on an adjustment layer so you can reduce it later.",
            "Stop when the picture looks true. More saturation is not always better.",
          ]),
          lesson("Retouch a small area", "Remove a speck or a stray mark without repainting the whole photograph.", [
            "Work on a copy of the layer. If the repair looks wrong, you still have the layer below.",
            "Match the surrounding texture. A smooth patch on a rough wall is visible.",
            "A repair that changes what the picture claims happened is a different decision. Label it if you were asked only to clean dust.",
          ]),
          lesson("Save for screen and for print", "A screen file is small and in RGB. A print file keeps more detail and may need CMYK.", [
            "JPEG is a common screen file. Save it from a copy so the layered working file remains.",
            "Keep the layered file. You cannot rebuild layers from a flattened JPEG.",
            "Ask the printer which colour mode and resolution they want before you flatten the file.",
          ]),
        ],
      },
    ],
  }),
];