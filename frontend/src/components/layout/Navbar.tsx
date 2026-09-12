import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { NotificationBell } from "./NotificationBell";
import { MobileMenu } from "./MobileMenu";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-lagoon-500" : "text-ink-400 hover:text-lagoon-500"
  }`;

export function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation desktop */}
      <header className="hidden border-b border-sand-200 bg-sand-50/95 backdrop-blur md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl font-semibold text-lagoon-500">
            HomeEase
          </Link>

          <nav className="flex items-center gap-7">
            <NavLink to="/" end className={navLinkClass}>
              Accueil
            </NavLink>
            <NavLink to="/buy" className={navLinkClass}>
              Acheter
            </NavLink>
            <NavLink to="/rent" className={navLinkClass}>
              Louer
            </NavLink>
            <NavLink to="/land" className={navLinkClass}>
              Parcelles
            </NavLink>
            <NavLink to="/publish" className={navLinkClass}>
              Publier une annonce
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              Favoris
            </NavLink>
            <NavLink to="/messages" className={navLinkClass}>
              Messages
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {user && <NotificationBell />}
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="flex items-center gap-2 rounded border border-sand-200 px-4 py-2 text-sm font-medium text-ink-500 hover:border-lagoon-500"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                Tableau de bord
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-ink-500 hover:text-lagoon-500">
                  Se connecter
                </Link>
                <Link to="/register" className="btn-primary">
                  Créer un compte
                </Link>
              </>
            )}
            {user && (
              <button onClick={logout} className="text-sm text-ink-300 hover:text-clay-500">
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </header>

      {/* En-tête mobile compact — logo centré */}
      <header className="grid grid-cols-3 items-center border-b border-sand-200 bg-sand-50 px-3 py-3 md:hidden">
        <div className="flex justify-start">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-9 w-9 items-center justify-center rounded hover:bg-sand-100"
          >
            <Menu size={20} className="text-ink-500" />
          </button>
        </div>

        <Link to="/" className="justify-self-center font-display text-base font-semibold text-lagoon-500">
          HomeEase
        </Link>

        {user ? (
          <div className="flex items-center justify-end gap-2">
            <NotificationBell />
            <Link to={user.role === "admin" ? "/admin" : "/dashboard/profile"}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lagoon-50 text-sm font-semibold text-lagoon-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </Link>
          </div>
        ) : (
          <Link to="/login" className="justify-self-end text-sm font-medium text-lagoon-500">
            Se connecter
          </Link>
        )}
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
