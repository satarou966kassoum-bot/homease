import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, Home } from "lucide-react";
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
  const [showBudget, setShowBudget] = useState(false);

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
    <div className="card p-3 shadow-elevated sm:p-4">
      {/* Ligne 1 : transaction */}
      <div className="flex gap-1 rounded-lg bg-sand-100 p-1">
        {transactions.map((t) => (
          <button
            key={t.value}
            onClick={() => setTransactionType(t.value)}
            className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              transactionType === t.value
                ? "bg-lagoon-500 text-white"
                : "text-ink-400 hover:text-lagoon-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Ligne 2 : localisation */}
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-sand-200 px-3">
        <MapPin size={17} className="shrink-0 text-ink-300" />
        <input
          type="text"
          placeholder="Ville, quartier ou zone"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-transparent py-3 text-base text-ink-500 placeholder:text-ink-300 focus:outline-none"
        />
      </div>

      {/* Ligne 3 : type de bien */}
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-sand-200 px-3">
        <Home size={17} className="shrink-0 text-ink-300" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-transparent py-3 text-base text-ink-500 focus:outline-none"
        >
          <option value="">Appartement, maison, terrain...</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Ligne 4 : budget (repliable) */}
      <button
        type="button"
        onClick={() => setShowBudget((v) => !v)}
        className="mt-2 flex w-full items-center gap-2 rounded-lg border border-sand-200 px-3 py-3 text-left text-sm text-ink-400"
      >
        <SlidersHorizontal size={17} className="shrink-0 text-ink-300" />
        {minPrice || maxPrice
          ? `Budget : ${minPrice || "0"} — ${maxPrice || "∞"} FCFA`
          : "Budget (prix minimum — prix maximum)"}
      </button>

      {showBudget && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Prix minimum"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Prix maximum"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input-field"
          />
        </div>
      )}

      <button onClick={handleSearch} className="btn-primary mt-3 w-full py-3.5 text-base">
        <Search size={18} />
        Rechercher
      </button>
    </div>
  );
}
