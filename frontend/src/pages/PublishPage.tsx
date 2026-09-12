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
    price: "",
    category: "appartement",
    transactionType: "location",
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
      <div className="page-container section text-center">
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
    <div className="page-container section max-w-2xl">
      <h1 className="font-display text-2xl font-medium">Publier une annonce</h1>
      <p className="mt-1 text-sm text-ink-300">
        Votre annonce sera visible après validation par un administrateur.
      </p>

      {success && (
        <p className="mt-4 rounded-lg border border-lagoon-500/30 bg-lagoon-50 px-4 py-3 text-sm text-lagoon-600">
          Annonce publiée avec succès. Statut : en attente de validation.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-clay-500/30 bg-clay-500/5 px-4 py-3 text-sm text-clay-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {/* 1. Nom de l'article */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Titre de l'annonce</label>
          <input
            required
            placeholder="Ex : Appartement moderne 3 chambres à Fidjrossè"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="input-field"
          />
        </div>

        {/* 2. Photos et vidéos */}
        <MediaUploader
          photos={photos}
          videos={videos}
          onChange={(media) => {
            setPhotos(media.photos);
            setVideos(media.videos);
          }}
        />

        {/* 3. Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Description</label>
          <textarea
            required
            placeholder="Décrivez le bien : atouts, environnement, équipements..."
            rows={5}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="input-field"
          />
        </div>

        {/* 4. Prix */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Prix (FCFA)</label>
          <input
            required
            type="number"
            placeholder="Ex : 250000"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="input-field"
          />
        </div>

        <div className="border-t border-sand-200 pt-6">
          <p className="mb-4 text-sm font-semibold text-ink-500">Détails du bien</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Type de bien</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="input-field"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Transaction</label>
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
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
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

          <label className="mt-3 flex items-center gap-2 text-sm text-ink-400">
            <input
              type="checkbox"
              checked={form.furnished}
              onChange={(e) => update("furnished", e.target.checked)}
            />
            Bien meublé
          </label>
        </div>

        <div className="border-t border-sand-200 pt-6">
          <p className="mb-4 text-sm font-semibold text-ink-500">Localisation</p>
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
            className="input-field mt-3"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 text-base">
          {isSubmitting ? "Publication..." : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
}
