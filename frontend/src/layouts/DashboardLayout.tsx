import { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { DashboardMobileMenu } from "../components/layout/DashboardMobileMenu";
import { NotificationBell } from "../components/layout/NotificationBell";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium ${
    isActive ? "bg-ink-500 text-white" : "text-ink-500 hover:bg-sand-100"
  }`;

const ownerLinks = [
  { to: "/dashboard", end: true, emoji: "📊", label: "Vue d'ensemble" },
  { to: "/dashboard/listings", emoji: "🏢", label: "Annonces" },
  { to: "/dashboard/stats", emoji: "📈", label: "Statistiques" },
  { to: "/dashboard/booster", emoji: "🚀", label: "Booster" },
  { to: "/dashboard/collections", emoji: "📁", label: "Collections" },
  { to: "/dashboard/messages", emoji: "💬", label: "Messages" },
  { to: "/dashboard/reservations", emoji: "📰", label: "Commandes" },
];

const clientLinks = [
  { to: "/dashboard", end: true, emoji: "👤", label: "Mes informations" },
  { to: "/dashboard/reservations", emoji: "📰", label: "Commandes" },
  { to: "/dashboard/messages", emoji: "💬", label: "Messages" },
];

export function DashboardLayout() {
  const { user, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const isOwner = user.role === "owner" || user.role === "admin";
  const links = isOwner ? ownerLinks : clientLinks;

  return (
    <div className="min-h-screen bg-sand-50">
      {/* En-tête propre au tableau de bord — un seul menu, thème blanc/beige */}
      <header className="flex items-center justify-between border-b border-sand-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu du tableau de bord"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sand-200 md:hidden"
          >
            <Menu size={18} className="text-ink-500" />
          </button>
          <h1 className="font-display text-lg font-medium text-ink-500 sm:text-xl">Tableau de bord</h1>
        </div>
        <NotificationBell />
      </header>

      <DashboardMobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="page-container py-5 sm:py-7">
        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
          {/* Barre latérale persistante — desktop uniquement */}
          <nav className="hidden space-y-1 md:block">
            <NavLink to="/" end className={linkClass}>
              <span>🏠</span> Accueil
            </NavLink>
            <div className="my-1.5 border-t border-sand-200" />
            {links.map((l) => (
              <NavLink key={l.label} to={l.to} end={l.end} className={linkClass}>
                <span>{l.emoji}</span> {l.label}
              </NavLink>
            ))}
            <div className="my-1.5 border-t border-sand-200" />
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-clay-500 hover:bg-sand-100"
            >
              <span>🚪</span> Déconnexion
            </button>
          </nav>

          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
