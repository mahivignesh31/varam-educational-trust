import type { AssessmentCategory, Question, Quiz } from "@/types";

type Row = [string, string[], number, string];

function pack(
  id: string,
  courseSlug: string,
  title: string,
  category: AssessmentCategory,
  minutes: number,
  rows: Row[],
): Quiz {
  const questions: Question[] = rows.map((row, index) => ({
    id: `${id}-q${index + 1}`,
    prompt: row[0],
    options: row[1],
    correctIndex: row[2],
    explanation: row[3],
  }));
  return { id, courseSlug, title, category, minutes, questions };
}

const computerPractice = pack(
  "computer-fundamentals-practice",
  "computer-fundamentals",
  "Computer Fundamentals — Practice quiz",
  "practice",
  10,
  [
    [
      "What does CPU stand for?",
      ["Central Processing Unit", "Computer Personal Unit", "Control Program Utility", "Central Print Unit"],
      0,
      "CPU stands for Central Processing Unit, the part that carries out instructions.",
    ],
    [
      "Which of these is an input device?",
      ["Monitor", "Keyboard", "Speaker", "Printer"],
      1,
      "A keyboard sends what you type into the computer. A monitor, speaker, and printer are output devices.",
    ],
    [
      "What is RAM mainly used for?",
      ["Long-term storage of photos", "Printing documents", "Temporary working memory", "Connecting to Wi-Fi"],
      2,
      "RAM is temporary working memory. It is cleared when the computer shuts down.",
    ],
    [
      "Which device keeps files after the power is switched off?",
      ["SSD or hard drive", "RAM", "The mouse pointer", "A speaker"],
      0,
      "Storage such as an SSD or hard drive keeps files when the power is off. RAM does not.",
    ],
    [
      "What is a main job of an operating system?",
      ["Replace the keyboard", "Manage hardware and other programs", "Paint the desktop picture only", "Guarantee a fast internet connection"],
      1,
      "The operating system manages hardware and runs other programs.",
    ],
    [
      "What is a folder for?",
      ["Increasing the screen brightness", "Speeding up the processor", "Organising files", "Changing the keyboard language automatically"],
      2,
      "A folder groups related files so you can find them again.",
    ],
    [
      "Which of these is a web browser?",
      ["Mozilla Firefox", "A USB cable", "A spreadsheet cell", "RAM"],
      0,
      "Firefox is a browser. The other options are not programs that open websites.",
    ],
    [
      "What does https indicate on a web address?",
      ["The site is always honest", "The page has no advertisements", "The file is a spreadsheet", "The connection is encrypted"],
      3,
      "https means the connection is encrypted. It does not by itself prove the organisation is trustworthy.",
    ],
    [
      "Which password habit is safer?",
      ["Use one short password on every site", "Use a long password you do not reuse", "Share your password with a caller who sounds official", "Write the password on the monitor"],
      1,
      "A long, unique password is safer than a short password reused everywhere.",
    ],
    [
      "What is the difference between Save and Save As?",
      ["Save As deletes the original", "Save always creates a PDF", "Save As can make another copy with a new name", "They do exactly the same thing"],
      2,
      "Save updates the current file. Save As can create a copy under a new name or in a new place.",
    ],
  ],
);

const computerFortnight = pack(
  "computer-fundamentals-fortnightly",
  "computer-fundamentals",
  "Computer Fundamentals — Fortnightly test",
  "fortnightly",
  8,
  [
    [
      "Which sequence best describes a computer at work?",
      ["Output, then delete, then print", "Input, processing, output", "Storage, then unplug, then type", "Browser, folder, password"],
      1,
      "A computer takes input, processes it, and produces output.",
    ],
    [
      "Why should you sign out on a shared computer?",
      ["To make the screen brighter", "So the next person does not open your account", "Because folders cannot be created otherwise", "To convert files into folders"],
      1,
      "Signing out protects the account and the files from the next person at that machine.",
    ],
    [
      "A file name ends in .pdf. What does that ending tell you?",
      ["The file is certainly unsafe", "Which kind of file it is and which program may open it", "The file is stored in RAM only", "The computer has no operating system"],
      1,
      "The ending, or extension, indicates the file type.",
    ],
    [
      "Which action is a backup?",
      ["Renaming a file on the same desktop", "Keeping a second copy somewhere else", "Increasing the zoom", "Emptying the recycle bin"],
      1,
      "A backup is a second copy kept apart from the original.",
    ],
    [
      "A pop-up says your computer is infected and you must call a number. What should you do?",
      ["Call the number and give remote access", "Close it and ask a trainer before doing anything else", "Type your password so the pop-up can check it", "Download the offered cleaner immediately"],
      1,
      "Unexpected scare pop-ups are a common trick. Stop and ask someone you trust.",
    ],
  ],
);

const computerMonthly = pack(
  "computer-fundamentals-monthly",
  "computer-fundamentals",
  "Computer Fundamentals — Monthly test",
  "monthly",
  12,
  [
    [
      "You create a folder called Practice and save a notice inside it. Where should you look tomorrow?",
      ["Inside RAM", "Inside the Practice folder", "In the browser address bar", "On the printer"],
      1,
      "The file was saved in the Practice folder, so that is where you look.",
    ],
    [
      "Which pair is correct?",
      ["Monitor = input, keyboard = output", "Keyboard = input, monitor = output", "Speaker = input, mouse = storage", "Printer = input, SSD = output"],
      1,
      "You type on a keyboard (input). The monitor shows the result (output).",
    ],
    [
      "What happens to unsaved work if the power fails?",
      ["The operating system always restores every keystroke", "Work that was not saved may be lost", "It is copied to every folder", "It becomes a website"],
      1,
      "Unsaved work lives in temporary memory and can disappear when power fails.",
    ],
    [
      "Which address habit is careful?",
      ["Click any link that uses your name", "Read the address before you type personal information", "Trust a site because it uses green text", "Ignore the address if the pictures look familiar"],
      1,
      "The address is how you check where you are before you enter information.",
    ],
    [
      "Why is Document1 a weak file name?",
      ["Computers cannot store numbers", "It does not say what the file contains", "It uses too much RAM", "Folders reject numbered names"],
      1,
      "A name should tell you what the file is, so you can find it later.",
    ],
  ],
);

const computerFinal = pack(
  "computer-fundamentals-final",
  "computer-fundamentals",
  "Computer Fundamentals — Final assessment",
  "final",
  15,
  [
    [
      "A learner says, “The screen stores my documents.” What is the better explanation?",
      ["The screen shows output; storage such as an SSD keeps the files", "The screen and the SSD are the same part", "Documents are stored in the mouse", "Only the browser can store files"],
      0,
      "The display shows output. Files are kept on storage, not on the glass of the screen.",
    ],
    [
      "Which shutdown habit is sound?",
      ["Hold the power button every time because Save is optional", "Save your work, then shut down through the operating system", "Unplug the machine while files are copying", "Leave a shared account signed in overnight"],
      1,
      "Save first, then use the operating system’s shut-down command.",
    ],
    [
      "Two files have the same name in different folders. What is true?",
      ["The computer must delete one of them", "They can be different files because the folder is part of the location", "Folders cannot contain files with names", "Both files are stored in RAM forever"],
      1,
      "The folder path distinguishes files that share a name.",
    ],
    [
      "Which request should you refuse?",
      ["A trainer asking you to save into the Practice folder", "A stranger asking you to read out a one-time code", "A classmate asking where the browser icon is", "A checklist that says to sign out"],
      1,
      "A one-time code should be entered only on the official screen that requested it, never read out to a stranger.",
    ],
    [
      "What is the operating system’s relationship to an application?",
      ["The application replaces the operating system permanently", "The operating system runs and manages the application", "Applications work only when the operating system is deleted", "They are two names for the keyboard"],
      1,
      "Applications run on top of the operating system, which manages them.",
    ],
    [
      "You need a second copy of a notice before you edit it. Which command fits?",
      ["Save As", "Empty bin", "Increase zoom", "Sign out"],
      0,
      "Save As creates another copy so the earlier version can remain.",
    ],
  ],
);

const excelPractice = pack(
  "advanced-excel-practice",
  "advanced-excel",
  "Advanced Excel — Practice quiz",
  "practice",
  10,
  [
    [
      "How does a formula begin in Excel?",
      ["With a #", "With an =", "With the word CELL", "With a blank space"],
      1,
      "Excel formulas start with an equals sign.",
    ],
    [
      "What does the address C4 mean?",
      ["Column 4, row C", "Column C, row 4", "The fourth sheet", "A chart named C"],
      1,
      "The letter is the column and the number is the row.",
    ],
    [
      "Which formula adds the numbers in A1 to A10?",
      ["=ADD(A1+A10)", "=SUM(A1:A10)", "=TOTAL[A1,A10]", "=PLUS(A1-A10)"],
      1,
      "SUM of the range A1:A10 adds those cells. The colon marks the range.",
    ],
    [
      "What does an absolute reference such as $H$1 do when you fill a formula down?",
      ["It changes to H2, H3, and so on", "It stays locked on H1", "It deletes column H", "It converts the cell to text"],
      1,
      "Dollar signs lock the reference so filling the formula does not shift it.",
    ],
    [
      "What does AVERAGE do?",
      ["Finds the middle spelling", "Adds the numbers and divides by how many numbers were included", "Counts blank cells only", "Sorts the column"],
      1,
      "AVERAGE is the sum of the numbers divided by the count of those numbers.",
    ],
    [
      "A filter on a list is used to…",
      ["Permanently delete every hidden row", "Show rows that match a condition", "Change formulas into values", "Lock the workbook forever"],
      1,
      "A filter hides rows that do not match. It does not delete them.",
    ],
    [
      "Which shape matches =IF(B2>=40,\"Pass\",\"Review\")?",
      ["It always returns Pass", "It returns Pass when B2 is at least 40, otherwise Review", "It adds 40 to B2", "It charts column B"],
      1,
      "IF returns the first result when the test is true and the second when it is false.",
    ],
    [
      "What is a workbook?",
      ["A single cell", "The file that can contain one or more worksheets", "Only a printed chart", "A browser tab"],
      1,
      "The workbook is the Excel file. Worksheets are the sheets inside it.",
    ],
    [
      "Why freeze the header row on a long list?",
      ["To prevent any editing", "To keep the headings visible while you scroll", "To encrypt the sheet", "To remove blank cells"],
      1,
      "Freezing panes keeps headings on screen as you move down the list.",
    ],
    [
      "What is a CSV file?",
      ["A chart style", "Comma-separated values, a plain-text table", "A locked macro", "An absolute reference"],
      1,
      "CSV means comma-separated values. It is a simple text way to store a table.",
    ],
  ],
);

const excelMonthly = pack(
  "advanced-excel-monthly",
  "advanced-excel",
  "Advanced Excel — Monthly test",
  "monthly",
  12,
  [
    [
      "You fill =A1* $B$1 down from row 1. In row 3, what does the formula become?",
      ["=A3*$B$1", "=A1*$B$3", "=$A$3*B1", "=A3*B3"],
      0,
      "A1 is relative and shifts to A3. $B$1 is absolute and stays.",
    ],
    [
      "SUM includes a cell that contains the word Total. What happens?",
      ["Excel refuses to open the file", "SUM ignores that text and adds the numbers", "The word Total is added as 5", "Every number becomes zero"],
      1,
      "SUM ignores text. It adds numeric values in the range.",
    ],
    [
      "Which chart fits comparing attendance across four courses?",
      ["A column chart", "A single cell", "A pie with forty slices", "A password prompt"],
      0,
      "A column chart compares categories. A pie with many slices is hard to read.",
    ],
    [
      "#DIV/0! most likely means…",
      ["The file name is too long", "A formula divided by zero or an empty divisor", "The chart has a title", "The header row is frozen"],
      1,
      "#DIV/0! appears when a divisor is zero or blank.",
    ],
    [
      "Before you send a totals sheet, which check matters most?",
      ["The zoom level is 200%", "You click the total and read which cells the formula uses", "The sheet tab is coloured", "The gridlines are hidden"],
      1,
      "Read the formula so you know the total still points at the right cells.",
    ],
  ],
);

const excelFinal = pack(
  "advanced-excel-final",
  "advanced-excel",
  "Advanced Excel — Final assessment",
  "final",
  15,
  [
    [
      "A sort splits names from their scores. What went wrong?",
      ["Only one column was sorted, so the rows broke apart", "SUM cannot be used after a title", "Absolute references forbid sorting", "Filters always delete the first row"],
      0,
      "Sorting a single column moves that column only. The rest of each row stays behind.",
    ],
    [
      "COUNTA(A1:A5) counts what?",
      ["Only numbers", "Cells that are not empty", "Only cells containing the letter A", "Hidden worksheets"],
      1,
      "COUNTA counts non-empty cells. COUNT counts numbers.",
    ],
    [
      "A chart title says Chart 1. Why is that weak?",
      ["Excel rejects titles", "It does not say what is being measured", "Titles must be cell addresses", "Charts cannot have text"],
      1,
      "The title should say what the reader is looking at, including the measure.",
    ],
    [
      "You see a filter icon and the total looks smaller than yesterday. What do you check first?",
      ["Whether some rows are hidden by the filter", "Whether the font is Calibri", "Whether https is on", "Whether the CPU is an input device"],
      0,
      "A filter can hide rows and change what a careless total appears to include. Confirm the formula and the filter.",
    ],
    [
      "Which formula returns Low when C2 is below 50 and otherwise returns OK?",
      ["=IF(C2<50,\"Low\",\"OK\")", "=SUM(C2<50)", "=IF(C2>50,Low,OK)", "=AVERAGE(\"Low\",\"OK\")"],
      0,
      "The test is C2<50. Text results need quotation marks.",
    ],
    [
      "Why give a worksheet a plain name such as April-expenses?",
      ["Sheet names change the SUM maths", "So the next person knows what the sheet contains", "Excel only calculates named sheets", "It freezes the header automatically"],
      1,
      "A clear sheet name is part of handing the file to someone else.",
    ],
  ],
);

const pythonPractice = pack(
  "python-programming-practice",
  "python-programming",
  "Python Programming — Practice quiz",
  "practice",
  10,
  [
    [
      "What does print(\"Hello\") do?",
      ["Saves a file named Hello", "Displays Hello", "Starts a loop", "Defines a function"],
      1,
      "print displays the value inside the parentheses.",
    ],
    [
      "Which keyword defines a function?",
      ["func", "def", "function", "make"],
      1,
      "def starts a function definition in Python.",
    ],
    [
      "What kind of value does input() return?",
      ["Always an integer", "Always text (a string)", "Always a list", "Always a boolean"],
      1,
      "input() returns text, even when the person types digits.",
    ],
    [
      "What is the difference between = and == ?",
      ["= compares, == stores", "= stores a value, == compares for equality", "They are identical", "== is only used in Excel"],
      1,
      "A single equals stores. A double equals asks whether two values are equal.",
    ],
    [
      "Why does indentation matter in Python?",
      ["It changes the screen colour", "It shows which lines belong to a block such as if or for", "It is optional decoration", "It converts strings to integers"],
      1,
      "Indentation groups lines into a block. It is part of the syntax.",
    ],
    [
      "What does int(\"3\") return?",
      ["The text 3", "The integer 3", "A list of three zeros", "An error every time"],
      1,
      "int converts a string of digits into an integer.",
    ],
    [
      "Which values does range(3) produce?",
      ["1, 2, 3", "0, 1, 2", "3, 3, 3", "0, 1, 2, 3"],
      1,
      "range(3) starts at 0 and stops before 3, so the values are 0, 1, and 2.",
    ],
    [
      "What is a list?",
      ["A single number that cannot change", "An ordered collection of items", "A kind of comment", "The operating system"],
      1,
      "A list keeps items in order, and you can change it.",
    ],
    [
      "How do you write a comment?",
      ["Start the line with #", "Start the line with //", "Wrap the line in print", "Use the keyword note"],
      0,
      "In Python, comments start with #.",
    ],
    [
      "What does len([\"a\", \"b\", \"c\"]) return?",
      ["2", "3", "\"abc\"", "0"],
      1,
      "len returns how many items are in the list. There are three.",
    ],
  ],
);

const pythonFortnight = pack(
  "python-programming-fortnightly",
  "python-programming",
  "Python Programming — Fortnightly test",
  "fortnightly",
  8,
  [
    [
      "items = [\"pen\", \"book\"] . What is items[0]?",
      ["book", "pen", "2", "An error, because indexes start at 1"],
      1,
      "Indexes start at 0, so the first item is pen.",
    ],
    [
      "Which loop is safest if you want exactly four repeats?",
      ["while True with no break", "for i in range(4)", "if i == 4", "print(range)"],
      1,
      "range(4) repeats four times and then stops.",
    ],
    [
      "What does return do inside a function?",
      ["Prints a value and always continues the function", "Sends a value back to the caller and ends the function", "Deletes the function", "Converts the value to a spreadsheet"],
      1,
      "return gives a value back and finishes that call of the function.",
    ],
    [
      "Which line adds \"rice\" to the end of basket?",
      ["basket.addlast(\"rice\")", "basket.append(\"rice\")", "append(basket, rice)", "basket = rice"],
      1,
      "append adds one item at the end of a list.",
    ],
    [
      "A program stops with IndentationError. What should you inspect?",
      ["The quotes and the spaces at the start of the lines in the block", "The monitor brightness", "The Excel absolute references", "The website https lock"],
      0,
      "IndentationError means the block spacing is inconsistent. Check the lines inside if, for, or def.",
    ],
  ],
);

const pythonFinal = pack(
  "python-programming-final",
  "python-programming",
  "Python Programming — Final assessment",
  "final",
  15,
  [
    [
      "What is printed?\n\nscore = 10\nif score >= 10:\n    print(\"Ready\")\nelse:\n    print(\"Not yet\")",
      ["Not yet", "Ready", "10", "Nothing, because = was used"],
      1,
      "score >= 10 is true, so the if branch prints Ready.",
    ],
    [
      "Why can int(input()) fail?",
      ["input() is illegal", "The person may type something that is not a whole number", "int only works on lists", "print must come first"],
      1,
      "int needs text that represents a whole number. Other text raises an error.",
    ],
    [
      "Which call matches def greet(name): ?",
      ["greet", "greet(name)", "greet(\"Meera\")", "def greet"],
      2,
      "A call uses the function name and passes a value. greet(\"Meera\") is a call.",
    ],
    [
      "What is wrong with while x < 3: if x never changes?",
      ["The loop will not stop", "The loop runs exactly three times", "Python converts it into a for loop", "It prints the numbers 0, 1, and 2"],
      0,
      "If the test never becomes false, a while loop continues.",
    ],
    [
      "marks = [4, 7, 1]. Which line prints each mark?",
      ["print(marks[3])", "for mark in marks:\n    print(mark)", "len(print(marks))", "range(marks)"],
      1,
      "A for loop walks each item. marks[3] is out of range because the last index is 2.",
    ],
    [
      "You want a function to hand a total back so another line can use it. Which keyword do you need?",
      ["print only, because print stores the value", "return", "input", "comment"],
      1,
      "return sends the value back. print only displays it.",
    ],
  ],
);

const officePractice = pack(
  "microsoft-office-practice",
  "microsoft-office",
  "Microsoft Office — Practice quiz",
  "practice",
  8,
  [
    ["Where do you look to see whether a document still has the automatic name Document1?", ["The title bar or file name", "The recycle bin", "The task manager only", "The keyboard cable"], 0, "The file name is shown in the title bar. Document1 means you have not chosen a name."],
    ["What is the ribbon?", ["A cable behind the screen", "The grouped commands across the top of the window", "A type of font", "The printed margin"], 1, "The ribbon organises commands such as Home and Insert."],
    ["Why use a heading style instead of only enlarging text?", ["So the computer can treat it as a heading, not just big letters", "Because large text cannot be printed", "Because headings delete paragraphs", "Styles are required to save a file"], 0, "A real heading style marks structure. Big bold text only changes the look."],
    ["What should a slide usually contain?", ["The speaker’s full script", "One idea in large type", "As many colours as possible", "The entire report"], 1, "A slide supports the talk. One clear idea is enough."],
    ["When is a PDF a better file to send than an editable document?", ["When you want the look to stay stable and you do not need the receiver to edit it", "When you want them to rewrite every paragraph", "When the file must stay unsaved", "When you want to hide the file name"], 0, "PDF keeps the layout more stable. An editable file is for when the next person must change it."],
  ],
);

const officeFinal = pack(
  "microsoft-office-final",
  "microsoft-office",
  "Microsoft Office — Final assessment",
  "final",
  12,
  [
    ["Which page is easier to read?", ["Centred paragraphs in several pale colours", "Left-aligned dark text, a title, and short sections", "A single block with no paragraphs", "Text set in a very small font to fit more"], 1, "Alignment, contrast, and short sections help a reader."],
    ["You are about to email a notice. Which check belongs on the list?", ["The attachment is the finished file, and the name says what it is", "The zoom is exactly 100%", "The ribbon is hidden", "The document uses at least five fonts"], 0, "Confirm the attachment and a clear file name before you send."],
    ["A slide has twelve lines of small text. What is the better change?", ["Move detail into speaker notes or a handout and keep the slide short", "Make the font even smaller", "Add more colours", "Read every line aloud without changing the slide"], 0, "Slides are not handouts. Extra detail can move off the slide."],
    ["Undo is useful because…", ["It steps back from a recent change", "It signs you out of email", "It converts the file to CSV", "It freezes the header"], 0, "Undo reverses a recent action and is safer than guessing how to rebuild the page."],
  ],
);

const digitalPractice = pack(
  "digital-literacy-practice",
  "digital-literacy",
  "Digital Literacy — Practice quiz",
  "practice",
  8,
  [
    ["A useful help request includes…", ["Only the words it does not work", "What you clicked, what you expected, and what happened", "Your password", "A demand to hurry"], 1, "The last action and the exact result let someone help you."],
    ["Which message is a warning sign?", ["A classmate asking for the class time", "A stranger urging you to open a link immediately and share a code", "A trainer reminding you to save", "A receipt you were expecting from a shop you used"], 1, "Urgency plus a surprise link or code is a common trap."],
    ["Search results are…", ["Always the true answer in the first row", "Pages the search tool found, which you still need to judge", "Private messages", "Backups of your desktop"], 1, "Search finds pages. You still decide which source to trust."],
    ["Before forwarding a friend’s photo, you should…", ["Ask them", "Add a joke so it is harmless", "Send it to as many groups as possible", "Remove your own name only"], 0, "Forwarding multiplies the photo. Ask first."],
    ["A calculator app asks for your contacts. What is a careful response?", ["Allow it, because all apps need contacts", "Refuse a permission that does not match the job", "Send the contacts to a cleaner ad", "Delete the operating system"], 1, "Permissions should match what the app is for."],
  ],
);

const digitalFinal = pack(
  "digital-literacy-final",
  "digital-literacy",
  "Digital Literacy — Final assessment",
  "final",
  12,
  [
    ["Two reliable pages disagree. What is honest?", ["Pick the louder headline", "Say you need to look further", "Trust the one with more advertisements", "Share both as proven fact"], 1, "Disagreement between good sources means the question is not settled yet."],
    ["Which file is safer to photograph for an application?", ["A page where the text is readable and extra private numbers are covered if they are not required", "A blurry photo of the wrong card", "Someone else’s document", "A password written on paper"], 0, "The photo should show what was asked, clearly, and nothing extra that is private."],
    ["Public Wi-Fi is a poor place to…", ["Read a news headline", "Type a password or make a payment without care", "Check a class time on a page you already trust after looking at the address", "Open your own downloaded notes"], 1, "Passwords and payments need extra care on a network you do not control."],
    ["An error appears. What do you record?", ["The exact words of the message", "Only your mood", "The brand of chair", "A new password"], 0, "The exact error text is what a helper needs."],
  ],
);

const englishPractice = pack(
  "spoken-english-practice",
  "spoken-english",
  "Spoken English — Practice quiz",
  "practice",
  8,
  [
    ["Which line asks someone to repeat, politely?", ["Say that again now.", "Please say that again.", "You are unclear.", "Stop talking."], 1, "Please say that again is polite and complete."],
    ["Which introduction is a full sentence?", ["Ravi student.", "My name is Ravi. I am learning computers.", "Name Ravi class.", "Hello name."], 1, "A full sentence has a clear subject and verb."],
    ["Which word starts a question about place?", ["Where", "Because", "Slowly", "Please"], 0, "Where asks about place."],
    ["A one-minute talk needs…", ["Every detail you know", "A start, a couple of points, and a clear ending", "No pauses at all", "Another person to read it for you"], 1, "A short talk has a beginning, a few points, and an ending."],
    ["Which closing is suitable after a shop question?", ["Give me that.", "Thank you. Have a good day.", "You talk.", "Faster."], 1, "Thank you and a short closing end the conversation cleanly."],
  ],
);

const englishFinal = pack(
  "spoken-english-final",
  "spoken-english",
  "Spoken English — Final assessment",
  "final",
  12,
  [
    ["Your partner asks, “Where is the class?” Which answer fits?", ["The class is in room 2.", "Class.", "Because room.", "I name."], 0, "Answer with a sentence that includes the place."],
    ["You forget the word printer. What can you do?", ["Stop the conversation forever", "Describe it: the machine that puts the page on paper", "Ask the person to leave", "Switch languages without trying"], 1, "Describing the word keeps the conversation moving."],
    ["Which question invites the other person to speak?", ["And you?", "Only me.", "Listen.", "Finished."], 0, "And you? hands the turn back."],
    ["Why practise a short talk aloud?", ["Because written English and spoken pace are different", "Because silent reading changes the grammar", "Because a talk cannot have an ending", "Because questions are impolite"], 0, "Speaking shows rushed endings and missing pauses that reading hides."],
  ],
);

const communicationPractice = pack(
  "communication-skills-practice",
  "communication-skills",
  "Communication Skills — Practice quiz",
  "practice",
  8,
  [
    ["Before you answer a request, a useful step is to…", ["Repeat the request in your own words", "Offer a different task", "Interrupt with advice", "Change the subject"], 0, "Restating the request checks that you heard it."],
    ["Which sentence is clearer?", ["It would be appreciated if the thing were sent sometime.", "Please send the attendance sheet today.", "Send maybe the list or not.", "Regarding the above, kindly do needful."], 1, "The clear sentence names the file and the time."],
    ["Helpful feedback…", ["Describes the person’s character", "Names what to change in the work and how", "Uses always and never", "Is given only as sarcasm"], 1, "Feedback should point at the work and a specific change."],
    ["A strong subject line is…", ["Hello", "Attendance sheet for 12 April", "Urgent!!!", "File"], 1, "The subject should say what the message is about."],
    ["In a group, a fair habit is to…", ["Speak for as long as you can", "Make one point, then invite someone who has not spoken", "Correct accents", "Ignore the original question"], 1, "Short turns and invitations keep a group balanced."],
  ],
);

const communicationFinal = pack(
  "communication-skills-final",
  "communication-skills",
  "Communication Skills — Final assessment",
  "final",
  12,
  [
    ["“Send the file now.” is better rewritten as…", ["Please send the notice today by 4 pm.", "File. Now. You.", "Why is this late again?", "Send whatever."], 0, "The rewrite keeps the request, adds politeness, and names the time."],
    ["Someone is still talking. You already know the answer. You should…", ["Let them finish", "Talk over them so the meeting ends", "Laugh", "Leave without a word"], 0, "Letting them finish is part of listening."],
    ["Which line is feedback on the work?", ["You are careless.", "The second paragraph needs a shorter first sentence.", "People like you rush.", "This is hopeless."], 1, "The useful line describes the sentence, not the person."],
    ["The first lines of a request message should…", ["Say what you need", "Only say Hello and stop", "Apologise for existing", "Include three unrelated stories"], 0, "Put the request early so the reader can act."],
  ],
);

const aiPractice = pack(
  "artificial-intelligence-fundamentals-practice",
  "artificial-intelligence-fundamentals",
  "AI Fundamentals — Practice quiz",
  "practice",
  8,
  [
    ["In this course, a careful meaning of AI is…", ["Software that finds patterns and drafts or predicts", "A person inside the computer", "A guarantee of truth", "A replacement for checking your work"], 0, "The course uses AI for tools that pattern-match and produce a draft or prediction."],
    ["A fluent paragraph from a chatbot is…", ["Therefore true", "Easy to read, and still in need of a check", "Always copied from your textbook", "A signed certificate"], 1, "Smooth language is not the same as a verified fact."],
    ["Which data should stay out of a public demo tool?", ["A sample shopping list with fake items", "A classmate’s identity numbers", "A question about what SUM means", "A made-up practice sentence"], 1, "Private records do not belong in a demonstration tool."],
    ["A better prompt includes…", ["Only the word explain", "The task, the audience, and what finished looks like", "A demand for secrets", "Someone’s password"], 1, "Specific tasks and limits produce a draft you can judge."],
    ["If an assignment is meant to practise your own formula, using a tool to submit the formula as yours is…", ["Required", "A way to skip the practice the assignment was for", "Always credited as experience", "The same as asking a trainer to explain a step"], 1, "The point of practice is the learner’s own attempt. Disclosure and the assignment rules matter."],
  ],
);

const aiFinal = pack(
  "artificial-intelligence-fundamentals-final",
  "artificial-intelligence-fundamentals",
  "AI Fundamentals — Final assessment",
  "final",
  12,
  [
    ["A tool gives a date for a local exam. What should you do?", ["Check the official notice", "Trust it because the sentence is confident", "Forward it as confirmed", "Ignore all dates forever"], 0, "Local facts and dates need the organisation’s own notice."],
    ["Which check fits a formula the tool suggested?", ["Type it into Excel or Python and compare with a known example", "Judge it by the font", "Assume it matches Excel because it uses an equals sign somewhere", "Skip the check if you are in a hurry"], 0, "Recreate the calculation in a tool you can inspect."],
    ["Why can a model fail on a situation it rarely saw in its examples?", ["Because its answers depend on patterns in those examples", "Because computers cannot store text", "Because https blocks it", "Because lists in Python start at 1"], 0, "Gaps in the examples become weak or invented answers."],
    ["An honest line under a draft is…", ["I used a chatbot to draft this, then checked the dates myself.", "The computer certified this.", "This cannot be wrong.", "A trainer signed it electronically."], 0, "Disclosure plus a real check is honest. A tool does not certify work."],
  ],
);

const employPractice = pack(
  "employability-skills-practice",
  "employability-skills",
  "Employability Skills — Practice quiz",
  "practice",
  8,
  [
    ["When you read a role description, what should you mark first?", ["The verbs that name the tasks", "Only the organisation’s logo colours", "Adjectives about being a family", "The longest paragraph, whatever it says"], 0, "The verbs tell you what the person will actually do."],
    ["Which line is evidence of a skill?", ["I am a hardworking genius.", "I prepared a one-page notice in Word during class.", "I know everything about offices.", "I will probably learn later."], 1, "A specific example is evidence. A broad claim is not."],
    ["A beginner résumé should…", ["Invent a job title", "Stay with facts you can discuss", "Run to four pages of adjectives", "List a certificate you have not earned"], 1, "Only include what you can explain in conversation."],
    ["If you will be late, a sound habit is to…", ["Send a message", "Arrive silently and hope", "Skip the next week as well", "Ask a stranger to call for you"], 0, "A message is better than silence."],
    ["A 30-day plan works better when it is…", ["Small enough that you will actually do it", "A list of twenty new careers", "Dependent on buying a surprise course", "Written only as motivation with no day attached"], 0, "A small repeated practice beats an impressive plan you will not start."],
  ],
);

const employFinal = pack(
  "employability-skills-final",
  "employability-skills",
  "Employability Skills — Final assessment",
  "final",
  12,
  [
    ["Which interview answer is specific?", ["I am perfect for everything.", "I practised SUM and IF in the Excel lessons and can explain a total.", "I work too hard to describe.", "Hire me and I will learn all tools tonight."], 1, "Name the skill and where you practised it."],
    ["A sample role asks for a spreadsheet and says applicants must live in the town. You should…", ["Ignore the eligibility line", "Notice both the task and the eligibility, and not pretend", "Claim ten years of experience", "Treat the sample as a real offer from this website"], 1, "Read the conditions honestly. Sample text on this site is not a vacancy."],
    ["A good question for an interviewer is…", ["What does a normal day look like?", "Will you write my application?", "How can I skip the boring parts?", "Do you like me?"], 0, "Asking about the work shows you are thinking about the role."],
    ["This demonstration campus should be described on a résumé as…", ["An accredited qualification from an external board", "Practice on a sample learning site, if you mention it at all", "A guaranteed placement", "A government rank"], 1, "Be precise. The site itself says certificates here are samples, not official credentials."],
  ],
);

const careerPractice = pack(
  "career-guidance-practice",
  "career-guidance",
  "Career Guidance — Practice quiz",
  "practice",
  8,
  [
    ["In this course, an interest is…", ["A permanent ranking produced by a hidden test", "Something you want to try, which you can describe", "A job offer", "A certificate number"], 1, "Interests here are clues for a conversation, not official scores."],
    ["A constraint such as travel or time should be…", ["Hidden so the plan looks bold", "Written honestly because it affects the plan", "Treated as a personal failing", "Ignored if a poster is inspiring"], 1, "A plan that hides a real limit is fragile."],
    ["Which fact belongs in a first comparison of study paths?", ["Duration, cost, location, and eligibility", "Only the slogan", "A promise of a job with no source", "The colour of the brochure"], 0, "Those four facts are the start of a fair comparison."],
    ["A useful mentor question is…", ["What does a Tuesday look like in this work?", "Can you decide my life?", "Will you guarantee a salary?", "Which advertisement should I believe without asking?"], 0, "Questions about an ordinary day draw on real experience."],
    ["A finished next step looks like…", ["A list of ten careers", "One action with a date, such as asking a trainer two questions on Friday", "A new poster", "Waiting for motivation"], 1, "An action names what you will do and when it is done."],
  ],
);

const careerFinal = pack(
  "career-guidance-final",
  "career-guidance",
  "Career Guidance — Final assessment",
  "final",
  12,
  [
    ["This website’s career pages do not…", ["Help you write questions", "Promise placements or rank colleges", "Suggest you talk to a mentor", "Ask you to pick one next step"], 1, "The course refuses invented placements and college rankings."],
    ["Computer skill in a non-IT job is best described as…", ["Proof that you must become a programmer", "A tool that may appear in the tasks, at a level you should state honestly", "A personality type", "A reason to buy a course from a pop-up"], 1, "Many jobs include a computer task. Say your real level."],
    ["How long is a fair first ask of a busy mentor?", ["An undefined series of favours", "A short conversation, such as twenty minutes", "That they write your application that day", "A demand for their personal documents"], 1, "A bounded request respects their time."],
    ["After the conversation you should…", ["Thank them and note what you will do next", "Forget the answers and rely on the mood", "Share their private contact widely", "Treat one opinion as a final ranking of your future"], 0, "A thank-you and a written next step complete the conversation."],
  ],
);

export const quizzes: Quiz[] = [
  computerPractice,
  computerFortnight,
  computerMonthly,
  computerFinal,
  excelPractice,
  excelMonthly,
  excelFinal,
  pythonPractice,
  pythonFortnight,
  pythonFinal,
  officePractice,
  officeFinal,
  digitalPractice,
  digitalFinal,
  englishPractice,
  englishFinal,
  communicationPractice,
  communicationFinal,
  aiPractice,
  aiFinal,
  employPractice,
  employFinal,
  careerPractice,
  careerFinal,
];

export function findQuiz(id: string) {
  return quizzes.find((quiz) => quiz.id === id);
}

export function quizzesForCourse(slug: string) {
  return quizzes.filter((quiz) => quiz.courseSlug === slug);
}

export function quizzesByCategory(category: AssessmentCategory) {
  return quizzes.filter((quiz) => quiz.category === category);
}

export function quizStaticParams() {
  return quizzes.map((quiz) => ({ quizId: quiz.id }));
}

export const passMark = 60;
