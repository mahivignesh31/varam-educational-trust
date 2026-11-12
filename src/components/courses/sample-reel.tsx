"use client";

import Image from "next/image";
import { courseThumbnail } from "@/components/course-icon";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function SampleReel({ frames }: { frames: string[] }) {
  const total = Math.max(frames.length, 1);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const safeIndex = ((index % total) + total) % total;
  const frame = frames[safeIndex] ?? "Sample frame";

  useEffect(() => {
    if (!playing) return;
    const timeout = window.setTimeout(() => {
      setIndex((current) => (current + 1) % total);
    }, 3500);
    return () => window.clearTimeout(timeout);
  }, [playing, index, total]);

  function move(delta: number) {
    setIndex((current) => (current + delta + total) % total);
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-[#14213D]">
        <Image
          src={courseThumbnail("classroom")}
          alt=""
          fill
          sizes="(min-width: 1024px) 48rem, 100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-[#14213D]/55" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            Frame {safeIndex + 1} of {total}
          </p>
          <p className="mt-2 max-w-3xl font-display text-2xl leading-snug text-white sm:text-4xl">{frame}</p>
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        Lesson notes for this class. Read the points, then use the assignment for this course.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>
          {playing ? "Pause" : "Play"}
        </Button>
        <Button type="button" variant="outline" onClick={() => move(-1)}>
          Previous frame
        </Button>
        <Button type="button" variant="outline" onClick={() => move(1)}>
          Next frame
        </Button>
      </div>
      <label className="block text-sm font-semibold">
        Scrub frames
        <input
          className="mt-2 h-2 w-full accent-primary"
          type="range"
          min={0}
          max={total - 1}
          value={safeIndex}
          aria-valuetext={frame}
          onChange={(event) => setIndex(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
