import { ArrowUpRight } from "lucide-react";
import { Session } from "@/components/session";
import { buttonVariants } from "@/components/ui/button";
import { profile } from "@/lib/profile";
import { cn } from "@/lib/utils";

function SectionLabel({
  index,
  title,
  id,
}: {
  index: string;
  title: string;
  id: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[11px] tracking-[0.2em] text-brass">
        {index}
      </span>
      <h2 id={id} className="font-serif text-3xl tracking-tight sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

export function Profile() {
  return (
    <div className="relative">
      <div className="sheen" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="glow" aria-hidden="true" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground">
          01 <span className="text-brass">/</span> PROFILE
        </p>
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-muted-foreground">
          <span className="pulse" aria-hidden="true" />
          {profile.city.toUpperCase()} · BD
        </p>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <section className="grid items-center gap-10 border-b border-border pb-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:gap-14">
          <div>
            <p className="rise font-mono text-[11px] tracking-[0.22em] text-brass sm:text-xs">
              {profile.role.toUpperCase()}
            </p>
            <h1 className="mt-3 font-serif text-[clamp(4.4rem,12vw,7.75rem)] leading-[0.86] tracking-[-0.035em] text-foreground">
              <span className="sr-only">{profile.name}</span>
              <span aria-hidden="true">
                {profile.name.split("").map((letter, index) => (
                  <span
                    key={`${letter}-${index}`}
                    className="letter"
                    style={{ animationDelay: `${90 + index * 48}ms` }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </h1>
            <div className="rule mt-5" aria-hidden="true" />
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-[1.05rem] sm:leading-8">
              {profile.summary}
            </p>
            <p className="mt-4 max-w-xl text-base leading-7 text-foreground/90">
              {profile.support}
            </p>
            <p className="mt-5 font-mono text-sm leading-6 text-foreground">
              {profile.title}
              <span className="text-muted-foreground">
                {" "}
                · {profile.company}
              </span>
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
              <a
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 gap-2 rounded-full px-5",
                )}
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <ArrowUpRight aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <p className="font-mono text-xs tracking-wide text-muted-foreground">
                {profile.linkedinLabel}
              </p>
            </div>
          </div>
          <Session />
        </section>

        <section className="pt-14" aria-labelledby="focus-heading">
          <SectionLabel index="02" title="Focus" id="focus-heading" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {profile.focus.map((item, index) => (
              <li
                key={item.title}
                className="rise rounded-2xl border border-border bg-card p-5 transition-colors duration-300 hover:border-brass/50"
                style={{ animationDelay: `${120 + index * 80}ms` }}
              >
                <p className="font-mono text-[11px] tracking-[0.18em] text-brass">
                  {item.index}
                </p>
                <h3 className="mt-3 font-serif text-[1.7rem] leading-none tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
          <section aria-labelledby="stack-heading">
            <SectionLabel index="03" title="Stack" id="stack-heading" />
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {profile.stack.map((group) => (
                <li
                  key={group.label}
                  className="grid gap-2 py-4 sm:grid-cols-[7.5rem_1fr] sm:items-baseline sm:gap-6"
                >
                  <p className="font-mono text-[11px] tracking-[0.18em] text-brass">
                    {group.label.toUpperCase()}
                  </p>
                  <p className="text-[15px] leading-7 text-foreground">
                    {group.items.join("  ·  ")}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="learning-heading" className="study">
            <SectionLabel
              index="04"
              title="Currently learning"
              id="learning-heading"
            />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              The mark walks the list.
            </p>
            <ol className="relative mt-6">
              <span className="marker" aria-hidden="true" />
              {profile.learning.map((item) => (
                <li
                  key={item}
                  className="flex h-11 items-center pl-5 text-[15px] text-foreground"
                >
                  {item}
                </li>
              ))}
            </ol>
          </section>
        </section>
      </main>

      <footer className="relative border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="font-serif text-xl tracking-tight">{profile.company}</p>
            <p className="mt-1 font-mono text-xs tracking-wide text-muted-foreground">
              {profile.title} · {profile.city}, {profile.country}
            </p>
          </div>
          <a
            className="font-mono text-xs tracking-wide text-brass underline-offset-4 hover:underline"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            {profile.linkedinLabel}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
