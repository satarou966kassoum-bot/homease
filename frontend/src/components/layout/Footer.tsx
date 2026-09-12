import { Link } from "react-router-dom";

const columns = [
  {
    title: "Explorer",
    links: [
      { to: "/rent", label: "Louer" },
      { to: "/buy", label: "Acheter" },
      { to: "/land", label: "Parcelles" },
      { to: "/publish", label: "Publier une annonce" },
    ],
  },
  {
    title: "Assistance",
    links: [
      { to: "/faq", label: "FAQ" },
      { to: "/support", label: "Support" },
      { to: "/contact", label: "Nous contacter" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { to: "/about", label: "À propos" },
      { to: "/terms", label: "Mentions légales" },
      { to: "/privacy", label: "Confidentialité" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-4 bg-lagoon-500 text-sand-100">
      <div className="page-container py-12">
        <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl font-semibold text-white">HomeEase</p>
            <p className="mt-2 max-w-xs text-sm text-sand-200">
              Trouvez et publiez facilement des biens immobiliers au Bénin.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-sm font-semibold text-white">{col.title}</p>
              <ul className="space-y-2 text-sm text-sand-200">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-sand-200 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} HomeEase. Tous droits réservés.</p>
          <p>Fait avec soin pour le marché béninois 🇧🇯</p>
        </div>
      </div>
    </footer>
  );
}
