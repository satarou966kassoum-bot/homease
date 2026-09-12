import { BadgeCheck } from "lucide-react";

export function VerifiedBadge({ compact }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-lagoon-50 px-2 py-0.5 text-[11px] font-medium text-lagoon-600">
      <BadgeCheck size={12} />
      {compact ? "Vérifié" : "Annonceur vérifié"}
    </span>
  );
}
