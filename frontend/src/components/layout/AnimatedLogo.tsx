import { useEffect, useState } from "react";

const LETTERS = ["E", "M", "O", "B", "I", "L", "E"];
const STEP_MS = 130; // délai entre l'apparition de deux lettres
const HOLD_MS = 1400; // durée d'affichage du mot complet avant de recommencer
const PAUSE_MS = 300; // courte pause avant de relancer le cycle

interface Props {
  className?: string;
  letterClassName?: string;
}

export function AnimatedLogo({ className = "", letterClassName = "" }: Props) {
  const [revealCount, setRevealCount] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function revealNext(count: number) {
      if (count <= LETTERS.length) {
        setRevealCount(count);
        const delay = count === LETTERS.length ? HOLD_MS : STEP_MS;
        timer = setTimeout(() => {
          if (count === LETTERS.length) {
            setRevealCount(0);
            timer = setTimeout(() => revealNext(1), PAUSE_MS);
          } else {
            revealNext(count + 1);
          }
        }, delay);
      }
    }

    revealNext(1);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className={`inline-flex items-center justify-center gap-[0.05em] ${className}`} aria-label="Emobile">
      {LETTERS.map((letter, i) => (
        <span
          key={i}
          className={`inline-block transition-all duration-300 ease-out ${letterClassName} ${
            i < revealCount ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
          }`}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
