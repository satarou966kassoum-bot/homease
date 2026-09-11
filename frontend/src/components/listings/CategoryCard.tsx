import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  to: string;
  icon: LucideIcon;
}

export function CategoryCard({ label, to, icon: Icon }: Props) {
  return (
    <Link
      to={to}
      className="card flex flex-col items-center gap-3 px-4 py-6 text-center transition-shadow hover:shadow-elevated"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-500">
        <Icon size={22} />
      </span>
      <span className="text-sm font-medium text-ink-500">{label}</span>
    </Link>
  );
}
