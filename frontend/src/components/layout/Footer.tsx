import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mb-14 mt-20 border-t border-sand-200 bg-white md:mb-0">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-300">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="font-display text-lg font-semibold text-lagoon-500">HomeEase</p>
            <p className="mt-2 max-w-xs">
              La plateforme immobilière pensée pour le Bénin : louer, acheter et réserver
              en toute simplicité, à Cotonou, Abomey-Calavi, Porto-Novo et au-delà.
            </p>
          </div>
          <div>
            <p className="mb-3 font-medium text-ink-500">Explorer</p>
            <ul className="space-y-2">
              <li><Link to="/rent" className="hover:text-lagoon-500">Louer</Link></li>
              <li><Link to="/buy" className="hover:text-lagoon-500">Acheter</Link></li>
              <li><Link to="/land" className="hover:text-lagoon-500">Parcelles</Link></li>
              <li><Link to="/publish" className="hover:text-lagoon-500">Publier une annonce</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-medium text-ink-500">HomeEase</p>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-lagoon-500">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-lagoon-500">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-medium text-ink-500">Légal</p>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-lagoon-500">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy" className="hover:text-lagoon-500">Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-sand-200 pt-6">
          © {new Date().getFullYear()} HomeEase. Fait avec soin pour le marché béninois.
        </p>
      </div>
    </footer>
  );
}
