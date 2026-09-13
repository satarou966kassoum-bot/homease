import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Heart,
  MessageCircle,
  CalendarCheck,
  PlusCircle,
  ShieldCheck,
  Clock,
  XCircle,
  UploadCloud,
  BarChart3,
  Camera,
  Eye,
  TrendingUp,
} from "lucide-react";
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
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { uploadMedia } from "../services/upload";
import { VerifiedBadge } from "../components/ui/VerifiedBadge";

interface QuickStats {
  listings: number;
  favorites: number;
  reservations: number;
}

interface OwnerStats {
  totalListings: number;
  totalViews: number;
  byStatus: Record<string, number>;
  topListings: { id: string; title: string; viewsCount: number }[];
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

export function DashboardProfilePage() {
  const { user, refreshUser } = useAuth();
  const isOwner = user?.role === "owner" || user?.role === "admin";

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [kycStatus, setKycStatus] = useState(user?.kycStatus || "non_soumis");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<QuickStats>({ listings: 0, favorites: 0, reservations: 0 });
  const [ownerStats, setOwnerStats] = useState<OwnerStats | null>(null);
  const [kycUploading, setKycUploading] = useState(false);
  const [kycError, setKycError] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get("/users/me").then((res) => {
      const u = res.data.data.user;
      setName(u.name);
      setPhone(u.phone || "");
      setAvatarUrl(u.avatarUrl || "");
      setKycStatus(u.kycStatus || "non_soumis");
    });

    const requests: Promise<any>[] = [
      api.get("/favorites").catch(() => ({ data: { data: { favorites: [] } } })),
      api.get("/reservations").catch(() => ({ data: { data: { reservations: [] } } })),
    ];
    if (isOwner) {
      requests.push(api.get("/listings/mine/all").catch(() => ({ data: { data: { listings: [] } } })));
      api.get("/listings/mine/stats").then((res) => setOwnerStats(res.data.data));
    }

    Promise.all(requests).then(([favRes, resRes, listRes]) => {
      setStats({
        favorites: favRes.data.data.favorites.length,
        reservations: resRes.data.data.reservations.length,
        listings: listRes ? listRes.data.data.listings.length : 0,
      });
    });
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      await api.put("/users/me", { name, phone });
      setMessage("Profil mis à jour.");
      refreshUser();
    } catch {
      setMessage("Impossible de mettre à jour le profil.");
    }
  }

  async function handleAvatarUpload(file: File) {
    setAvatarUploading(true);
    try {
      const result = await uploadMedia(file);
      await api.put("/users/me", { avatarUrl: result.url });
      setAvatarUrl(result.url);
      refreshUser();
    } catch {
      setMessage("Impossible de mettre à jour la photo.");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleKycUpload(file: File) {
    setKycError("");
    setKycUploading(true);
    try {
      const result = await uploadMedia(file);
      await api.post("/users/kyc", { documentUrl: result.url });
      setKycStatus("en_attente");
    } catch {
      setKycError("Impossible d'envoyer le document. Réessayez.");
    } finally {
      setKycUploading(false);
    }
  }

  if (!user) return null;

  const quickActions = [
    ...(isOwner
      ? [{ to: "/dashboard/listings", label: "Annonces", icon: Home, value: stats.listings }]
      : []),
    { to: "/favorites", label: "Favoris", icon: Heart, value: stats.favorites },
    { to: "/dashboard/reservations", label: "Commandes", icon: CalendarCheck, value: stats.reservations },
    { to: "/messages", label: "Messages", icon: MessageCircle, value: null },
  ];

  const barData = ownerStats?.topListings.map((l) => ({
    name: l.title.length > 12 ? l.title.slice(0, 12) + "…" : l.title,
    vues: l.viewsCount,
  })) || [];

  const pieData = ownerStats
    ? Object.entries(ownerStats.byStatus).map(([status, count]) => ({
        name: statusLabel[status] || status,
        value: count,
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* En-tête profil avec photo modifiable */}
      <div className="card flex items-center gap-4 p-5">
        <label className="group relative h-16 w-16 shrink-0 cursor-pointer">
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-lagoon-50 text-2xl font-semibold text-lagoon-600">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </span>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={18} />
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={avatarUploading}
            onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
          />
        </label>
        <div>
          <p className="flex items-center gap-2 text-lg font-medium">
            {name}
            {kycStatus === "verifie" && <VerifiedBadge compact />}
          </p>
          <p className="text-sm text-ink-300">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-medium text-ink-400">
            {user.role === "admin" ? "Administrateur" : user.role === "owner" ? "Propriétaire" : "Client"}
          </span>
        </div>
      </div>

      {/* Statistiques directement visibles — propriétaires */}
      {isOwner && ownerStats && (
        <div>
          <p className="mb-3 text-sm font-semibold text-ink-500">Vos statistiques</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="card p-4">
              <Home size={18} className="text-lagoon-500" />
              <p className="mt-2 text-2xl font-semibold">{ownerStats.totalListings}</p>
              <p className="text-xs text-ink-300">Annonces publiées</p>
            </div>
            <div className="card p-4">
              <Eye size={18} className="text-lagoon-500" />
              <p className="mt-2 text-2xl font-semibold">{ownerStats.totalViews}</p>
              <p className="text-xs text-ink-300">Vues cumulées</p>
            </div>
            <div className="card p-4">
              <TrendingUp size={18} className="text-lagoon-500" />
              <p className="mt-2 text-2xl font-semibold">{ownerStats.byStatus.approuvee || 0}</p>
              <p className="text-xs text-ink-300">Annonces actives</p>
            </div>
          </div>

          {barData.length > 0 && (
            <div className="card mt-3 p-4">
              <p className="mb-2 text-sm font-semibold text-ink-500">Vues par annonce</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ left: -20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={45} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="vues" fill="#141311" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {pieData.length > 0 && (
            <div className="card mt-3 p-4">
              <p className="mb-2 text-sm font-semibold text-ink-500">Répartition par statut</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
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

          <Link to="/dashboard/stats" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-lagoon-600">
            <BarChart3 size={14} /> Voir toutes les statistiques
          </Link>
        </div>
      )}

      {/* Actions rapides */}
      <div>
        <p className="mb-3 text-sm font-semibold text-ink-500">Accès rapide</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {user.role === "owner" && (
            <Link
              to="/publish"
              className="card flex flex-col items-center justify-center gap-2 p-4 text-center text-lagoon-600 hover:shadow-elevated"
            >
              <PlusCircle size={20} />
              <span className="text-xs font-medium">Publier</span>
            </Link>
          )}
          {quickActions.map(({ to, label, icon: Icon, value }) => (
            <Link
              key={label}
              to={to}
              className="card flex flex-col items-center justify-center gap-2 p-4 text-center hover:shadow-elevated"
            >
              <Icon size={20} className="text-lagoon-500" />
              {value !== null && <span className="text-lg font-semibold">{value}</span>}
              <span className="text-xs font-medium text-ink-400">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Vérification KYC — propriétaires uniquement */}
      {isOwner && (
        <div className="card p-5">
          <p className="text-sm font-semibold text-ink-500">Vérification du profil (KYC)</p>
          <p className="mt-1 text-sm text-ink-300">
            Faites vérifier votre identité pour obtenir le badge "Annonceur vérifié" et
            inspirer davantage confiance auprès des clients.
          </p>

          <div className="mt-4">
            {kycStatus === "verifie" && (
              <div className="flex items-center gap-2 rounded-lg bg-lagoon-50 px-4 py-3 text-sm text-lagoon-600">
                <ShieldCheck size={18} />
                Votre profil est vérifié. Le badge est actif sur vos annonces.
              </div>
            )}
            {kycStatus === "en_attente" && (
              <div className="flex items-center gap-2 rounded-lg bg-ochre-100 px-4 py-3 text-sm text-ochre-600">
                <Clock size={18} />
                Document envoyé — vérification en cours par un administrateur.
              </div>
            )}
            {kycStatus === "rejete" && (
              <div className="flex items-center gap-2 rounded-lg bg-clay-500/10 px-4 py-3 text-sm text-clay-600">
                <XCircle size={18} />
                Vérification refusée. Vous pouvez soumettre un nouveau document.
              </div>
            )}

            {(kycStatus === "non_soumis" || kycStatus === "rejete") && (
              <label className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-sand-200 p-6 text-center hover:border-lagoon-500">
                <UploadCloud size={22} className="text-lagoon-500" />
                <span className="text-sm text-ink-400">
                  {kycUploading ? "Envoi en cours..." : "Téléverser une pièce d'identité (CIP, passeport...)"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={kycUploading}
                  onChange={(e) => e.target.files?.[0] && handleKycUpload(e.target.files[0])}
                />
              </label>
            )}
            {kycError && <p className="mt-2 text-sm text-clay-600">{kycError}</p>}
          </div>
        </div>
      )}

      {/* Modifier le profil */}
      <div className="card max-w-md p-5">
        <p className="text-sm font-semibold text-ink-500">Modifier mes informations</p>

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
    </div>
  );
}
