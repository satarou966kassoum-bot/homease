import { useState } from "react";
import { BottomSheet } from "../ui/BottomSheet";
import { categoryLabels } from "../../utils/format";

export interface FilterValues {
  category: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  furnished: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  values: FilterValues;
  onApply: (values: FilterValues) => void;
}

export function FilterSheet({ open, onClose, values, onApply }: Props) {
  const [draft, setDraft] = useState<FilterValues>(values);

  function update<K extends keyof FilterValues>(key: K, value: FilterValues[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleApply() {
    onApply(draft);
    onClose();
  }

  function handleReset() {
    const cleared: FilterValues = {
      category: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      furnished: "",
    };
    setDraft(cleared);
    onApply(cleared);
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Filtres">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Type de bien</label>
          <select
            value={draft.category}
            onChange={(e) => update("category", e.target.value)}
            className="input-field"
          >
            <option value="">Tous les types</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Ville ou quartier</label>
          <input
            value={draft.city}
            onChange={(e) => update("city", e.target.value)}
            className="input-field"
            placeholder="Cotonou, Fidjrossè..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Prix min (FCFA)</label>
            <input
              type="number"
              value={draft.minPrice}
              onChange={(e) => update("minPrice", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Prix max (FCFA)</label>
            <input
              type="number"
              value={draft.maxPrice}
              onChange={(e) => update("maxPrice", e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Chambres minimum</label>
          <select
            value={draft.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            className="input-field"
          >
            <option value="">Indifférent</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-400">
          <input
            type="checkbox"
            checked={draft.furnished === "true"}
            onChange={(e) => update("furnished", e.target.checked ? "true" : "")}
          />
          Meublé uniquement
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={handleReset} className="btn-ghost flex-1">
          Réinitialiser
        </button>
        <button onClick={handleApply} className="btn-primary flex-1">
          Voir les résultats
        </button>
      </div>
    </BottomSheet>
  );
}
