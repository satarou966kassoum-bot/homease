import { NavLink, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium ${
    isActive ? "bg-ink-500 text-white" : "text-ink-500 hover:bg-sand-100"
  }`;

const ownerLinks = [
  { to: "/", end: true, emoji: "🏠", label: "Accueil" },
  { to: "/dashboard", end: true, emoji: "📊", label: "Vue d'ensemble" },
  { to: "/dashboard/listings", emoji: "🏢", label: "Annonces" },
  { to: "/dashboard/stats", emoji: "📈", label: "Statistiques" },
  { to: "/dashboard/booster", emoji: "🚀", label: "Booster" },
  { to: "/dashboard/collections", emoji: "📁", label: "Collections" },
  { to: "/dashboard/messages", emoji: "💬", label: "Messages" },
  { to: "/dashboard/reservations", emoji: "📰", label: "Commandes" },
  { to: "/dashboard/profile", emoji: "👤", label: "Mon compte" },
];

const clientLinks = [
  { to: "/", end: true, emoji: "🏠", label: "Accueil" },
  { to: "/dashboard", end: true, emoji: "👤", label: "Mes informations" },
  { to: "/dashboard/reservations", emoji: "📰", label: "Commandes" },
  { to: "/dashboard/messages", emoji: "💬", label: "Messages" },
];

export function DashboardMobileMenu({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.role === "owner" || user?.role === "admin";
  const links = isOwner ? ownerLinks : clientLinks;

  function handleLogout() {
    logout();
    onClose();
    navigate("/");
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] transform overflow-y-auto bg-white shadow-elevated transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sand-200 p-4">
          <div>
            <p className="font-display text-lg font-semibold text-ink-500">⭐ Emobile</p>
            <p className="text-xs text-ink-300">{isOwner ? "Espace propriétaire" : "Espace client"}</p>
          </div>
          <button onClick={onClose} aria-label="Fermer le menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 p-3">
          {links.map((l) => (
            <NavLink key={l.label} to={l.to} end={l.end} className={linkClass} onClick={onClose}>
              <span>{l.emoji}</span>
              {l.label}
            </NavLink>
          ))}

          <div className="my-2 border-t border-sand-200" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-clay-500 hover:bg-sand-100"
          >
            <span>🚪</span>
            Déconnexion
          </button>
        </nav>
      </div>
    </>
  );
}
