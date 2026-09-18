import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Video, ShieldAlert } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Listing } from "../types";

export function GuidedTourPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState(user?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/listings/${id}`)
      .then((res) => setListing(res.data.data.listing))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleReserve() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!fullName.trim()) {
      setError("Merci d'indiquer votre nom et prénom.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/reservations", {
        listingId: id,
        clientFullName: fullName,
      });
      setSuccessMessage(data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible d'envoyer la réservation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="page-container section text-center text-ink-300">Chargement...</div>;
  }

  if (!listing) {
    return <div className="page-container section text-center text-ink-300">Annonce introuvable.</div>;
  }

  if (successMessage) {
    return (
      <div className="page-container section max-w-md text-center">
        <div className="card p-6">
          <ShieldAlert size={28} className="mx-auto text-lagoon-500" />
          <p className="mt-3 font-medium">Merci !</p>
          <p className="mt-2 text-sm text-ink-400">{successMessage}</p>
          <Link to="/reservations" className="btn-primary mt-5 inline-flex">
            Voir mes commandes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container section max-w-2xl">
      <h1 className="font-display text-xl font-medium">{listing.title}</h1>
      <p className="mt-1 text-sm text-ink-300">Visite guidée</p>

      <div className="mt-4 overflow-hidden rounded-xl bg-sand-100">
        {listing.guidedTourVideoUrl ? (
          <video src={listing.guidedTourVideoUrl} controls className="w-full" />
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 text-ink-300">
            <Video size={28} />
            <p className="text-sm">Le propriétaire n'a pas encore ajouté de vidéo de visite.</p>
          </div>
        )}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary mt-5 w-full py-3.5 text-base">
          Je réserve
        </button>
      ) : (
        <div className="card mt-5 p-5">
          <p className="text-sm font-semibold text-ink-500">Confirmer la réservation</p>
          {error && <p className="mt-2 text-sm text-clay-600">{error}</p>}
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium">Nom et prénom</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              placeholder="Ex : Kassoum Abdoulaye"
            />
          </div>
          <button onClick={handleReserve} disabled={isSubmitting} className="btn-primary mt-4 w-full">
            {isSubmitting ? "Envoi..." : "Confirmer ma réservation"}
          </button>
        </div>
      )}
    </div>
  );
}
