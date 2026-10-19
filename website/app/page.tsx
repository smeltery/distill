import Link from "next/link";
import {
  FileText,
  Layers,
  Terminal,
  GitBranch,
  Check,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/MarketingLayout";
import { CopyButton } from "@/components/CopyButton";
import { repository } from "@/lib/catalog";

export const metadata = { alternates: { canonical: "/" } };

const install = "go install github.com/smeltery/distill@latest";
export default function Page() {
  return (
    <>
      <MarketingNav />
      <main id="main" className="wrap">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> Knowledge, in its most useful form
            </p>
            <h1>
              Less context.
              <br />
              <em>More clarity.</em>
            </h1>
            <p className="hero-lead">
              Your best references. Your agent’s next instinct.
              <br className="desktop-break" /> Turn long-form Markdown into
              focused, reusable knowledge.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/docs/quick-start">
                Start distilling <ArrowRight size={18} />
              </Link>
              <Link className="text-link" href="/docs">
                Read the docs
              </Link>
            </div>
            <p className="hero-details">
              Plain Markdown <span>·</span> Your choice of agent <span>·</span>{" "}
              Built in Go
            </p>
          </div>
          <div
            className="distill-demo"
            aria-label="Example compaction from a guide to concise rules"
          >
            <div className="demo-title">
              <span className="eyebrow">
                Keep the knowledge. Lose the noise.
              </span>
              <Layers size={18} />
            </div>
            <div className="source-preview">
              <span>
                <FileText size={16} /> engineering-guide.md
              </span>
              <div className="document-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="demo-command">
              <Terminal size={17} />
              <code>distill guide --token-budget 2000</code>
              <span className="demo-note">Illustration</span>
            </div>
            <div className="output-preview">
              <div>
                <span className="status-dot" /> guide-minified.md{" "}
                <span>Markdown</span>
              </div>
              <h3>Good decisions, distilled.</h3>
              <p>
                <b>01</b> Keep functions focused on one responsibility.
              </p>
              <p>
                <b>02</b> Handle errors where you have the context.
              </p>
              <p>
                <b>03</b> Make the important assumptions explicit.
              </p>
            </div>
            <div className="demo-footer">
              <Check size={15} /> Ready to review. Ready to reuse.
            </div>
          </div>
        </section>
        <div className="benefit-strip">
          <span>
            Smaller files.
            <br />
            <strong>Clearer thinking.</strong>
          </span>
          <span>
            <FileText /> Markdown in, Markdown out
          </span>
          <span>
            <Layers /> Four focused templates
          </span>
          <span>
            <GitBranch /> Context you can version
          </span>
        </div>
        <section id="features" className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A place for what matters</p>
              <h2>
                Give your agent
                <br />
                <em>something worth knowing.</em>
              </h2>
            </div>
            <p>
              Bring the material you trust.
              <br />
              Shape it for the work ahead.
            </p>
          </div>
          <div className="feature-grid">
            <article>
              <FileText />
              <h3>Start with your sources.</h3>
              <p>
                A team handbook. A framework guide. A folder of notes. Register
                local Markdown and keep its origin clear.
              </p>
              <Link href="/docs/sources">Working with sources</Link>
            </article>
            <article>
              <Layers />
              <h3>Choose the right shape.</h3>
              <p>
                Rules for how to work. Principles for how to think. Patterns for
                problems you see again. Or keep things close to the source.
              </p>
              <Link href="/docs/templates">Explore the templates</Link>
            </article>
            <article>
              <Terminal />
              <h3>Use the agent you know.</h3>
              <p>
                Call Claude or Codex from your terminal, or connect an Anthropic
                or OpenAI API provider. Keep your workflow familiar.
              </p>
              <Link href="/docs/agents">Connect your agent</Link>
            </article>
          </div>
        </section>
        <section id="how-it-works" className="workflow section">
          <div>
            <p className="eyebrow">A small, repeatable ritual</p>
            <h2>
              From reference
              <br />
              to <em>ready to use.</em>
            </h2>
            <p>
              One source, one template, one command.
              <br />
              Review what comes out, then put it to work.
            </p>
            <Link className="text-link" href="/docs/quick-start">
              Follow the quick start
            </Link>
          </div>
          <ol className="steps">
            <li>
              <span>01</span>
              <div>
                <h3>Add a source.</h3>
                <p>Point Distill at a Markdown file or directory.</p>
                <code>distill add markdown ./guide.md --name guide</code>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Distill what matters.</h3>
                <p>Your configured agent compacts the source.</p>
                <code>distill guide --token-budget 2000</code>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Review. Share. Repeat.</h3>
                <p>
                  Read the result, check it against the original, and add it to
                  your agent’s context.
                </p>
                <code>output/guide/guide-minified.md</code>
              </div>
            </li>
          </ol>
        </section>
        <section id="use-cases" className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The shape of useful knowledge</p>
              <h2>A format for the task.</h2>
            </div>
            <Link className="text-link" href="/docs/templates">
              Template guide
            </Link>
          </div>
          <div className="template-grid">
            {[
              [
                "rules",
                "Do the right thing.",
                "Framework conventions and team practices.",
              ],
              [
                "principles",
                "Understand the why.",
                "Core ideas behind technical decisions.",
              ],
              [
                "patterns",
                "Recognize the problem.",
                "Reusable solutions and their trade-offs.",
              ],
              [
                "raw",
                "Keep the essentials.",
                "Lighter compaction, familiar structure.",
              ],
            ].map(([name, title, description]) => (
              <Link key={name} href={`/docs/templates#choose-a-format`}>
                <span className="eyebrow">{name}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </Link>
            ))}
          </div>
        </section>
        <section id="paper" className="research">
          <BookOpen size={26} />
          <div>
            <h3>Built around a simple idea.</h3>
            <p>
              Knowledge should travel well. Read the design behind
              template-driven compaction, and what’s implemented today.
            </p>
          </div>
          <a className="text-link" href={`${repository}/blob/master/PAPER.md`}>
            Read the paper
          </a>
        </section>
        <section id="quick-start" className="closing section">
          <p className="eyebrow">Your next useful document starts here</p>
          <h2>
            Make room for
            <br />
            <em>what matters.</em>
          </h2>
          <div className="install-command">
            <code>{install}</code>
            <CopyButton text={install} label="Copy command" />
          </div>
          <p>Have Go installed? You’re one command closer.</p>
          <Link className="text-link" href="/docs/quick-start">
            Installation & first steps
          </Link>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
