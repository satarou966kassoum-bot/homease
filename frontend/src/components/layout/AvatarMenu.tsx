import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Clique sur l'avatar = accès direct à la page de compte (plus de petit menu).
// Destination selon le rôle : l'admin va sur son panneau, les autres sur leur
// tableau de bord (qui affiche les statistiques en premier pour les
// propriétaires, ou les informations du profil pour les clients).
export function AvatarMenu() {
  const { user } = useAuth();
  if (!user) return null;

  const destination = user.role === "admin" ? "/admin" : "/dashboard";

  return (
    <Link
      to={destination}
      aria-label="Mon compte"
      className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-lagoon-50 text-sm font-semibold text-lagoon-600 md:h-9 md:w-9"
    >
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
      ) : (
        user.name.charAt(0).toUpperCase()
      )}
    </Link>
  );
}
