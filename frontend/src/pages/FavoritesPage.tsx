import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { api } from "../services/api";
import { PropertyCard } from "../components/listings/PropertyCard";
import { SkeletonCard } from "../components/ui/SkeletonCard";
import { EmptyState } from "../components/ui/EmptyState";
import { Listing } from "../types";
import { useAuth } from "../contexts/AuthContext";

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
      <div className="page-container section text-center">
        <h1 className="text-xl font-medium">Mes favoris</h1>
        <p className="mt-2 text-sm text-ink-300">
          <Link to="/login" className="text-lagoon-500">Connectez-vous</Link> pour retrouver vos annonces favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="page-container section">
      <h1 className="font-display text-2xl font-medium">Mes favoris</h1>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
            icon={Heart}
            title="Aucun favori pour l'instant"
            description="Parcourez les annonces et appuyez sur ♡ pour les enregistrer ici."
          />
        </div>
      )}
    </div>
  );
}
