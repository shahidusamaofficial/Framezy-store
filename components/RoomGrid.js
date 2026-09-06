import Link from "next/link";
import { Sofa, BedDouble, Baby, Briefcase, UtensilsCrossed } from "lucide-react";

const ROOM_ICONS = {
  "living-room": Sofa,
  bedroom: BedDouble,
  "kids-room": Baby,
  office: Briefcase,
  "dining-room": UtensilsCrossed,
};

export default function RoomGrid({ rooms }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="mb-10">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Shop by space</p>
        <h2 className="font-display text-3xl text-cream md:text-4xl">Find Frames for Your Room</h2>
        <p className="mt-2 max-w-xl text-sm text-cream/60">
          Not sure where to start? Browse by the room you're decorating instead of by style.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {rooms.map((room) => {
          const Icon = ROOM_ICONS[room.slug];
          return (
            <Link
              key={room.slug}
              href={`/shop?room=${room.slug}`}
              className="glass group flex flex-col items-center gap-3 rounded-2xl px-4 py-8 text-center transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-ink">
                {Icon && <Icon size={24} />}
              </span>
              <span className="font-display text-base text-cream">{room.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
