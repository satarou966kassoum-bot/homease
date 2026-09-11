import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl text-lagoon-500">404</p>
      <h1 className="mt-4 text-xl font-medium">Page introuvable</h1>
      <p className="mt-2 text-sm text-ink-300">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Retour à l'accueil
      </Link>
    </div>
  );
}
