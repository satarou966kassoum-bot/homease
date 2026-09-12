import { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Home,
  Building2,
  Landmark,
  Sofa,
  UtensilsCrossed,
  TrainFront,
  Store,
  Truck,
  ShoppingBag,
  Palmtree,
  Ticket,
  CalendarCheck,
  MessageCircle,
  Heart,
  ChevronDown,
  HelpCircle,
  LifeBuoy,
  Mail,
  Info,
  FileText,
  Shield,
  Download,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";

interface Props {
  open: boolean;
  onClose: () => void;
}

// Ordonné par importance : le cœur immobilier d'abord, puis les futures
// verticales du marketplace HomeEase.
const categoryLinks = [
  { to: "/search?category=maison", label: "Maisons", icon: Home, live: true },
  { to: "/search?category=appartement", label: "Appartements", icon: Building2, live: true },
  { to: "/search?category=villa", label: "Villas", icon: Landmark, live: true },
  { to: "/search?category=bureau", label: "Bureaux", icon: Landmark, live: true },
  { to: "/search?category=meuble", label: "Meublés", icon: Sofa, live: true },
  { to: "/a-venir?nom=Boutiques", label: "Boutiques", icon: Store, live: false },
  { to: "/a-venir?nom=Restaurants", label: "Restaurants", icon: UtensilsCrossed, live: false },
  { to: "/a-venir?nom=Shopping en ligne", label: "Shopping en ligne", icon: ShoppingBag, live: false },
  { to: "/a-venir?nom=Ravitaillements", label: "Ravitaillements", icon: Truck, live: false },
  { to: "/a-venir?nom=Locomotives", label: "Locomotives", icon: TrainFront, live: false },
  { to: "/a-venir?nom=Tourisme", label: "Tourisme", icon: Palmtree, live: false },
  { to: "/a-venir?nom=Attractions", label: "Attractions", icon: Ticket, live: false },
];

const infoLinks = [
  { to: "/faq", label: "FAQ", icon: HelpCircle },
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/contact", label: "Nous contacter", icon: Mail },
  { to: "/about", label: "À propos", icon: Info },
  { to: "/terms", label: "Mentions légales", icon: FileText },
  { to: "/privacy", label: "Politique de confidentialité", icon: Shield },
];

export function MobileMenu({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const { canInstall, promptInstall } = useInstallPrompt();
  const [categoriesOpen, setCategoriesOpen] = useState(true);

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
          <span className="font-display text-lg font-semibold text-lagoon-500">HomeEase</span>
          <button onClick={onClose} aria-label="Fermer le menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-2">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
          >
            <Home size={18} className="text-lagoon-500" />
            Accueil
          </Link>

          {user && (
            <>
              <Link
                to="/reservations"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
              >
                <CalendarCheck size={18} className="text-lagoon-500" />
                Mes commandes
              </Link>
              <Link
                to="/messages"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
              >
                <MessageCircle size={18} className="text-lagoon-500" />
                Messagerie
              </Link>
              <Link
                to="/favorites"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
              >
                <Heart size={18} className="text-lagoon-500" />
                Favoris
              </Link>
            </>
          )}

          {/* Catégories — dépliées par défaut */}
          <button
            onClick={() => setCategoriesOpen((v) => !v)}
            className="mt-1 flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
          >
            Catégories
            <ChevronDown
              size={16}
              className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
            />
          </button>

          {categoriesOpen && (
            <div className="ml-2 border-l border-sand-200 pl-2">
              {categoryLinks.map(({ to, label, icon: Icon, live }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink-400 hover:bg-sand-100"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} className="text-lagoon-500" />
                    {label}
                  </span>
                  {!live && (
                    <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[10px] font-medium text-ink-300">
                      Bientôt
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="my-2 border-t border-sand-200" />

          {infoLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
            >
              <Icon size={18} className="text-lagoon-500" />
              {label}
            </Link>
          ))}

          {canInstall && (
            <button
              onClick={promptInstall}
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-lagoon-600 hover:bg-lagoon-50"
            >
              <Download size={18} />
              Installer l'application
            </button>
          )}

          <div className="my-2 border-t border-sand-200" />

          {user ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-clay-500 hover:bg-sand-100"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-sand-100"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="mx-3 mt-1 rounded-lg bg-lagoon-500 px-3 py-2.5 text-center text-sm font-medium text-white"
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
