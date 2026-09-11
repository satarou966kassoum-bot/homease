import { X } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: Props) {
  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40" />
      <div className="sheet-panel">
        <div className="sheet-handle" />
        <div className="flex items-center justify-between border-b border-sand-100 px-5 py-4">
          <p className="font-medium">{title}</p>
          <button onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </>
  );
}
