import Image from "next/image";

interface Props {
  className?: string;
  size?: number;
  alt: string;
  src?: string;
}

export function Logo({ src, size, className, alt }: Props) {
  return (
    <Image
      src={src ?? "/logo.png"}
      alt={alt}
      width={size ?? 40}
      height={size ?? 40}
      className={className}
    />
  );
}
