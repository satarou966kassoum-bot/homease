import { api } from "./api";

export interface UploadedMedia {
  url: string;
  type: "image" | "video" | "audio";
}

export function uploadMedia(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedMedia> {
  return api.get("/uploads/signature").then(({ data }) => {
    const { timestamp, folder, signature, apiKey, cloudName } = data.data;
    const isAudio = file.type.startsWith("audio");
    const isVideo = file.type.startsWith("video");
    // Cloudinary regroupe audio et vidéo sous le même "resource_type": video.
    const cloudinaryResourceType: "image" | "video" = isVideo || isAudio ? "video" : "image";
    const mediaType: UploadedMedia["type"] = isAudio ? "audio" : isVideo ? "video" : "image";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);

    return new Promise<UploadedMedia>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${cloudinaryResourceType}/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const res = JSON.parse(xhr.responseText);
          resolve({ url: res.secure_url, type: mediaType });
        } else {
          reject(new Error("Échec de l'envoi du fichier vers Cloudinary."));
        }
      };

      xhr.onerror = () => reject(new Error("Erreur réseau pendant l'envoi du fichier."));
      xhr.send(formData);
    });
  });
}
