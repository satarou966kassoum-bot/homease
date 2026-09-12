import { Link } from "react-router-dom";
import { Heart, BedDouble, Bath, Ruler, PlayCircle } from "lucide-react";
import { Listing } from "../../types";
import { formatFCFA, transactionLabels } from "../../utils/format";
import { useFavorite } from "../../hooks/useFavorite";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { Badge } from "../ui/Badge";

const badgeVariant: Record<string, "location" | "vente" | "reservation"> = {
  location: "location",
  vente: "vente",
  reservation: "reservation",
};

export function PropertyCard({ listing }: { listing: Listing }) {
  const { isFavorite, toggle, isLoggedIn } = useFavorite(listing._id);
  const hasVideo = !listing.photos?.[0] && listing.videos?.[0];
  const isNew =
    Date.now() - new Date(listing.createdAt).getTime() < 1000 * 60 * 60 * 24 * 7;

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="card group block overflow-hidden animate-fade-up transition-shadow hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-100">
        {hasVideo ? (
          <>
            <video src={listing.videos[0]} className="h-full w-full object-cover" muted />
            <span className="absolute inset-0 flex items-center justify-center bg-black/10">
              <PlayCircle size={36} className="text-white drop-shadow" />
            </span>
          </>
        ) : (
          <ImageWithFallback
            src={listing.photos?.[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge variant={badgeVariant[listing.transactionType]}>
            {transactionLabels[listing.transactionType]}
          </Badge>
          {isNew && <Badge variant="nouveau">Nouveau</Badge>}
        </div>

        {isLoggedIn && (
          <button
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            onClick={toggle}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform active:scale-90 ${
              isFavorite ? "text-clay-500" : "text-ink-500 hover:text-clay-500"
            }`}
          >
            <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="p-4">
        <p className="font-display text-base font-medium leading-snug text-ink-500 line-clamp-1">
          {listing.title}
        </p>
        <p className="mt-1 text-sm text-ink-300 line-clamp-1">
          {listing.neighborhood}, {listing.city}
        </p>
        <p className="mt-2 text-lg font-semibold text-lagoon-600">
          {formatFCFA(listing.price)}
          {listing.transactionType === "location" && (
            <span className="text-sm font-normal text-ink-300"> / mois</span>
          )}
        </p>

        {(typeof listing.bedrooms === "number" ||
          typeof listing.bathrooms === "number" ||
          typeof listing.surfaceM2 === "number") && (
          <div className="mt-3 flex items-center gap-4 border-t border-sand-100 pt-3 text-xs text-ink-300">
            {typeof listing.bedrooms === "number" && (
              <span className="flex items-center gap-1">
                <BedDouble size={14} /> {listing.bedrooms}
              </span>
            )}
            {typeof listing.bathrooms === "number" && (
              <span className="flex items-center gap-1">
                <Bath size={14} /> {listing.bathrooms}
              </span>
            )}
            {typeof listing.surfaceM2 === "number" && (
              <span className="flex items-center gap-1">
                <Ruler size={14} /> {listing.surfaceM2} m²
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
