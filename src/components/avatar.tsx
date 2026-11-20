const GRADIENTS = [
  "from-pink-500 to-orange-400",
  "from-violet-500 to-fuchsia-400",
  "from-sky-500 to-indigo-500",
  "from-emerald-500 to-teal-400",
  "from-rose-500 to-red-400",
  "from-amber-500 to-pink-500",
];

function pick(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

/** Avatar provisório com a inicial do nome. Fotos geradas chegam na fase de imagens. */
export function Avatar({ name, url, size = "md" }: { name: string; url?: string | null; size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-24 text-4xl" : "size-14 text-2xl";
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={name} className={`${box} shrink-0 rounded-2xl object-cover`} />;
  }
  return (
    <div
      aria-hidden
      className={`${box} flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-semibold text-white ${pick(name)}`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}
