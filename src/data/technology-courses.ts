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
    category: "Courses & Internship Technologies",
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

export const technologyCourses: Course[] = [
  build({
    slug: "web-development",
    title: "Web Development",
    difficulty: "Beginner",
    hours: 48,
    summary: "Build a simple website with HTML, CSS, and JavaScript, then put the pages on the web.",
    description:
      "Learners make pages, style them, and add the small interactions a visitor expects. The course stays with the browser first, then introduces how a page talks to a server.",
    outcomes: [
      "Build a multi-page site with HTML and CSS",
      "Add basic JavaScript for forms and navigation",
      "Explain how a browser requests a page",
    ],
    icon: "layout",
    modules: [
      {
        title: "Pages people can use",
        lessons: [
          lesson("How a web page is built", "A page is HTML for structure, CSS for appearance, and JavaScript for behaviour.", [
            "HTML names the parts of a page: headings, paragraphs, links, and images.",
            "CSS controls colour, spacing, and layout.",
            "The browser reads these files and draws the page.",
          ]),
          lesson("Structure with HTML", "Write a page that has a clear heading, navigation, and main content.", [
            "Use one h1 for the page title.",
            "Put navigation links together so they are easy to find.",
            "Every image needs text that describes it.",
          ]),
          lesson("Layout with CSS", "Arrange the page so it is readable on a laptop and a phone.", [
            "Set a readable font size and line height.",
            "Use spacing so sections do not collide.",
            "Check the page at a narrow width before you finish.",
          ]),
        ],
      },
      {
        title: "Interaction and publishing",
        lessons: [
          lesson("JavaScript in the browser", "Respond to a click or a form without reloading the whole page.", [
            "Select an element, then listen for an event.",
            "Check the input before you use it.",
            "Show a clear message when something is missing.",
          ]),
          lesson("Forms and simple data", "Collect a name and a message, then check that both were entered.", [
            "Required fields should be marked.",
            "Do not send an empty form.",
            "Tell the learner what happens after they submit.",
          ]),
          lesson("Publishing a site", "Put the finished files where a browser on another computer can open them.", [
            "Keep HTML, CSS, and images in a clear folder.",
            "Open the live address and click every link.",
            "Fix a broken image or link before you share the address.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "java-fullstack",
    title: "Java Fullstack",
    difficulty: "Intermediate",
    hours: 72,
    summary: "Build a Java application from the screen the user sees through to the data it stores.",
    description:
      "The course follows one small application from a Java program, to an API, to a page that calls it. Learners practise the path a fullstack Java project actually takes.",
    outcomes: [
      "Write a Java program that stores and returns data",
      "Expose that data through a simple API",
      "Show the result on a web page",
    ],
    icon: "braces",
    modules: [
      {
        title: "Java for an application",
        lessons: [
          lesson("A Java program", "Run a small Java program and follow the path from main to a result.", [
            "A class holds the code. A method does one job.",
            "Compile, then run, then read the message if it fails.",
            "Name variables for what they hold.",
          ]),
          lesson("Objects and collections", "Model a learner, a course, and a list of enrolments.", [
            "An object groups the fields that belong together.",
            "A list holds many of the same kind of item.",
            "Do not use a list when one value is enough.",
          ]),
          lesson("Working with data", "Read input, validate it, and keep a record.", [
            "Reject an empty name before you save it.",
            "Keep the saved record separate from the screen text.",
            "Print or return the saved record so you can check it.",
          ]),
        ],
      },
      {
        title: "From API to page",
        lessons: [
          lesson("A Java API", "Offer one address that returns the saved records as JSON.", [
            "An endpoint has a path and a method such as GET or POST.",
            "JSON is the text format the page will read.",
            "Return a clear error when the input is incomplete.",
          ]),
          lesson("The page that calls it", "Show the records in the browser and add a new one from a form.", [
            "The page asks the API. It does not invent the list.",
            "Show a loading and an error state.",
            "After a successful save, the new record appears in the list.",
          ]),
          lesson("Checking the whole path", "Trace one record from the form to storage and back to the page.", [
            "Test the happy path and one missing field.",
            "Look at the API response when the page looks wrong.",
            "Write down the steps so another learner can run the project.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "python-fullstack",
    title: "Python Fullstack",
    difficulty: "Intermediate",
    hours: 72,
    summary: "Use Python for the program, the API, and the page that displays the result.",
    description:
      "Learners write Python for everyday data tasks, then expose that work through a small web API and a page. The course is the fullstack path, not a single library tour.",
    outcomes: [
      "Write Python that reads, checks, and stores data",
      "Serve that data from a Python API",
      "Display it on a simple web page",
    ],
    icon: "terminal",
    modules: [
      {
        title: "Python for the job",
        lessons: [
          lesson("Python basics for a project", "Use variables, conditions, and functions in a small program.", [
            "A function should do one clear job.",
            "Print intermediate values while you are learning the flow.",
            "Keep input separate from the calculation.",
          ]),
          lesson("Lists and dictionaries", "Store a course roster as structured data.", [
            "A list is an ordered collection.",
            "A dictionary stores named fields such as title and hours.",
            "Check that a key exists before you read it.",
          ]),
          lesson("Files and checks", "Save the roster and refuse an incomplete record.", [
            "Write the data so it can be opened again.",
            "Validate the title and the hours before saving.",
            "Show a message that says what to fix.",
          ]),
        ],
      },
      {
        title: "API and interface",
        lessons: [
          lesson("A Python API", "Return the roster from a local web address.", [
            "One route lists records. Another accepts a new record.",
            "Return JSON, not a paragraph of text.",
            "An invalid record gets an error, not a silent save.",
          ]),
          lesson("A page for the roster", "Let a learner view and add a course from the browser.", [
            "The form fields match the API fields.",
            "Refresh the list after a successful add.",
            "Keep the page usable when the API is unreachable.",
          ]),
          lesson("Review the project", "Walk through the code from the page to the saved file.", [
            "Name the file that draws the page and the file that saves data.",
            "Note one bug you fixed and how you found it.",
            "Leave a short run instruction at the top of the project.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "aws",
    title: "AWS",
    difficulty: "Intermediate",
    hours: 40,
    summary: "Learn the Amazon Web Services a small project actually uses: compute, storage, and access.",
    description:
      "The course introduces the AWS pieces a learner meets first: an account boundary, storage, a server, and the habit of granting only the access a task needs.",
    outcomes: [
      "Describe what an AWS account, region, and service are",
      "Store a file and run a simple compute task",
      "Limit access instead of sharing a root password",
    ],
    icon: "cloud",
    modules: [
      {
        title: "The AWS map",
        lessons: [
          lesson("Account, region, and service", "Place a task in an account and a region before you create anything.", [
            "An account is the boundary for billing and access.",
            "A region is the location where the resource runs.",
            "A service is one product, such as storage or compute.",
          ]),
          lesson("Identity and access", "Give a person or a program only the permission the task needs.", [
            "Do not share the root account for daily work.",
            "A policy names the actions that are allowed.",
            "Remove access when the task is finished.",
          ]),
          lesson("Reading the bill", "Notice what creates a charge before you leave a resource running.", [
            "A running server can cost money even when you are not using it.",
            "Stop or delete a practice resource when the lesson ends.",
            "Check the service name on a charge before you assume it is a mistake.",
          ]),
        ],
      },
      {
        title: "Storage and compute",
        lessons: [
          lesson("Object storage", "Upload a file and control who can read it.", [
            "A bucket holds objects. An object is the file plus its key.",
            "Private should be the starting point.",
            "A public file is readable by anyone who has the address.",
          ]),
          lesson("A virtual server", "Start a small instance, connect, and stop it.", [
            "Choose a small size for practice.",
            "Connect with a key, not a shared password in a chat.",
            "Stop the instance when the exercise is done.",
          ]),
          lesson("Putting a task together", "Store a file and note which service did which job.", [
            "Storage keeps the file. Compute runs the program.",
            "Access control decides who can do either.",
            "Write the three names in your notes before you close the account.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "devops",
    title: "DevOps",
    difficulty: "Intermediate",
    hours: 40,
    summary: "Practise the path from a code change to a checked, repeatable release.",
    description:
      "Learners use version control, a simple automated check, and a repeatable way to run the project. The course is about the habit of shipping a known version, not a catalogue of tools.",
    outcomes: [
      "Track a project in Git and review a change",
      "Run an automated check before a release",
      "Describe a repeatable deploy step",
    ],
    icon: "workflow",
    modules: [
      {
        title: "A change you can trust",
        lessons: [
          lesson("Git for a team", "Save work in commits that another person can read.", [
            "A commit is a saved point with a message.",
            "The message should say why the change was made.",
            "Do not commit passwords or local environment files.",
          ]),
          lesson("Branches and review", "Make a change on a branch and read the difference before it joins the main line.", [
            "A branch keeps unfinished work separate.",
            "Read the diff. Do not approve a change you have not looked at.",
            "Main should stay in a state you are willing to run.",
          ]),
          lesson("What not to ship", "Keep secrets and machine-specific files out of the repository.", [
            "Use an ignore file for dependencies and local settings.",
            "A key in a commit is still in the history after you delete the line.",
            "Share setup steps in a short note instead of sharing your private file.",
          ]),
        ],
      },
      {
        title: "Check and release",
        lessons: [
          lesson("An automated check", "Run the same test every time, not only when someone remembers.", [
            "A check should fail when the project is broken.",
            "Run it before you merge.",
            "A green check is about the tests you wrote, not a promise about every future bug.",
          ]),
          lesson("A repeatable run", "Write the commands so another computer can start the project.", [
            "Pin the steps: install, check, start.",
            "Do not rely on a click you cannot describe.",
            "If a step fails, the message should say which step.",
          ]),
          lesson("A small release", "Ship one known version and note how to undo it.", [
            "Name the version you released.",
            "Know the previous version you can return to.",
            "Watch the running project once after the release.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "data-science",
    title: "Data Science",
    difficulty: "Intermediate",
    hours: 48,
    summary: "Clean a dataset, look at it honestly, and explain what the numbers can and cannot say.",
    description:
      "Learners prepare a table of data, summarise it, and make a simple chart. The course insists on saying what the data does not prove.",
    outcomes: [
      "Clean a small table and explain the columns",
      "Summarise values without hiding the gaps",
      "State one finding and its limit",
    ],
    icon: "chart",
    modules: [
      {
        title: "A table you can trust",
        lessons: [
          lesson("Rows, columns, and questions", "Start from a question the table might answer.", [
            "A row is one record. A column is one fact about that record.",
            "Write the question before you calculate.",
            "If the column does not exist, the table cannot answer that question.",
          ]),
          lesson("Cleaning the sheet", "Find empty cells, duplicates, and values that are the wrong kind.", [
            "An empty cell is not the same as zero.",
            "Remove or mark duplicates and say which you did.",
            "A date stored as text will sort incorrectly.",
          ]),
          lesson("Summaries", "Use a count, a total, and an average only where each one makes sense.", [
            "A count answers how many.",
            "An average can hide a very large or very small value.",
            "Say how many rows were excluded.",
          ]),
        ],
      },
      {
        title: "Looking and explaining",
        lessons: [
          lesson("A chart that matches the question", "Choose a chart that a reader can check against the table.", [
            "A bar compares categories. A line is for a sequence.",
            "Label the axes.",
            "Do not start an axis at a value that exaggerates a small difference unless you say so.",
          ]),
          lesson("What the result does not prove", "Separate a pattern in this table from a claim about everyone.", [
            "A pattern in one class is not a fact about the district.",
            "Correlation is not a cause.",
            "Write the limit next to the finding.",
          ]),
          lesson("A short report", "Give the question, the cleaned data, the chart, and the limit.", [
            "Lead with the finding.",
            "Show the number of rows.",
            "End with what you would not claim.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    difficulty: "Beginner",
    hours: 36,
    summary: "See what an AI system is doing, where it helps, and where a person must still decide.",
    description:
      "The course explains AI in plain language: data, a model, a prediction, and the human check. It does not treat a model output as an authority.",
    outcomes: [
      "Describe data, a model, and a prediction",
      "Try a simple AI task and inspect the result",
      "Name a decision that should stay with a person",
    ],
    icon: "bot",
    modules: [
      {
        title: "What the system is doing",
        lessons: [
          lesson("Rules and learning", "Compare a program that follows written rules with one that learns from examples.", [
            "A rule-based program does what was written.",
            "A learned model produces an output from patterns in examples.",
            "Both can be wrong. The reasons differ.",
          ]),
          lesson("Data in, prediction out", "Trace one example from input to the model's answer.", [
            "The input is what the model sees.",
            "The prediction is its output, not a fact by itself.",
            "Poor or narrow examples produce a poor model.",
          ]),
          lesson("Where a person stays responsible", "Mark the decisions an AI suggestion must not make alone.", [
            "A score can support a decision. It should not hide who decided.",
            "Personal records need care before they are used as training data.",
            "If you cannot explain the stakes, do not automate the decision.",
          ]),
        ],
      },
      {
        title: "Using it carefully",
        lessons: [
          lesson("Trying a model", "Give a model a small task and compare the output with what you know.", [
            "Write what a good answer would include before you look.",
            "Check names, numbers, and claims.",
            "Keep the source of any fact the model did not provide.",
          ]),
          lesson("Errors and bias", "Look for a pattern of mistakes, not only one wrong answer.", [
            "One wrong answer is a mistake. A repeated miss on the same kind of example is a pattern.",
            "Ask who is missing from the examples.",
            "Do not ship a tool that fails the people it is meant to serve.",
          ]),
          lesson("A practical use at the Trust", "Choose one campus task where AI can draft, and a person still reviews.", [
            "Drafting a lesson outline can be reviewed by a trainer.",
            "Marking a learner's future should not be left to a score alone.",
            "Write the review step next to the task.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "machine-learning-and-dl",
    title: "Machine Learning & DL",
    difficulty: "Advanced",
    hours: 56,
    summary: "Train a simple model, then see how deep learning differs when the pattern is in images or sequences.",
    description:
      "Learners prepare examples, train a basic model, measure it, and then meet the idea of a neural network used in deep learning. The measure of success is an honest test, not a screenshot of training.",
    outcomes: [
      "Split examples into training and test data",
      "Train a simple model and report its errors",
      "Explain what a neural network adds for images or sequences",
    ],
    icon: "cpu",
    modules: [
      {
        title: "Machine learning",
        lessons: [
          lesson("Examples and labels", "A model learns from examples that already have the answer you care about.", [
            "A feature is an input. A label is the answer in the training data.",
            "If the labels are wrong, the model learns the wrong answer.",
            "Write down what one example contains.",
          ]),
          lesson("Train and test", "Hold some examples back so you can see whether the model only memorised.", [
            "Training data is what the model learns from.",
            "Test data is kept unseen until you measure.",
            "A perfect training score with a weak test score is a warning.",
          ]),
          lesson("Reading the errors", "Look at the examples the model got wrong.", [
            "Count the misses. Do not report only the successes.",
            "Group the errors. One kind of miss may have one cause.",
            "Decide whether the next step is more data or a simpler model.",
          ]),
        ],
      },
      {
        title: "Deep learning",
        lessons: [
          lesson("A neural network", "See a network as layers that transform an input into a prediction.", [
            "Each layer changes the representation of the input.",
            "Deep means many layers, not automatically better.",
            "The last layer produces the prediction you measure.",
          ]),
          lesson("Images and sequences", "Notice why photos and language often use deep learning.", [
            "A photo is a grid of values. A sentence is an ordered sequence.",
            "The network is looking for patterns that are hard to write as rules.",
            "It still needs examples and a test.",
          ]),
          lesson("A measured result", "Report accuracy together with what the model must not be used for.", [
            "Give the test result, the number of examples, and the kind of data.",
            "Say the decision a person still has to make.",
            "Do not describe a class exercise as a production system.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "internet-of-things",
    title: "Internet of Things",
    difficulty: "Intermediate",
    hours: 40,
    summary: "Connect a sensor, read a measurement, and send it somewhere a person can see it.",
    description:
      "The course follows one small device: a sensor, a reading, a message, and a screen. Learners also cover the basic care of a device that stays on a network.",
    outcomes: [
      "Read a measurement from a sensor",
      "Send that reading to a page or a log",
      "Limit who can reach the device",
    ],
    icon: "radio",
    modules: [
      {
        title: "A device and a reading",
        lessons: [
          lesson("What an IoT device is", "A small computer with a sensor that can send what it measures.", [
            "The device, the sensor, and the network are three different parts.",
            "A reading is only useful if you know the unit and the time.",
            "A device with no update plan becomes a risk later.",
          ]),
          lesson("Reading a sensor", "Take a temperature or a switch reading and show it locally first.", [
            "Confirm the reading against something you can check.",
            "Note how often you sample.",
            "A stuck value is a fault, not a calm room.",
          ]),
          lesson("Power and failure", "Plan what the device does when the network or the power drops.", [
            "Say whether missed readings are stored or lost.",
            "A device should fail in a way you can notice.",
            "Label the device so someone can find it.",
          ]),
        ],
      },
      {
        title: "Sending the reading",
        lessons: [
          lesson("A message from the device", "Send one reading to a log the class can open.", [
            "The message should include the device name, the value, and the time.",
            "Do not send more personal data than the lesson needs.",
            "Check the log after you send, not only the device screen.",
          ]),
          lesson("A simple dashboard", "Show the latest reading where a person can see it.", [
            "Show the time of the last reading.",
            "Make a stale reading look different from a fresh one.",
            "One chart is enough for this lesson.",
          ]),
          lesson("Keeping the device closed", "Change the default password and restrict who can connect.", [
            "A default password is public.",
            "Only the people who maintain the device need admin access.",
            "Turn off a practice device when the class ends.",
          ]),
        ],
      },
    ],
  }),
];
