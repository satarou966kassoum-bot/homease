import { useEffect, useRef, useState } from "react";

interface Banner {
  _id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
}

export function HeroBannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 3000);
    return () => clearTimeout(timerRef.current);
  }, [index, banners.length]);

  const active = banners[index];

  return (
    <div className="relative h-72 w-full overflow-hidden sm:h-[26rem]">
      {banners.map((b, i) => (
        <img
          key={b._id}
          src={b.imageUrl}
          alt={b.title || "HomeEase"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/45" />

      <div className="page-container relative flex h-full flex-col justify-end pb-16 sm:pb-20">
        <h1 className="max-w-xl font-display text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
          {active?.title || "Trouvez votre prochain chez-vous."}
        </h1>
        <p className="mt-4 max-w-md text-base text-sand-100">
          {active?.subtitle || "Explorez des logements, terrains et biens immobiliers au Bénin."}
        </p>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
