import { Link } from "react-router-dom";
import { X, Home, Building2, Trees, Landmark, Sofa, PlusCircle, Heart, MessageCircle, Download } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";

interface Props {
  open: boolean;
  onClose: () => void;
}

const links = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/rent", label: "Louer", icon: Home },
  { to: "/buy", label: "Acheter", icon: Building2 },
  { to: "/land", label: "Parcelles", icon: Trees },
  { to: "/search?category=bureau", label: "Bureaux", icon: Landmark },
  { to: "/search?category=meuble", label: "Meublés", icon: Sofa },
];

export function MobileMenu({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const { canInstall, promptInstall } = useInstallPrompt();

  return (
    <>
      {/* Fond sombre cliquable pour fermer */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panneau glissant */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] transform bg-white shadow-lg transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sand-200 p-4">
          <span className="font-display text-lg font-semibold text-lagoon-500">HomeEase</span>
          <button onClick={onClose} aria-label="Fermer le menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-2">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
            >
              <Icon size={18} className="text-lagoon-500" />
              {label}
            </Link>
          ))}

          <div className="my-2 border-t border-sand-200" />

          {canInstall && (
            <button
              onClick={promptInstall}
              className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-lagoon-600 hover:bg-lagoon-50"
            >
              <Download size={18} />
              Installer l'application
            </button>
          )}

          <Link
            to="/publish"
            onClick={onClose}
            className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
          >
            <PlusCircle size={18} className="text-lagoon-500" />
            Publier une annonce
          </Link>
          <Link
            to="/favorites"
            onClick={onClose}
            className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
          >
            <Heart size={18} className="text-lagoon-500" />
            Favoris
          </Link>
          <Link
            to="/messages"
            onClick={onClose}
            className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
          >
            <MessageCircle size={18} className="text-lagoon-500" />
            Messages
          </Link>

          <div className="my-2 border-t border-sand-200" />

          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard/profile"}
                onClick={onClose}
                className="rounded px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
              >
                Mon compte ({user.name})
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="rounded px-3 py-2.5 text-left text-sm font-medium text-clay-500 hover:bg-sand-100"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className="rounded px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="mx-3 mt-1 rounded bg-lagoon-500 px-3 py-2.5 text-center text-sm font-medium text-white"
              >
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
