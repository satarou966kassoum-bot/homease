import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface Report {
  _id: string;
  reason: string;
  details?: string;
  status: string;
  reporter: { name: string; email: string };
  listing: { _id: string; title: string };
}

const reasonLabels: Record<string, string> = {
  fausse_annonce: "Fausse annonce",
  prix_trompeur: "Prix trompeur",
  contenu_interdit: "Contenu interdit",
  arnaque: "Arnaque",
  autre: "Autre",
};

export function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/reports")
      .then((res) => setReports(res.data.data.reports))
      .finally(() => setIsLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await api.put(`/admin/reports/${id}`, { status });
    setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
  }

  if (isLoading) return <p className="text-sm text-ink-300">Chargement...</p>;
  if (reports.length === 0) return <p className="text-sm text-ink-300">Aucun signalement pour le moment.</p>;

  return (
    <div className="divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
      {reports.map((r) => (
        <div key={r._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="font-medium">{r.listing?.title || "Annonce supprimée"}</p>
            <p className="text-sm text-ink-300">
              {reasonLabels[r.reason]} — signalé par {r.reporter?.name}
            </p>
            {r.details && <p className="mt-1 text-sm text-ink-400">{r.details}</p>}
          </div>

          <select
            value={r.status}
            onChange={(e) => updateStatus(r._id, e.target.value)}
            className="input-field w-auto py-2 text-sm"
          >
            <option value="ouvert">Ouvert</option>
            <option value="traite">Traité</option>
            <option value="rejete">Rejeté</option>
          </select>
        </div>
      ))}
    </div>
  );
}
