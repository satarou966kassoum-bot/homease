import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Rocket, Star } from "lucide-react";
import { api } from "../services/api";
import { Listing } from "../types";
import { formatFCFA } from "../utils/format";

export function DashboardBoosterPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/listings/mine/all")
      .then((res) => setListings(res.data.data.listings.filter((l: Listing) => l.status === "approuvee")))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleBoostRequest(id: string) {
    const { data } = await api.put(`/listings/${id}/boost-request`);
    setListings((prev) =>
      prev.map((l) => (l._id === id ? { ...l, boostRequested: data.data.listing.boostRequested } : l))
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium">Booster mes annonces</h2>
      <p className="mt-1 text-sm text-ink-300">
        Une annonce boostée apparaît en tête des résultats et sur l'accueil. La demande
        est examinée par un administrateur.
      </p>

      {isLoading ? (
        <p className="mt-6 text-sm text-ink-300">Chargement...</p>
      ) : listings.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-sand-200 p-8 text-center text-sm text-ink-300">
          Aucune annonce approuvée pour l'instant. Une annonce doit être validée avant de
          pouvoir être boostée.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
          {listings.map((listing) => (
            <div key={listing._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <Link to={`/listing/${listing._id}`} className="font-medium hover:text-lagoon-500">
                  {listing.title}
                </Link>
                <p className="text-sm text-ink-300">{formatFCFA(listing.price)}</p>
              </div>

              {listing.isFeatured ? (
                <span className="flex items-center gap-1.5 rounded-full bg-ochre-100 px-3 py-1.5 text-sm font-medium text-ochre-600">
                  <Star size={14} fill="currentColor" /> Déjà en avant
                </span>
              ) : listing.boostRequested ? (
                <span className="rounded-full bg-clay-500/10 px-3 py-1.5 text-sm font-medium text-clay-600">
                  Demande envoyée
                </span>
              ) : (
                <button
                  onClick={() => handleBoostRequest(listing._id)}
                  className="btn-accent px-4 py-2 text-sm"
                >
                  <Rocket size={14} /> Booster
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
