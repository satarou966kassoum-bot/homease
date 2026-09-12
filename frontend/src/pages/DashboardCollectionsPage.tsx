import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, X } from "lucide-react";
import { api } from "../services/api";
import { Listing } from "../types";
import { formatFCFA } from "../utils/format";

interface CollectionType {
  _id: string;
  name: string;
  listings: Listing[];
}

export function DashboardCollectionsPage() {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  function load() {
    Promise.all([api.get("/collections/mine"), api.get("/listings/mine/all")]).then(
      ([colRes, listRes]) => {
        setCollections(colRes.data.data.collections);
        setMyListings(listRes.data.data.listings);
        setIsLoading(false);
      }
    );
  }

  useEffect(load, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    await api.post("/collections", { name: newName });
    setNewName("");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette collection ?")) return;
    await api.delete(`/collections/${id}`);
    load();
  }

  async function toggleListing(collection: CollectionType, listingId: string) {
    const currentIds = collection.listings.map((l) => l._id);
    const nextIds = currentIds.includes(listingId)
      ? currentIds.filter((id) => id !== listingId)
      : [...currentIds, listingId];
    await api.put(`/collections/${collection._id}`, { listings: nextIds });
    load();
  }

  if (isLoading) return <p className="text-sm text-ink-300">Chargement...</p>;

  return (
    <div>
      <h2 className="text-lg font-medium">Collections</h2>
      <p className="mt-1 text-sm text-ink-300">
        Regroupez vos annonces par thème (ex : "Meublés à Cotonou", "Offres du mois").
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Nom de la collection"
          className="input-field"
        />
        <button onClick={handleCreate} className="btn-primary shrink-0 px-4">
          <Plus size={16} />
        </button>
      </div>

      {collections.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-sand-200 p-8 text-center text-sm text-ink-300">
          Aucune collection pour l'instant.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {collections.map((c) => (
            <div key={c._id} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{c.name}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingId(editingId === c._id ? null : c._id)}
                    className="text-sm font-medium text-lagoon-600 hover:underline"
                  >
                    {editingId === c._id ? "Terminer" : "Gérer les annonces"}
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="text-clay-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {c.listings.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.listings.map((l) => (
                    <Link
                      key={l._id}
                      to={`/listing/${l._id}`}
                      className="rounded-full border border-sand-200 px-3 py-1 text-xs text-ink-400 hover:border-lagoon-500"
                    >
                      {l.title} · {formatFCFA(l.price)}
                    </Link>
                  ))}
                </div>
              )}

              {editingId === c._id && (
                <div className="mt-3 space-y-1 border-t border-sand-100 pt-3">
                  {myListings.map((l) => {
                    const isIn = c.listings.some((cl) => cl._id === l._id);
                    return (
                      <button
                        key={l._id}
                        onClick={() => toggleListing(c, l._id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                          isIn ? "bg-lagoon-50 text-lagoon-600" : "hover:bg-sand-50"
                        }`}
                      >
                        {l.title}
                        {isIn && <X size={14} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
