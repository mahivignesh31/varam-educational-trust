"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useSlideshow(length: number, delay = 5000) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [length]);

  useEffect(() => {
    if (reduce || paused || length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % length);
    }, delay);
    return () => window.clearInterval(timer);
  }, [delay, length, paused, reduce]);

  function step(direction: number) {
    if (length < 1) return;
    setIndex((current) => (current + direction + length) % length);
  }

  return {
    index: length ? index % length : 0,
    setIndex,
    setPaused,
    previous: () => step(-1),
    next: () => step(1),
  };
}

export function SlideControls({
  index,
  count,
  onPrevious,
  onNext,
  onSelect,
  label,
}: {
  index: number;
  count: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  label: string;
}) {
  if (count < 2) return null;
  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-muted-foreground">
        {index + 1} / {count}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground hover:bg-muted"
          aria-label={`Previous ${label}`}
          onClick={onPrevious}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex max-w-[12rem] gap-1.5 overflow-x-auto" role="tablist" aria-label={label}>
          {Array.from({ length: count }, (_, dot) => (
            <button
              key={dot}
              type="button"
              role="tab"
              aria-selected={dot === index}
              aria-label={`${label} ${dot + 1}`}
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot === index ? "bg-brand-green" : "bg-border"}`}
              onClick={() => onSelect(dot)}
            />
          ))}
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground hover:bg-muted"
          aria-label={`Next ${label}`}
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
