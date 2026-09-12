import { useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { uploadMedia } from "../../services/upload";

interface Props {
  photos: string[];
  videos: string[];
  onChange: (media: { photos: string[]; videos: string[] }) => void;
}

interface PendingUpload {
  id: string;
  name: string;
  progress: number;
}

export function MediaUploader({ photos, videos, onChange }: Props) {
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    setError("");
    const files = Array.from(fileList);

    // On accumule localement pour ne pas écraser les fichiers précédents :
    // "photos"/"videos" (props) ne se mettent à jour qu'au prochain rendu,
    // donc on ne peut pas s'y fier entre deux itérations de la boucle.
    let currentPhotos = [...photos];
    let currentVideos = [...videos];

    for (const file of files) {
      const isVideo = file.type.startsWith("video");
      const maxMB = isVideo ? 50 : 8;
      if (file.size > maxMB * 1024 * 1024) {
        setError(`"${file.name}" dépasse la taille maximale de ${maxMB} Mo.`);
        continue;
      }

      const id = `${file.name}-${Date.now()}`;
      setPending((p) => [...p, { id, name: file.name, progress: 0 }]);

      try {
        const result = await uploadMedia(file, (percent) => {
          setPending((p) => p.map((u) => (u.id === id ? { ...u, progress: percent } : u)));
        });

        if (result.type === "video") {
          currentVideos = [...currentVideos, result.url];
        } else {
          currentPhotos = [...currentPhotos, result.url];
        }
        onChange({ photos: currentPhotos, videos: currentVideos });
      } catch (err: any) {
        setError(err.message || "Échec de l'envoi.");
      } finally {
        setPending((p) => p.filter((u) => u.id !== id));
      }
    }
  }

  function removePhoto(url: string) {
    onChange({ photos: photos.filter((p) => p !== url), videos });
  }

  function removeVideo(url: string) {
    onChange({ photos, videos: videos.filter((v) => v !== url) });
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Photos et vidéos</label>

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-sand-200 p-6 text-center hover:border-lagoon-500">
        <ImagePlus size={22} className="text-lagoon-500" />
        <span className="text-sm text-ink-400">
          Ajouter des photos (max 8 Mo) ou vidéos (max 50 Mo)
        </span>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="mt-2 text-sm text-clay-600">{error}</p>}

      {pending.length > 0 && (
        <div className="mt-3 space-y-2">
          {pending.map((p) => (
            <div key={p.id} className="flex items-center gap-2 text-sm text-ink-300">
              <Loader2 size={14} className="animate-spin" />
              <span className="flex-1 truncate">{p.name}</span>
              <span>{p.progress}%</span>
            </div>
          ))}
        </div>
      )}

      {(photos.length > 0 || videos.length > 0) && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded border border-sand-200">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {videos.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded border border-sand-200 bg-ink-500">
              <video src={url} className="h-full w-full object-cover" muted />
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                Vidéo
              </span>
              <button
                type="button"
                onClick={() => removeVideo(url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
