import { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { DashboardMobileMenu } from "../components/layout/DashboardMobileMenu";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-lagoon-50 text-lagoon-600" : "text-ink-400 hover:bg-sand-100"
  }`;

export function DashboardLayout() {
  const { user, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const isOwner = user.role === "owner" || user.role === "admin";

  return (
    <div className="page-container section">
      {/* En-tête avec menu dédié au tableau de bord (mobile uniquement) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu du tableau de bord"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sand-200 md:hidden"
        >
          <Menu size={18} className="text-ink-500" />
        </button>
        <h1 className="font-display text-2xl font-medium">Tableau de bord</h1>
      </div>

      <DashboardMobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="mt-6 grid gap-8 md:grid-cols-[210px_1fr]">
        {/* Barre latérale persistante — desktop uniquement */}
        <nav className="hidden space-y-1 md:block">
          {isOwner ? (
            <>
              <NavLink to="/dashboard" end className={linkClass}>Vue d'ensemble</NavLink>
              <NavLink to="/dashboard/listings" className={linkClass}>Annonces</NavLink>
              <NavLink to="/dashboard/stats" className={linkClass}>Statistiques</NavLink>
              <NavLink to="/dashboard/messages" className={linkClass}>Messages</NavLink>
              <NavLink to="/dashboard/reservations" className={linkClass}>Commandes</NavLink>
              <NavLink to="/dashboard/booster" className={linkClass}>Booster</NavLink>
              <NavLink to="/dashboard/collections" className={linkClass}>Collections</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" end className={linkClass}>Mes informations</NavLink>
              <NavLink to="/dashboard/reservations" className={linkClass}>Commandes</NavLink>
              <NavLink to="/dashboard/messages" className={linkClass}>Messages</NavLink>
            </>
          )}
          <div className="my-2 border-t border-sand-200" />
          <button
            onClick={logout}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-clay-500 hover:bg-sand-100"
          >
            Déconnexion
          </button>
        </nav>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
