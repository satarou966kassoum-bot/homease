import { Link } from "react-router-dom";
import { Heart, BedDouble, Bath, Ruler, ImageOff } from "lucide-react";
import { Listing } from "../../types";
import { formatFCFA, transactionLabels } from "../../utils/format";
import { useFavorite } from "../../hooks/useFavorite";

const tagColor: Record<string, string> = {
  location: "bg-lagoon-500",
  vente: "bg-ochre-500 text-ink-500",
  reservation: "bg-ink-400",
};

export function ListingCard({ listing }: { listing: Listing }) {
  const { isFavorite, toggle, isLoggedIn } = useFavorite(listing._id);

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="group block overflow-hidden rounded-lg border border-sand-200 bg-white shadow-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-100">
        {listing.photos?.[0] ? (
          <img
            src={listing.photos[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : listing.videos?.[0] ? (
          <>
            <video src={listing.videos[0]} className="h-full w-full object-cover" muted />
            <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
              ▶ Vidéo
            </span>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-300">
            <ImageOff size={28} />
          </div>
        )}

        <span
          className={`absolute left-3 top-3 rounded px-2 py-1 text-xs font-medium text-white ${
            tagColor[listing.transactionType] || "bg-lagoon-500"
          }`}
        >
          {transactionLabels[listing.transactionType]}
        </span>

        {isLoggedIn && (
          <button
            aria-label="Ajouter aux favoris"
            onClick={toggle}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 ${
              isFavorite ? "text-clay-500" : "text-ink-500 hover:text-clay-500"
            }`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="p-4">
        <p className="font-display text-base font-medium text-ink-500 line-clamp-1">
          {listing.title}
        </p>
        <p className="mt-1 text-sm text-ink-300">
          {listing.neighborhood}, {listing.city}
        </p>
        <p className="mt-2 text-lg font-semibold text-lagoon-600">
          {formatFCFA(listing.price)}
          {listing.transactionType === "location" && (
            <span className="text-sm font-normal text-ink-300"> / mois</span>
          )}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs text-ink-300">
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
      </div>
    </Link>
  );
}
