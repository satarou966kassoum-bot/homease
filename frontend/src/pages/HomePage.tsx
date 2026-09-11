import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Clock,
  MessageCircle,
  Search as SearchIcon,
  Building2,
  Home as HomeIcon,
  Trees,
  Landmark,
  Sofa,
  DoorOpen,
} from "lucide-react";
import { HeroSearchBar } from "../components/listings/HeroSearchBar";
import { PropertyCard } from "../components/listings/PropertyCard";
import { CategoryCard } from "../components/listings/CategoryCard";
import { SkeletonCard } from "../components/ui/SkeletonCard";
import { EmptyState } from "../components/ui/EmptyState";
import { api } from "../services/api";
import { Listing } from "../types";

const categories = [
  { label: "Maisons", to: "/rent", icon: HomeIcon },
  { label: "Appartements", to: "/search?category=appartement", icon: Building2 },
  { label: "Parcelles", to: "/land", icon: Trees },
  { label: "Villas", to: "/search?category=villa", icon: Landmark },
  { label: "Bureaux", to: "/search?category=bureau", icon: DoorOpen },
  { label: "Meublés", to: "/search?category=meuble", icon: Sofa },
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

const advantages = [
  {
    icon: SearchIcon,
    title: "Recherche simplifiée",
    body: "Filtrez par ville, quartier, prix et type de bien pour trouver exactement ce qu'il vous faut.",
  },
  {
    icon: ShieldCheck,
    title: "Annonces vérifiées",
    body: "Chaque annonce est modérée avant publication pour limiter les fausses annonces et les arnaques.",
  },
  {
    icon: MessageCircle,
    title: "Contact direct",
    body: "Échangez directement avec le propriétaire ou l'agence via la messagerie intégrée.",
  },
  {
    icon: Clock,
    title: "Gain de temps",
    body: "Comparez rapidement plusieurs biens et faites une demande de réservation en quelques clics.",
  },
];

export function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/listings", { params: { limit: 6, sort: "recent" } })
      .then((res) => setListings(res.data.data.listings))
      .catch(() => setListings([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-lagoon-500">
        <div className="page-container pb-20 pt-14 sm:pb-28 sm:pt-20">
          <h1 className="max-w-xl font-display text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
            Trouvez votre prochain chez-vous.
          </h1>
          <p className="mt-4 max-w-md text-base text-lagoon-100">
            Explorez des logements, terrains et biens immobiliers au Bénin.
          </p>
        </div>
      </section>

      {/* Search card — chevauche le hero */}
      <div className="page-container -mt-14 sm:-mt-16">
        <HeroSearchBar />
      </div>

      {/* Catégories populaires — grille 2x2 sur mobile */}
      <section className="section page-container">
        <h2 className="text-2xl font-medium">Catégories populaires</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.label} {...c} />
          ))}
        </div>
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

      {/* Zones populaires */}
      <section className="section page-container">
        <h2 className="text-2xl font-medium">Zones populaires</h2>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {zones.map((zone) => (
            <Link
              key={zone}
              to={`/search?city=${encodeURIComponent(zone)}`}
              className="rounded-full border border-sand-200 bg-white px-4 py-2.5 text-sm font-medium hover:border-lagoon-500"
            >
              {zone}
            </Link>
          ))}
        </div>
      </section>

      {/* Pourquoi HomeEase */}
      <section className="bg-white py-9 sm:py-14">
        <div className="page-container">
          <h2 className="text-2xl font-medium">Pourquoi HomeEase ?</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <Icon size={22} className="text-ochre-500" />
                <p className="mt-3 font-medium">{title}</p>
                <p className="mt-1 text-sm text-ink-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA publication */}
      <section className="section page-container">
        <div className="card flex flex-col items-center gap-4 bg-lagoon-500 px-6 py-10 text-center shadow-elevated sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-display text-xl font-medium text-white">
              Vous avez un bien à louer ou à vendre ?
            </p>
            <p className="mt-1 text-sm text-lagoon-100">
              Publiez votre annonce gratuitement et touchez des milliers de personnes.
            </p>
          </div>
          <Link to="/publish" className="btn-accent shrink-0">
            Publier une annonce
          </Link>
        </div>
      </section>
    </div>
  );
}
