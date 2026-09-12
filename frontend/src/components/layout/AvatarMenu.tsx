import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User as UserIcon, CalendarCheck, LayoutDashboard, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export function AvatarMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Mon compte"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-lagoon-50 text-sm font-semibold text-lagoon-600 md:h-9 md:w-9"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-lg border border-sand-200 bg-white py-1.5 shadow-elevated">
          <Link
            to="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-500 hover:bg-sand-50"
          >
            <UserIcon size={16} className="text-lagoon-500" />
            Mes informations
          </Link>
          <Link
            to="/reservations"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-500 hover:bg-sand-50"
          >
            <CalendarCheck size={16} className="text-lagoon-500" />
            Mes commandes
          </Link>

          {user.role === "owner" && (
            <Link
              to="/dashboard/listings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-500 hover:bg-sand-50"
            >
              <LayoutDashboard size={16} className="text-lagoon-500" />
              Tableau de bord
            </Link>
          )}

          {user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-500 hover:bg-sand-50"
            >
              <ShieldCheck size={16} className="text-lagoon-500" />
              Administration
            </Link>
          )}

          <div className="my-1 border-t border-sand-200" />

          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-clay-500 hover:bg-sand-50"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
