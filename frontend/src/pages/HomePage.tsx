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
} from "lucide-react";
import { HeroSearchBar } from "../components/listings/HeroSearchBar";
import { ListingCard } from "../components/listings/ListingCard";
import { api } from "../services/api";
import { Listing } from "../types";

const categories = [
  { label: "À louer", to: "/rent", icon: HomeIcon },
  { label: "À vendre", to: "/buy", icon: Building2 },
  { label: "Parcelles", to: "/land", icon: Trees },
  { label: "Bureaux", to: "/search?category=bureau", icon: Landmark },
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
        <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-14 md:grid-cols-2 md:items-center md:pb-24 md:pt-20">
          <div>
            <h1 className="font-display text-4xl font-medium leading-tight text-white md:text-5xl">
              Trouvez votre prochain chez-vous.
            </h1>
            <p className="mt-4 max-w-md text-lagoon-100">
              HomeEase rassemble les meilleures annonces de chambres, maisons,
              appartements, villas et parcelles à Cotonou, Abomey-Calavi, Porto-Novo
              et au-delà.
            </p>
          </div>
        </div>
      </section>

      {/* Barre de recherche — chevauche le hero */}
      <div className="mx-auto -mt-10 max-w-4xl px-6 md:-mt-14">
        <HeroSearchBar />
      </div>

      {/* Catégories populaires */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl font-medium">Catégories populaires</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="flex flex-col items-center gap-3 rounded-lg border border-sand-200 bg-white p-6 text-center transition-colors hover:border-lagoon-500"
            >
              <Icon size={26} className="text-lagoon-500" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Annonces populaires */}
      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Annonces populaires</h2>
          <Link to="/search" className="text-sm font-medium text-lagoon-500">
            Voir tout
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-lg bg-sand-100" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-sand-200 p-10 text-center text-ink-300">
            Aucune annonce à afficher pour l'instant. Lance le script de seed
            (<code>npm run seed</code> côté backend) pour voir des annonces de démo,
            ou publie la première annonce toi-même.
          </div>
        )}
      </section>

      {/* Zones populaires */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl font-medium">Zones populaires</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {zones.map((zone) => (
            <Link
              key={zone}
              to={`/search?city=${encodeURIComponent(zone)}`}
              className="rounded-full border border-sand-200 bg-white px-4 py-2 text-sm font-medium hover:border-lagoon-500"
            >
              {zone}
            </Link>
          ))}
        </div>
      </section>

      {/* Pourquoi HomeEase */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
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
    </div>
  );
}
