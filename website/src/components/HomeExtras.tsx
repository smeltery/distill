"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Terminal, KeyRound } from "lucide-react";
import { CopyButton } from "./CopyButton";

const templates = [
  {
    name: "rules",
    title: "Tell your agent what to do.",
    description: "Turn team conventions into direct, actionable instructions.",
    output:
      "# Error handling\n\n1. Add context when returning an error.\n2. Keep the original cause available.\n3. Log once, at the application boundary.",
  },
  {
    name: "principles",
    title: "Keep the reasoning close.",
    description:
      "Preserve the ideas behind a decision, so they travel to new situations.",
    output:
      "# Errors carry context\n\nAn error is useful when it explains what failed\nand preserves why. Keep that chain intact so\nthe caller can choose how to recover.",
  },
  {
    name: "patterns",
    title: "Recognize a problem. Reuse a solution.",
    description:
      "Capture the problem, approach, and trade-off in a familiar shape.",
    output:
      "# Wrap at the boundary\n\nProblem: a low-level error loses its context.\nSolution: wrap it with the operation that failed.\nTrade-off: useful context without duplicate logs.",
  },
  {
    name: "raw",
    title: "Keep the shape. Trim the noise.",
    description:
      "A lighter pass for material that already has a useful structure.",
    output:
      "# Error handling\n\nWrap errors with operation context and retain\nthe original cause. Let callers choose recovery.\nLog at the boundary to avoid duplicate entries.",
  },
];
export function TemplateExplorer() {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const template = templates[selected];
  return (
    <section className="section template-explorer" id="use-cases">
      <div className="section-heading">
        <div>
          <p className="eyebrow">The shape of useful knowledge</p>
          <h2>
            Same source.
            <br />
            <em>A different kind of useful.</em>
          </h2>
        </div>
        <p>
          Choose a template to explore the result.
          <br />
          Illustrative examples, not a live model call.
        </p>
      </div>
      <div
        className="template-tabs"
        role="tablist"
        aria-label="Compaction template"
      >
        {templates.map((item, index) => (
          <button
            key={item.name}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            role="tab"
            id={`tab-${item.name}`}
            aria-controls="template-result"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
              if (!keys.includes(event.key)) return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? 3
                    : (index + (event.key === "ArrowRight" ? 1 : 3)) % 4;
              setSelected(next);
              buttons.current[next]?.focus();
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div
        className="template-example"
        id="template-result"
        role="tabpanel"
        aria-labelledby={`tab-${template.name}`}
        tabIndex={0}
      >
        <div className="example-source">
          <p className="eyebrow">Source / engineering-guide.md</p>
          <h3>Error handling</h3>
          <p>
            When an operation fails, it is tempting to return the error exactly
            as you received it. But a caller often needs to know which operation
            failed, too. Wrap the error with that context, preserve its original
            cause, and let the caller decide how to recover. Logging in every
            layer produces duplicate entries; prefer logging once at the
            application boundary.
          </p>
          <span>One reference. Four ways to carry it forward.</span>
        </div>
        <div className="example-output">
          <div className="example-label">
            <span>{template.name} / example output</span>
            <CopyButton text={template.output} label="Copy example" />
          </div>
          <pre>{template.output}</pre>
          <h3>{template.title}</h3>
          <p>{template.description}</p>
        </div>
      </div>
      <Link className="text-link" href="/docs/templates">
        Choose or write your own template
      </Link>
    </section>
  );
}
export function AgentChoices() {
  const [mode, setMode] = useState("cli");
  return (
    <section className="section agent-choices" id="agents">
      <div>
        <p className="eyebrow">Fits the way you work</p>
        <h2>
          Your sources.
          <br />
          <em>Your choice of agent.</em>
        </h2>
        <p>
          Start with an authenticated CLI, or configure a provider API. Distill
          handles the prompt and saves the result as Markdown.
        </p>
        <div
          className="agent-switch"
          role="group"
          aria-label="Agent connection"
        >
          <button aria-pressed={mode === "cli"} onClick={() => setMode("cli")}>
            <Terminal size={16} />
            Local CLI
          </button>
          <button aria-pressed={mode === "api"} onClick={() => setMode("api")}>
            <KeyRound size={16} />
            Provider API
          </button>
        </div>
        <Link className="text-link" href="/docs/agents">
          Agent setup & configuration
        </Link>
      </div>
      <div className="agent-choice-panel" aria-live="polite">
        <div className="provider-marks">
          <Image
            src="/brands/chat/claude.svg"
            width={26}
            height={26}
            alt="Claude"
          />
          <Image
            src="/brands/chat/chatgpt.svg"
            width={26}
            height={26}
            alt="OpenAI"
          />
        </div>
        <h3>
          {mode === "cli"
            ? "Already set up? Start there."
            : "Choose a model for the job."}
        </h3>
        <p>
          {mode === "cli"
            ? "Use Claude Code or Codex on your PATH. Authenticate with the CLI first, then choose its configured agent name."
            : "Connect Anthropic or OpenAI using an environment variable. Set the model and response limit in your project configuration."}
        </p>
        <code>
          {mode === "cli"
            ? "distill guide --agent codex-cli"
            : "distill guide --agent my-api"}
        </code>
        <p className="agent-footnote">
          {mode === "cli"
            ? "Claude CLI is the default. Source content is sent through the selected CLI to its provider."
            : "Create the my-api configuration before running this command. Requests use your provider account and may incur charges."}
        </p>
      </div>
    </section>
  );
}
export function HomeFAQ() {
  return (
    <section className="section home-faq" id="questions">
      <div>
        <p className="eyebrow">Before you begin</p>
        <h2>
          A few useful
          <br />
          <em>things to know.</em>
        </h2>
        <Link className="text-link" href="/docs">
          Explore the documentation
        </Link>
      </div>
      <div>
        {[
          [
            "What can I distill today?",
            "Local Markdown files and the immediate Markdown files in a directory. PDF, EPUB, URL, Notion, and GitHub ingestion are planned, but are not implemented yet.",
          ],
          [
            "Does my source stay on my machine?",
            "Distill reads and writes files locally, but sends source content and template instructions to your selected agent provider for compaction. Choose sources and a provider appropriate for your material.",
          ],
          [
            "Is the token budget a hard limit?",
            "No. It is a target included in each chunk’s prompt. A directory can produce several chunks, so the final combined file may exceed that target. Review the result before using it as context.",
          ],
          [
            "How do I use the result with my agent?",
            "Read the generated Markdown, check it against the original, and place the reviewed file in your agent’s context workflow. You can also version it in Git and share it with your team.",
          ],
          [
            "Will updating skip unchanged sources?",
            "Not yet. Update reprocesses sources and replaces their generated files. Use a dry run to inspect the input, and keep reviewed output in version control so you can compare changes.",
          ],
        ].map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <ChevronDown size={18} />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
