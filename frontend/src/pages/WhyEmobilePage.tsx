import { ShieldCheck, Clock, MessageCircle, Search as SearchIcon } from "lucide-react";

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

export function WhyEmobilePage() {
  return (
    <div className="page-container section max-w-2xl">
      <h1 className="font-display text-2xl font-medium">Pourquoi Emobile ?</h1>
      <div className="mt-6 space-y-6">
        {advantages.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4">
            <Icon size={22} className="mt-0.5 shrink-0 text-ochre-500" />
            <div>
              <p className="font-medium">{title}</p>
              <p className="mt-1 text-sm text-ink-300">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
