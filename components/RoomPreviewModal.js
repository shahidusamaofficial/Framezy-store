"use client";

import { useRef, useState, useCallback } from "react";
import { X, Upload, RotateCw, RefreshCw } from "lucide-react";

const BASE_WIDTH = 160; // px, before scale is applied

export default function RoomPreviewModal({ product, onClose }) {
  const containerRef = useRef(null);
  const [roomUrl, setRoomUrl] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const dragState = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRoomUrl(url);
  }

  function handleRoomImageLoad() {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setPos({ x: rect.width / 2, y: rect.height / 2 });
    setScale(1);
    setRotation(0);
  }

  function getCenter() {
    const rect = containerRef.current?.getBoundingClientRect();
    return {
      x: rect.left + pos.x,
      y: rect.top + pos.y,
    };
  }

  const onPointerMove = useCallback((e) => {
    const drag = dragState.current;
    if (!drag) return;

    if (drag.mode === "move") {
      const containerRect = containerRef.current.getBoundingClientRect();
      setPos({
        x: drag.startX + (e.clientX - drag.startPointerX),
        y: drag.startY + (e.clientY - drag.startPointerY),
      });
    } else if (drag.mode === "resize") {
      const dist = Math.hypot(e.clientX - drag.centerX, e.clientY - drag.centerY);
      const nextScale = Math.max(0.3, Math.min(4, drag.startScale * (dist / drag.startDist)));
      setScale(nextScale);
    } else if (drag.mode === "rotate") {
      const angle = Math.atan2(e.clientY - drag.centerY, e.clientX - drag.centerX);
      const deltaDeg = (angle - drag.startAngle) * (180 / Math.PI);
      setRotation(drag.startRotation + deltaDeg);
    }
  }, []);

  const onPointerUp = useCallback(() => {
    dragState.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerMove]);

  function startDrag(mode, e) {
    e.preventDefault();
    e.stopPropagation();
    const center = getCenter();

    if (mode === "move") {
      dragState.current = {
        mode,
        startPointerX: e.clientX,
        startPointerY: e.clientY,
        startX: pos.x,
        startY: pos.y,
      };
    } else if (mode === "resize") {
      dragState.current = {
        mode,
        centerX: center.x,
        centerY: center.y,
        startDist: Math.hypot(e.clientX - center.x, e.clientY - center.y),
        startScale: scale,
      };
    } else if (mode === "rotate") {
      dragState.current = {
        mode,
        centerX: center.x,
        centerY: center.y,
        startAngle: Math.atan2(e.clientY - center.y, e.clientX - center.x),
        startRotation: rotation,
      };
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  function reset() {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setPos({ x: rect.width / 2, y: rect.height / 2 });
    setScale(1);
    setRotation(0);
  }

  function changePhoto() {
    setRoomUrl(null);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm">
      <div className="glass-dark relative w-full max-w-2xl rounded-2xl border border-white/10 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-cream">See it on your wall</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 text-cream/70 hover:text-cream">
            <X size={20} />
          </button>
        </div>

        {!roomUrl ? (
          <label className="flex h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/20 text-cream/60 transition hover:border-gold/50 hover:text-cream">
            <Upload size={28} />
            <span className="text-sm">Upload a photo of your wall</span>
            <span className="text-xs text-cream/40">Stays on your device — never uploaded anywhere</span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        ) : (
          <>
            <div
              ref={containerRef}
              className="relative mx-auto max-h-[60vh] w-full touch-none overflow-hidden rounded-xl bg-black/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={roomUrl}
                alt="Your wall"
                onLoad={handleRoomImageLoad}
                className="pointer-events-none block max-h-[60vh] w-full select-none object-contain"
              />

              <div
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  onPointerDown={(e) => startDrag("move", e)}
                  draggable={false}
                  style={{ width: BASE_WIDTH * scale, height: "auto" }}
                  className="cursor-move select-none rounded-sm shadow-2xl"
                />

                <button
                  onPointerDown={(e) => startDrag("rotate", e)}
                  aria-label="Rotate"
                  className="absolute -top-7 left-1/2 flex h-6 w-6 -translate-x-1/2 cursor-grab items-center justify-center rounded-full bg-gold text-ink shadow-lift active:cursor-grabbing"
                >
                  <RotateCw size={13} />
                </button>

                <button
                  onPointerDown={(e) => startDrag("resize", e)}
                  aria-label="Resize"
                  className="absolute -bottom-2 -right-2 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-ink bg-gold shadow-lift"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-cream/50">
                Drag the frame to move · gold dot to resize · top handle to rotate
              </p>
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-cream/70 hover:text-cream"
                >
                  <RefreshCw size={12} /> Reset
                </button>
                <button
                  onClick={changePhoto}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-cream/70 hover:text-cream"
                >
                  Change Photo
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
