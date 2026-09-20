import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { VerifiedBadge } from "../ui/VerifiedBadge";

const roleLabel: Record<string, string> = {
  admin: "Administrateur",
  owner: "Propriétaire",
  client: "Client",
};

export function AvatarMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  function close() {
    setOpen(false);
  }

  function handleLogout() {
    logout();
    close();
    navigate("/");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Mon compte"
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-lagoon-50 text-sm font-semibold text-lagoon-600 md:h-9 md:w-9"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          user.name.charAt(0).toUpperCase()
        )}
      </button>

      {/* Tiroir de compte — glisse depuis la droite */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] transform overflow-y-auto bg-white shadow-elevated transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sand-200 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-lagoon-50 text-xl font-semibold text-lagoon-600">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </span>
            <div>
              <p className="flex items-center gap-1.5 font-medium leading-tight">
                {user.name}
                {user.kycStatus === "verifie" && <VerifiedBadge compact />}
              </p>
              <p className="text-sm text-ink-300">{roleLabel[user.role]}</p>
            </div>
          </div>
          <button onClick={close} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 p-4">
          <Link
            to="/dashboard/profile"
            onClick={close}
            className="rounded-xl bg-sand-100 px-4 py-3.5 text-sm font-medium text-ink-500 hover:bg-sand-200"
          >
            Voir mon profil
          </Link>
          <Link
            to="/reservations"
            onClick={close}
            className="rounded-xl bg-sand-100 px-4 py-3.5 text-sm font-medium text-ink-500 hover:bg-sand-200"
          >
            Mes commandes
          </Link>
          {user.role === "owner" && (
            <Link
              to="/dashboard"
              onClick={close}
              className="rounded-xl bg-sand-100 px-4 py-3.5 text-sm font-medium text-ink-500 hover:bg-sand-200"
            >
              Tableau de bord
            </Link>
          )}
          {user.role === "admin" && (
            <Link
              to="/admin"
              onClick={close}
              className="rounded-xl bg-sand-100 px-4 py-3.5 text-sm font-medium text-ink-500 hover:bg-sand-200"
            >
              Espace administrateur
            </Link>
          )}
          <Link
            to="/contact"
            onClick={close}
            className="rounded-xl bg-sand-100 px-4 py-3.5 text-sm font-medium text-ink-500 hover:bg-sand-200"
          >
            🚩 Signaler un problème
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-sand-100 px-4 py-3.5 text-left text-sm font-medium text-clay-600 hover:bg-sand-200"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  );
}
