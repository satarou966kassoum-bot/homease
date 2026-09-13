import { NavLink, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
    isActive ? "bg-lagoon-50 text-lagoon-600" : "text-ink-400 hover:bg-sand-100"
  }`;

export function DashboardMobileMenu({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.role === "owner" || user?.role === "admin";

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
          <span className="font-display text-lg font-semibold text-lagoon-500">Tableau de bord</span>
          <button onClick={onClose} aria-label="Fermer le menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-2">
          {isOwner ? (
            <>
              <NavLink to="/dashboard" end className={linkClass} onClick={onClose}>Vue d'ensemble</NavLink>
              <NavLink to="/dashboard/listings" className={linkClass} onClick={onClose}>Annonces</NavLink>
              <NavLink to="/dashboard/stats" className={linkClass} onClick={onClose}>Statistiques</NavLink>
              <NavLink to="/dashboard/messages" className={linkClass} onClick={onClose}>Messages</NavLink>
              <NavLink to="/dashboard/reservations" className={linkClass} onClick={onClose}>Commandes</NavLink>
              <NavLink to="/dashboard/booster" className={linkClass} onClick={onClose}>Booster</NavLink>
              <NavLink to="/dashboard/collections" className={linkClass} onClick={onClose}>Collections</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" end className={linkClass} onClick={onClose}>Mes informations</NavLink>
              <NavLink to="/dashboard/reservations" className={linkClass} onClick={onClose}>Commandes</NavLink>
              <NavLink to="/dashboard/messages" className={linkClass} onClick={onClose}>Messages</NavLink>
            </>
          )}

          <div className="my-2 border-t border-sand-200" />
          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-clay-500 hover:bg-sand-100"
          >
            Déconnexion
          </button>
        </nav>
      </div>
    </>
  );
}
