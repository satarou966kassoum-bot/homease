import { useEffect, useState } from "react";
import { ShieldCheck, XCircle } from "lucide-react";
import { api } from "../../services/api";

interface KycUser {
  _id: string;
  name: string;
  email: string;
  kycDocumentUrl?: string;
  kycSubmittedAt?: string;
}

export function AdminKycPage() {
  const [users, setUsers] = useState<KycUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/kyc")
      .then((res) => setUsers(res.data.data.users))
      .finally(() => setIsLoading(false));
  }, []);

  async function decide(id: string, status: "verifie" | "rejete") {
    await api.put(`/admin/kyc/${id}`, { status });
    setUsers((prev) => prev.filter((u) => u._id !== id));
  }

  if (isLoading) return <p className="text-sm text-ink-300">Chargement...</p>;
  if (users.length === 0) return <p className="text-sm text-ink-300">Aucune demande de vérification en attente.</p>;

  return (
    <div className="space-y-4">
      {users.map((u) => (
        <div key={u._id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <p className="font-medium">{u.name}</p>
            <p className="text-sm text-ink-300">{u.email}</p>
            {u.kycDocumentUrl && (
              <a
                href={u.kycDocumentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm text-lagoon-500 underline"
              >
                Voir le document
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => decide(u._id, "verifie")}
              className="flex items-center gap-1.5 rounded-lg bg-lagoon-500 px-4 py-2 text-sm font-medium text-white hover:bg-lagoon-600"
            >
              <ShieldCheck size={15} /> Vérifier
            </button>
            <button
              onClick={() => decide(u._id, "rejete")}
              className="flex items-center gap-1.5 rounded-lg bg-clay-500/10 px-4 py-2 text-sm font-medium text-clay-600"
            >
              <XCircle size={15} /> Refuser
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
