import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { categoryLabels } from "../utils/format";
import { MediaUploader } from "../components/listings/MediaUploader";

export function PublishPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "appartement",
    transactionType: "location",
    price: "",
    city: "",
    neighborhood: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    surfaceM2: "",
    furnished: false,
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || (user.role !== "owner" && user.role !== "admin")) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="text-xl font-medium">Réservé aux propriétaires</h1>
        <p className="mt-2 text-sm text-ink-300">
          Créez un compte "Je publie des annonces" pour publier un bien sur HomeEase.
        </p>
      </div>
    );
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/listings", {
        ...form,
        price: Number(form.price),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        surfaceM2: form.surfaceM2 ? Number(form.surfaceM2) : undefined,
        photos,
        videos,
      });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/listings"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de publier l'annonce.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-2xl font-medium">Publier une annonce</h1>
      <p className="mt-1 text-sm text-ink-300">
        Votre annonce sera visible après validation par un administrateur.
      </p>

      {success && (
        <p className="mt-4 rounded border border-lagoon-500/30 bg-lagoon-50 px-4 py-3 text-sm text-lagoon-600">
          Annonce publiée avec succès. Statut : en attente de validation.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded border border-clay-500/30 bg-clay-500/5 px-4 py-3 text-sm text-clay-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          required
          placeholder="Titre de l'annonce"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="input-field"
        />

        <textarea
          required
          placeholder="Description détaillée"
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="input-field"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="input-field"
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={form.transactionType}
            onChange={(e) => update("transactionType", e.target.value)}
            className="input-field"
          >
            <option value="location">Location</option>
            <option value="vente">Vente</option>
            <option value="reservation">Réservation</option>
          </select>
        </div>

        <input
          required
          type="number"
          placeholder="Prix (FCFA)"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
          className="input-field"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Ville"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className="input-field"
          />
          <input
            required
            placeholder="Quartier"
            value={form.neighborhood}
            onChange={(e) => update("neighborhood", e.target.value)}
            className="input-field"
          />
        </div>

        <input
          placeholder="Adresse approximative (optionnel)"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          className="input-field"
        />

        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="Chambres"
            value={form.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Salles de bain"
            value={form.bathrooms}
            onChange={(e) => update("bathrooms", e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Surface (m²)"
            value={form.surfaceM2}
            onChange={(e) => update("surfaceM2", e.target.value)}
            className="input-field"
          />
        </div>

        <MediaUploader
          photos={photos}
          videos={videos}
          onChange={(media) => {
            setPhotos(media.photos);
            setVideos(media.videos);
          }}
        />

        <label className="flex items-center gap-2 text-sm text-ink-400">
          <input
            type="checkbox"
            checked={form.furnished}
            onChange={(e) => update("furnished", e.target.checked)}
          />
          Bien meublé
        </label>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Publication..." : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
}
