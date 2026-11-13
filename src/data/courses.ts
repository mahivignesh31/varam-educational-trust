import type { Course, Lesson, LessonVideo, Module } from "@/types";
import { designCourses } from "@/data/design-courses";
import { financeCourses } from "@/data/finance-courses";
import { technologyCourses } from "@/data/technology-courses";

interface LessonSeed {
  title: string;
  minutes: number;
  summary: string;
  objectives: string[];
  notes: string[];
  video?: LessonVideo;
}

interface ModuleSeed {
  title: string;
  lessons: LessonSeed[];
}

interface CourseSeed {
  slug: string;
  title: string;
  category: string;
  difficulty: Course["difficulty"];
  instructor: string;
  hours: number;
  summary: string;
  description: string;
  outcomes: string[];
  thumbnail: Course["thumbnail"];
  icon: Course["icon"];
  modules: ModuleSeed[];
}

const localVideo: LessonVideo = { kind: "local" };

function materialBody(lesson: LessonSeed) {
  return [
    lesson.summary,
    "",
    "Objectives",
    ...lesson.objectives.map((item) => `• ${item}`),
    "",
    "Study notes",
    ...lesson.notes.map((item) => `• ${item}`),
    "",
    "Sample notes for the Varam demonstration campus. Not an official textbook extract.",
  ].join("\n");
}

function buildLesson(slug: string, index: number, seed: LessonSeed): Lesson {
  const id = `${slug}-l${index}`;
  return {
    id,
    title: seed.title,
    minutes: seed.minutes,
    summary: seed.summary,
    objectives: seed.objectives,
    notes: seed.notes,
    video: seed.video ?? localVideo,
    materials: [
      {
        id: `${id}-notes`,
        title: `${seed.title} — study notes`,
        body: materialBody(seed),
      },
    ],
  };
}

function buildCourse(seed: CourseSeed): Course {
  let count = 0;
  const modules: Module[] = seed.modules.map((module, moduleIndex) => ({
    id: `${seed.slug}-m${moduleIndex + 1}`,
    title: module.title,
    lessons: module.lessons.map((lesson) => {
      count += 1;
      return buildLesson(seed.slug, count, lesson);
    }),
  }));

  return {
    id: seed.slug,
    slug: seed.slug,
    title: seed.title,
    category: seed.category,
    difficulty: seed.difficulty,
    instructor: seed.instructor,
    hours: seed.hours,
    summary: seed.summary,
    description: seed.description,
    outcomes: seed.outcomes,
    thumbnail: seed.thumbnail,
    icon: seed.icon,
    modules,
  };
}

const youtube = (
  youtubeId: string,
  credit: string,
  start?: number,
): LessonVideo => ({ kind: "youtube", youtubeId, credit, start });

export const courses: Course[] = [
  ...technologyCourses,
  ...financeCourses,
  ...designCourses,
  buildCourse({
    slug: "computer-fundamentals",
    title: "Computer Fundamentals",
    category: "Digital Skills",
    difficulty: "Beginner",
    instructor: "Sample faculty, Digital Skills",
    hours: 18,
    summary:
      "A first map of the computer: hardware you can point to, software that runs it, and safe everyday file work.",
    description:
      "This sample offering introduces computers for learners who want a calm, practical start. It covers parts of a machine, the role of an operating system, files and folders, browsers, and simple account care. It is a demonstration course until the Trust verifies the final syllabus.",
    outcomes: [
      "Name the main parts of a computer and the job each one does",
      "Save, find, and organise a file",
      "Use a browser and a password with basic care",
    ],
    thumbnail: "classroom",
    icon: "monitor",
    modules: [
      {
        title: "The machine in front of you",
        lessons: [
          {
            title: "What a computer is doing",
            minutes: 16,
            summary:
              "A computer follows instructions and works on data. This lesson separates the idea of hardware from the programs we open.",
            objectives: [
              "Explain hardware and software in one sentence each",
              "Give an example of input, processing, and output",
              "Say why a computer needs both electricity and instructions",
            ],
            notes: [
              "Input is what you give the machine, such as a click or a typed word.",
              "Processing is the work done on that input.",
              "Output is the result you can see, hear, or save.",
              "A phone and a desktop computer share this pattern, even when they look different.",
            ],
            video: youtube(
              "O5nskjZ_GoI",
              "Public lesson: Crash Course Computer Science #1, Early Computing. Varam does not host this recording.",
            ),
          },
          {
            title: "Hardware you can point to",
            minutes: 18,
            summary:
              "Learners name the pieces they can touch and the pieces that stay inside the case.",
            objectives: [
              "Point out a keyboard, mouse or touchpad, screen, and system unit",
              "Distinguish memory that forgets from storage that keeps files",
              "Explain the CPU as the part that carries out instructions",
            ],
            notes: [
              "The CPU carries out instructions. CPU means Central Processing Unit.",
              "RAM is temporary working space. It is cleared when the power goes off.",
              "A hard drive or SSD keeps files after shutdown.",
              "The screen shows output. It does not, by itself, store your documents.",
            ],
          },
          {
            title: "Software and the operating system",
            minutes: 15,
            summary:
              "Programs are instructions. The operating system is the program that manages the others and the hardware.",
            objectives: [
              "Name the operating system on a machine you use",
              "Open and close an application on purpose",
              "Describe one job of an operating system",
            ],
            notes: [
              "Windows, macOS, ChromeOS, Android, and Linux are examples of operating systems.",
              "An application is a program for a task, such as writing or browsing.",
              "Closing a window is not always the same as shutting the computer down.",
              "Updates often repair problems. They should come from the system itself, not from a surprise pop-up.",
            ],
            video: youtube(
              "26QPDBe-NB8",
              "Public lesson: Crash Course Computer Science #18, Operating Systems. Varam does not host this recording.",
            ),
          },
        ],
      },
      {
        title: "Files, the web, and care",
        lessons: [
          {
            title: "Files, folders, and saving",
            minutes: 18,
            summary:
              "A file is a saved piece of work. A folder is a place to keep related files so they can be found again.",
            objectives: [
              "Create a folder and save a file inside it",
              "Rename a file without removing its type by accident",
              "Tell the difference between Save and Save As",
            ],
            notes: [
              "Save updates the file you already opened. Save As makes another copy.",
              "A clear name such as Notice-12-April is easier to find than Document1.",
              "The ending, such as .docx or .pdf, tells the computer which program should open the file.",
              "Deleting a file from the desktop does not delete every copy if you already saved it elsewhere.",
            ],
          },
          {
            title: "Using a browser with care",
            minutes: 16,
            summary:
              "A browser is the program that opens websites. The address bar is where you check where you really are.",
            objectives: [
              "Open a website by typing an address",
              "Use a tab without losing the page you already have",
              "Notice https and a strange address before entering information",
            ],
            notes: [
              "The address bar is not the same as a search box, though many browsers let you type both.",
              "https means the connection is encrypted. It does not by itself prove a site is honest.",
              "A new tab keeps the current page open.",
              "Pop-ups that demand an immediate download deserve a pause and a question to the trainer.",
            ],
          },
          {
            title: "Accounts, passwords, and backups",
            minutes: 17,
            summary:
              "An account is a name the computer or a website knows you by. A password should be long, unique, and not shared.",
            objectives: [
              "Explain why one password should not be reused everywhere",
              "Sign out of an account on a shared computer",
              "Name one way to keep a second copy of important work",
            ],
            notes: [
              "A strong password is long and unique. A phrase you can remember is often better than a short jumble.",
              "Never give a password to someone who contacts you unexpectedly.",
              "On a shared computer, sign out before you walk away.",
              "A backup is a second copy. One copy on the desktop is not a backup.",
            ],
          },
        ],
      },
    ],
  }),
  buildCourse({
    slug: "microsoft-office",
    title: "Microsoft Office",
    category: "Digital Skills",
    difficulty: "Intermediate",
    instructor: "Sample faculty, Digital Skills",
    hours: 20,
    summary:
      "Documents, slides, and shared files for everyday study and office tasks, with an emphasis on readable work.",
    description:
      "This sample course walks through the kind of Office work a learner meets in class and in a first job: a clean document, a short presentation, and a file another person can open. The final syllabus is subject to verification by the Trust.",
    outcomes: [
      "Produce a readable one-page document",
      "Build a short slide deck that supports a talk",
      "Save and share a file in a form the reader can open",
    ],
    thumbnail: "group",
    icon: "sheet",
    modules: [
      {
        title: "Documents people can read",
        lessons: [
          {
            title: "The Office workspace",
            minutes: 14,
            summary:
              "The ribbon, the page, and the file name are the three places a new user should be able to find.",
            objectives: [
              "Find the ribbon, the document area, and the file name",
              "Start a blank document",
              "Save the file into a chosen folder",
            ],
            notes: [
              "The ribbon groups commands by job: Home, Insert, and so on.",
              "The title bar shows the file name. Document1 means you have not chosen a name yet.",
              "Undo is the safest way back from a mistake.",
              "Zoom changes what you see. It does not change the printed page.",
            ],
          },
          {
            title: "Writing a clean document",
            minutes: 18,
            summary:
              "A useful document has a title, short paragraphs, and words a reader can scan.",
            objectives: [
              "Add a title and two or three short sections",
              "Use headings instead of only making text larger",
              "Check spelling without trusting it blindly",
            ],
            notes: [
              "One idea per paragraph is easier to read than a long block.",
              "Headings help a reader jump. Bold alone is not a heading style.",
              "Spellcheck misses real words used in the wrong place.",
              "Read the page once from the reader’s point of view before you send it.",
            ],
          },
          {
            title: "Formatting that stays readable",
            minutes: 16,
            summary:
              "Alignment, spacing, and simple lists do more for a page than many colours.",
            objectives: [
              "Set consistent alignment and spacing",
              "Make a short bulleted list",
              "Avoid low-contrast text and tiny fonts",
            ],
            notes: [
              "Left-aligned body text is usually easier to read than centred paragraphs.",
              "A list is for items. A paragraph is for an explanation.",
              "Dark text on a light page is the safest default.",
              "If you must print, check the margins before you decorate.",
            ],
          },
        ],
      },
      {
        title: "Slides and sharing",
        lessons: [
          {
            title: "A simple presentation",
            minutes: 16,
            summary:
              "Slides support a speaker. They are not a script pasted onto the screen.",
            objectives: [
              "Create a title slide and three content slides",
              "Keep one idea on each slide",
              "Use a large font a back row could read",
            ],
            notes: [
              "A title tells the listener what this slide is for.",
              "Six short lines are usually enough.",
              "Pictures need a reason. Decoration is not a reason.",
              "Notes for the speaker can live off the slide.",
            ],
          },
          {
            title: "Slides that support a talk",
            minutes: 15,
            summary:
              "Practice the order out loud. The slide should still make sense if you pause.",
            objectives: [
              "Reorder slides",
              "Present from the first slide without reading every word",
              "Prepare one sentence you will say that is not written on the slide",
            ],
            notes: [
              "Start with what the listener should leave knowing.",
              "A dark room and a bright projector can wash out pale colours.",
              "Have a copy of the file in the folder you will actually use.",
              "If a slide needs a paragraph, it may belong in a handout instead.",
            ],
          },
          {
            title: "Sharing a file politely",
            minutes: 14,
            summary:
              "The person who receives a file needs the right format, a clear name, and no surprise edits.",
            objectives: [
              "Choose between an editable file and a PDF",
              "Name a file so the receiver knows what it is",
              "Check that you are not sending a private draft",
            ],
            notes: [
              "PDF keeps the look more stable. An Office file lets the next person edit.",
              "Put the topic and date in the file name.",
              "Look at the attachment list before you send.",
              "A shared computer’s recent-files list may show work you meant to keep private.",
            ],
          },
        ],
      },
    ],
  }),
  buildCourse({
    slug: "advanced-excel",
    title: "Advanced Excel",
    category: "Digital Skills",
    difficulty: "Advanced",
    instructor: "Sample faculty, Data & Spreadsheets",
    hours: 24,
    summary:
      "Cells, formulas, filters, and charts, with the habit of checking a sheet before anyone else relies on it.",
    description:
      "This sample course is for learners who can already open a workbook and now want formulas they can explain. It covers references, SUM and IF, lists, charts, and a final check. Treat the syllabus as a demonstration until the Trust confirms it.",
    outcomes: [
      "Write a formula and explain what it refers to",
      "Filter a list and summarise it",
      "Build a chart that matches the question being asked",
    ],
    thumbnail: "classroom",
    icon: "table",
    modules: [
      {
        title: "Formulas you can explain",
        lessons: [
          {
            title: "Cells, ranges, and references",
            minutes: 18,
            summary:
              "A cell is one address, such as A1. A range is a block, such as A1:A10. Formulas begin with an equals sign.",
            objectives: [
              "Name a cell by its column letter and row number",
              "Select a range",
              "Start a formula with =",
            ],
            notes: [
              "Columns are letters. Rows are numbers. A1 is column A, row 1.",
              "A range uses a colon: A1:A10.",
              "Every formula starts with =. Without it, Excel stores the text, not a calculation.",
              "A relative reference changes when you fill it down. An absolute reference uses $ and stays put.",
            ],
            video: youtube(
              "wbJcJCkBcMg",
              "Public lesson: Excel for Beginners — The Complete Course. Varam does not host this recording.",
            ),
          },
          {
            title: "SUM, AVERAGE, and COUNT",
            minutes: 18,
            summary:
              "These functions summarise a range so you do not add a long column by hand.",
            objectives: [
              "Write SUM for a column of numbers",
              "Use AVERAGE and say what it does not tell you",
              "Use COUNT or COUNTA for the right kind of cells",
            ],
            notes: [
              "SUM adds numbers. Text in the range is ignored by SUM.",
              "AVERAGE can hide a very high or very low value. Look at the list as well.",
              "COUNT counts numbers. COUNTA counts cells that are not empty.",
              "Check the range highlight before you press Enter.",
            ],
            video: youtube(
              "Jl0Qk63z2ZY",
              "Public lesson: Excel Formulas and Functions Tutorial. Varam does not host this recording.",
            ),
          },
          {
            title: "IF and a simple check",
            minutes: 20,
            summary:
              "IF returns one value when a test is true and another when it is false.",
            objectives: [
              "Write a test such as B2>=40",
              "Return two different labels with IF",
              "Read an error instead of ignoring it",
            ],
            notes: [
              "The shape is =IF(test, value if true, value if false).",
              "Text results need quotes. Numbers do not.",
              "#DIV/0! and #VALUE! are messages. They mean the formula needs a correction.",
              "Test the formula on a row where you already know the answer.",
            ],
          },
        ],
      },
      {
        title: "Lists, charts, and handover",
        lessons: [
          {
            title: "Sorting and filtering a list",
            minutes: 16,
            summary:
              "A list needs headings. Sort and filter change what you see, and they should not destroy the original question.",
            objectives: [
              "Keep one header row",
              "Sort by a column without splitting a row apart",
              "Filter to the rows you mean, then clear the filter",
            ],
            notes: [
              "Select the whole table before sorting, or use a proper table, so rows stay together.",
              "A filter hides rows. It does not delete them.",
              "Look for the filter icon before you trust a total.",
              "Blank rows in the middle of a list break many tools.",
            ],
          },
          {
            title: "Charts that tell the truth",
            minutes: 16,
            summary:
              "A chart should answer one question. The title should say what the reader is looking at.",
            objectives: [
              "Choose a column chart for categories",
              "Avoid a chart that starts at a misleading number without a reason",
              "Give the chart a title and label the units",
            ],
            notes: [
              "A pie chart is a poor choice when there are many slices.",
              "The title should name the measure and, if needed, the time.",
              "Colour is not a substitute for a label.",
              "If the sheet total and the chart do not agree, trust neither until you find out why.",
            ],
          },
          {
            title: "Checking a sheet before you share it",
            minutes: 14,
            summary:
              "A workbook is ready when another person can see where the numbers came from.",
            objectives: [
              "Find every formula that feeds a total",
              "Remove sample rows you did not mean to include",
              "Name the file and the sheet in plain language",
            ],
            notes: [
              "Click the total and read the formula.",
              "Freeze the header row if the list is long, so headings stay visible.",
              "Hide a sheet only if the receiver does not need it. Do not hide a mistake.",
              "Write a one-line note of what the workbook is for.",
            ],
          },
        ],
      },
    ],
  }),
  buildCourse({
    slug: "digital-literacy",
    title: "Digital Literacy",
    category: "Digital Skills",
    difficulty: "Beginner",
    instructor: "Sample faculty, Digital Skills",
    hours: 16,
    summary:
      "Everyday digital tasks: messages, search, phones, and knowing when to stop and ask.",
    description:
      "Digital literacy here means being able to complete ordinary tasks with a computer or phone and to pause when something looks wrong. This is sample course copy until the Trust verifies the offering.",
    outcomes: [
      "Send a clear message and recognise a risky one",
      "Search for information and compare two sources",
      "Ask for help with a precise description of the problem",
    ],
    thumbnail: "group",
    icon: "globe",
    modules: [
      {
        title: "Everyday tasks",
        lessons: [
          {
            title: "Digital tasks in daily life",
            minutes: 14,
            summary:
              "Forms, photos, messages, and payments all use the same habit: read, act, then confirm.",
            objectives: [
              "List three digital tasks a household might do in a week",
              "Find the confirm step before a form is finished",
              "Keep a copy of an important submission when the tool allows it",
            ],
            notes: [
              "A confirmation screen or message is part of the task, not an extra.",
              "Photos of documents are useful only if the text can be read.",
              "Public Wi-Fi is fine for reading. Be careful with passwords and payments.",
              "If a form will not submit, note the exact message before you retry ten times.",
            ],
          },
          {
            title: "Messages that are clear and safer",
            minutes: 16,
            summary:
              "A good message says who you are, what you need, and when. A risky message tries to rush you.",
            objectives: [
              "Write a three-line message with a request and a time",
              "Spot urgency, a strange sender, and an unexpected link",
              "Check with a person you trust before sharing a password or a code",
            ],
            notes: [
              "The display name can be faked. Look at the actual address when it is shown.",
              "Organisations you already use do not need your password by chat.",
              "A one-time code should be typed only into the official screen that asked for it.",
              "Short and specific is kinder than a long, unclear paragraph.",
            ],
          },
          {
            title: "Searching for reliable information",
            minutes: 16,
            summary:
              "Search finds pages. It does not decide which page is right. Compare more than one source.",
            objectives: [
              "Turn a vague need into a specific search",
              "Open two results and notice who published them",
              "Leave a page that is only trying to frighten you into clicking",
            ],
            notes: [
              "Add a place or a year when the answer depends on them.",
              "Prefer a known organisation, a textbook, or a trainer over an unnamed page.",
              "Ads are labeled. They are not the same as the results.",
              "If two reliable sources disagree, the honest answer is that you need to look further.",
            ],
          },
        ],
      },
      {
        title: "Judgement",
        lessons: [
          {
            title: "Phones and computers together",
            minutes: 14,
            summary:
              "A phone is a computer you carry. The same care about accounts and updates applies.",
            objectives: [
              "Find the settings and update area on a phone or computer",
              "Notice which app is asking for a permission",
              "Keep work files in a folder you can find again",
            ],
            notes: [
              "App permissions should match the job. A calculator does not need your contacts.",
              "Updates from the official store are different from a file sent in a chat.",
              "A full storage warning is a reason to tidy files, not to tap a random cleaner ad.",
              "Sign out of a shared device.",
            ],
          },
          {
            title: "Online manners",
            minutes: 12,
            summary:
              "Digital rooms are still rooms. Tone is easy to misread, so clarity and respect matter more.",
            objectives: [
              "Disagree with a point without insulting a person",
              "Ask before forwarding someone else’s photo or message",
              "Stay out of a conversation that is becoming cruel",
            ],
            notes: [
              "Capital letters read as shouting.",
              "A joke that needs a person’s photo is usually not worth sending.",
              "Forwarding multiplies a mistake.",
              "Leaving a harsh thread is a skill, not a failure.",
            ],
          },
          {
            title: "Getting help when something breaks",
            minutes: 14,
            summary:
              "A useful help request says what you clicked, what you expected, and what happened instead.",
            objectives: [
              "Describe a problem in three sentences",
              "Take a note of the exact error text",
              "Know one person or desk you can ask",
            ],
            notes: [
              "“It doesn’t work” is a start. The last click is the useful part.",
              "Write the error words down. A photo of the screen helps if it shows no private data.",
              "Restarting is a fair first step after you have saved your work.",
              "Do not pay a stranger who calls to say your computer is infected.",
            ],
          },
        ],
      },
    ],
  }),
  buildCourse({
    slug: "spoken-english",
    title: "Spoken English",
    category: "Communication",
    difficulty: "Beginner",
    instructor: "Sample faculty, Communication",
    hours: 18,
    summary:
      "Sounds, greetings, questions, and short talks for learners who want spoken English they can use the same day.",
    description:
      "This sample course practises spoken English in short, repeatable pieces: greetings, introductions, questions, and a one-minute talk. It is not a certified language test. The Trust can replace this copy when the final program is confirmed.",
    outcomes: [
      "Introduce yourself in clear sentences",
      "Ask and answer simple questions",
      "Give a one-minute talk with a beginning and an end",
    ],
    thumbnail: "group",
    icon: "languages",
    modules: [
      {
        title: "First conversations",
        lessons: [
          {
            title: "Sounds, greetings, and pace",
            minutes: 15,
            summary:
              "Clear beats fast. This lesson practises greetings slowly enough for another person to answer.",
            objectives: [
              "Use a greeting and a reply",
              "Speak a short line without rushing the last word",
              "Ask for a repeat politely",
            ],
            notes: [
              "Good morning, hello, and good evening cover most starts.",
              "Please say that again is a complete and polite request.",
              "A pause is not a mistake.",
              "Listen to the other person’s name and use it once.",
            ],
          },
          {
            title: "Introducing yourself",
            minutes: 16,
            summary:
              "A simple introduction has your name, what you are learning, and one interest.",
            objectives: [
              "Say your name in a full sentence",
              "Add one sentence about your study",
              "Invite the other person to speak",
            ],
            notes: [
              "My name is… I am learning… is enough to begin.",
              "And you? returns the conversation.",
              "You do not need a long life story.",
              "If you forget a word, describe it in simpler words.",
            ],
          },
          {
            title: "Asking questions",
            minutes: 16,
            summary:
              "Questions starting with what, where, when, who, why, and how open a conversation.",
            objectives: [
              "Form a what and a where question",
              "Answer in a sentence, not only a single word",
              "Check you understood by repeating the key fact",
            ],
            notes: [
              "What are you learning? Where is the class?",
              "A yes or no question still deserves a full reply in practice.",
              "So the class is at four? is a useful check.",
              "Question marks are for writing. In speech, your voice rises or the word order shows the question.",
            ],
          },
        ],
      },
      {
        title: "Longer turns",
        lessons: [
          {
            title: "Everyday conversations",
            minutes: 15,
            summary:
              "Practice lines for the classroom, a shop, and asking for a direction.",
            objectives: [
              "Ask for a price or a time",
              "Give a simple direction",
              "Thank someone and close the conversation",
            ],
            notes: [
              "Excuse me is a better start than launching into the request.",
              "Could you tell me… is softer than Tell me.",
              "Thank you. Have a good day. is a clean ending.",
              "If you do not know, I am not sure, let me check is honest English.",
            ],
          },
          {
            title: "Classroom phrases",
            minutes: 14,
            summary:
              "Learners collect the phrases they need to join a lesson: asking, agreeing, and saying they are lost.",
            objectives: [
              "Ask a trainer to repeat an instruction",
              "Say which step you have reached",
              "Tell a partner you agree or need a moment",
            ],
            notes: [
              "Could you repeat the instruction, please?",
              "I have finished the first step.",
              "I am not sure about this part.",
              "These phrases are more useful than pretending you understood.",
            ],
          },
          {
            title: "A one-minute talk",
            minutes: 16,
            summary:
              "A short talk needs a first sentence, two points, and a last sentence. Practice it aloud.",
            objectives: [
              "Choose a small topic you know",
              "Speak for about a minute with a clear ending",
              "Stand or sit still enough for the listener",
            ],
            notes: [
              "Today I will talk about… sets the topic.",
              "Two points are enough.",
              "That is why… or Thank you closes the talk.",
              "Record yourself once if you can, and listen for the rushed ending.",
            ],
          },
        ],
      },
    ],
  }),
  buildCourse({
    slug: "communication-skills",
    title: "Communication Skills",
    category: "Communication",
    difficulty: "Intermediate",
    instructor: "Sample faculty, Communication",
    hours: 16,
    summary:
      "Listening, plain sentences, respectful tone, and short written messages for study and work.",
    description:
      "This sample course treats communication as a skill you can practise: listen, speak in short sentences, and write a message someone can act on. It is demonstration content until the Trust confirms the program.",
    outcomes: [
      "Restate what another person asked before you answer",
      "Write a request that includes the task and the time",
      "Give feedback that names the work, not the person",
    ],
    thumbnail: "classroom",
    icon: "messages",
    modules: [
      {
        title: "Listening and speaking",
        lessons: [
          {
            title: "Listening before answering",
            minutes: 14,
            summary:
              "Most confusion starts when we answer a different question from the one that was asked.",
            objectives: [
              "Let a person finish",
              "Repeat the request in your own words",
              "Ask one clarifying question",
            ],
            notes: [
              "Notes of the key noun and the deadline prevent a second meeting.",
              "So you need the list by Friday? is a check, not a delay.",
              "Interrupting to be helpful can still be interrupting.",
              "If you disagree, show you heard the point first.",
            ],
          },
          {
            title: "Clear sentences",
            minutes: 14,
            summary:
              "One subject, one verb, one point. Then the next sentence.",
            objectives: [
              "Split a long sentence into two",
              "Put the action near the start",
              "Remove words that do not change the meaning",
            ],
            notes: [
              "Please send the attendance sheet today is clearer than a long preface.",
              "Avoid stacking three ideas with and.",
              "Concrete nouns beat vague ones: the Excel file, not the stuff.",
              "Read the sentence aloud. If you gasp, it is too long.",
            ],
          },
          {
            title: "Tone and respect",
            minutes: 14,
            summary:
              "The same request can sound like help or like a scolding. Tone is a choice.",
            objectives: [
              "Rewrite a blunt order as a request",
              "Keep respect when you are in a hurry",
              "Notice how written words lose the smile you meant",
            ],
            notes: [
              "Please and thank you are not decoration. They mark a request rather than an order.",
              "A deadline can be firm and still be polite.",
              "Jokes about a person’s accent, clothes, or speed do not belong in a classroom.",
              "If a message feels sharp, wait ten minutes and read it again.",
            ],
          },
        ],
      },
      {
        title: "Groups and writing",
        lessons: [
          {
            title: "Speaking in a group",
            minutes: 15,
            summary:
              "A group works when people take turns, stay on the question, and invite quieter voices.",
            objectives: [
              "State your point in under a minute",
              "Hand the turn to someone who has not spoken",
              "Bring the group back to the question",
            ],
            notes: [
              "One point, then stop.",
              "What do you think? is an invitation, not a test.",
              "The question we were asked is… resets a wandering talk.",
              "Volume is not the same as confidence.",
            ],
          },
          {
            title: "Writing a short message",
            minutes: 15,
            summary:
              "A useful message has a subject, the request, the time, and your name.",
            objectives: [
              "Write a subject line that says the topic",
              "Put the request in the first two lines",
              "End with your name and how to reach you",
            ],
            notes: [
              "Subject: Attendance sheet for 12 April.",
              "The first line should not be only Hello.",
              "Attachments are mentioned in the message: The sheet is attached.",
              "Proofread names and dates. Those are the words people act on.",
            ],
          },
          {
            title: "Feedback that helps",
            minutes: 14,
            summary:
              "Helpful feedback names what worked, what to change, and how to change it.",
            objectives: [
              "Describe the work, not the person’s character",
              "Offer one change, not a list of ten",
              "Check the other person knows the next step",
            ],
            notes: [
              "The title is clear. The second paragraph needs a shorter first sentence.",
              "Always and never are rarely fair.",
              "Ask what they were trying to do before you rewrite it.",
              "Feedback is a gift only if the receiver can use it.",
            ],
          },
        ],
      },
    ],
  }),
  buildCourse({
    slug: "python-programming",
    title: "Python Programming",
    category: "Programming",
    difficulty: "Intermediate",
    instructor: "Sample faculty, Programming",
    hours: 28,
    summary:
      "A first programming course: programs, variables, decisions, loops, functions, and a small list project.",
    description:
      "This sample course teaches beginner Python with short programs a learner can read aloud. It assumes no prior coding. Public videos are linked for demonstration; Varam does not host those recordings. The syllabus awaits verification by the Trust.",
    outcomes: [
      "Write and run a small Python program",
      "Use variables, if, loops, and functions",
      "Explain what a short program will do before you run it",
    ],
    thumbnail: "classroom",
    icon: "code",
    modules: [
      {
        title: "Programs and decisions",
        lessons: [
          {
            title: "Your first program",
            minutes: 18,
            summary:
              "A program is a list of instructions. print shows a result. Python cares about exact spelling.",
            objectives: [
              "Run a program that prints a greeting",
              "Read an error message far enough to see the line number",
              "Change the greeting and run it again",
            ],
            notes: [
              "print(\"Hello\") displays Hello. The quotes mark text.",
              "Parentheses and quotes must come in pairs.",
              "An error is information. Read the last line and the line number.",
              "Save the file before you decide the program is wrong.",
            ],
            video: youtube(
              "_uQrJ0TkZlc",
              "Public lesson: Programming with Mosh, Python Full Course for Beginners, from the first program. Varam does not host this recording.",
              370,
            ),
          },
          {
            title: "Variables and types",
            minutes: 18,
            summary:
              "A variable is a name for a value. Numbers and text behave differently.",
            objectives: [
              "Store a name and a number in variables",
              "Tell a string from an integer",
              "Convert text from input into a number when you need to do maths",
            ],
            notes: [
              "name = \"Asha\" stores text. score = 40 stores a number.",
              "input() always gives text, even if the person types digits.",
              "int(\"3\") makes a number. int(\"hello\") fails.",
              "Print the type when you are unsure: print(type(score)).",
            ],
            video: youtube(
              "_uQrJ0TkZlc",
              "Public lesson: Programming with Mosh, from the variables chapter. Varam does not host this recording.",
              783,
            ),
          },
          {
            title: "Decisions with if",
            minutes: 18,
            summary:
              "if runs a block only when a test is true. Indentation shows which lines belong inside.",
            objectives: [
              "Write a comparison with ==, >, or <",
              "Indent the lines that belong to the if",
              "Add else for the other case",
            ],
            notes: [
              "== asks whether two values are equal. = stores a value.",
              "The block under if is indented. Mixing spaces carelessly causes IndentationError.",
              "else covers what remains. elif adds another test.",
              "Predict the printed line before you run the program.",
            ],
            video: youtube(
              "_uQrJ0TkZlc",
              "Public lesson: Programming with Mosh, from the if-statements chapter. Varam does not host this recording.",
              3992,
            ),
          },
        ],
      },
      {
        title: "Repetition and structure",
        lessons: [
          {
            title: "Repeating with loops",
            minutes: 18,
            summary:
              "A loop repeats work. range(3) produces 0, 1, and 2. While repeats until a test fails.",
            objectives: [
              "Write a for loop over a range",
              "Explain when a while loop might never stop",
              "Use a loop to print each item in a list",
            ],
            notes: [
              "for i in range(3): repeats three times. The values are 0, 1, and 2.",
              "A while loop needs something inside that will eventually make the test false.",
              "Print the counter if a loop is misbehaving.",
              "Not every repeated click in real life should become an infinite loop.",
            ],
            video: youtube(
              "_uQrJ0TkZlc",
              "Public lesson: Programming with Mosh, from the while-loop chapter. Varam does not host this recording.",
              4843,
            ),
          },
          {
            title: "Functions",
            minutes: 18,
            summary:
              "A function is a named block you can call. def starts it. return sends a value back.",
            objectives: [
              "Define a function with def",
              "Pass one parameter",
              "Return a result instead of only printing it",
            ],
            notes: [
              "def greet(name): defines the function. greet(\"Sam\") calls it.",
              "Parameters are the names inside the function. Arguments are the values you pass.",
              "return ends the function and gives a value back. print only displays.",
              "A short name that says what the function does is better than a clever one.",
            ],
            video: youtube(
              "_uQrJ0TkZlc",
              "Public lesson: Programming with Mosh, from the functions chapter. Varam does not host this recording.",
              9031,
            ),
          },
          {
            title: "Lists and a tiny project",
            minutes: 20,
            summary:
              "A list keeps items in order. This lesson builds a tiny attendance or shopping list and prints a summary.",
            objectives: [
              "Create a list and read an item by index",
              "Add an item and find the length",
              "Loop through the list and print each item",
            ],
            notes: [
              "Indexes start at 0. The first item is items[0].",
              "len(items) tells you how many items there are.",
              "append adds to the end.",
              "A tiny project is finished when someone else can run it and understand the output.",
            ],
            video: youtube(
              "_uQrJ0TkZlc",
              "Public lesson: Programming with Mosh, from the lists chapter. Varam does not host this recording.",
              6950,
            ),
          },
        ],
      },
    ],
  }),
  buildCourse({
    slug: "artificial-intelligence-fundamentals",
    title: "Artificial Intelligence Fundamentals",
    category: "Programming",
    difficulty: "Advanced",
    instructor: "Sample faculty, Programming",
    hours: 16,
    summary:
      "What people mean by AI, what a tool can and cannot know, and how to check an answer before you use it.",
    description:
      "This sample course is a careful introduction, not a promise of a job in AI. It explains patterns, limits, everyday tools, and honest use. Public video is credited. The Trust has not certified this syllabus.",
    outcomes: [
      "Explain AI in plain language without hype",
      "Ask a tool a specific question",
      "Check an answer against a source or a calculation you trust",
    ],
    thumbnail: "group",
    icon: "spark",
    modules: [
      {
        title: "Words and limits",
        lessons: [
          {
            title: "What people mean by AI",
            minutes: 16,
            summary:
              "Artificial intelligence is a broad label. In this course it means software that finds patterns and produces a prediction or a draft.",
            objectives: [
              "Separate the marketing word AI from a specific tool",
              "Give one example of a prediction a computer might make",
              "Say why a fluent answer can still be wrong",
            ],
            notes: [
              "A spellchecker, a translation, and a chatbot are different tools under a wide label.",
              "A prediction is a guess based on patterns, not a guarantee.",
              "Fluent sentences are not the same as true sentences.",
              "This course will not claim that a tool is intelligent in the human sense.",
            ],
            video: youtube(
              "z-EtmaFJieY",
              "Public lesson: Crash Course Computer Science #34, Machine Learning & Artificial Intelligence. Varam does not host this recording.",
            ),
          },
          {
            title: "Data, patterns, and limits",
            minutes: 16,
            summary:
              "Tools learn from examples they were given. Gaps and bias in those examples show up in the answers.",
            objectives: [
              "Explain that a model depends on its examples",
              "Name one task a tool may do badly",
              "Refuse to treat a tool as a source of private facts about a real person",
            ],
            notes: [
              "If the examples never included a situation, the answer is a guess.",
              "Numbers, local rules, and today’s news need a check outside the tool.",
              "A tool should not be asked to identify or judge a real student from a photo.",
              "Limits are part of the lesson, not a failure of the learner.",
            ],
          },
          {
            title: "Everyday AI tools",
            minutes: 14,
            summary:
              "Learners look at tools they may already meet: translation, dictation, search summaries, and chat.",
            objectives: [
              "Name the job you want the tool to do",
              "Notice when a tool is drafting and when it is calculating",
              "Keep personal documents out of a public demo box",
            ],
            notes: [
              "Translation is a draft. Names and numbers need a human look.",
              "Dictation makes mistakes on similar sounds.",
              "Do not paste passwords, identity numbers, or private records into a tool.",
              "A classroom demo should use sample data, not a real person’s file.",
            ],
          },
        ],
      },
      {
        title: "Using tools honestly",
        lessons: [
          {
            title: "Asking a better question",
            minutes: 14,
            summary:
              "A useful prompt says the task, the audience, the limits, and what done looks like.",
            objectives: [
              "Include the task and the length you want",
              "Say who the reader is",
              "Ask for steps you can check",
            ],
            notes: [
              "Explain this formula to a beginner in five lines is better than Explain Excel.",
              "Ask for the assumption the answer depends on.",
              "If you need a local fact, say that the tool may not know it.",
              "You are still the author of anything you submit.",
            ],
          },
          {
            title: "Checking an answer",
            minutes: 15,
            summary:
              "Every important answer needs a second look: a calculation, a book, a trainer, or the original source.",
            objectives: [
              "Redo a small calculation yourself",
              "Look up a factual claim in a source you trust",
              "Mark what you could not verify",
            ],
            notes: [
              "If a formula is given, type it into Excel or Python and compare.",
              "Quotes should be traced to a real page.",
              "A date, a fee, and a law are high-risk facts. Check them.",
              "It is acceptable to say: the tool suggested this, and I have not verified it.",
            ],
          },
          {
            title: "Honesty in study and work",
            minutes: 14,
            summary:
              "Using a tool is allowed when the assignment says so, and it should be disclosed. Pretending is not.",
            objectives: [
              "Read what an assignment allows",
              "Credit a tool when you used it for a draft",
              "Keep the practice yourself if the goal is to learn the skill",
            ],
            notes: [
              "If the goal is your own speaking or your own formula, the tool cannot do the practice for you.",
              "A disclosure can be one line: I used a chatbot to draft the outline, then rewrote it.",
              "Do not submit private classmate data to a tool.",
              "This demonstration course does not grant permission for any external exam.",
            ],
          },
        ],
      },
    ],
  }),
  buildCourse({
    slug: "employability-skills",
    title: "Employability Skills",
    category: "Career",
    difficulty: "Intermediate",
    instructor: "Sample faculty, Career Studio",
    hours: 14,
    summary:
      "How to read a role, show evidence of a skill, and prepare for a straightforward workplace conversation.",
    description:
      "This sample course covers habits that help a learner talk about skills they actually have. It does not promise placement. Figures, employers, and outcomes are not claimed. The Trust can edit this offering.",
    outcomes: [
      "Read a role description and pick out the skills",
      "Describe one skill with an example",
      "Prepare a simple résumé structure and a short introduction",
    ],
    thumbnail: "classroom",
    icon: "briefcase",
    modules: [
      {
        title: "Evidence, not adjectives",
        lessons: [
          {
            title: "Reading a role description",
            minutes: 14,
            summary:
              "A role description is a list of tasks and conditions. Highlight the verbs.",
            objectives: [
              "Mark the tasks in a sample description",
              "Separate required tools from nice-to-have lines",
              "Notice place, time, and eligibility without guessing",
            ],
            notes: [
              "Verbs such as prepare, record, and explain describe the work.",
              "If a tool is named, be honest about whether you have used it.",
              "Eligibility rules are not suggestions.",
              "This lesson uses a sample description, not a live vacancy.",
            ],
          },
          {
            title: "Skills you can evidence",
            minutes: 15,
            summary:
              "I am hardworking is weaker than a specific example of work you finished.",
            objectives: [
              "Name a skill you have practised in this campus",
              "Add a where and a what",
              "Leave out claims you cannot explain",
            ],
            notes: [
              "I prepared a one-page notice in Microsoft Word during class is evidence.",
              "A certificate you have not earned should not be listed.",
              "Practice on this demo site is practice, not an accredited qualification.",
              "One true example is enough to start.",
            ],
          },
          {
            title: "A simple résumé structure",
            minutes: 16,
            summary:
              "A beginner résumé can be one page: contact, education, skills with examples, and any real experience.",
            objectives: [
              "Lay out the four sections",
              "Write a skill line with an example",
              "Keep the page to facts you can discuss",
            ],
            notes: [
              "Put a phone or email only if you are comfortable being contacted. This demo does not need a real one.",
              "Education includes the course you are actually taking.",
              "Do not invent job titles.",
              "Ask someone to check dates and spelling.",
            ],
          },
        ],
      },
      {
        title: "Conversations and habits",
        lessons: [
          {
            title: "Preparing for a conversation",
            minutes: 14,
            summary:
              "An interview or a trainer’s review is a conversation with a purpose. Prepare four answers aloud.",
            objectives: [
              "Answer Tell me about yourself in under a minute",
              "Prepare one example of learning something difficult",
              "Prepare two questions to ask them",
            ],
            notes: [
              "Who you are, what you are learning, and what you want to do next.",
              "A difficult topic you stuck with is a stronger story than a claim of perfection.",
              "Questions about the daily tasks show interest.",
              "Arrive with a copy of what you sent, if there was an application.",
            ],
          },
          {
            title: "Workplace habits",
            minutes: 14,
            summary:
              "Time, messages, and asking for help are skills. They are visible in the first week of any role or class.",
            objectives: [
              "Confirm a time and a place",
              "Send a message when you will be late",
              "Ask for help before a small problem grows",
            ],
            notes: [
              "Write the time down. Do not rely on memory for a first meeting.",
              "A late message is better than silence.",
              "I have tried this step and I am stuck here is a good help request.",
              "These habits apply in a classroom as much as in an office.",
            ],
          },
          {
            title: "A 30-day practice plan",
            minutes: 12,
            summary:
              "Pick one skill and a small weekly repetition. A plan you will do beats a plan that sounds impressive.",
            objectives: [
              "Choose one skill from this site",
              "Set two practice slots you can keep",
              "Decide how you will know you improved",
            ],
            notes: [
              "Twenty minutes twice a week is a real plan.",
              "Improvement might be: I can write the SUM formula without looking.",
              "Tell a classmate the plan so it is specific.",
              "Missed a week? Continue. Do not restart from shame.",
            ],
          },
        ],
      },
    ],
  }),
  buildCourse({
    slug: "career-guidance",
    title: "Career Guidance",
    category: "Career",
    difficulty: "Beginner",
    instructor: "Sample faculty, Career Studio",
    hours: 12,
    summary:
      "A structured way to think about interests, constraints, and the next question to ask — without invented placements.",
    description:
      "This sample course helps a learner look at interests, practical constraints, and questions for a mentor. It does not rank careers, promise jobs, or cite outcomes. The Trust should replace any line that does not match its real guidance work.",
    outcomes: [
      "Describe an interest and a constraint without treating either as permanent",
      "List questions for a mentor or a trainer",
      "Choose one next learning step you can actually take",
    ],
    thumbnail: "group",
    icon: "compass",
    modules: [
      {
        title: "Looking clearly",
        lessons: [
          {
            title: "Interests and constraints",
            minutes: 14,
            summary:
              "An interest is what you want to try. A constraint is a real limit such as time, travel, or money. Both belong on the page.",
            objectives: [
              "Name two activities you do not mind repeating",
              "Name one constraint honestly",
              "Avoid treating a relative’s job as your only option",
            ],
            notes: [
              "I like explaining is a clue. It is not yet a career.",
              "Constraints can change. Hiding them makes a plan fragile.",
              "This exercise is private. You do not have to share it aloud.",
              "No result in this lesson is an official aptitude score.",
            ],
          },
          {
            title: "Learning paths after school",
            minutes: 14,
            summary:
              "After school there are many kinds of study: formal courses, short skills, and learning at work. This lesson shows how to compare them.",
            objectives: [
              "List what a path asks you to study",
              "Ask how long it takes and what it costs",
              "Separate a brochure claim from a question you still need answered",
            ],
            notes: [
              "Duration, cost, location, and eligibility are the first facts.",
              "A skill course and a degree answer different needs.",
              "If a page promises a job, ask who is promising and in writing.",
              "This website does not recommend a particular college.",
            ],
          },
          {
            title: "Computer skills and work",
            minutes: 14,
            summary:
              "Many roles now include a computer task even when the job is not called IT. Match a skill to a task.",
            objectives: [
              "Connect one course on this site to a workplace task",
              "Be precise about your level",
              "See that computer skill is a tool, not a personality",
            ],
            notes: [
              "A clinic, a shop, and an office may all need a spreadsheet.",
              "Beginner is a respectable and useful level if you say it clearly.",
              "You can learn the next tool when a real task needs it.",
              "Do not buy a course from a pop-up because it uses the word AI.",
            ],
          },
        ],
      },
      {
        title: "A next step",
        lessons: [
          {
            title: "Questions worth asking",
            minutes: 12,
            summary:
              "Good guidance starts with questions a real person can answer from experience.",
            objectives: [
              "Write three questions that are not yes-or-no",
              "Ask about a normal day, not only about salary",
              "Ask what beginners get wrong",
            ],
            notes: [
              "What does a Tuesday look like?",
              "Which skill do you wish you had practised earlier?",
              "What should I ignore in the advertisements?",
              "Write the answers down. Memory edits them.",
            ],
          },
          {
            title: "Talking to a mentor",
            minutes: 12,
            summary:
              "A mentor might be a trainer, a relative, or a neighbour who does the work. Respect their time.",
            objectives: [
              "Ask for a short conversation, not an undefined favour",
              "Arrive with your questions written",
              "Thank them and say what you will do next",
            ],
            notes: [
              "Twenty minutes is a fair first ask.",
              "Do not ask someone to write your application for you in that first meeting.",
              "A thank-you message the same day is part of the skill.",
              "One conversation is information, not a destiny.",
            ],
          },
          {
            title: "Your personal next step",
            minutes: 14,
            summary:
              "End with one action this month: a course to finish, a person to ask, or a skill to practise.",
            objectives: [
              "Choose one action",
              "Put a date on it",
              "Say how you will know it is done",
            ],
            notes: [
              "Finish the Computer Fundamentals practice quiz is a complete action.",
              "Ask my trainer two questions on Friday is a complete action.",
              "A list of ten careers is not an action.",
              "Write the action where you will see it.",
            ],
          },
        ],
      },
    ],
  }),
];

export const courseCategories = [
  "All",
  ...Array.from(new Set(courses.map((course) => course.category))),
];

export const difficulties: Course["difficulty"][] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

export function flatLessons(course: Course) {
  return course.modules.flatMap((module) => module.lessons);
}

export function findCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function findLesson(course: Course, lessonId: string) {
  return flatLessons(course).find((lesson) => lesson.id === lessonId);
}

export const seedCourseSlugs = new Set(courses.map((course) => course.slug));

export const seedLessonIds = new Set(
  courses.flatMap((course) => flatLessons(course).map((lesson) => lesson.id)),
);

export function courseStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export function lessonStaticParams() {
  return courses.flatMap((course) =>
    flatLessons(course).map((lesson) => ({
      courseSlug: course.slug,
      lessonId: lesson.id,
    })),
  );
}
