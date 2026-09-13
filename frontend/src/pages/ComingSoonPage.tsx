import { useSearchParams, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function ComingSoonPage() {
  const [params] = useSearchParams();
  const name = params.get("nom") || "Cette catégorie";

  return (
    <div className="page-container section flex flex-col items-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-500">
        <Sparkles size={26} />
      </span>
      <h1 className="mt-4 font-display text-2xl font-medium">{name} arrive bientôt</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-300">
        Homizzy s'étend progressivement au-delà de l'immobilier. Cette catégorie sera
        activée dans une prochaine mise à jour.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Retour à l'accueil
      </Link>
    </div>
  );
}
