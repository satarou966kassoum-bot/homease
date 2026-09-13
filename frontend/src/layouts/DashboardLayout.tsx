import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded px-3 py-2 text-sm font-medium ${
    isActive ? "bg-lagoon-50 text-lagoon-600" : "text-ink-400 hover:bg-sand-100"
  }`;

export function DashboardLayout() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const isOwner = user.role === "owner" || user.role === "admin";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-2xl font-medium">Tableau de bord</h1>
      <div className="mt-6 grid gap-8 md:grid-cols-[200px_1fr]">
        <nav className="space-y-1">
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
            className="block w-full rounded px-3 py-2 text-left text-sm font-medium text-clay-500 hover:bg-sand-100"
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
