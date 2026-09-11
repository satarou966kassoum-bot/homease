interface Props {
  variant: "location" | "vente" | "reservation" | "nouveau" | "meuble";
  children: React.ReactNode;
}

const variants: Record<Props["variant"], string> = {
  location: "bg-lagoon-500 text-white",
  vente: "bg-ochre-500 text-ink-500",
  reservation: "bg-ink-400 text-white",
  nouveau: "bg-clay-500 text-white",
  meuble: "bg-sand-200 text-ink-500",
};

export function Badge({ variant, children }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
