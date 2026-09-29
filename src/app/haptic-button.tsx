"use client";

import { useRef, type MouseEvent, type PointerEvent } from "react";

type Props = {
  label: string;
  // タップ位置（ビューポート座標）を渡す
  onTap: (point: { x: number; y: number }) => void;
};

export function HapticButton({ label, onTap }: Props) {
  const origin = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    origin.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // キーボード操作などポインタ位置がない場合はボタン中央から
    onTap(
      origin.current ?? {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
    );
    origin.current = null;
  };

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className="h-24 touch-manipulation select-none rounded-2xl bg-foreground text-base font-medium text-background shadow-lg transition-transform active:scale-95 [-webkit-tap-highlight-color:transparent]"
    >
      {label}
    </button>
  );
}
