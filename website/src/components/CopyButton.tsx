"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
    } catch {
      setStatus("Copy unavailable. Select the text to copy.");
    }
  }
  return (
    <span className="copy-control">
      <button type="button" onClick={copy} aria-label={label}>
        {status === "Copied" ? <Check size={14} /> : <Copy size={14} />}{" "}
        {status === "Copied" ? "Copied" : label}
      </button>
      <span
        role="status"
        className={
          status.startsWith("Copy unavailable") ? "copy-error" : "sr-only"
        }
      >
        {status}
      </span>
    </span>
  );
}
