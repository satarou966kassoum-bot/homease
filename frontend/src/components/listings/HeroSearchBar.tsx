import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { categoryLabels } from "../../utils/format";

const transactions = [
  { value: "vente", label: "Acheter" },
  { value: "location", label: "Louer" },
  { value: "reservation", label: "Réserver" },
];

export function HeroSearchBar() {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState("location");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [category, minPrice, maxPrice].filter(Boolean).length;

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("transactionType", transactionType);
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    navigate(`/search?${params.toString()}`);
  }

  return (
    <div className="rounded-lg border border-sand-200 bg-white p-4 shadow-card sm:p-6">
      {/* Transaction : Acheter / Louer / Réserver */}
      <div className="flex gap-1 rounded bg-sand-100 p-1">
        {transactions.map((t) => (
          <button
            key={t.value}
            onClick={() => setTransactionType(t.value)}
            className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
              transactionType === t.value
                ? "bg-lagoon-500 text-white"
                : "text-ink-400 hover:text-lagoon-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Ligne essentielle : ville + bouton filtres */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Ville ou quartier"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input-field flex-1"
        />
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`relative flex items-center gap-1.5 rounded border px-3 text-sm font-medium ${
            showFilters || activeFilterCount > 0
              ? "border-lagoon-500 text-lagoon-600"
              : "border-sand-200 text-ink-400"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filtres
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lagoon-500 text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Filtres avancés — repliés par défaut */}
      {showFilters && (
        <div className="mt-3 grid gap-3 border-t border-sand-100 pt-3 sm:grid-cols-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="">Tous les types de bien</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Budget minimum (FCFA)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input-field"
          />

          <input
            type="number"
            placeholder="Budget maximum (FCFA)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input-field"
          />
        </div>
      )}

      <button onClick={handleSearch} className="btn-primary mt-4 w-full sm:w-auto">
        <Search size={18} />
        Rechercher
      </button>
    </div>
  );
}
