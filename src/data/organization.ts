export const organization = {
  name: "VARAM EDUCATIONAL & CHARITABLE TRUST",
  shortName: "Varam Educational & Charitable Trust",
  project: "Varam Learning Platform",
  tagline: "Empowering Education. Transforming Lives.",
  support:
    "Unlocking opportunities through quality education, practical skills, digital innovation, and community empowerment.",
  email: "sriajay50@gmail.com",
  registrationEmail: "varamtrust.nlr@gmail.com",
  addressLines: [
    "Dr. No. 105, Block-C",
    "DNSSS Campus, Opposite ZP High School",
    "Nethaji Nagar, Podalakur Road",
    "Nellore – 524004",
  ],
  address:
    "Dr. No. 105, Block-C, DNSSS Campus, Opposite ZP High School, Nethaji Nagar, Podalakur Road, Nellore – 524004",
  images: {
    logo: "/images/trust-logo.png",
    classroom: "/images/classroom-training.jpg",
    group: "/images/students-group.jpg",
  },
} as const;

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Our Programs" },
  { href: "/lms", label: "LMS Portal" },
  { href: "/gallery", label: "Gallery" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const aboutCopy = {
  who: "Varam Educational & Charitable Trust is based in Nellore. The Trust teaches skill development, computer education, digital literacy, employability, and accessible learning.",
  mission:
    "To make practical computer, language, and work-ready skills available to learners in our community, with teaching that is patient, clear, and useful in daily life.",
  vision:
    "A learning community in which education opens practical paths for study, work, and participation in a digital world.",
  commitment:
    "We are committed to hands-on practice, respectful classrooms, and learning paths that recognise different starting points. Trainers and learners should be able to see what a lesson is for, try it, and ask for help.",
  values: [
    {
      title: "Care",
      text: "Learners are met with patience. A question is part of the lesson, not an interruption.",
    },
    {
      title: "Practice",
      text: "Skills settle when people use them. Sessions favour doing the task, then talking about it.",
    },
    {
      title: "Clarity",
      text: "Instructions, examples, and next steps should be easy to follow the first time.",
    },
    {
      title: "Respect",
      text: "Classrooms work when every learner is treated as capable and welcome.",
    },
    {
      title: "Honesty",
      text: "A course states what it covers. A certificate from the Trust records that a learner finished that course.",
    },
  ],
};

export const whyChoose = [
  {
    title: "Practical Learning",
    text: "Lessons are built around tasks a learner can try: a file, a worksheet, a short conversation, or a small program.",
    icon: "laptop",
    image: "/images/classroom-training.jpg",
    alt: "Learners seated at desks, working through papers during a training session.",
  },
  {
    title: "Industry-Relevant Skills",
    text: "Programs focus on tools and habits used in offices, classrooms, and entry-level digital work.",
    icon: "briefcase",
    image: "/images/courses/microsoft-office.jpg",
    alt: "People reviewing documents beside laptops on a desk.",
  },
  {
    title: "Experienced Trainers",
    text: "Trainers show a task, watch the practice, and correct it with care.",
    icon: "users",
    image: "/images/gallery/hall-group.jpg",
    alt: "Trainers standing with learners at the front of a hall session.",
  },
  {
    title: "Digital Learning Resources",
    text: "The campus includes notes, video lessons, and practice papers a learner can revisit in the browser.",
    icon: "library",
    image: "/images/courses/computer-fundamentals.jpg",
    alt: "An open laptop on a wooden desk.",
  },
  {
    title: "Career Readiness",
    text: "Employability and guidance programs connect skills with how a learner might talk about them in a workplace conversation.",
    icon: "compass",
    image: "/images/gallery/learners-uniform.jpg",
    alt: "Learners in blue work uniforms photographed together.",
  },
  {
    title: "Student-Centered Education",
    text: "Pace, language, and examples should fit the people in the room, including learners who are new to computers.",
    icon: "heart",
    image: "/images/students-group.jpg",
    alt: "A large group of learners and trainers standing together on the campus steps.",
  },
] as const;

export const intendedOutcomes = [
  {
    title: "Digital comfort",
    text: "Learners can switch a computer on, find a file, and complete a basic online task without fear of breaking something.",
  },
  {
    title: "Office fluency",
    text: "Learners can prepare a readable document, a simple presentation, and a checked spreadsheet.",
  },
  {
    title: "Clear communication",
    text: "Learners can introduce themselves, ask a question, and write a short message that another person can act on.",
  },
  {
    title: "First programs",
    text: "Learners can read a small Python program and change it with a purpose they can explain.",
  },
  {
    title: "Judgement with new tools",
    text: "Learners can use a digital or AI tool, then check the result instead of trusting it blindly.",
  },
  {
    title: "A next step",
    text: "Learners leave with one concrete action: a skill to practise, a role to research, or a question for a mentor.",
  },
] as const;

export const learningPath = [
  {
    step: "01",
    title: "Explore programs",
    text: "Read the courses and choose the skill you want to practise.",
  },
  {
    step: "02",
    title: "Create an account",
    text: "Students can sign in and start. Trainers wait until the Trust approves the account.",
  },
  {
    step: "03",
    title: "Learn and attempt",
    text: "Work through the lessons, complete the written assignment, and sit the practice paper.",
  },
  {
    step: "04",
    title: "Course record",
    text: "A finished course can open the Trust’s own completion record for that course.",
  },
] as const;
