package cmd

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestInstallCmd_MissingArgs(t *testing.T) {
	root := newRootCmd("dev")
	root.SetArgs([]string{"install"})

	err := root.Execute()
	if err == nil {
		t.Fatal("expected error for missing args")
	}
}

func TestInstallCmd_Help(t *testing.T) {
	root := newRootCmd("dev")
	root.SetArgs([]string{"install", "--help"})
	var out bytes.Buffer
	root.SetOut(&out)

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !strings.Contains(out.String(), "install") {
		t.Error("expected install help text")
	}
}

func TestSplitLines(t *testing.T) {
	tests := []struct {
		input string
		want  []string
	}{
		{"a\nb\nc", []string{"a", "b", "c"}},
		{"single", []string{"single"}},
		{"", nil},
		{"a\n", []string{"a"}},
		{"a\nb\n", []string{"a", "b"}},
	}
	for _, tt := range tests {
		got := splitLines(tt.input)
		if len(got) != len(tt.want) {
			t.Errorf("splitLines(%q) = %v, want %v", tt.input, got, tt.want)
			continue
		}
		for i := range got {
			if got[i] != tt.want[i] {
				t.Errorf("splitLines(%q)[%d] = %q, want %q", tt.input, i, got[i], tt.want[i])
			}
		}
	}
}

func TestAppendGitignore_NewFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, ".gitignore")

	appendGitignore(path, "docs/")

	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("reading gitignore: %v", err)
	}
	if string(data) != "docs/\n" {
		t.Errorf("expected 'docs/\n', got %q", string(data))
	}
}

func TestAppendGitignore_AlreadyPresent(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, ".gitignore")
	os.WriteFile(path, []byte("docs/\n"), 0o644)

	appendGitignore(path, "docs/")

	data, _ := os.ReadFile(path)
	// Should not duplicate
	if string(data) != "docs/\n" {
		t.Errorf("expected no duplicate, got %q", string(data))
	}
}

func TestAppendGitignore_AppendsToExisting(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, ".gitignore")
	os.WriteFile(path, []byte("node_modules/\n"), 0o644)

	appendGitignore(path, "docs/")

	data, _ := os.ReadFile(path)
	if !strings.Contains(string(data), "node_modules/") {
		t.Error("lost existing content")
	}
	if !strings.Contains(string(data), "docs/") {
		t.Error("docs/ not appended")
	}
}
