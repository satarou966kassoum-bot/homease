import { useEffect, useState } from "react";
import { Trash2, ArrowUp, ArrowDown, ImagePlus, Eye, EyeOff } from "lucide-react";
import { api } from "../../services/api";
import { uploadMedia } from "../../services/upload";

interface Banner {
  _id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  order: number;
  isActive: boolean;
}

export function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [error, setError] = useState("");

  function load() {
    api.get("/admin/banners").then((res) => setBanners(res.data.data.banners));
  }

  useEffect(() => {
    load();
    setIsLoading(false);
  }, []);

  async function handleUpload(file: File) {
    setError("");
    setIsUploading(true);
    try {
      const result = await uploadMedia(file);
      await api.post("/admin/banners", {
        imageUrl: result.url,
        title: title || undefined,
        subtitle: subtitle || undefined,
      });
      setTitle("");
      setSubtitle("");
      load();
    } catch {
      setError("Impossible d'ajouter cette bannière.");
    } finally {
      setIsUploading(false);
    }
  }

  async function toggleActive(banner: Banner) {
    await api.put(`/admin/banners/${banner._id}`, { isActive: !banner.isActive });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette bannière ?")) return;
    await api.delete(`/admin/banners/${id}`);
    load();
  }

  async function move(banner: Banner, direction: -1 | 1) {
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((b) => b._id === banner._id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;
    await Promise.all([
      api.put(`/admin/banners/${banner._id}`, { order: swapWith.order }),
      api.put(`/admin/banners/${swapWith._id}`, { order: banner.order }),
    ]);
    load();
  }

  if (isLoading) return <p className="text-sm text-ink-300">Chargement...</p>;

  return (
    <div>
      <div className="card p-5">
        <p className="text-sm font-semibold text-ink-500">Ajouter une bannière</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Titre (optionnel)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
          <input
            placeholder="Sous-titre (optionnel)"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="input-field"
          />
        </div>
        <label className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-sand-200 p-6 text-center hover:border-lagoon-500">
          <ImagePlus size={22} className="text-lagoon-500" />
          <span className="text-sm text-ink-400">
            {isUploading ? "Envoi en cours..." : "Choisir une image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </label>
        {error && <p className="mt-2 text-sm text-clay-600">{error}</p>}
      </div>

      <div className="mt-6 space-y-3">
        {banners.length === 0 ? (
          <p className="text-sm text-ink-300">Aucune bannière — l'accueil affichera le texte par défaut.</p>
        ) : (
          [...banners]
            .sort((a, b) => a.order - b.order)
            .map((b, i, arr) => (
              <div key={b._id} className="card flex items-center gap-4 p-3">
                <img src={b.imageUrl} alt="" className="h-16 w-24 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{b.title || "(sans titre)"}</p>
                  <p className="text-xs text-ink-300">{b.subtitle || "—"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => move(b, -1)} disabled={i === 0} className="btn-ghost h-8 w-8 p-0 disabled:opacity-30">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => move(b, 1)} disabled={i === arr.length - 1} className="btn-ghost h-8 w-8 p-0 disabled:opacity-30">
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => toggleActive(b)} className="btn-ghost h-8 w-8 p-0">
                    {b.isActive ? <Eye size={14} /> : <EyeOff size={14} className="text-ink-300" />}
                  </button>
                  <button onClick={() => remove(b._id)} className="btn-ghost h-8 w-8 p-0 text-clay-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
