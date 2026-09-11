import { Link, NavLink } from "react-router-dom";
import { Home, Search, PlusCircle, Heart, User as UserIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { NotificationBell } from "./NotificationBell";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-lagoon-500" : "text-ink-400 hover:text-lagoon-500"
  }`;

export function Navbar() {
  const { user, logout } = useAuth();

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

      {/* En-tête mobile simple */}
      <header className="flex items-center justify-between border-b border-sand-200 bg-sand-50 px-4 py-3 md:hidden">
        <Link to="/" className="font-display text-lg font-semibold text-lagoon-500">
          HomeEase
        </Link>
        {user ? (
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Link to={user.role === "admin" ? "/admin" : "/dashboard/profile"}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lagoon-50 text-sm font-semibold text-lagoon-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </Link>
          </div>
        ) : (
          <Link to="/login" className="text-sm font-medium text-lagoon-500">
            Se connecter
          </Link>
        )}
      </header>

      {/* Navigation basse mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-sand-200 bg-white py-2 md:hidden">
        <MobileTab to="/" icon={<Home size={20} />} label="Accueil" end />
        <MobileTab to="/search" icon={<Search size={20} />} label="Rechercher" />
        <MobileTab to="/publish" icon={<PlusCircle size={20} />} label="Publier" />
        <MobileTab to="/favorites" icon={<Heart size={20} />} label="Favoris" />
        <MobileTab
          to={user ? (user.role === "admin" ? "/admin" : "/dashboard/profile") : "/login"}
          icon={<UserIcon size={20} />}
          label="Profil"
        />
      </nav>
    </>
  );
}

function MobileTab({
  to,
  icon,
  label,
  end,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 px-2 text-[11px] font-medium ${
          isActive ? "text-lagoon-500" : "text-ink-300"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
