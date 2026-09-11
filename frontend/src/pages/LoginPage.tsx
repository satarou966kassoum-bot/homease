import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de se connecter.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl font-medium">Se connecter</h1>
      <p className="mt-2 text-sm text-ink-300">
        Accédez à vos favoris, vos réservations et vos messages.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="rounded border border-clay-500/30 bg-clay-500/5 px-4 py-3 text-sm text-clay-600">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="vous@exemple.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-300">
        Pas encore de compte ?{" "}
        <Link to="/register" className="font-medium text-lagoon-500">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
