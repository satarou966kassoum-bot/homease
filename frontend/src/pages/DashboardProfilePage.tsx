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

const PIE_COLORS = ["#3D3B37", "#8B8580", "#C7B896", "#615E58", "#E3D8C3", "#A39C90"];

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

  const tiles = [
    ...(user.role === "owner"
      ? [{ to: "/publish", label: "Publier", icon: PlusCircle, value: null, accent: true }]
      : []),
    ...(isOwner
      ? [{ to: "/dashboard/listings", label: "Annonces", icon: Home, value: stats.listings, accent: false }]
      : []),
    { to: "/favorites", label: "Favoris", icon: Heart, value: stats.favorites, accent: false },
    { to: "/dashboard/reservations", label: "Commandes", icon: CalendarCheck, value: stats.reservations, accent: false },
    { to: "/messages", label: "Messages", icon: MessageCircle, value: null, accent: false },
  ];

  const barData = ownerStats?.topListings.map((l) => ({
    name: l.title.length > 10 ? l.title.slice(0, 10) + "…" : l.title,
    vues: l.viewsCount,
  })) || [];

  const pieData = ownerStats
    ? Object.entries(ownerStats.byStatus).map(([status, count]) => ({
        name: statusLabel[status] || status,
        value: count,
      }))
    : [];

  return (
    <div className="space-y-5">
      {/* En-tête profil compact avec photo modifiable */}
      <div className="card flex items-center gap-3 p-4">
        <label className="group relative h-12 w-12 shrink-0 cursor-pointer">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-sand-200 text-lg font-semibold text-ink-500">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </span>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={14} />
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={avatarUploading}
            onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
          />
        </label>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-base font-medium leading-tight">
            <span className="truncate">{name}</span>
            {kycStatus === "verifie" && <VerifiedBadge compact />}
          </p>
          <p className="truncate text-xs text-ink-300">{user.email}</p>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-sand-100 px-2.5 py-1 text-xs font-medium text-ink-400">
          {user.role === "admin" ? "Admin" : user.role === "owner" ? "Propriétaire" : "Client"}
        </span>
      </div>

      {/* Grille unifiée : statistiques + accès rapide, tuiles proportionnelles */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-300">Aperçu</p>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {isOwner && ownerStats && (
            <>
              <div className="card flex aspect-square flex-col items-center justify-center gap-1 p-2 text-center">
                <Home size={17} className="text-ink-500" />
                <span className="text-lg font-semibold leading-none">{ownerStats.totalListings}</span>
                <span className="text-[11px] leading-tight text-ink-300">Annonces</span>
              </div>
              <div className="card flex aspect-square flex-col items-center justify-center gap-1 p-2 text-center">
                <Eye size={17} className="text-ink-500" />
                <span className="text-lg font-semibold leading-none">{ownerStats.totalViews}</span>
                <span className="text-[11px] leading-tight text-ink-300">Vues</span>
              </div>
              <div className="card flex aspect-square flex-col items-center justify-center gap-1 p-2 text-center">
                <TrendingUp size={17} className="text-ink-500" />
                <span className="text-lg font-semibold leading-none">{ownerStats.byStatus.approuvee || 0}</span>
                <span className="text-[11px] leading-tight text-ink-300">Actives</span>
              </div>
            </>
          )}
          {tiles.map(({ to, label, icon: Icon, value, accent }) => (
            <Link
              key={label}
              to={to}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl p-2 text-center transition-shadow hover:shadow-elevated ${
                accent ? "bg-ink-500 text-white" : "card"
              }`}
            >
              <Icon size={17} className={accent ? "text-white" : "text-ink-500"} />
              {value !== null && <span className="text-lg font-semibold leading-none">{value}</span>}
              <span className={`text-[11px] leading-tight ${accent ? "text-sand-100" : "text-ink-300"}`}>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Statistiques détaillées — propriétaires */}
      {isOwner && ownerStats && (barData.length > 0 || pieData.length > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {barData.length > 0 && (
            <div className="card p-3">
              <p className="mb-1 text-xs font-semibold text-ink-500">Vues par annonce</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ left: -20, top: 8 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={38} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="vues" fill="#3D3B37" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {pieData.length > 0 && (
            <div className="card p-3">
              <p className="mb-1 text-xs font-semibold text-ink-500">Par statut</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={36} outerRadius={58} paddingAngle={3}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <Link to="/dashboard/stats" className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 sm:col-span-2">
            <BarChart3 size={13} /> Voir toutes les statistiques
          </Link>
        </div>
      )}

      {/* Vérification KYC — propriétaires uniquement */}
      {isOwner && (
        <div className="card p-4">
          <p className="text-sm font-semibold text-ink-500">Vérification du profil (KYC)</p>
          <p className="mt-0.5 text-xs text-ink-300">
            Obtenez le badge "Annonceur vérifié" pour inspirer confiance auprès des clients.
          </p>

          <div className="mt-3">
            {kycStatus === "verifie" && (
              <div className="flex items-center gap-2 rounded-lg bg-sand-100 px-3 py-2.5 text-xs text-ink-500">
                <ShieldCheck size={16} />
                Profil vérifié — badge actif sur vos annonces.
              </div>
            )}
            {kycStatus === "en_attente" && (
              <div className="flex items-center gap-2 rounded-lg bg-sand-200 px-3 py-2.5 text-xs text-ink-500">
                <Clock size={16} />
                Document envoyé — vérification en cours.
              </div>
            )}
            {kycStatus === "rejete" && (
              <div className="flex items-center gap-2 rounded-lg bg-clay-500/10 px-3 py-2.5 text-xs text-clay-600">
                <XCircle size={16} />
                Vérification refusée — soumettez un nouveau document.
              </div>
            )}

            {(kycStatus === "non_soumis" || kycStatus === "rejete") && (
              <label className="mt-2 flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 border-dashed border-sand-200 p-4 text-center hover:border-ink-400">
                <UploadCloud size={19} className="text-ink-500" />
                <span className="text-xs text-ink-400">
                  {kycUploading ? "Envoi en cours..." : "Téléverser une pièce d'identité"}
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
            {kycError && <p className="mt-1.5 text-xs text-clay-600">{kycError}</p>}
          </div>
        </div>
      )}

      {/* Modifier le profil */}
      <div className="card p-4">
        <p className="text-sm font-semibold text-ink-500">Mes informations</p>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          {message && <p className="text-xs text-ink-500">{message}</p>}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-400">Nom</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-400">Téléphone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink-400">Email</label>
            <input value={user.email} disabled className="input-field bg-sand-100 text-ink-300" />
          </div>

          <button type="submit" className="btn-primary">Enregistrer</button>
        </form>
      </div>
    </div>
  );
}
