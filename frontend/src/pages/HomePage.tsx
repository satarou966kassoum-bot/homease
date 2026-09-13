import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeroSearchBar } from "../components/listings/HeroSearchBar";
import { HeroBannerCarousel } from "../components/listings/HeroBannerCarousel";
import { PropertyCard } from "../components/listings/PropertyCard";
import { SkeletonCard } from "../components/ui/SkeletonCard";
import { EmptyState } from "../components/ui/EmptyState";
import { api } from "../services/api";
import { Listing } from "../types";

const transactionOptions = [
  { value: "location", label: "Location" },
  { value: "vente", label: "Achat" },
  { value: "reservation", label: "Réservation" },
  { value: "visite", label: "Visite" },
];

const zones = [
  "Cotonou",
  "Abomey-Calavi",
  "Porto-Novo",
  "Godomey",
  "Akpakpa",
  "Fidjrossè",
  "Haie Vive",
  "Cococodji",
];

export function HomePage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState("");
  const [zone, setZone] = useState("");

  useEffect(() => {
    api
      .get("/listings", { params: { limit: 6, sort: "recent" } })
      .then((res) => setListings(res.data.data.listings))
      .catch(() => setListings([]))
      .finally(() => setIsLoading(false));

    api
      .get("/banners")
      .then((res) => setBanners(res.data.data.banners))
      .catch(() => setBanners([]));
  }, []);

  function handleTransactionChange(value: string) {
    setTransaction(value);
    if (value) navigate(`/search?transactionType=${value}`);
  }

  function handleZoneChange(value: string) {
    setZone(value);
    if (value) navigate(`/search?city=${encodeURIComponent(value)}`);
  }

  return (
    <div>
      {/* Hero — bannière pilotée depuis l'admin, ou texte par défaut */}
      <section className="bg-lagoon-500">
        {banners.length > 0 ? (
          <HeroBannerCarousel banners={banners} />
        ) : (
          <div className="page-container pb-20 pt-14 sm:pb-28 sm:pt-20">
            <h1 className="max-w-xl font-display text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
              Trouvez votre prochain chez-vous.
            </h1>
            <p className="mt-4 max-w-md text-base text-sand-100">
              Explorez des logements, terrains et biens immobiliers au Bénin.
            </p>
          </div>
        )}
      </section>

      {/* Search card — chevauche le hero */}
      <div className="page-container -mt-14 sm:-mt-16">
        <HeroSearchBar />
      </div>

      {/* Que recherchez-vous ? */}
      <section className="section page-container">
        <h2 className="text-2xl font-medium">Que recherchez-vous ?</h2>
        <select
          value={transaction}
          onChange={(e) => handleTransactionChange(e.target.value)}
          className="input-field mt-4 text-base font-medium"
        >
          <option value="">Choisissez un objectif</option>
          {transactionOptions.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </section>

      {/* Annonces populaires */}
      <section className="page-container pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Annonces populaires</h2>
          <Link to="/search" className="text-sm font-medium text-lagoon-500">
            Voir tout
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
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
              title="Aucune annonce pour l'instant"
              description="Les premières annonces apparaîtront ici dès qu'elles seront publiées et approuvées."
            />
          </div>
        )}
      </section>

      {/* Zones populaires — menu déroulant */}
      <section className="section page-container">
        <h2 className="text-2xl font-medium">Zones populaires</h2>
        <select
          value={zone}
          onChange={(e) => handleZoneChange(e.target.value)}
          className="input-field mt-4 text-base font-medium"
        >
          <option value="">Choisissez une zone</option>
          {zones.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </section>
    </div>
  );
}
