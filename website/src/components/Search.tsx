"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, X, BookOpen } from "lucide-react";
import { pages, docHref } from "@/lib/catalog";

export function Search({ full = false }: { full?: boolean }) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("Everything");
  const results = pages.filter(
    (page) =>
      `${page.title} ${page.description}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (scope === "Everything" || page.group === scope),
  );
  function open() {
    dialog.current?.showModal();
    input.current?.focus();
  }
  function close() {
    dialog.current?.close();
  }
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  return (
    <>
      <button
        type="button"
        className={full ? "mobile-search-trigger" : "header-search-trigger"}
        onClick={open}
        aria-label="Search documentation"
        aria-haspopup="dialog"
      >
        <SearchIcon size={18} />
        <span>{full ? "Search docs & guides" : "Search"}</span>
        <kbd>⌘ K</kbd>
      </button>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="overlay-heading">
          <div>
            <p className="eyebrow">The Distill documentation</p>
            <h2 id={titleId}>Find your next step.</h2>
          </div>
          <button
            className="close-overlay"
            onClick={close}
            aria-label="Close search"
          >
            <X size={22} />
          </button>
        </div>
        <div className="panel-search">
          <SearchIcon size={20} />
          <label
            className="sr-only"
            htmlFor={full ? "menu-search" : "site-search"}
          >
            Search documentation
          </label>
          <input
            ref={input}
            id={full ? "menu-search" : "site-search"}
            type="search"
            placeholder="Search commands, agents, or guides…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                dialog.current
                  ?.querySelector<HTMLAnchorElement>(".search-result")
                  ?.focus();
              }
            }}
          />
        </div>
        <div className="search-scopes" role="group" aria-label="Search within">
          {["Everything", "Guides", "Reference"].map((item) => (
            <button
              key={item}
              aria-pressed={scope === item}
              onClick={() => setScope(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="search-results-scroll">
          <nav
            aria-label="Search results"
            onKeyDown={(event) => {
              const links = [...event.currentTarget.querySelectorAll("a")];
              const index = links.indexOf(
                document.activeElement as HTMLAnchorElement,
              );
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                links[
                  (index +
                    (event.key === "ArrowDown" ? 1 : -1) +
                    links.length) %
                    links.length
                ]?.focus();
              }
            }}
          >
            {results.map((page) => (
              <Link
                className="search-result"
                key={page.file}
                href={docHref(page.slug)}
                onClick={close}
              >
                <span className="result-icon">
                  <BookOpen size={18} />
                </span>
                <span className="result-copy">
                  <strong>{page.title}</strong>
                  <small>{page.description}</small>
                </span>
                <span className="result-kind">{page.group}</span>
              </Link>
            ))}
          </nav>
          {!results.length && (
            <div className="search-no-results">
              <h3>No matches this time.</h3>
              <p>Try “agent”, “template”, or “install”.</p>
              <button
                className="button secondary"
                onClick={() => {
                  setQuery("");
                  setScope("Everything");
                  input.current?.focus();
                }}
              >
                Reset search
              </button>
            </div>
          )}
        </div>
        <div className="search-panel-footer">
          <span role="status">{results.length} results</span>
          <span>↑ ↓ Move · Enter Open · Esc Close</span>
        </div>
      </dialog>
    </>
  );
}
