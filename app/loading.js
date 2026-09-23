import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Image
        src="/brand/icon@2x.png"
        alt=""
        width={44}
        height={48}
        className="h-10 w-auto animate-pulse"
      />
      <div className="flex gap-1.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" />
      </div>
    </div>
  );
}
