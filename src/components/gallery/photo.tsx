import Image from "next/image";

export function CampusPhoto({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const classes = className ?? "object-cover";
  if (src.startsWith("data:")) {
    return <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${classes}`} />;
  }
  return <Image src={src} alt={alt} fill className={classes} />;
}
