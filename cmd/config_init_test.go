package cmd

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestConfigInitCmd(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	root := newRootCmd("dev")
	root.SetArgs([]string{"config", "init"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	// Verify file was created
	if _, err := os.Stat("distill.yaml"); err != nil {
		t.Fatal("distill.yaml not created")
	}

	// Running again without --force should fail
	root2 := newRootCmd("dev")
	root2.SetArgs([]string{"config", "init"})
	err = root2.Execute()
	if err == nil {
		t.Fatal("expected error when config already exists")
	}
}

func TestConfigInitCmd_Force(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	// Create first
	root := newRootCmd("dev")
	root.SetArgs([]string{"config", "init"})
	root.Execute()

	// Force overwrite
	root2 := newRootCmd("dev")
	root2.SetArgs([]string{"config", "init", "--force"})
	err := root2.Execute()
	if err != nil {
		t.Fatalf("expected --force to succeed, got: %v", err)
	}
}

func TestInitCmd(t *testing.T) {
	dir := t.TempDir()
	repoName := filepath.Join(dir, "my-context")

	root := newRootCmd("dev")
	root.SetArgs([]string{"init", repoName})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	// Check scaffolded files
	for _, f := range []string{"index.md", ".gitignore", "README.md"} {
		if _, err := os.Stat(filepath.Join(repoName, f)); err != nil {
			t.Errorf("expected %s to exist: %v", f, err)
		}
	}
}

func TestInitCmd_VerifyContents(t *testing.T) {
	dir := t.TempDir()
	repoName := filepath.Join(dir, "test-context")

	root := newRootCmd("dev")
	root.SetArgs([]string{"init", repoName})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	// Verify index.md content
	data, _ := os.ReadFile(filepath.Join(repoName, "index.md"))
	if !strings.Contains(string(data), "test-context") {
		t.Error("index.md should contain repo name")
	}
	if !strings.Contains(string(data), "distill") {
		t.Error("index.md should reference distill")
	}

	// Verify .gitignore
	data, _ = os.ReadFile(filepath.Join(repoName, ".gitignore"))
	if !strings.Contains(string(data), ".distill-state.yaml") {
		t.Error(".gitignore should exclude state file")
	}

	// Verify README.md
	data, _ = os.ReadFile(filepath.Join(repoName, "README.md"))
	if !strings.Contains(string(data), "test-context") {
		t.Error("README should contain repo name")
	}
	if !strings.Contains(string(data), "~/.claude") {
		t.Error("README should mention ~/.claude")
	}
}

func TestInitCmd_MissingArg(t *testing.T) {
	root := newRootCmd("dev")
	root.SetArgs([]string{"init"})

	err := root.Execute()
	if err == nil {
		t.Fatal("expected error for missing arg")
	}
}
