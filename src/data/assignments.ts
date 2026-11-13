import type { Assignment } from "@/types";

export const assignments: Assignment[] = [
  {
    id: "asg-computer",
    courseSlug: "computer-fundamentals",
    title: "Map your own computer",
    prompt:
      "In a short note, name four parts of a computer you can point to and one job each part does. Then describe how you would save a file into a folder named Practice. This response stays in your browser.",
    minutes: 20,
  },
  {
    id: "asg-office",
    courseSlug: "microsoft-office",
    title: "A one-page notice",
    prompt:
      "Draft the wording for a one-page class notice: a title, three short points, and a closing line. Mention which Office tool you would use and why.",
    minutes: 25,
  },
  {
    id: "asg-excel",
    courseSlug: "advanced-excel",
    title: "Check a total",
    prompt:
      "Describe a small expense list with five rows. Write the Excel formula you would use to total them, and name one check you would make before sharing the sheet.",
    minutes: 25,
  },
  {
    id: "asg-digital",
    courseSlug: "digital-literacy",
    title: "A safer inbox",
    prompt:
      "Write three signs that an email or message might be unsafe, and the step you would take instead of clicking a surprise link.",
    minutes: 20,
  },
  {
    id: "asg-english",
    courseSlug: "spoken-english",
    title: "Introduce yourself",
    prompt:
      "Write a six-line spoken introduction: your name, where you are learning, one skill you are practising, and one question you can ask a classmate.",
    minutes: 20,
  },
  {
    id: "asg-communication",
    courseSlug: "communication-skills",
    title: "Rewrite a blunt message",
    prompt:
      "Take the line “Send the file now.” Rewrite it so the request is clear, polite, and says when you need it.",
    minutes: 15,
  },
  {
    id: "asg-python",
    courseSlug: "python-programming",
    title: "Explain a tiny program",
    prompt:
      "Write a Python snippet that asks for a name and prints a greeting. Under it, explain in plain language what each line does.",
    minutes: 30,
  },
  {
    id: "asg-ai",
    courseSlug: "artificial-intelligence-fundamentals",
    title: "Check an AI answer",
    prompt:
      "Describe a question you might ask an AI tool for this course, and two checks you would make before trusting the answer.",
    minutes: 20,
  },
  {
    id: "asg-employability",
    courseSlug: "employability-skills",
    title: "Evidence of a skill",
    prompt:
      "Choose one skill from this program. Write two sentences a learner could say in an interview, with a concrete example of practice.",
    minutes: 20,
  },
  {
    id: "asg-career",
    courseSlug: "career-guidance",
    title: "One next step",
    prompt:
      "Name one learning or work direction you want to understand better, and three questions you would ask a mentor about it.",
    minutes: 20,
  },
  {
    id: "asg-web",
    courseSlug: "web-development",
    title: "Publish a three-page site",
    prompt:
      "Describe a three-page site you would build: the pages, what each one contains, and how you would check the links before sharing the address.",
    minutes: 30,
  },
  {
    id: "asg-java",
    courseSlug: "java-fullstack",
    title: "Trace one record",
    prompt:
      "Explain the path of one learner record from a form, through a Java API, into storage, and back onto the page. Name what you would check if the page stayed empty.",
    minutes: 35,
  },
  {
    id: "asg-python-full",
    courseSlug: "python-fullstack",
    title: "A roster check",
    prompt:
      "Write the fields you would store for a course roster and the Python checks you would run before saving a new row.",
    minutes: 30,
  },
  {
    id: "asg-aws",
    courseSlug: "aws",
    title: "Name the three parts",
    prompt:
      "For a practice file and a small server, name the AWS service you would use for storage, for compute, and for access. Say when you would stop the server.",
    minutes: 25,
  },
  {
    id: "asg-devops",
    courseSlug: "devops",
    title: "A release note",
    prompt:
      "Write the steps you would run before a small release: the Git check, the automated test, and how you would return to the previous version.",
    minutes: 25,
  },
  {
    id: "asg-data",
    courseSlug: "data-science",
    title: "One honest finding",
    prompt:
      "Using any small table you know, state one question, the summary you would calculate, and one claim you would not make from that table.",
    minutes: 30,
  },
  {
    id: "asg-ai-course",
    courseSlug: "artificial-intelligence",
    title: "A reviewed draft",
    prompt:
      "Name one campus task where an AI tool may draft the first version, and the check a trainer must do before anyone relies on it.",
    minutes: 20,
  },
  {
    id: "asg-ml",
    courseSlug: "machine-learning-and-dl",
    title: "Train and test",
    prompt:
      "Explain how you would split examples into training and test data, and what a high training score with a low test score would tell you.",
    minutes: 30,
  },
  {
    id: "asg-tally",
    courseSlug: "tally-erp-9",
    title: "One voucher, end to end",
    prompt:
      "Describe a cash purchase for a practice company in Tally ERP 9. Name the voucher type, the ledgers you would use, and the report where you would confirm the entry afterwards.",
    minutes: 30,
  },
  {
    id: "asg-tally-gst",
    courseSlug: "tally-with-gst",
    title: "A tax invoice check",
    prompt:
      "List the details a GST tax invoice needs for a sale inside one state. Say whether the tax is CGST and SGST or IGST, and name the return that reports outward supplies.",
    minutes: 30,
  },
  {
    id: "asg-accounting",
    courseSlug: "basic-accounting",
    title: "Two equal sides",
    prompt:
      "Write the journal entry for cash received from the owner as capital. Name the debit, the credit, and one reason the trial balance would fail if you posted only one side.",
    minutes: 25,
  },
  {
    id: "asg-statements",
    courseSlug: "financial-statements",
    title: "Profit is not cash",
    prompt:
      "A practice shop shows a profit and almost no cash. In a short note, explain how both can be true, and name one figure you would read on the balance sheet before you judged the shop.",
    minutes: 25,
  },
  {
    id: "asg-payroll",
    courseSlug: "payroll-and-salary",
    title: "One pay slip",
    prompt:
      "Draft a sample pay slip for one month: earnings, two deductions, payable days, and net pay. Label it as a sample and say which total should match the bank payment.",
    minutes: 30,
  },
  {
    id: "asg-banking",
    courseSlug: "banking-and-reconciliation",
    title: "Why the balances differ",
    prompt:
      "The cash book bank balance and the bank statement disagree. Name two ordinary reasons that are timing differences and one difference that is an error in the books.",
    minutes: 25,
  },
  {
    id: "asg-dtp",
    courseSlug: "desktop-publishing",
    title: "One card, ready to print",
    prompt:
      "Describe a visiting card you would lay out: the page size, what goes on it, and two things you would check on the PDF before sending it to print.",
    minutes: 25,
  },
  {
    id: "asg-photoshop",
    courseSlug: "photoshop",
    title: "Keep the original",
    prompt:
      "You are asked to brighten a practice photograph and remove one speck. Say where the original file stays, what you put on its own layer, and which file you would hand over for a website.",
    minutes: 30,
  },
  {
    id: "asg-iot",
    courseSlug: "internet-of-things",
    title: "One device reading",
    prompt:
      "Describe a sensor reading you would send: the device name, the value, the unit, and the time. Say who should be allowed to change the device.",
    minutes: 25,
  },
];
