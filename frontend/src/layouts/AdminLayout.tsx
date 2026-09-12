import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded px-3 py-2 text-sm font-medium ${
    isActive ? "bg-lagoon-50 text-lagoon-600" : "text-ink-400 hover:bg-sand-100"
  }`;

export function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-2xl font-medium">Administration HomeEase</h1>
      <div className="mt-6 grid gap-8 md:grid-cols-[200px_1fr]">
        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass}>Vue d'ensemble</NavLink>
          <NavLink to="/admin/banners" className={linkClass}>Bannières</NavLink>
          <NavLink to="/admin/users" className={linkClass}>Utilisateurs</NavLink>
          <NavLink to="/admin/listings" className={linkClass}>Annonces</NavLink>
          <NavLink to="/admin/kyc" className={linkClass}>Vérifications</NavLink>
          <NavLink to="/admin/reports" className={linkClass}>Signalements</NavLink>
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
