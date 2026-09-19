import { useEffect, useRef, useState } from "react";
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
import { PropertyCard } from "../components/listings/PropertyCard";
import { useAuth } from "../contexts/AuthContext";
import { useFavorite } from "../hooks/useFavorite";
import { VerifiedBadge } from "../components/ui/VerifiedBadge";

const reportReasons = [
  { value: "fausse_annonce", label: "Fausse annonce" },
  { value: "prix_trompeur", label: "Prix trompeur" },
  { value: "contenu_interdit", label: "Contenu interdit" },
  { value: "arnaque", label: "Arnaque" },
  { value: "autre", label: "Autre" },
];

interface MediaItem {
  url: string;
  type: "image" | "video";
}

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

  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const favorite = useFavorite(id || "");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/listings/${id}`)
      .then((res) => {
        setListing(res.data.data.listing);
        setSimilar(res.data.data.similar);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // Défilement automatique de la galerie (comme une fiche produit) — se met en
  // pause tant qu'une vidéo est affichée, pour ne pas couper sa lecture.
  useEffect(() => {
    if (!listing) return;
    const photosLen = (listing.photos || []).length;
    const videosLen = (listing.videos || []).length;
    const total = photosLen + videosLen;
    if (total <= 1) return;

    const isCurrentVideo = activeIndex >= photosLen;
    if (isCurrentVideo) return;

    const timer = setTimeout(() => {
      scrollToIndex((activeIndex + 1) % total);
    }, 4500);

    return () => clearTimeout(timer);
  }, [listing, activeIndex]);

  if (isLoading) {
    return <div className="page-container py-16 text-center text-ink-300">Chargement...</div>;
  }

  if (!listing) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-ink-300">Cette annonce est introuvable ou a été retirée.</p>
        <Link to="/search" className="btn-primary mt-4 inline-flex">
          Voir d'autres annonces
        </Link>
      </div>
    );
  }

  const media: MediaItem[] = [
    ...(listing.photos || []).map((url) => ({ url, type: "image" as const })),
    ...(listing.videos || []).map((url) => ({ url, type: "video" as const })),
  ];

  const owner = typeof listing.owner === "object" ? listing.owner : null;
  const ownerId = owner ? (owner as any)._id : null;

  function scrollToIndex(index: number) {
    const container = galleryRef.current;
    if (!container) return;
    container.scrollTo({ left: index * container.offsetWidth, behavior: "smooth" });
  }

  function handleGalleryScroll() {
    const container = galleryRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    setActiveIndex(index);
  }

  function focusActions(reserve: boolean) {
    if (reserve) setShowReserve(true);
    else setShowContact(true);
    actionsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

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

  const canReserve = listing.transactionType === "reservation" || listing.transactionType === "location";

  return (
    <div className="page-container py-5 sm:py-8">
      {/* Galerie défilable (swipe) style e-commerce */}
      {media.length > 0 ? (
        <>
          <div
            ref={galleryRef}
            onScroll={handleGalleryScroll}
            className="flex aspect-[4/3] w-full snap-x snap-mandatory overflow-x-auto rounded-xl bg-sand-100 sm:aspect-video"
          >
            {media.map((item, i) => (
              <div key={item.url + i} className="w-full flex-shrink-0 snap-center">
                {item.type === "video" ? (
                  <video src={item.url} controls className="h-full w-full object-cover" />
                ) : (
                  <img src={item.url} alt={`${listing.title} — photo ${i + 1}`} className="h-full w-full object-cover" />
                )}
              </div>
            ))}
          </div>

          {media.length > 1 && (
            <div className="mt-2 flex justify-center gap-1.5">
              {media.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? "w-5 bg-lagoon-500" : "w-1.5 bg-sand-200"
                  }`}
                />
              ))}
            </div>
          )}

          {media.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {media.map((item, i) => (
                <button
                  key={item.url + i}
                  onClick={() => scrollToIndex(i)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-ink-500 ${
                    i === activeIndex ? "border-lagoon-500" : "border-transparent"
                  }`}
                >
                  {item.type === "video" ? (
                    <>
                      <video src={item.url} className="h-full w-full object-cover" muted />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white">▶</span>
                    </>
                  ) : (
                    <img src={item.url} alt="" className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-sand-100 text-ink-300">
          <ImageOff size={40} />
        </div>
      )}

      <div className="mt-4 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <span className="inline-block rounded-full bg-lagoon-50 px-3 py-1 text-xs font-medium text-lagoon-600">
            {transactionLabels[listing.transactionType]} · {categoryLabels[listing.category]}
          </span>

          <h1 className="mt-3 font-display text-2xl font-medium">{listing.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-300">
            <MapPin size={14} /> {listing.neighborhood}, {listing.city}
            {listing.mapsUrl && (
              <a
                href={listing.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-2 text-lagoon-500 underline"
              >
                Voir sur Google Maps
              </a>
            )}
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

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-400">
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

          <div className="mt-5 flex flex-wrap gap-2">
            {favorite.isLoggedIn && (
              <button onClick={favorite.toggle} className="btn-ghost">
                <Heart size={16} fill={favorite.isFavorite ? "currentColor" : "none"} />
                {favorite.isFavorite ? "Retirer des favoris" : "Favoris"}
              </button>
            )}
            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
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

        <aside ref={actionsRef} className="card h-fit p-4">
          <p className="text-2xl font-semibold text-lagoon-600">
            {formatFCFA(listing.price)}
            {listing.transactionType === "location" && (
              <span className="text-sm font-normal text-ink-300"> / mois</span>
            )}
          </p>

          {owner && (
            <Link to={`/profil/${ownerId}`} className="mt-3 flex items-center gap-3 hover:opacity-80">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-lagoon-50 font-medium text-lagoon-600">
                {(owner as any).avatarUrl ? (
                  <img src={(owner as any).avatarUrl} alt={owner.name} className="h-full w-full object-cover" />
                ) : (
                  owner.name.charAt(0).toUpperCase()
                )}
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  {owner.name}
                  {(owner as any).kycStatus === "verifie" && <VerifiedBadge compact />}
                </p>
                <p className="text-xs text-ink-300">Propriétaire / annonceur · voir le profil</p>
              </div>
            </Link>
          )}

          {!user ? (
            <p className="mt-3 text-center text-xs text-ink-300">
              <Link to="/login" className="text-lagoon-500">Connectez-vous</Link> pour demander une visite guidée.
            </p>
          ) : user.role !== "client" ? (
            <p className="mt-4 rounded-lg bg-sand-100 px-3 py-2.5 text-center text-xs text-ink-400">
              Réservé aux comptes clients.
            </p>
          ) : (
            <Link to={`/listing/${listing._id}/visite`} className="btn-primary mt-4 w-full py-3 text-base">
              Demander une visite guidée
            </Link>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-medium">Annonces similaires</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((s) => (
              <PropertyCard key={s._id} listing={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
