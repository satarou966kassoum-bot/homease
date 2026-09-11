interface Props {
  title: string;
  phase: string;
  description: string;
}

export function PhasePlaceholderPage({ title, phase, description }: Props) {
  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <span className="inline-block rounded-full bg-lagoon-50 px-3 py-1 text-xs font-medium text-lagoon-600">
        {phase}
      </span>
      <h1 className="mt-4 font-display text-2xl font-medium">{title}</h1>
      <p className="mt-2 text-sm text-ink-300">{description}</p>
    </div>
  );
}
