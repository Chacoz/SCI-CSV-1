// Affiche une photo si une URL est fournie, sinon un joli placeholder dégradé.

export function PhotoBox({
  src,
  alt,
  label,
  className = "",
}: {
  src?: string | null;
  alt?: string;
  label?: string;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ""} className={`object-cover ${className}`} />;
  }
  return (
    <div
      className={`photo-placeholder flex items-center justify-center ${className}`}
      aria-label={alt}
    >
      <span className="text-sm font-medium text-forest/50">{label ?? "Photo à venir"}</span>
    </div>
  );
}
