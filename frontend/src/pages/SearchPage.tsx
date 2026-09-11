import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { PropertyCard } from "../components/listings/PropertyCard";
import { SkeletonCard } from "../components/ui/SkeletonCard";
import { EmptyState } from "../components/ui/EmptyState";
import { FilterSheet, FilterValues } from "../components/listings/FilterSheet";
import { SortSheet } from "../components/listings/SortSheet";
import { api } from "../services/api";
import { Listing } from "../types";

const sortLabels: Record<string, string> = {
  recent: "Plus récent",
  price_asc: "Prix croissant",
  price_desc: "Prix décroissant",
  popular: "Plus populaire",
};

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const sort = searchParams.get("sort") || "recent";
  const activeFilterCount = ["category", "city", "minPrice", "maxPrice", "bedrooms", "furnished"].filter(
    (k) => searchParams.get(k)
  ).length;

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

  function updateParams(patch: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  }

  function handleApplyFilters(values: FilterValues) {
    updateParams({ ...values });
  }

  function resetFilters() {
    setSearchParams(new URLSearchParams());
  }

  const currentFilters: FilterValues = {
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    furnished: searchParams.get("furnished") || "",
  };

  return (
    <div className="page-container section">
      <h1 className="text-2xl font-medium">Résultats de recherche</h1>
      <p className="mt-1 text-sm text-ink-300">
        {isLoading ? "Recherche en cours..." : `${total} bien${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}`}
      </p>

      {/* Barre de contrôle : Filtres / Trier */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={() => setFilterOpen(true)}
          className="btn-ghost relative flex-1 sm:flex-none"
        >
          <SlidersHorizontal size={16} />
          Filtres
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lagoon-500 text-[11px] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button onClick={() => setSortOpen(true)} className="btn-ghost flex-1 sm:flex-none">
          <ArrowUpDown size={16} />
          Trier : {sortLabels[sort]}
        </button>
      </div>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <PropertyCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="Aucun bien trouvé"
            description="Essayez de modifier votre zone ou vos filtres."
            action={{ label: "Réinitialiser les filtres", onClick: resetFilters }}
          />
        </div>
      )}

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        values={currentFilters}
        onApply={handleApplyFilters}
      />
      <SortSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        value={sort}
        onChange={(value) => updateParams({ sort: value })}
      />
    </div>
  );
}
