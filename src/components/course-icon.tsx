import {
  AppWindow,
  BarChart3,
  Bot,
  Braces,
  Briefcase,
  Cloud,
  Code2,
  Compass,
  Cpu,
  FileSpreadsheet,
  GitBranch,
  Globe,
  Languages,
  MessagesSquare,
  Monitor,
  Radio,
  Sparkles,
  Table2,
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
};

export function courseThumbnail(thumbnail: "classroom" | "group") {
  return thumbnail === "group" ? organization.images.group : organization.images.classroom;
}
