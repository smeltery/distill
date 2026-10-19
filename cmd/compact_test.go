package cmd

import (
	"bytes"
	"github.com/smeltery/distill/internal/config"
	"os"
	"strings"
	"testing"
)

func TestCompactCmd_MissingSource(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"nonexistent-source"})

	err := root.Execute()
	if err == nil {
		t.Fatal("expected error for missing source")
	}
}

func TestCompactCmd_BadIngestorType(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"bad": {Type: "pdf", Template: "rules", OutputDir: "x"},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"bad"})
	err := root.Execute()
	if err == nil {
		t.Fatal("expected error for unimplemented ingestor")
	}
}

func TestCompactCmd_BadTemplate(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"bad-tmpl": {Type: "markdown", Path: "./test.md", Template: "nonexistent-template", OutputDir: "x"},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"bad-tmpl"})
	err := root.Execute()
	if err == nil {
		t.Fatal("expected error for bad template")
	}
}

func TestCompactCmd_DryRun(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	// Create a source file
	os.WriteFile("source.md", []byte("# Test content\n\nSome text."), 0o644)

	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"test-src": {Type: "markdown", Path: "./source.md", Template: "rules", OutputDir: "out", OutputFile: "test-minified.md"},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"test-src", "--dry-run"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestCompactCmd_NoArgs(t *testing.T) {
	root := newRootCmd("dev")
	root.SetArgs([]string{})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	// Should show help
	if !strings.Contains(out.String(), "distill") {
		t.Error("expected help output")
	}
}

func TestCompactCmd_IngestError(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	// Source file doesn't exist
	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"missing-file": {Type: "markdown", Path: "./does-not-exist.md", Template: "rules", OutputDir: "out"},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"missing-file"})
	err := root.Execute()
	if err == nil {
		t.Fatal("expected error for missing source file")
	}
}

func TestCompactCmd_DryRunWithTokenBudget(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	os.WriteFile("source.md", []byte("# Content\n\nText."), 0o644)

	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"src": {Type: "markdown", Path: "./source.md", Template: "rules", OutputDir: "out"},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"src", "--dry-run", "--token-budget", "2000"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestCompactCmd_DefaultOutputFilename(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	os.WriteFile("source.md", []byte("# Content"), 0o644)

	// Source without output_file — should default to name-minified.md
	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"my-guide": {Type: "markdown", Path: "./source.md", Template: "rules", OutputDir: "out"},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"my-guide", "--dry-run"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestCompactCmd_WithSpecificAgent(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	os.WriteFile("src.md", []byte("# Test"), 0o644)

	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"test": {Type: "markdown", Path: "./src.md", Template: "rules", OutputDir: "out"},
	}
	config.SaveTo(cfg, "distill.yaml")

	// Use codex-cli agent (will fail to exec, but exercises the agent selection path)
	root := newRootCmd("dev")
	root.SetArgs([]string{"test", "--agent", "codex-cli", "--dry-run"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestCompactCmd_BadAgent(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	os.WriteFile("src.md", []byte("# Test"), 0o644)

	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"test": {Type: "markdown", Path: "./src.md", Template: "rules", OutputDir: "out"},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"test", "--agent", "nonexistent-agent"})

	err := root.Execute()
	if err == nil {
		t.Fatal("expected error for nonexistent agent")
	}
}
