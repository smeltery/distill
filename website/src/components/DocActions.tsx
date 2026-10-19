"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ArrowUp,
  ArrowUpRight,
  ChevronRight,
  Copy,
  Github,
  MessageSquare,
} from "lucide-react";
import { repository } from "@/lib/catalog";

const providers = [
  ["ChatGPT", "chatgpt", "https://chatgpt.com/?prompt="],
  ["Claude", "claude", "https://claude.ai/new?q="],
  ["v0", "v0", "https://v0.app/?q="],
  ["T3 Chat", "t3", "https://t3.chat/new?q="],
  ["Scira", "scira", "https://scira.ai/?q="],
  ["Cursor", "cursor", "https://cursor.com/link/prompt?text="],
];
export function DocActions({
  file,
  markdown,
}: {
  file: string;
  markdown: string;
}) {
  const [status, setStatus] = useState("");
  const prompt = encodeURIComponent(
    `Help me use Distill based on this documentation:\n\n${markdown}`,
  );
  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      setStatus("Copied");
    } catch {
      setStatus("Copy unavailable. Select the Markdown below to copy.");
    }
  }
  return (
    <div className="doc-actions">
      <a
        href={`${repository}/edit/master/docs/${file}.md`}
        target="_blank"
        rel="noreferrer"
      >
        <Github size={18} />
        Edit on GitHub
      </a>
      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          })
        }
      >
        <ArrowUp size={18} />
        Scroll to top
      </button>
      <button onClick={copyMarkdown}>
        <Copy size={18} />
        {status === "Copied" ? "Copied" : "Copy as Markdown"}
      </button>
      <span
        role="status"
        className={
          status.startsWith("Copy unavailable") ? "copy-error" : "sr-only"
        }
      >
        {status}
      </span>
      {status.startsWith("Copy unavailable") && (
        <textarea
          aria-label="Page Markdown"
          readOnly
          value={markdown}
          onFocus={(event) => event.target.select()}
        />
      )}
      <details>
        <summary>
          <MessageSquare size={18} />
          Open in chat
          <ChevronRight className="chat-chevron" size={14} />
        </summary>
        <div className="chat-links">
          {providers.map(([name, icon, url]) => (
            <a
              key={name}
              href={`${url}${prompt}`}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={`/brands/chat/${icon}.svg`}
                width={19}
                height={19}
                alt=""
              />
              <span>{name}</span>
              <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
        <p className="chat-note">
          Opens with this page’s documentation in the prompt.
        </p>
      </details>
    </div>
  );
}
