import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export function useFavorite(listingId: string) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    api
      .get("/favorites")
      .then((res) => {
        const found = res.data.data.favorites.some(
          (f: any) => (f.listing?._id || f.listing) === listingId
        );
        setIsFavorite(found);
      })
      .catch(() => {});
  }, [user, listingId]);

  async function toggle(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    if (!user || isLoading) return;
    setIsLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${listingId}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${listingId}`);
        setIsFavorite(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return { isFavorite, toggle, isLoading, isLoggedIn: !!user };
}
