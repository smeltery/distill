"use client";
import { ArrowUp, Github, MessageSquare } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { repository } from "@/lib/catalog";

export function DocActions({
  file,
  markdown,
}: {
  file: string;
  markdown: string;
}) {
  const source = `${repository}/blob/master/docs/${file}.md`;
  const prompt = encodeURIComponent(
    `Help me use Distill based on this documentation: ${source}`,
  );
  return (
    <div className="doc-actions">
      <a href={`${repository}/edit/master/docs/${file}.md`}>
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
      <CopyButton text={markdown} label="Copy as Markdown" />
      <details>
        <summary>
          <MessageSquare size={18} />
          Open in chat
        </summary>
        <div className="chat-links">
          <a href={`https://chatgpt.com/?prompt=${prompt}`}>ChatGPT</a>
          <a href={`https://claude.ai/new?q=${prompt}`}>Claude</a>
          <a href={`https://cursor.com/link/prompt?text=${prompt}`}>Cursor</a>
        </div>
      </details>
    </div>
  );
}
