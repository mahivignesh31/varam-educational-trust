import Image from "next/image";
import type { ReactNode } from "react";
import { courseCover } from "@/components/course-icon";
import type { CourseIcon } from "@/types";

function Frame({
  className,
  label,
  children,
}: {
  className: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex h-full min-h-[22rem] flex-col p-5 sm:p-7 ${className}`}>
      <div className="flex flex-1 flex-col">{children}</div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#14213D]/70">{label}</p>
    </div>
  );
}

function BrowserChrome({ children, address }: { children: ReactNode; address: string }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_40px_rgba(20,33,61,0.12)]">
      <div className="flex items-center gap-2 border-b border-black/5 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate rounded-full bg-[#F7F9FC] px-3 py-1 text-[11px] text-[#14213D]/60">{address}</span>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">{children}</div>
    </div>
  );
}

function WebPage() {
  return (
    <Frame className="bg-[#e7f6ee]" label="Web page · HTML, CSS, layout">
      <BrowserChrome address="index.html">
        <div className="flex items-center justify-between">
          <span className="h-3 w-14 rounded-full bg-[#00A651]" />
          <span className="flex gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-[#14213D]/15" />
            <span className="h-1.5 w-6 rounded-full bg-[#14213D]/15" />
            <span className="h-1.5 w-6 rounded-full bg-[#14213D]/15" />
          </span>
        </div>
        <div className="mt-3 rounded-xl bg-[#14213D] p-4 text-white">
          <span className="block h-2.5 w-28 rounded-full bg-white/90" />
          <span className="mt-2 block h-2 w-40 rounded-full bg-white/35" />
          <span className="mt-3 inline-block h-6 w-16 rounded-full bg-[#00A651]" />
        </div>
        <div className="mt-3 grid flex-1 grid-cols-3 gap-2">
          {["#00A651", "#303F91", "#F58220"].map((color) => (
            <div key={color} className="rounded-lg bg-[#F7F9FC] p-2">
              <span className="block h-8 rounded-md" style={{ backgroundColor: color, opacity: 0.25 }} />
              <span className="mt-2 block h-1.5 rounded-full bg-[#14213D]/15" />
              <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-[#14213D]/10" />
            </div>
          ))}
        </div>
      </BrowserChrome>
    </Frame>
  );
}

function CodeWindow({
  tint,
  label,
  lines,
}: {
  tint: string;
  label: string;
  lines: { text: string; color: string }[];
}) {
  return (
    <Frame className={tint} label={label}>
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-[#14213D] shadow-[0_16px_40px_rgba(20,33,61,0.18)]">
        <div className="flex gap-1.5 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <div className="space-y-2 px-4 pb-5 font-mono text-[12px] leading-5">
          {lines.map((line, index) => (
            <p key={index} className="whitespace-pre" style={{ color: line.color }}>
              {line.text || " "}
            </p>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function CloudScene() {
  return (
    <Frame className="bg-[#e8eefc]" label="Cloud services on AWS">
      <div className="grid flex-1 content-center gap-3">
        <div className="mx-auto grid h-16 w-24 place-items-center rounded-[2rem] bg-white text-sm font-semibold text-[#303F91] shadow">
          AWS
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Store", "Compute", "Network"].map((name) => (
            <div key={name} className="rounded-2xl bg-white p-3 text-center shadow-sm">
              <span className="mx-auto block h-8 w-8 rounded-xl bg-[#303F91]/10" />
              <span className="mt-2 block text-xs font-semibold text-[#14213D]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Pipeline() {
  const steps = ["Build", "Test", "Release"];
  return (
    <Frame className="bg-[#e7f6ee]" label="Build, test, then release">
      <div className="flex flex-1 items-center gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div className="flex-1 rounded-2xl bg-white p-3 text-center shadow-sm">
              <span className="text-xs font-semibold text-[#00A651]">0{index + 1}</span>
              <span className="mt-1 block text-sm font-semibold text-[#14213D]">{step}</span>
            </div>
            {index < steps.length - 1 ? <span className="h-0.5 w-3 bg-[#00A651]" /> : null}
          </div>
        ))}
      </div>
    </Frame>
  );
}

function ChartScene() {
  const bars = [40, 70, 48, 88, 62];
  return (
    <Frame className="bg-[#fff4e8]" label="Tables, charts, and a finding">
      <div className="flex flex-1 items-end gap-2 rounded-2xl bg-white p-4 shadow-sm">
        {bars.map((height) => (
          <span key={height} className="flex-1 rounded-t-lg bg-[#F58220]" style={{ height: `${height}%` }} />
        ))}
      </div>
    </Frame>
  );
}

function Assistant() {
  return (
    <Frame className="bg-[#e8eefc]" label="Ask, then check the answer">
      <div className="flex flex-1 flex-col justify-center gap-3">
        <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-[#14213D] shadow-sm">
          What does this result mean?
        </div>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[#303F91] px-4 py-3 text-sm text-white">
          A draft. Compare it with the source.
        </div>
      </div>
    </Frame>
  );
}

function Network() {
  return (
    <Frame className="bg-[#f3eefe]" label="Train on examples, then test">
      <div className="grid flex-1 grid-cols-3 items-center gap-3">
        {[3, 4, 2].map((count) => (
          <div key={count} className="flex flex-col items-center gap-3">
            {Array.from({ length: count }, (_, node) => (
              <span key={node} className="h-7 w-7 rounded-full bg-[#303F91]" />
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Device() {
  return (
    <Frame className="bg-[#e7f6ee]" label="A device sends one reading">
      <div className="flex flex-1 items-center justify-center gap-4">
        <div className="rounded-3xl bg-white p-4 shadow-sm">
          <span className="block h-16 w-12 rounded-xl bg-[#14213D]" />
          <span className="mt-2 block text-center text-xs font-semibold text-[#14213D]">Sensor</span>
        </div>
        <span className="h-0.5 w-10 bg-[#00A651]" />
        <div className="rounded-3xl bg-white px-4 py-5 text-center shadow-sm">
          <span className="block font-display text-3xl text-[#00A651]">26°</span>
          <span className="text-xs text-[#14213D]/70">reading</span>
        </div>
      </div>
    </Frame>
  );
}

function Desktop() {
  return (
    <Frame className="bg-[#e8eefc]" label="The computer in front of you">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-xs rounded-2xl border-8 border-[#14213D] bg-white p-4">
          <div className="grid grid-cols-3 gap-2">
            {["Files", "Web", "Mail"].map((name) => (
              <div key={name} className="rounded-xl bg-[#F7F9FC] p-2 text-center text-[11px] font-semibold text-[#303F91]">
                {name}
              </div>
            ))}
          </div>
        </div>
        <span className="h-3 w-16 rounded-b-lg bg-[#14213D]" />
      </div>
    </Frame>
  );
}

function DocumentScene() {
  return (
    <Frame className="bg-[#fff4e8]" label="A document people can read">
      <div className="mx-auto flex w-full max-w-xs flex-1 flex-col gap-2 rounded-2xl bg-white p-5 shadow-sm">
        <span className="h-3 w-2/3 rounded-full bg-[#F58220]" />
        <span className="h-2 w-full rounded-full bg-[#14213D]/10" />
        <span className="h-2 w-full rounded-full bg-[#14213D]/10" />
        <span className="h-2 w-4/5 rounded-full bg-[#14213D]/10" />
        <span className="mt-3 h-16 rounded-xl bg-[#F58220]/15" />
      </div>
    </Frame>
  );
}

function SheetScene() {
  return (
    <Frame className="bg-[#e7f6ee]" label="Rows, a formula, a chart">
      <div className="grid flex-1 grid-cols-4 gap-1 rounded-2xl bg-white p-3 shadow-sm">
        {Array.from({ length: 16 }, (_, cell) => (
          <span
            key={cell}
            className={`grid min-h-8 place-items-center rounded-md text-[10px] font-semibold ${cell === 0 ? "bg-[#00A651] text-white" : "bg-[#F7F9FC]"}`}
          >
            {cell === 0 ? "SUM" : ""}
          </span>
        ))}
      </div>
    </Frame>
  );
}

function SearchScene() {
  return (
    <Frame className="bg-[#e8eefc]" label="Search, messages, and care">
      <div className="flex flex-1 flex-col justify-center gap-3">
        <div className="rounded-full bg-white px-4 py-3 text-sm text-[#14213D]/50 shadow-sm">Search the web</div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <span className="block h-2 w-1/2 rounded-full bg-[#303F91]" />
          <span className="mt-2 block h-2 w-full rounded-full bg-[#14213D]/10" />
        </div>
      </div>
    </Frame>
  );
}

function Speech() {
  return (
    <Frame className="bg-[#fff4e8]" label="Introduce yourself out loud">
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-[2rem] bg-white px-6 py-5 text-center shadow-sm">
          <p className="font-display text-2xl text-[#14213D]">Hello, I am…</p>
          <p className="mt-1 text-sm text-[#F58220]">one clear sentence</p>
        </div>
      </div>
    </Frame>
  );
}

function Conversation() {
  return (
    <Frame className="bg-[#e7f6ee]" label="Listen, then answer">
      <div className="flex flex-1 flex-col justify-center gap-3">
        <div className="max-w-[75%] rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">Can you say that again?</div>
        <div className="ml-auto max-w-[75%] rounded-2xl bg-[#00A651] px-4 py-3 text-sm text-white">Yes. Here is the short version.</div>
      </div>
    </Frame>
  );
}

function Checklist() {
  const items = ["Read the role", "Show one example", "Ask a question"];
  return (
    <Frame className="bg-[#fff4e8]" label="Evidence you can point to">
      <ul className="flex flex-1 flex-col justify-center gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#14213D] shadow-sm">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#F58220] text-xs text-white">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function PathScene() {
  return (
    <Frame className="bg-[#e8eefc]" label="Interests, then one next step">
      <div className="flex flex-1 items-center justify-between gap-2">
        {["Now", "Learn", "Next"].map((step, index) => (
          <div key={step} className="flex flex-1 flex-col items-center gap-2">
            <span className={`grid h-12 w-12 place-items-center rounded-full text-sm font-semibold text-white ${index === 2 ? "bg-[#00A651]" : "bg-[#303F91]"}`}>
              {index + 1}
            </span>
            <span className="text-xs font-semibold text-[#14213D]">{step}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

const scenes: Record<CourseIcon, () => ReactNode> = {
  layout: WebPage,
  braces: () => (
    <CodeWindow
      tint="bg-[#e8eefc]"
      label="A Java class and its methods"
      lines={[
        { text: "class Student {", color: "#8eb6ff" },
        { text: "  String name;", color: "#d6e4ff" },
        { text: "  void save() {", color: "#8eb6ff" },
        { text: "    // one record", color: "#8aa0c8" },
        { text: "  }", color: "#8eb6ff" },
        { text: "}", color: "#8eb6ff" },
      ]}
    />
  ),
  terminal: () => (
    <CodeWindow
      tint="bg-[#e7f6ee]"
      label="Python from the prompt"
      lines={[
        { text: ">>> name = \"Asha\"", color: "#b7f7cf" },
        { text: ">>> print(name)", color: "#d6e4ff" },
        { text: "Asha", color: "#ffffff" },
      ]}
    />
  ),
  code: () => (
    <CodeWindow
      tint="bg-[#e7f6ee]"
      label="A first Python program"
      lines={[
        { text: "def greet(name):", color: "#9ad7ff" },
        { text: "    return \"Hello \" + name", color: "#ffffff" },
        { text: "print(greet(\"Asha\"))", color: "#b7f7cf" },
      ]}
    />
  ),
  cloud: CloudScene,
  workflow: Pipeline,
  chart: ChartScene,
  bot: Assistant,
  spark: Assistant,
  cpu: Network,
  radio: Device,
  monitor: Desktop,
  sheet: DocumentScene,
  table: SheetScene,
  globe: SearchScene,
  languages: Speech,
  messages: Conversation,
  briefcase: Checklist,
  compass: PathScene,
  calculator: SheetScene,
  receipt: DocumentScene,
  wallet: SheetScene,
  pie: ChartScene,
  coins: DocumentScene,
  landmark: SearchScene,
  type: DocumentScene,
  image: ChartScene,
  store: Checklist,
};

export function CourseArtwork({ icon }: { icon: CourseIcon }) {
  const Scene = scenes[icon];
  return <Scene />;
}

export function CoursePhoto({ icon }: { icon: CourseIcon }) {
  const cover = courseCover(icon);
  return (
    <div className="relative h-full min-h-[22rem]">
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes="(min-width: 1024px) 40rem, 100vw"
        className="object-cover"
      />
    </div>
  );
}
