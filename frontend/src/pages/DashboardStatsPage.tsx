import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Home, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
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

const PIE_COLORS = ["#141311", "#A9822E", "#B23A2E", "#C4B79E", "#615E58", "#3D3B37"];

export function DashboardStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/listings/mine/stats").then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <p className="text-sm text-ink-300">Chargement des statistiques...</p>;

  const barData = stats.topListings.map((l) => ({
    name: l.title.length > 14 ? l.title.slice(0, 14) + "…" : l.title,
    vues: l.viewsCount,
  }));

  const pieData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: statusLabel[status] || status,
    value: count,
  }));

  return (
    <div className="space-y-8">
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

      {barData.length > 0 && (
        <div className="card p-4">
          <p className="mb-3 text-sm font-semibold text-ink-500">Vues par annonce (top 5)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="vues" fill="#141311" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {pieData.length > 0 && (
        <div className="card p-4">
          <p className="mb-3 text-sm font-semibold text-ink-500">Répartition par statut</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
