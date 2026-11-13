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
    category: "Finance & Accounts",
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

export const financeCourses: Course[] = [
  build({
    slug: "tally-erp-9",
    title: "Tally ERP 9",
    difficulty: "Beginner",
    hours: 48,
    summary: "Create a company in Tally ERP 9, record everyday vouchers, and read the books those vouchers produce.",
    description:
      "Learners work inside Gateway of Tally: a company, ledger groups, and the vouchers a small shop actually uses. The course ends when a learner can trace one transaction from a voucher to the day book and the trial balance.",
    outcomes: [
      "Create a company and the ledgers it needs",
      "Record payment, receipt, sales, and purchase vouchers",
      "Open the day book, trial balance, and final accounts",
    ],
    icon: "calculator",
    modules: [
      {
        title: "A company in Tally",
        lessons: [
          lesson("Gateway of Tally", "Find the company, the vouchers, and the reports from the opening screen.", [
            "Gateway of Tally is the home screen. Masters, transactions, and reports start there.",
            "A company is one set of books. Do not mix two businesses in one company.",
            "Note the financial year before you enter the first voucher.",
          ]),
          lesson("Create a company", "Set the name, the books beginning date, and the security so a practice company stays separate.", [
            "The name on the company should match the name on the bills.",
            "Books beginning from is the date the entries start, not the day you installed Tally.",
            "Keep the practice company apart from any real set of books.",
          ]),
          lesson("Ledgers and groups", "Put each account under the group that describes what it is.", [
            "A ledger is one account. A group is the family it belongs to, such as Sundry Debtors or Bank Accounts.",
            "Cash and each bank account are separate ledgers.",
            "A wrong group makes the trial balance look right and the balance sheet wrong.",
          ]),
        ],
      },
      {
        title: "Vouchers and reports",
        lessons: [
          lesson("Payment, receipt, and contra", "Record money going out, money coming in, and money moving between cash and bank.", [
            "A payment voucher is money paid. A receipt voucher is money received.",
            "A contra voucher moves money between cash and bank. It is not income or an expense.",
            "Write the bill or receipt number in the narration so you can find the paper later.",
          ]),
          lesson("Sales and purchase vouchers", "Record a sale and a purchase with the party and the amount.", [
            "A sales voucher increases what the customer owes or the cash received.",
            "A purchase voucher records what the business bought and who must be paid.",
            "Check the party name before you accept the voucher.",
          ]),
          lesson("Day book, trial balance, and final accounts", "Follow one voucher into the reports a learner is asked to show.", [
            "The day book lists vouchers by date. Use it to find an entry you just saved.",
            "The trial balance lists debit and credit totals. They should agree.",
            "Profit and loss and the balance sheet are read only after the trial balance agrees.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "tally-with-gst",
    title: "Tally with GST",
    difficulty: "Intermediate",
    hours: 40,
    summary: "Turn GST on in Tally, raise a tax invoice, and see how outward supplies reach GSTR-1 and GSTR-3B.",
    description:
      "The course assumes a learner can already record a simple voucher. It adds GST: the company GSTIN, party ledgers, tax ledgers, a tax invoice, and the two returns a small business meets first. Rates and forms change, so the habit is to check the current rule before filing.",
    outcomes: [
      "Enable GST and store a GSTIN on the company and the party",
      "Raise a sales invoice that shows the tax",
      "Explain what GSTR-1 and GSTR-3B are for",
    ],
    icon: "receipt",
    modules: [
      {
        title: "GST on the company",
        lessons: [
          lesson("What GST is charging", "GST is a tax on a supply. The invoice shows who is charging it and at what rate.", [
            "A supply inside one state usually splits the tax into CGST and SGST.",
            "A supply to another state is usually IGST.",
            "The rate is not guessed. It comes from the goods or service and the current notification.",
          ]),
          lesson("Turn GST on and set the GSTIN", "Enable GST for the company and type the registration number exactly.", [
            "GST features are switched on before the first tax invoice.",
            "The GSTIN has a fixed length. A missing character will not match the portal.",
            "The state in the GSTIN must match the company's state.",
          ]),
          lesson("Party ledgers and place of supply", "A customer or supplier ledger needs a GSTIN and a place of supply when they are registered.", [
            "Registration type says whether the party is regular, composition, or unregistered.",
            "Place of supply decides whether the invoice uses CGST and SGST or IGST.",
            "Copy the GSTIN from the party's document. Do not invent one for practice that looks real.",
          ]),
        ],
      },
      {
        title: "Invoices and returns",
        lessons: [
          lesson("A tax invoice", "A GST invoice names the supplier, the recipient, the supply, the taxable value, and the tax.", [
            "HSN or SAC belongs on the invoice when the rule for that business requires it.",
            "The tax amount is the taxable value times the rate. Check the arithmetic.",
            "A bill of supply is not the same document as a tax invoice. Use the one the registration allows.",
          ]),
          lesson("Outward supplies for GSTR-1", "GSTR-1 is the return of outward supplies. The sales invoices should be the source.", [
            "Each outward invoice in the books should be traceable to a line that would go on GSTR-1.",
            "A credit note reduces a supply. It is not deleted from history.",
            "Export the figures and compare the total with the sales register before anyone files.",
          ]),
          lesson("The summary return GSTR-3B", "GSTR-3B summarises tax payable and input tax credit for the period.", [
            "Output tax comes from supplies. Input tax credit comes from eligible purchases.",
            "A purchase without a valid invoice is not automatic credit.",
            "This course shows how to read the summary. Filing on the portal is a separate checked step.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "basic-accounting",
    title: "Basic Accounting",
    difficulty: "Beginner",
    hours: 30,
    summary: "Learn debit and credit, write a journal entry, and carry it to a ledger and a trial balance.",
    description:
      "The course is the paper habit underneath Tally. Learners name assets, liabilities, and capital, then record a few transactions and prove that debits equal credits.",
    outcomes: [
      "Classify a simple item as asset, liability, or capital",
      "Write a journal entry with equal debit and credit",
      "Post the entry and prepare a small trial balance",
    ],
    icon: "wallet",
    modules: [
      {
        title: "The language of accounts",
        lessons: [
          lesson("Assets, liabilities, and capital", "A business owns assets, owes liabilities, and the rest is the owner's capital.", [
            "Cash, stock, and money customers owe are assets.",
            "A loan and money owed to suppliers are liabilities.",
            "Capital is the owner's claim. Assets equal liabilities plus capital.",
          ]),
          lesson("Debit and credit", "Every entry has a debit and a credit of the same amount.", [
            "Debit is the left side. Credit is the right side. Neither word means good or bad.",
            "An increase in cash is a debit to cash. An increase in a loan is a credit to the loan.",
            "If the two sides differ, the entry is not finished.",
          ]),
          lesson("A journal entry", "Write the date, the account debited, the account credited, and a short narration.", [
            "The narration says what happened, such as cash received from a customer.",
            "One transaction can use more than two accounts, but the totals still match.",
            "Do not skip the date. Reports are read in date order.",
          ]),
        ],
      },
      {
        title: "From journal to trial balance",
        lessons: [
          lesson("Posting to a ledger", "Copy each side of the journal into the ledger of that account.", [
            "The ledger collects every debit and credit for one account.",
            "The balance is what remains after the two sides are compared.",
            "Post the same amount that is in the journal. Do not round it on the way.",
          ]),
          lesson("A trial balance", "List every ledger balance and check that total debits equal total credits.", [
            "A trial balance is a list, not a story. Each account appears once.",
            "Equal totals mean the sides match. They do not prove every narration is true.",
            "Write the date the trial balance is prepared.",
          ]),
          lesson("Finding a simple error", "Look for a difference, a missing entry, or an amount on the wrong side.", [
            "A difference that is divisible by 9 often means two digits were swapped.",
            "An entry in the journal that never reached a ledger will unbalance the trial balance.",
            "Correct with a new entry or a clear correction. Do not erase the original without a note.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "financial-statements",
    title: "Financial Statements",
    difficulty: "Intermediate",
    hours: 32,
    summary: "Prepare a simple profit and loss account and balance sheet, then say what the figures do and do not prove.",
    description:
      "Learners take a short trial balance and sort it into performance and position. The course stays with one period and a comparison, and it refuses claims a single statement cannot support.",
    outcomes: [
      "Sort income and expense from assets and liabilities",
      "Prepare a simple profit and loss account and balance sheet",
      "State one limit of what those statements can show",
    ],
    icon: "pie",
    modules: [
      {
        title: "Profit and position",
        lessons: [
          lesson("Income and expense", "Income is what the business earned. Expense is the cost of earning it in that period.", [
            "A sale is income. Rent and wages for the period are expenses.",
            "Buying a machine is not an expense of the whole amount in one line if it will be used for years.",
            "The period must be named: a month, a quarter, or a year.",
          ]),
          lesson("A profit and loss account", "Income minus expenses for the period is the profit or the loss.", [
            "List income, then expenses, then the difference.",
            "A loss is a result. It is not hidden by leaving out an expense.",
            "The profit moves to capital. It is not a second cash box.",
          ]),
          lesson("A balance sheet", "The balance sheet shows assets, liabilities, and capital on one date.", [
            "It is a position on a date, not a story of the whole year.",
            "The two sides agree when the profit or loss has been included.",
            "Cash on the balance sheet is not the same figure as profit.",
          ]),
        ],
      },
      {
        title: "Reading the statements",
        lessons: [
          lesson("What the numbers can say", "Compare profit with sales, and cash with the bills that are due.", [
            "A profit with no cash can still be real if customers have not paid.",
            "A large cash balance with unpaid suppliers is not automatically healthy.",
            "Write the comparison in one sentence a owner could check.",
          ]),
          lesson("A comparison with last period", "One period beside the previous period shows a change, not a cause.", [
            "Use the same headings in both periods.",
            "A rise in sales is a change. The reason is a separate question.",
            "Do not drop a line because it makes this period look better.",
          ]),
          lesson("What not to claim", "A class statement is not an audit and not a forecast.", [
            "Say which books the statement came from.",
            "Do not promise next year's profit from one profit figure.",
            "If a figure was assumed, label the assumption.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "payroll-and-salary",
    title: "Payroll and Salary",
    difficulty: "Intermediate",
    hours: 28,
    summary: "Build a pay slip from earnings and deductions, then record the salary payment in the books.",
    description:
      "Learners calculate payable days, earnings, and the deductions a salary sheet usually shows. Statutory amounts follow the current rule, so the course teaches where to look and how to check the slip before anyone is paid.",
    outcomes: [
      "Compute payable days and gross earnings",
      "Recognise common salary deductions without inventing a rate",
      "Record the net salary payment and check the slip",
    ],
    icon: "coins",
    modules: [
      {
        title: "A salary record",
        lessons: [
          lesson("Earnings and deductions", "Gross pay is earnings. Net pay is what remains after deductions.", [
            "Basic pay, allowance, and incentive are earnings. They are listed separately.",
            "A deduction reduces the amount paid. It is not ignored because it is small.",
            "Net pay is gross pay minus deductions. Show the arithmetic on the slip.",
          ]),
          lesson("Attendance and payable days", "Pay follows the days the person was payable for in that month.", [
            "Calendar days, paid leave, and loss of pay are three different counts.",
            "A loss-of-pay day reduces earnings. Write the count before you calculate.",
            "Do not copy last month's days if this month is shorter.",
          ]),
          lesson("A pay slip", "The slip names the person, the month, the earnings, the deductions, and the net pay.", [
            "The name and the month must both be right.",
            "Each deduction has its own line.",
            "Give the slip to the person it belongs to. Do not leave a pile of slips in a shared tray.",
          ]),
        ],
      },
      {
        title: "Paying and recording",
        lessons: [
          lesson("Deductions a learner should recognise", "Provident fund, ESI, professional tax, and tax deducted at source appear on many Indian salary sheets.", [
            "The rate and the wage ceiling are set by rule and can change. Look them up. Do not memorise a stale number.",
            "Employee share and employer share are not the same amount in every scheme.",
            "A practice slip should be labelled sample so it is not mistaken for a filed return.",
          ]),
          lesson("Record the salary payment", "The books show salary expense and the net amount paid, plus the amounts withheld.", [
            "Net pay goes to the employee. Amounts withheld are still owed to someone else.",
            "A payment voucher or bank entry should match the net total of the slips.",
            "Keep the month on the voucher narration.",
          ]),
          lesson("Check the payroll before it is paid", "Add the slips, compare attendance, and only then release the payment.", [
            "The total of net pay on the slips equals the amount leaving the bank.",
            "A new joiner or a resignation changes this month. Do not assume last month's list.",
            "One wrong account number is checked before the transfer, not after.",
          ]),
        ],
      },
    ],
  }),
  build({
    slug: "banking-and-reconciliation",
    title: "Banking and Reconciliation",
    difficulty: "Intermediate",
    hours: 24,
    summary: "Record cash and bank entries, then explain why the bank statement and the books disagree.",
    description:
      "Learners keep a cash book and a bank book, then prepare a short bank reconciliation. The point is to name the items that are timing differences and the items that are errors.",
    outcomes: [
      "Record a deposit, a withdrawal, and a transfer",
      "Prepare a simple bank reconciliation",
      "Separate a timing difference from a mistake",
    ],
    icon: "landmark",
    modules: [
      {
        title: "Cash and bank",
        lessons: [
          lesson("Cash book and bank book", "Cash in hand and money in the bank are different balances.", [
            "The cash book records notes and coins on the premises.",
            "Each bank account has its own book or ledger.",
            "Moving money from cash to bank is a transfer, not income.",
          ]),
          lesson("A deposit and a withdrawal", "Money put into the bank and money taken out are dated when they happen.", [
            "A deposit slip or transfer reference belongs in the narration.",
            "A withdrawal reduces the bank balance. It may increase cash or pay a bill.",
            "Write the date on the bank's advice, not only the date you noticed it.",
          ]),
          lesson("Cheque and transfer", "A cheque is not the same as an instant transfer. The books should say which one it was.", [
            "A cheque issued is recorded when it is written. The bank may clear it later.",
            "A transfer has a reference number. Keep it.",
            "A cheque that is cancelled is reversed. It is not left as if it was paid.",
          ]),
        ],
      },
      {
        title: "Reconciliation",
        lessons: [
          lesson("Why the books and the bank differ", "Cheques not yet cleared, deposits not yet credited, and bank charges are ordinary differences.", [
            "The passbook or statement is the bank's list. The cash book is the business list.",
            "A difference is expected until both lists include the same items.",
            "Bank charges appear on the statement first. They still have to be entered in the books.",
          ]),
          lesson("A bank reconciliation statement", "Start from one balance and list the items that explain the other balance.", [
            "Choose a date and use the balances on that date.",
            "Add deposits not yet credited. Subtract cheques not yet presented, or the reverse, depending on which balance you started from.",
            "The adjusted figure should equal the other balance. If it does not, an item is missing.",
          ]),
          lesson("Items still outstanding", "A cheque open for a long time is a question, not a permanent line.", [
            "Follow up a cheque that has not cleared.",
            "A bank charge that was never entered is an error in the books.",
            "A reconciliation is signed with the date it was prepared.",
          ]),
        ],
      },
    ],
  }),
];
