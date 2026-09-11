import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListingCard } from "../components/listings/ListingCard";
import { api } from "../services/api";
import { Listing } from "../types";
import { categoryLabels } from "../utils/format";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const sort = searchParams.get("sort") || "recent";

  useEffect(() => {
    setIsLoading(true);
    api
      .get("/listings", { params: Object.fromEntries(searchParams) })
      .then((res) => {
        setListings(res.data.data.listings);
        setTotal(res.data.data.pagination.total);
      })
      .catch(() => {
        setListings([]);
        setTotal(0);
      })
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-medium">Résultats de recherche</h1>
      <p className="mt-1 text-sm text-ink-300">
        {isLoading ? "Recherche en cours..." : `${total} annonce${total > 1 ? "s" : ""} trouvée${total > 1 ? "s" : ""}`}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={searchParams.get("category") || ""}
          onChange={(e) => updateParam("category", e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Tous les types</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="input-field w-auto"
        >
          <option value="recent">Plus récent</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
          <option value="popular">Plus populaire</option>
        </select>
      </div>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-lg bg-sand-100" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-sand-200 p-10 text-center text-ink-300">
          Aucune annonce ne correspond à ces critères pour le moment. Essayez
          d'élargir votre recherche.
        </div>
      )}
    </div>
  );
}
