"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import RoomPreviewModal from "@/components/RoomPreviewModal";

export default function RoomPreviewButton({ product }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 py-3 text-sm font-semibold text-gold transition hover:bg-gold hover:text-ink"
      >
        <Home size={16} />
        See it on your wall
      </button>

      {open && <RoomPreviewModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
