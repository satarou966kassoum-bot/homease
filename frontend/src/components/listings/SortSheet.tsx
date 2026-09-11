import { Check } from "lucide-react";
import { BottomSheet } from "../ui/BottomSheet";

const options = [
  { value: "recent", label: "Plus récent" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "popular", label: "Plus populaire" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function SortSheet({ open, onClose, value, onChange }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Trier par">
      <div className="space-y-1">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => {
              onChange(o.value);
              onClose();
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-sand-50"
          >
            {o.label}
            {value === o.value && <Check size={16} className="text-lagoon-500" />}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
