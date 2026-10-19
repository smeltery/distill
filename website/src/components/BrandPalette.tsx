"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
const colors = [
  ["Slate", "#1a1d29", "A quiet foundation for focused work."],
  ["Cream", "#fefdfb", "Warm, readable words on a dark canvas."],
  ["Purple", "#8b5cf6", "The original accent. A little character."],
  ["Lavender", "#b69bfa", "Clear links and details on dark surfaces."],
  ["Surface", "#222635", "A subtle lift for cards and previews."],
];
export function BrandPalette() {
  const [copied, setCopied] = useState("");
  const [status, setStatus] = useState("");
  async function copy(name: string, hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setStatus(`${name} copied: ${hex}`);
    } catch {
      setCopied("");
      setStatus(`Copy unavailable. Select and copy this value: ${hex}`);
    }
  }
  return (
    <>
      <div className="brand-colors">
        {colors.map(([name, hex, description]) => (
          <article key={name}>
            <button
              className="swatch"
              onClick={() => copy(name, hex)}
              aria-label={`Copy ${name} hex ${hex}`}
            >
              <span
                className="color-chip"
                style={{ background: hex }}
                aria-hidden="true"
              />
              <span className="swatch-label">
                <strong>{name}</strong>
                <code>{copied === hex ? "Copied" : hex}</code>
                {copied === hex ? <Check size={14} /> : <Copy size={14} />}
              </span>
            </button>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <p
        role="status"
        className={
          status.startsWith("Copy unavailable") ? "copy-error" : "sr-only"
        }
      >
        {status}
      </p>
    </>
  );
}
