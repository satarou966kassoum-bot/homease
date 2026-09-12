import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-4 border-t border-sand-200 bg-white">
      <div className="page-container py-10">
        <p className="font-display text-lg font-semibold text-lagoon-500">HomeEase</p>
        <p className="mt-2 max-w-xs text-sm text-ink-300">
          Trouvez et publiez facilement des biens immobiliers au Bénin.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="mb-2 text-sm font-medium text-ink-500">Explorer</p>
            <ul className="space-y-1.5 text-sm text-ink-300">
              <li><Link to="/rent" className="hover:text-lagoon-500">Louer</Link></li>
              <li><Link to="/buy" className="hover:text-lagoon-500">Acheter</Link></li>
              <li><Link to="/land" className="hover:text-lagoon-500">Parcelles</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-500">Entreprise</p>
            <ul className="space-y-1.5 text-sm text-ink-300">
              <li><Link to="/about" className="hover:text-lagoon-500">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-lagoon-500">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-lagoon-500">Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-lagoon-500">Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <p className="mt-8 text-xs text-ink-300">
          © {new Date().getFullYear()} HomeEase.
        </p>
      </div>
    </footer>
  );
}
