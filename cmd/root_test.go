package cmd

import (
	"bytes"
	"github.com/smeltery/distill/internal/config"
	"os"
	"strings"
	"testing"
)

func TestAvailableSources_Empty(t *testing.T) {
	cfg := &config.Config{Sources: map[string]config.Source{}}
	got := availableSources(cfg)
	if got != "none (add sources to distill.yaml)" {
		t.Errorf("expected 'none' message, got %q", got)
	}
}

func TestAvailableSources_WithSources(t *testing.T) {
	cfg := &config.Config{Sources: map[string]config.Source{
		"alpha": {},
		"beta":  {},
	}}
	got := availableSources(cfg)
	if len(got) == 0 {
		t.Error("expected non-empty result")
	}
}

func TestExecute_Version(t *testing.T) {
	root := newRootCmd("1.2.3")
	root.SetArgs([]string{"--version"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !strings.Contains(out.String(), "1.2.3") {
		t.Errorf("expected version in output, got %q", out.String())
	}
}

func TestExecute_Help(t *testing.T) {
	root := newRootCmd("dev")
	root.SetArgs([]string{"--help"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	output := out.String()
	if !strings.Contains(output, "distill") {
		t.Error("expected 'distill' in help output")
	}
	if !strings.Contains(output, "agents") {
		t.Error("expected 'agents' subcommand in help")
	}
	if !strings.Contains(output, "templates") {
		t.Error("expected 'templates' subcommand in help")
	}
}

func TestTemplatesCmd(t *testing.T) {
	root := newRootCmd("dev")
	root.SetArgs([]string{"templates"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	output := out.String()
	if !strings.Contains(output, "rules") {
		t.Error("expected 'rules' in templates output")
	}
	if !strings.Contains(output, "principles") {
		t.Error("expected 'principles' in templates output")
	}
	if !strings.Contains(output, "patterns") {
		t.Error("expected 'patterns' in templates output")
	}
	if !strings.Contains(output, "raw") {
		t.Error("expected 'raw' in templates output")
	}
}

func TestAgentsCmd(t *testing.T) {
	// Create a temp dir with default config so agents cmd loads it
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"agents"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	output := out.String()
	if !strings.Contains(output, "claude-cli") {
		t.Error("expected 'claude-cli' in agents output")
	}
	if !strings.Contains(output, "(default)") {
		t.Error("expected '(default)' marker")
	}
}

func TestValidateCmd(t *testing.T) {
	root := newRootCmd("dev")
	root.SetArgs([]string{"validate"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestPublishCmd(t *testing.T) {
	root := newRootCmd("dev")
	root.SetArgs([]string{"publish"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestAgentsCmd_WithAPIKeySet(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	t.Setenv("ANTHROPIC_API_KEY", "sk-test")

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"agents"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	output := out.String()
	// claude-api should show ✓ since ANTHROPIC_API_KEY is set
	if !strings.Contains(output, "claude-api") {
		t.Error("expected claude-api in output")
	}
	if !strings.Contains(output, "codex-cli") {
		t.Error("expected codex-cli in output")
	}
	if !strings.Contains(output, "gpt-api") {
		t.Error("expected gpt-api in output")
	}
}

func TestAgentsCmd_AllProviderTypes(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"agents"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	output := out.String()
	// All 4 default agents should appear
	for _, name := range []string{"claude-cli", "codex-cli", "claude-api", "gpt-api"} {
		if !strings.Contains(output, name) {
			t.Errorf("expected %q in agents output", name)
		}
	}
	// CLI providers should show ✓ (cli)
	if !strings.Contains(output, "✓ (cli)") {
		t.Error("expected '✓ (cli)' for CLI providers")
	}
	// API providers without keys should show ✗
	if !strings.Contains(output, "✗ (not set)") {
		t.Error("expected '✗ (not set)' for unset API keys")
	}
	if !strings.Contains(output, "Default:") {
		t.Error("expected 'Default:' line")
	}
}

func TestExecute(t *testing.T) {
	// Just verify Execute doesn't panic when called with --help
	origArgs := os.Args
	os.Args = []string{"distill", "--help"}
	defer func() { os.Args = origArgs }()

	// Execute returns nil for --help
	err := Execute("test")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}
