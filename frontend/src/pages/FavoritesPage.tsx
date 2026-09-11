import { useEffect, useState } from "react";
import { api } from "../services/api";
import { ListingCard } from "../components/listings/ListingCard";
import { Listing } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export function FavoritesPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    api
      .get("/favorites")
      .then((res) =>
        setListings(res.data.data.favorites.map((f: any) => f.listing).filter(Boolean))
      )
      .finally(() => setIsLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="text-xl font-medium">Mes favoris</h1>
        <p className="mt-2 text-sm text-ink-300">
          <Link to="/login" className="text-lagoon-500">Connectez-vous</Link> pour retrouver vos annonces favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-2xl font-medium">Mes favoris</h1>

      {isLoading ? (
        <p className="mt-6 text-sm text-ink-300">Chargement...</p>
      ) : listings.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-sand-200 p-10 text-center text-ink-300">
          Vous n'avez pas encore de favoris. Parcourez les annonces et cliquez sur ♡
          pour les enregistrer ici.
        </div>
      )}
    </div>
  );
}
