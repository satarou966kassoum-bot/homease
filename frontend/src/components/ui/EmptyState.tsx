import { LucideIcon, SearchX } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon = SearchX, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-sand-200 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand-100 text-ink-300">
        <Icon size={22} />
      </span>
      <p className="mt-4 font-medium text-ink-500">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-ink-300">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-ghost mt-5">
          {action.label}
        </button>
      )}
    </div>
  );
}
