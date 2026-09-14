import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { NotificationBell } from "./NotificationBell";
import { MobileMenu } from "./MobileMenu";
import { AvatarMenu } from "./AvatarMenu";
import { AnimatedLogo } from "./AnimatedLogo";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-lagoon-500" : "text-ink-400 hover:text-lagoon-500"
  }`;

export function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation desktop */}
      <header className="hidden border-b border-sand-200 bg-sand-50/95 backdrop-blur md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl font-semibold text-lagoon-500">
            <AnimatedLogo />
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
              <AvatarMenu />
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
          </div>
        </div>
      </header>

      {/* En-tête mobile compact */}
      <header className="flex items-center justify-between border-b border-sand-200 bg-sand-50 px-3 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-9 w-9 items-center justify-center rounded hover:bg-sand-100"
          >
            <Menu size={20} className="text-ink-500" />
          </button>
          <Link to="/" className="font-display text-2xl font-semibold text-lagoon-500">
            <AnimatedLogo />
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <NotificationBell />
            <AvatarMenu />
          </div>
        ) : (
          <Link to="/login" className="text-sm font-medium text-lagoon-500">
            Se connecter
          </Link>
        )}
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
