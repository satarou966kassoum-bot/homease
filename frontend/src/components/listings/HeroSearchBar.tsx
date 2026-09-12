import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { FilterSheet, FilterValues } from "./FilterSheet";

const emptyFilters: FilterValues = {
  transactionType: "",
  category: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  furnished: "",
};

export function HeroSearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterValues>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  function runSearch(values: FilterValues = filters) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/search?${params.toString()}`);
  }

  return (
    <div className="card flex items-center gap-2 p-2 shadow-elevated">
      <Search size={19} className="ml-2 shrink-0 text-ink-300" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && runSearch()}
        placeholder="Rechercher une ville, un quartier, un bien..."
        className="w-full bg-transparent py-3 text-base text-ink-500 placeholder:text-ink-300 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setFilterOpen(true)}
        aria-label="Filtres"
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-sand-200 text-ink-400 hover:border-lagoon-500"
      >
        <SlidersHorizontal size={18} />
        {activeFilterCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-lagoon-500 text-[10px] text-white">
            {activeFilterCount}
          </span>
        )}
      </button>
      <button
        onClick={() => runSearch()}
        className="btn-primary hidden shrink-0 sm:inline-flex"
      >
        Rechercher
      </button>

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        values={filters}
        onApply={(values) => {
          setFilters(values);
          runSearch(values);
        }}
      />
    </div>
  );
}
