import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="Distill home">
      <Image src="/favicon.svg" alt="" width={32} height={32} />
      {compact ? (
        <strong>distill.</strong>
      ) : (
        <span>
          smeltery <span className="brand-sub">/ distill</span>
        </span>
      )}
    </Link>
  );
}
