"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/primitives";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function createCaptcha() {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join("");
}

export function useCaptcha() {
  const [challenge, setChallenge] = useState("");
  const [answer, setAnswer] = useState("");

  function refresh() {
    setChallenge(createCaptcha());
    setAnswer("");
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    challenge,
    answer,
    setAnswer,
    refresh,
    ready: challenge.length > 0,
    matches: challenge.length > 0 && answer.trim().toUpperCase() === challenge,
  };
}

export function CaptchaField({
  challenge,
  answer,
  onAnswer,
  onRefresh,
}: {
  challenge: string;
  answer: string;
  onAnswer: (value: string) => void;
  onRefresh: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !challenge) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#eef3f8";
    ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < 7; index += 1) {
      ctx.strokeStyle = index % 2 === 0 ? "#00a651" : "#303f91";
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.font = "700 32px ui-sans-serif, system-ui, sans-serif";
    ctx.textBaseline = "middle";
    const gap = width / (challenge.length + 1);
    [...challenge].forEach((character, index) => {
      ctx.save();
      ctx.translate(gap * (index + 1), height / 2 + (Math.random() - 0.5) * 8);
      ctx.rotate((Math.random() - 0.5) * 0.45);
      ctx.fillStyle = index % 2 === 0 ? "#14213d" : "#303f91";
      ctx.fillText(character, -10, 0);
      ctx.restore();
    });
  }, [challenge]);

  return (
    <div>
      <Label htmlFor="login-captcha">Captcha</Label>
      <div className="mt-2 flex items-center gap-2">
        <canvas
          ref={canvasRef}
          width={200}
          height={64}
          className="h-16 w-52 rounded-2xl border border-border bg-[#eef3f8]"
          aria-hidden
        />
        <Button type="button" variant="outline" size="icon" onClick={onRefresh} aria-label="Show a new captcha">
          <RefreshCw />
        </Button>
      </div>
      <Input
        id="login-captcha"
        className="mt-2"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        placeholder="Type the characters"
        value={answer}
        onChange={(event) => onAnswer(event.target.value)}
        required
      />
    </div>
  );
}
