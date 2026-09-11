import { useState } from "react";

interface Props {
  src?: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <img
      src={showFallback ? "/placeholder-property.jpg" : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
