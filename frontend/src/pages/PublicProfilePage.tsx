import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { VerifiedBadge } from "../components/ui/VerifiedBadge";

interface PublicUser {
  _id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  kycStatus?: string;
  createdAt: string;
}

interface ReviewItem {
  _id: string;
  rating: number;
  comment?: string;
  reviewer: { name: string; avatarUrl?: string };
  createdAt: string;
}

export function PublicProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  function load() {
    if (!userId) return;
    Promise.all([
      api.get(`/users/${userId}/public`),
      api.get(`/reviews/${userId}`),
    ]).then(([profileRes, reviewRes]) => {
      setProfile(profileRes.data.data.user);
      setReviews(reviewRes.data.data.reviews);
      setAverage(reviewRes.data.data.average);
      setCount(reviewRes.data.data.count);
      setIsLoading(false);
    });
  }

  useEffect(load, [userId]);

  async function handleSubmitReview() {
    if (!userId) return;
    setSubmitting(true);
    setSubmitMessage("");
    try {
      await api.post("/reviews", { reviewedUserId: userId, rating, comment: comment || undefined });
      setComment("");
      setSubmitMessage("Merci pour votre avis !");
      load();
    } catch (err: any) {
      setSubmitMessage(err.response?.data?.message || "Impossible d'envoyer l'avis.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return <div className="page-container section text-center text-ink-300">Chargement...</div>;
  if (!profile) return <div className="page-container section text-center text-ink-300">Profil introuvable.</div>;

  const canReview = currentUser && currentUser.id !== profile._id;

  return (
    <div className="page-container section max-w-2xl">
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-lagoon-50 text-2xl font-semibold text-lagoon-600">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </span>
          <div>
            <p className="flex items-center gap-2 text-lg font-medium">
              {profile.name}
              {profile.kycStatus === "verifie" && <VerifiedBadge compact />}
            </p>
            <p className="text-sm text-ink-300">
              {profile.role === "owner" ? "Propriétaire / annonceur" : "Membre"} · sur Emobile
              depuis {new Date(profile.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </p>
            {count > 0 && (
              <div className="mt-1 flex items-center gap-1 text-sm text-ochre-600">
                <Star size={14} fill="currentColor" />
                {average} · {count} avis
              </div>
            )}
          </div>
        </div>

        {profile.kycStatus !== "verifie" && (
          <p className="mt-4 rounded-lg bg-sand-100 px-3 py-2 text-xs text-ink-400">
            Ce profil n'a pas encore été vérifié par Emobile. Restez prudent et privilégiez les
            échanges via la messagerie de la plateforme.
          </p>
        )}
      </div>

      {canReview && (
        <div className="card mt-4 p-5">
          <p className="text-sm font-semibold text-ink-500">Laisser un avis</p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n} étoiles`}>
                <Star size={22} className={n <= rating ? "text-ochre-500" : "text-sand-200"} fill={n <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Votre expérience avec cette personne (optionnel)"
            className="input-field mt-3"
          />
          <button onClick={handleSubmitReview} disabled={submitting} className="btn-primary mt-3">
            {submitting ? "Envoi..." : "Publier l'avis"}
          </button>
          {submitMessage && <p className="mt-2 text-sm text-ink-300">{submitMessage}</p>}
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-ink-500">Avis ({count})</p>
        {reviews.length === 0 ? (
          <p className="text-sm text-ink-300">Aucun avis pour l'instant.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.reviewer.name}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={13} className={n <= r.rating ? "text-ochre-500" : "text-sand-200"} fill={n <= r.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="mt-1 text-sm text-ink-400">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
