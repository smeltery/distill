"use client";
import { useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  BookOpen,
  Compass,
  Layers,
  FileText,
  Terminal,
  Share2,
  Github,
} from "lucide-react";
import { Brand } from "./Brand";
import { Search } from "./Search";
import { repository } from "@/lib/catalog";

export function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();
  return (
    <>
      <button
        className="menu-toggle"
        aria-label="Menu"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        Menu <Menu size={18} />
      </button>
      <dialog
        ref={dialog}
        className="mobile-dialog"
        aria-labelledby="mobile-title"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) close();
        }}
      >
        <div className="mobile-panel-heading">
          <Brand />
          <button
            autoFocus
            className="close-overlay"
            aria-label="Close navigation"
            onClick={close}
          >
            <X size={22} />
          </button>
        </div>
        <div className="mobile-panel-body">
          <p className="eyebrow">A little context goes a long way</p>
          <h2 id="mobile-title">What’s next?</h2>
          <Search full />
          <nav className="mobile-primary" aria-label="Mobile navigation">
            <Link className="mobile-feature-card" href="/docs">
              <span className="nav-card-icon">
                <Layers size={20} />
              </span>
              <span>
                <strong>Explore Distill</strong>
                <small>Useful knowledge for the work ahead.</small>
              </span>
              <span className="nav-count">10</span>
            </Link>
            <div className="mobile-resource-grid">
              <Link href="/docs/quick-start">
                <BookOpen size={21} />
                <strong>Getting started</strong>
                <small>From install to your first document.</small>
              </Link>
              <Link href="/docs">
                <Compass size={21} />
                <strong>Our approach</strong>
                <small>Better context, written down.</small>
              </Link>
            </div>
          </nav>
          <section
            className="mobile-tasks"
            aria-labelledby="mobile-tasks-title"
          >
            <div className="mobile-section-label">
              <h3 id="mobile-tasks-title">Browse by task</h3>
              <span>Start with an outcome</span>
            </div>
            <nav aria-label="Documentation topics">
              {[
                [FileText, "Add your sources", "sources"],
                [Layers, "Choose a template", "templates"],
                [Terminal, "Connect an agent", "agents"],
                [Share2, "Share your context", "sharing"],
              ].map(([Icon, title, slug]) => {
                const Glyph = Icon as typeof FileText;
                return (
                  <Link key={String(slug)} href={`/docs/${slug}`}>
                    <span className="nav-card-icon">
                      <Glyph size={19} />
                    </span>
                    <span>{String(title)}</span>
                    <small>Guide</small>
                  </Link>
                );
              })}
            </nav>
          </section>
          <aside className="mobile-starter">
            <p className="eyebrow">Not sure where to begin?</p>
            <h3>One good document is a start.</h3>
            <p>
              Turn a guide you already trust into context your agent can use.
            </p>
            <Link href="/docs/quick-start">Try the quick start</Link>
          </aside>
        </div>
        <div className="mobile-panel-footer">
          <a href={repository} className="icon-link">
            <Github size={18} /> GitHub
          </a>
          <a href={`${repository}/issues`}>Feedback & issues</a>
          <span className="mobile-footer-note">Made to fit your day.</span>
        </div>
      </dialog>
    </>
  );
}
