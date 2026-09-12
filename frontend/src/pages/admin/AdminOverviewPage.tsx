import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface Stats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  totalReservations: number;
  openReports: number;
  pendingKyc: number;
  recentUsers: { _id: string; name: string; email: string; role: string }[];
}

export function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <p className="text-sm text-ink-300">Chargement des statistiques...</p>;

  const cards = [
    { label: "Utilisateurs", value: stats.totalUsers },
    { label: "Annonces totales", value: stats.totalListings },
    { label: "Annonces actives", value: stats.activeListings },
    { label: "En attente de validation", value: stats.pendingListings },
    { label: "Réservations", value: stats.totalReservations },
    { label: "Signalements ouverts", value: stats.openReports },
    { label: "Vérifications en attente", value: stats.pendingKyc },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-sand-200 bg-white p-5">
            <p className="text-2xl font-semibold text-lagoon-600">{c.value}</p>
            <p className="mt-1 text-sm text-ink-300">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium">Utilisateurs récents</h2>
        <div className="mt-3 divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
          {stats.recentUsers.map((u) => (
            <div key={u._id} className="flex items-center justify-between p-3 text-sm">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-ink-300">{u.email}</p>
              </div>
              <span className="rounded bg-sand-100 px-2 py-1 text-xs">{u.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
