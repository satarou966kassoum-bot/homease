import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "owner">("client");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await register({ name, email, password, phone, role });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de créer le compte.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl font-medium">Créer un compte</h1>
      <p className="mt-2 text-sm text-ink-300">
        Rejoignez HomeEase pour rechercher ou publier des annonces.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="rounded border border-clay-500/30 bg-clay-500/5 px-4 py-3 text-sm text-clay-600">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 rounded bg-sand-100 p-1">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
              role === "client" ? "bg-lagoon-500 text-white" : "text-ink-400"
            }`}
          >
            Je cherche un bien
          </button>
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
              role === "owner" ? "bg-lagoon-500 text-white" : "text-ink-400"
            }`}
          >
            Je publie des annonces
          </button>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Nom complet</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Téléphone (optionnel)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
            placeholder="+229 ..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-300">
        Déjà un compte ?{" "}
        <Link to="/login" className="font-medium text-lagoon-500">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
