import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  Heart,
  Share2,
  Flag,
  ImageOff,
} from "lucide-react";
import { api } from "../services/api";
import { Listing } from "../types";
import { formatFCFA, categoryLabels, transactionLabels } from "../utils/format";
import { ListingCard } from "../components/listings/ListingCard";
import { useAuth } from "../contexts/AuthContext";
import { useFavorite } from "../hooks/useFavorite";

const reportReasons = [
  { value: "fausse_annonce", label: "Fausse annonce" },
  { value: "prix_trompeur", label: "Prix trompeur" },
  { value: "contenu_interdit", label: "Contenu interdit" },
  { value: "arnaque", label: "Arnaque" },
  { value: "autre", label: "Autre" },
];

export function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showContact, setShowContact] = useState(false);
  const [contactMessage, setContactMessage] = useState("Bonjour, votre annonce m'intéresse.");
  const [contactStatus, setContactStatus] = useState("");

  const [showReserve, setShowReserve] = useState(false);
  const [reserveDate, setReserveDate] = useState("");
  const [reserveStatus, setReserveStatus] = useState("");

  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("fausse_annonce");
  const [reportStatus, setReportStatus] = useState("");

  const [activeMedia, setActiveMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const favorite = useFavorite(id || "");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/listings/${id}`)
      .then((res) => {
        setListing(res.data.data.listing);
        setSimilar(res.data.data.similar);
        const l = res.data.data.listing;
        if (l.photos?.[0]) setActiveMedia({ url: l.photos[0], type: "image" });
        else if (l.videos?.[0]) setActiveMedia({ url: l.videos[0], type: "video" });
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-6 py-16 text-center text-ink-300">Chargement...</div>;
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="text-ink-300">Cette annonce est introuvable ou a été retirée.</p>
        <Link to="/search" className="btn-primary mt-4 inline-flex">
          Voir d'autres annonces
        </Link>
      </div>
    );
  }

  const owner = typeof listing.owner === "object" ? listing.owner : null;
  const ownerId = owner ? (owner as any)._id : null;

  async function handleSendContact() {
    if (!ownerId || !contactMessage.trim()) return;
    setContactStatus("Envoi...");
    try {
      await api.post("/conversations", {
        recipientId: ownerId,
        listingId: listing!._id,
        content: contactMessage,
      });
      setContactStatus("Message envoyé !");
      setTimeout(() => navigate("/messages"), 800);
    } catch {
      setContactStatus("Impossible d'envoyer le message.");
    }
  }

  async function handleReserve() {
    if (!reserveDate) return;
    setReserveStatus("Envoi...");
    try {
      await api.post("/reservations", {
        listingId: listing!._id,
        startDate: reserveDate,
      });
      setReserveStatus("Demande de réservation envoyée !");
    } catch {
      setReserveStatus("Impossible d'envoyer la demande.");
    }
  }

  async function handleReport() {
    setReportStatus("Envoi...");
    try {
      await api.post("/reports", { listingId: listing!._id, reason: reportReason });
      setReportStatus("Signalement envoyé. Merci.");
    } catch {
      setReportStatus("Impossible d'envoyer le signalement.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-sand-100">
        {activeMedia ? (
          activeMedia.type === "video" ? (
            <video src={activeMedia.url} controls className="h-full w-full object-cover" />
          ) : (
            <img src={activeMedia.url} alt={listing.title} className="h-full w-full object-cover" />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-300">
            <ImageOff size={40} />
          </div>
        )}
      </div>

      {(listing.photos.length + listing.videos.length > 1) && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {listing.photos.map((url) => (
            <button
              key={url}
              onClick={() => setActiveMedia({ url, type: "image" })}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 ${
                activeMedia?.url === url ? "border-lagoon-500" : "border-transparent"
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          {listing.videos.map((url) => (
            <button
              key={url}
              onClick={() => setActiveMedia({ url, type: "video" })}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 bg-ink-500 ${
                activeMedia?.url === url ? "border-lagoon-500" : "border-transparent"
              }`}
            >
              <video src={url} className="h-full w-full object-cover" muted />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white">
                ▶
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <span className="inline-block rounded bg-lagoon-50 px-2 py-1 text-xs font-medium text-lagoon-600">
            {transactionLabels[listing.transactionType]} · {categoryLabels[listing.category]}
          </span>

          <h1 className="mt-3 font-display text-2xl font-medium">{listing.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-300">
            <MapPin size={14} /> {listing.neighborhood}, {listing.city}
          </p>

          <div className="mt-4 flex items-center gap-6 text-sm text-ink-400">
            {typeof listing.bedrooms === "number" && (
              <span className="flex items-center gap-1"><BedDouble size={16} /> {listing.bedrooms} chambres</span>
            )}
            {typeof listing.bathrooms === "number" && (
              <span className="flex items-center gap-1"><Bath size={16} /> {listing.bathrooms} salles de bain</span>
            )}
            {typeof listing.surfaceM2 === "number" && (
              <span className="flex items-center gap-1"><Ruler size={16} /> {listing.surfaceM2} m²</span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink-400">
            {listing.description}
          </p>

          {listing.amenities.length > 0 && (
            <div className="mt-6">
              <p className="font-medium">Équipements</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span key={a} className="rounded-full border border-sand-200 px-3 py-1 text-xs text-ink-400">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {favorite.isLoggedIn && (
              <button onClick={favorite.toggle} className="btn-ghost">
                <Heart size={16} fill={favorite.isFavorite ? "currentColor" : "none"} />
                {favorite.isFavorite ? "Retirer des favoris" : "Favoris"}
              </button>
            )}
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
              }}
              className="btn-ghost"
            >
              <Share2 size={16} /> Partager
            </button>
            {user && (
              <button onClick={() => setShowReport((v) => !v)} className="btn-ghost text-clay-500">
                <Flag size={16} /> Signaler
              </button>
            )}
          </div>

          {showReport && (
            <div className="mt-4 rounded-lg border border-sand-200 p-4">
              <p className="text-sm font-medium">Signaler cette annonce</p>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="input-field mt-2"
              >
                {reportReasons.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <button onClick={handleReport} className="btn-primary mt-3">Envoyer le signalement</button>
              {reportStatus && <p className="mt-2 text-sm text-ink-300">{reportStatus}</p>}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-sand-200 bg-white p-5 shadow-card">
          <p className="text-2xl font-semibold text-lagoon-600">
            {formatFCFA(listing.price)}
            {listing.transactionType === "location" && (
              <span className="text-sm font-normal text-ink-300"> / mois</span>
            )}
          </p>

          {owner && (
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lagoon-50 font-medium text-lagoon-600">
                {owner.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-medium">{owner.name}</p>
                <p className="text-xs text-ink-300">Propriétaire / annonceur</p>
              </div>
            </div>
          )}

          {user ? (
            <>
              <button onClick={() => setShowContact((v) => !v)} className="btn-primary mt-5 w-full">
                Contacter
              </button>
              {showContact && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={3}
                    className="input-field"
                  />
                  <button onClick={handleSendContact} className="btn-ghost w-full">Envoyer</button>
                  {contactStatus && <p className="text-center text-xs text-ink-300">{contactStatus}</p>}
                </div>
              )}

              {(listing.transactionType === "reservation" || listing.transactionType === "location") && (
                <>
                  <button onClick={() => setShowReserve((v) => !v)} className="btn-accent mt-3 w-full">
                    Réserver
                  </button>
                  {showReserve && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="date"
                        value={reserveDate}
                        onChange={(e) => setReserveDate(e.target.value)}
                        className="input-field"
                      />
                      <button onClick={handleReserve} className="btn-ghost w-full">
                        Envoyer la demande
                      </button>
                      {reserveStatus && <p className="text-center text-xs text-ink-300">{reserveStatus}</p>}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <p className="mt-3 text-center text-xs text-ink-300">
              <Link to="/login" className="text-lagoon-500">Connectez-vous</Link> pour contacter ou réserver.
            </p>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-medium">Annonces similaires</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((s) => (
              <ListingCard key={s._id} listing={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
