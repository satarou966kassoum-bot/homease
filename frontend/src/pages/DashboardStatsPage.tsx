import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Home, TrendingUp } from "lucide-react";
import { api } from "../services/api";

interface TopListing {
  id: string;
  title: string;
  viewsCount: number;
  status: string;
}

interface Stats {
  totalListings: number;
  totalViews: number;
  byStatus: Record<string, number>;
  topListings: TopListing[];
}

const statusLabel: Record<string, string> = {
  brouillon: "Brouillon",
  en_attente: "En attente",
  approuvee: "Approuvée",
  rejetee: "Rejetée",
  suspendue: "Suspendue",
  vendue_louee: "Vendue / louée",
};

export function DashboardStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/listings/mine/stats").then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <p className="text-sm text-ink-300">Chargement des statistiques...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <Home size={18} className="text-lagoon-500" />
          <p className="mt-2 text-2xl font-semibold">{stats.totalListings}</p>
          <p className="text-xs text-ink-300">Annonces publiées</p>
        </div>
        <div className="card p-4">
          <Eye size={18} className="text-lagoon-500" />
          <p className="mt-2 text-2xl font-semibold">{stats.totalViews}</p>
          <p className="text-xs text-ink-300">Vues cumulées</p>
        </div>
        <div className="card p-4">
          <TrendingUp size={18} className="text-lagoon-500" />
          <p className="mt-2 text-2xl font-semibold">{stats.byStatus.approuvee || 0}</p>
          <p className="text-xs text-ink-300">Annonces actives</p>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-ink-500">Répartition par statut</p>
        <div className="card divide-y divide-sand-100">
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-ink-400">{statusLabel[status] || status}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {stats.topListings.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-ink-500">Annonces les plus vues</p>
          <div className="card divide-y divide-sand-100">
            {stats.topListings.map((l) => (
              <Link
                key={l.id}
                to={`/listing/${l.id}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-sand-50"
              >
                <span className="truncate pr-3">{l.title}</span>
                <span className="flex shrink-0 items-center gap-1 text-ink-300">
                  <Eye size={13} /> {l.viewsCount}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
