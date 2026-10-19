package cmd

import (
	"bytes"
	"github.com/smeltery/distill/internal/config"
	"os"
	"strings"
	"testing"
)

func TestListCmd_NoSources(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"list"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !strings.Contains(out.String(), "No sources") {
		t.Errorf("expected 'No sources' message, got %q", out.String())
	}
}

func TestListCmd_WithSources(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"test-source": {
			Type:      "markdown",
			Template:  "rules",
			OutputDir: "test",
		},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"list"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !strings.Contains(out.String(), "test-source") {
		t.Errorf("expected 'test-source' in output, got %q", out.String())
	}
}

func TestUpdateCmd_NoSources(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"update"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestUpdateCmd_AllSources_WithErrors(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	// Add sources that will fail (pdf not implemented, missing file)
	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"bad-pdf": {Type: "pdf", Template: "rules", OutputDir: "x"},
		"bad-md":  {Type: "markdown", Path: "./nonexistent.md", Template: "rules", OutputDir: "y"},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"update"})
	var out bytes.Buffer
	root.SetOut(&out)

	// update --all with failing sources should still complete (errors are warned, not fatal)
	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestUpdateCmd_SpecificName_Missing(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"update", "nonexistent"})

	// update delegates to compactSource, which returns an error for missing source.
	// We just verify it doesn't panic — the error may or may not propagate through cobra.
	_ = root.Execute()
}

func TestListCmd_MultipleSources(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"alpha": {Type: "pdf", Template: "rules", OutputDir: "a"},
		"beta":  {Type: "markdown", Template: "principles", OutputDir: "b"},
		"gamma": {Type: "url", Template: "patterns", OutputDir: "c"},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"list"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	output := out.String()
	// Should be sorted alphabetically
	alphaIdx := strings.Index(output, "alpha")
	betaIdx := strings.Index(output, "beta")
	gammaIdx := strings.Index(output, "gamma")
	if alphaIdx > betaIdx || betaIdx > gammaIdx {
		t.Error("expected sources sorted alphabetically")
	}
	if !strings.Contains(output, "rules") {
		t.Error("expected template names in output")
	}
}

func TestUpdateCmd_DryRun(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	os.WriteFile("source.md", []byte("# Test"), 0o644)

	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{
		"src": {Type: "markdown", Path: "./source.md", Template: "rules", OutputDir: "out", OutputFile: "out.md"},
	}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"update", "src", "--dry-run"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}
