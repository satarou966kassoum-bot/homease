import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Listing } from "../types";
import { formatFCFA, categoryLabels } from "../utils/format";

const statusLabel: Record<string, string> = {
  brouillon: "Brouillon",
  en_attente: "En attente de validation",
  approuvee: "Approuvée",
  rejetee: "Rejetée",
  suspendue: "Suspendue",
  vendue_louee: "Vendue / louée",
};

const statusColor: Record<string, string> = {
  brouillon: "text-ink-300",
  en_attente: "text-ochre-600",
  approuvee: "text-lagoon-600",
  rejetee: "text-clay-500",
  suspendue: "text-clay-500",
  vendue_louee: "text-ink-400",
};

export function DashboardListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/listings/mine/all")
      .then((res) => setListings(res.data.data.listings))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer définitivement cette annonce ?")) return;
    await api.delete(`/listings/${id}`);
    setListings((prev) => prev.filter((l) => l._id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Mes annonces</h2>
        <Link to="/publish" className="btn-primary">Publier une annonce</Link>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-ink-300">Chargement...</p>
      ) : listings.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-sand-200 p-8 text-center text-sm text-ink-300">
          Vous n'avez pas encore publié d'annonce.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
          {listings.map((listing) => (
            <div key={listing._id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <Link to={`/listing/${listing._id}`} className="font-medium hover:text-lagoon-500">
                  {listing.title}
                </Link>
                <p className="text-sm text-ink-300">
                  {categoryLabels[listing.category]} · {formatFCFA(listing.price)}
                </p>
                <p className={`mt-1 text-xs font-medium ${statusColor[listing.status]}`}>
                  {statusLabel[listing.status]}
                  {listing.isFeatured && (
                    <span className="ml-2 rounded-full bg-ochre-100 px-2 py-0.5 text-ochre-600">
                      En avant
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to={`/dashboard/listings/${listing._id}/edit`}
                  className="text-sm font-medium text-lagoon-600 hover:underline"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="text-sm text-clay-500 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
