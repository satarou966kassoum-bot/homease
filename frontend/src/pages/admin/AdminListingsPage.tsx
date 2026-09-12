import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { api } from "../../services/api";
import { Listing } from "../../types";
import { formatFCFA } from "../../utils/format";

const statuses = [
  { value: "", label: "Tous les statuts" },
  { value: "en_attente", label: "En attente" },
  { value: "approuvee", label: "Approuvée" },
  { value: "rejetee", label: "Rejetée" },
  { value: "suspendue", label: "Suspendue" },
];

export function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [status, setStatus] = useState("en_attente");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get("/admin/listings", { params: status ? { status } : {} })
      .then((res) => setListings(res.data.data.listings))
      .finally(() => setIsLoading(false));
  }, [status]);

  async function updateStatus(id: string, newStatus: string) {
    await api.put(`/admin/listings/${id}/status`, { status: newStatus });
    setListings((prev) => prev.filter((l) => l._id !== id));
  }

  async function toggleFeatured(id: string) {
    const res = await api.put(`/admin/listings/${id}/feature`);
    const updated = res.data.data.listing;
    setListings((prev) => prev.map((l) => (l._id === id ? { ...l, isFeatured: updated.isFeatured } : l)));
  }

  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field w-auto">
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {isLoading ? (
        <p className="mt-6 text-sm text-ink-300">Chargement...</p>
      ) : listings.length === 0 ? (
        <p className="mt-6 text-sm text-ink-300">Aucune annonce dans cette catégorie.</p>
      ) : (
        <div className="mt-6 divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
          {listings.map((listing) => (
            <div key={listing._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">
                  {listing.title}
                  {listing.isFeatured && (
                    <span className="ml-2 rounded-full bg-ochre-100 px-2 py-0.5 text-xs font-medium text-ochre-600">
                      En avant
                    </span>
                  )}
                  {(listing as any).boostRequested && !listing.isFeatured && (
                    <span className="ml-2 rounded-full bg-clay-500/10 px-2 py-0.5 text-xs font-medium text-clay-600">
                      Boost demandé
                    </span>
                  )}
                </p>
                <p className="text-sm text-ink-300">
                  {listing.city} · {formatFCFA(listing.price)} ·{" "}
                  {typeof listing.owner === "object" ? listing.owner.name : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {listing.status === "approuvee" && (
                  <button
                    onClick={() => toggleFeatured(listing._id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
                      listing.isFeatured
                        ? "bg-ochre-100 text-ochre-600"
                        : "border border-sand-200 text-ink-400"
                    }`}
                  >
                    <Star size={14} fill={listing.isFeatured ? "currentColor" : "none"} />
                    {listing.isFeatured ? "Retirer" : "Mettre en avant"}
                  </button>
                )}
                {listing.status !== "approuvee" && (
                  <button onClick={() => updateStatus(listing._id, "approuvee")} className="btn-primary py-2">
                    Approuver
                  </button>
                )}
                {listing.status !== "rejetee" && (
                  <button
                    onClick={() => updateStatus(listing._id, "rejetee")}
                    className="rounded-lg bg-clay-500/10 px-4 py-2 text-sm font-medium text-clay-600"
                  >
                    Rejeter
                  </button>
                )}
                {listing.status !== "suspendue" && (
                  <button
                    onClick={() => updateStatus(listing._id, "suspendue")}
                    className="btn-ghost py-2"
                  >
                    Suspendre
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
