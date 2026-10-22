"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/profile";

const INPUTS = [
  "SELECT title, employer, city",
  "FROM engineers",
  "WHERE name = N'Tanvir';",
] as const;

const ROWS = [
  ["title", profile.title],
  ["employer", profile.company],
  ["city", `${profile.city}, ${profile.country}`],
] as const;

type Phase =
  | { kind: "type"; line: number; chars: number }
  | { kind: "pause" }
  | { kind: "rows"; count: number }
  | { kind: "done" };

const START: Phase = { kind: "type", line: 0, chars: 0 };

function highlight(sql: string) {
  const parts = sql.split(/(\b(?:SELECT|FROM|WHERE)\b|N?'[^']*')/g);
  return parts.map((part, index) => {
    if (/^(SELECT|FROM|WHERE)$/.test(part)) {
      return (
        <span key={index} className="text-brass">
          {part}
        </span>
      );
    }
    if (part.startsWith("'") || part.startsWith("N'")) {
      return (
        <span key={index} className="text-moss">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function Session() {
  const [motion, setMotion] = useState<"unknown" | "reduce" | "ok">("unknown");
  const [phase, setPhase] = useState<Phase>(START);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotion(media.matches ? "reduce" : "ok");
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const shown: Phase = motion === "reduce" ? { kind: "done" } : phase;

  useEffect(() => {
    if (motion !== "ok" || phase.kind === "done") return;

    let delay = 32;
    if (phase.kind === "type") {
      const line = INPUTS[phase.line];
      if (phase.chars < line.length) {
        delay = line[phase.chars] === " " ? 16 : 28;
      } else {
        delay = 200;
      }
    } else if (phase.kind === "pause") {
      delay = 380;
    } else {
      delay = 240;
    }

    const timeout = window.setTimeout(() => {
      setPhase((current) => {
        if (current.kind === "type") {
          const line = INPUTS[current.line];
          if (current.chars < line.length) {
            return {
              kind: "type",
              line: current.line,
              chars: current.chars + 1,
            };
          }
          if (current.line < INPUTS.length - 1) {
            return { kind: "type", line: current.line + 1, chars: 0 };
          }
          return { kind: "pause" };
        }
        if (current.kind === "pause") return { kind: "rows", count: 1 };
        if (current.kind === "rows") {
          if (current.count < ROWS.length) {
            return { kind: "rows", count: current.count + 1 };
          }
          return { kind: "done" };
        }
        return current;
      });
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [phase, motion]);

  const lines: { text: string; caret: boolean }[] = [];
  let rowCount = 0;
  let done = false;

  if (shown.kind === "type") {
    for (let index = 0; index <= shown.line; index += 1) {
      const full = INPUTS[index];
      lines.push({
        text: index < shown.line ? full : full.slice(0, shown.chars),
        caret: index === shown.line,
      });
    }
  } else {
    for (const text of INPUTS) lines.push({ text, caret: false });
    if (shown.kind === "rows") rowCount = shown.count;
    if (shown.kind === "done") {
      rowCount = ROWS.length;
      done = true;
    }
  }

  const waiting = shown.kind === "pause";

  return (
    <section
      aria-label="Animated SQL portrait"
      className="overflow-hidden rounded-2xl border border-border bg-panel shadow-[0_24px_80px_-48px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-brass/80" />
          </span>
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
            profile.sql
          </p>
        </div>
        {motion === "reduce" ? null : (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
            onClick={() => setPhase(START)}
          >
            Run again
          </Button>
        )}
      </div>
      <div className="min-h-[23rem] px-4 py-4 font-mono text-[13px] leading-6 text-foreground sm:px-5">
        <p className="text-muted-foreground">
          <span className="text-brass">--</span> one-row portrait, not a live
          database
        </p>
        <div className="mt-3 space-y-0.5">
          {lines.map((line, index) => (
            <p key={index} className="break-all">
              {highlight(line.text)}
              {line.caret ? <span className="caret" aria-hidden="true" /> : null}
            </p>
          ))}
        </div>
        {waiting ? (
          <p className="mt-3">
            <span className="caret" aria-hidden="true" />
          </p>
        ) : null}
        {rowCount > 0 ? (
          <div className="mt-4 space-y-1 border-t border-border pt-3">
            {ROWS.slice(0, rowCount).map(([label, value]) => (
              <p key={label} className="result-row flex gap-3">
                <span className="w-[5.5rem] shrink-0 text-muted-foreground">
                  {label}
                </span>
                <span className="min-w-0">{value}</span>
              </p>
            ))}
          </div>
        ) : null}
        {done ? (
          <p className="mt-4 text-muted-foreground">
            <span className="text-brass">--</span> 1 row · {profile.city}
            <span className="caret" aria-hidden="true" />
          </p>
        ) : null}
      </div>
    </section>
  );
}
