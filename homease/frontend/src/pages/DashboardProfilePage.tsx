import { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export function DashboardProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      await api.put("/users/me", { name, phone });
      setMessage("Profil mis à jour.");
    } catch {
      setMessage("Impossible de mettre à jour le profil.");
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-medium">Mon profil</h2>

      {user.role === "admin" && (
        <p className="mt-2 inline-block rounded bg-lagoon-50 px-3 py-1 text-xs font-medium text-lagoon-600">
          Compte administrateur
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {message && <p className="text-sm text-lagoon-600">{message}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium">Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input value={user.email} disabled className="input-field bg-sand-100 text-ink-300" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Téléphone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" />
        </div>

        <button type="submit" className="btn-primary">Enregistrer</button>
      </form>
    </div>
  );
}
