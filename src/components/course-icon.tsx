import {
  AppWindow,
  BarChart3,
  Bot,
  Braces,
  Briefcase,
  Calculator,
  Cloud,
  Code2,
  Coins,
  Compass,
  Cpu,
  FileSpreadsheet,
  GitBranch,
  Globe,
  Image,
  Landmark,
  Languages,
  MessagesSquare,
  PieChart,
  Receipt,
  Monitor,
  Radio,
  Sparkles,
  Store,
  Table2,
  Type,
  Wallet,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import type { CourseIcon } from "@/types";
import { organization } from "@/data/organization";

export const courseIconMap: Record<CourseIcon, LucideIcon> = {
  monitor: Monitor,
  sheet: FileSpreadsheet,
  table: Table2,
  globe: Globe,
  languages: Languages,
  messages: MessagesSquare,
  code: Code2,
  spark: Sparkles,
  briefcase: Briefcase,
  compass: Compass,
  layout: AppWindow,
  braces: Braces,
  terminal: Terminal,
  cloud: Cloud,
  workflow: GitBranch,
  chart: BarChart3,
  bot: Bot,
  cpu: Cpu,
  radio: Radio,
  calculator: Calculator,
  receipt: Receipt,
  wallet: Wallet,
  pie: PieChart,
  coins: Coins,
  landmark: Landmark,
  type: Type,
  image: Image,
  store: Store,
};

export function courseThumbnail(thumbnail: "classroom" | "group") {
  return thumbnail === "group" ? organization.images.group : organization.images.classroom;
}

const courseCovers: Record<CourseIcon, { src: string; alt: string }> = {
  layout: {
    src: "/images/courses/web-development.jpg",
    alt: "A monitor, tablet, and phone showing a website being designed",
  },
  braces: {
    src: "/images/courses/java-fullstack.jpg",
    alt: "A laptop open to application code on a desk",
  },
  terminal: {
    src: "/images/courses/python-fullstack.jpg",
    alt: "A handwritten note that reads Python, held in front of a computer",
  },
  code: {
    src: "/images/courses/python-programming.jpg",
    alt: "Python code on a computer screen",
  },
  cloud: {
    src: "/images/courses/aws.jpg",
    alt: "Server racks with network cables in a data center",
  },
  workflow: {
    src: "/images/courses/devops.jpg",
    alt: "Two people working at computers in an office",
  },
  chart: {
    src: "/images/courses/data-science.jpg",
    alt: "A laptop screen filled with charts and usage statistics",
  },
  bot: {
    src: "/images/courses/artificial-intelligence.jpg",
    alt: "A white humanoid robot with a screen on its chest",
  },
  spark: {
    src: "/images/courses/ai-fundamentals.jpg",
    alt: "A humanoid robot raising one hand",
  },
  cpu: {
    src: "/images/courses/machine-learning.jpg",
    alt: "Eyeglasses in front of a monitor full of code",
  },
  radio: {
    src: "/images/courses/internet-of-things.jpg",
    alt: "A close view of a circuit board and its chips",
  },
  monitor: {
    src: "/images/courses/computer-fundamentals.jpg",
    alt: "An open laptop on a wooden desk",
  },
  sheet: {
    src: "/images/courses/microsoft-office.jpg",
    alt: "People reviewing documents beside two laptops",
  },
  table: {
    src: "/images/courses/advanced-excel.jpg",
    alt: "A laptop showing charts and a data dashboard",
  },
  globe: {
    src: "/images/courses/digital-literacy.jpg",
    alt: "Hands marking phone and app sketches on a desk",
  },
  languages: {
    src: "/images/courses/spoken-english.jpg",
    alt: "Two people talking across a laptop in a meeting",
  },
  messages: {
    src: "/images/courses/communication.jpg",
    alt: "A person explaining notes on a wall to a seated group",
  },
  briefcase: {
    src: "/images/courses/employability.jpg",
    alt: "Two people shaking hands across a desk",
  },
  compass: {
    src: "/images/courses/career-guidance.jpg",
    alt: "Three people talking around laptops at a table",
  },
  calculator: {
    src: "/images/courses/tally-erp9.jpg",
    alt: "A person signing account papers at a desk",
  },
  receipt: {
    src: "/images/courses/tally-gst.jpg",
    alt: "A customer paying at a shop counter",
  },
  wallet: {
    src: "/images/courses/basic-accounting.jpg",
    alt: "An open notebook and a pen on a desk",
  },
  pie: {
    src: "/images/courses/financial-statements.jpg",
    alt: "Printed charts and percentages spread on a desk",
  },
  coins: {
    src: "/images/courses/payroll.jpg",
    alt: "A pile of coins with a small plant growing from them",
  },
  landmark: {
    src: "/images/courses/banking.jpg",
    alt: "A hand entering a code on a bank machine keypad",
  },
  type: {
    src: "/images/courses/dtp.jpg",
    alt: "Colour swatches and a tablet with layout sketches",
  },
  image: {
    src: "/images/courses/photoshop.jpg",
    alt: "A person using a drawing tablet beside colour charts",
  },
  store: {
    src: "/images/courses/entrepreneurship.jpg",
    alt: "People working on laptops around a shared table",
  },
};

export function courseCover(icon: CourseIcon) {
  return courseCovers[icon];
}
