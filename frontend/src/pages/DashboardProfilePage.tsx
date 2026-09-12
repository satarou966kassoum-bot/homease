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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { uploadMedia } from "../services/upload";
import { VerifiedBadge } from "../components/ui/VerifiedBadge";

interface Stats {
  listings: number;
  favorites: number;
  reservations: number;
}

export function DashboardProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [kycStatus, setKycStatus] = useState(user?.kycStatus || "non_soumis");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<Stats>({ listings: 0, favorites: 0, reservations: 0 });
  const [kycUploading, setKycUploading] = useState(false);
  const [kycError, setKycError] = useState("");

  useEffect(() => {
    if (!user) return;
    api.get("/users/me").then((res) => {
      const u = res.data.data.user;
      setName(u.name);
      setPhone(u.phone || "");
      setKycStatus(u.kycStatus || "non_soumis");
    });

    const requests: Promise<any>[] = [
      api.get("/favorites").catch(() => ({ data: { data: { favorites: [] } } })),
      api.get("/reservations").catch(() => ({ data: { data: { reservations: [] } } })),
    ];
    if (user.role === "owner" || user.role === "admin") {
      requests.push(api.get("/listings/mine/all").catch(() => ({ data: { data: { listings: [] } } })));
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
    } catch {
      setMessage("Impossible de mettre à jour le profil.");
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
    ...(user.role === "owner" || user.role === "admin"
      ? [{ to: "/dashboard/listings", label: "Mes annonces", icon: Home, value: stats.listings }]
      : []),
    { to: "/favorites", label: "Favoris", icon: Heart, value: stats.favorites },
    { to: "/dashboard/reservations", label: "Réservations", icon: CalendarCheck, value: stats.reservations },
    { to: "/messages", label: "Messages", icon: MessageCircle, value: null },
  ];

  return (
    <div className="space-y-8">
      {/* En-tête profil */}
      <div className="card flex items-center gap-4 p-5">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lagoon-50 text-2xl font-semibold text-lagoon-600">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="flex items-center gap-2 text-lg font-medium">
            {user.name}
            {kycStatus === "verifie" && <VerifiedBadge compact />}
          </p>
          <p className="text-sm text-ink-300">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-medium text-ink-400">
            {user.role === "admin" ? "Administrateur" : user.role === "owner" ? "Propriétaire" : "Client"}
          </span>
        </div>
      </div>

      {/* Actions rapides / statistiques */}
      <div>
        <p className="mb-3 text-sm font-semibold text-ink-500">Tableau de bord</p>
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
      {(user.role === "owner" || user.role === "admin") && (
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
