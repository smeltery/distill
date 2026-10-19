package cmd

import (
	"github.com/smeltery/distill/internal/config"
	"os"
	"testing"
)

func TestDeriveName_PDF(t *testing.T) {
	tests := []struct {
		typ      string
		location string
		want     string
	}{
		{"pdf", "~/Books/Tao of React.pdf", "tao-of-react"},
		{"pdf", "/path/to/clean-code.pdf", "clean-code"},
		{"markdown", "./docs/guide.md", "guide"},
		{"epub", "~/Books/DDIA.epub", "ddia"},
		{"url", "https://example.com/best-practices/", "best-practices"},
		{"notion", "https://www.notion.so/org/Some-Doc-Minified-abc123def456789abcdef01234", "some-doc-minified"},
	}
	for _, tt := range tests {
		got := deriveName(tt.typ, tt.location)
		if got != tt.want {
			t.Errorf("deriveName(%q, %q) = %q, want %q", tt.typ, tt.location, got, tt.want)
		}
	}
}

func TestAddCmd_MissingArgs(t *testing.T) {
	root := newRootCmd("dev")
	root.SetArgs([]string{"add"})

	err := root.Execute()
	if err == nil {
		t.Fatal("expected error for missing args")
	}
}

func TestAddCmd_Success(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"add", "markdown", "./test.md", "--name", "my-source", "--template", "rules"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	// Verify source was added to config
	loaded, _ := config.LoadFrom("distill.yaml")
	if _, ok := loaded.Sources["my-source"]; !ok {
		t.Error("source 'my-source' not found in config after add")
	}
}

func TestAddCmd_UnknownType(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"add", "foobar", "./test.md", "--name", "x"})

	err := root.Execute()
	if err == nil {
		t.Fatal("expected error for unknown source type")
	}
}

func TestAddCmd_DuplicateName(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	cfg.Sources = map[string]config.Source{"exists": {Type: "markdown"}}
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"add", "markdown", "./test.md", "--name", "exists"})

	err := root.Execute()
	if err == nil {
		t.Fatal("expected error for duplicate source name")
	}
}

func TestAddCmd_AllTypes(t *testing.T) {
	for _, typ := range []string{"pdf", "markdown", "epub", "notion", "url", "github"} {
		dir := t.TempDir()
		origDir, _ := os.Getwd()
		os.Chdir(dir)

		cfg := config.DefaultConfig()
		config.SaveTo(cfg, "distill.yaml")

		root := newRootCmd("dev")
		root.SetArgs([]string{"add", typ, "./loc", "--name", "src-" + typ})
		err := root.Execute()
		if err != nil {
			t.Errorf("add %s failed: %v", typ, err)
		}

		os.Chdir(origDir)
	}
}

func TestDeriveName_AdditionalCases(t *testing.T) {
	tests := []struct {
		typ      string
		location string
		want     string
	}{
		{"github", "owner/repo", "source"},
		{"unknown", "anything", "source"},
		{"url", "https://example.com/", "example.com"},
		{"notion", "https://notion.so/short", "short"},
	}
	for _, tt := range tests {
		got := deriveName(tt.typ, tt.location)
		if got != tt.want {
			t.Errorf("deriveName(%q, %q) = %q, want %q", tt.typ, tt.location, got, tt.want)
		}
	}
}

func TestAddCmd_WithSplitBy(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"add", "pdf", "~/Books/ddia.pdf", "--name", "ddia", "--template", "principles", "--split-by", "chapter"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	loaded, _ := config.LoadFrom("distill.yaml")
	src, ok := loaded.Sources["ddia"]
	if !ok {
		t.Fatal("source 'ddia' not found")
	}
	if src.SplitBy != "chapter" {
		t.Errorf("expected split_by 'chapter', got %q", src.SplitBy)
	}
	if src.Template != "principles" {
		t.Errorf("expected template 'principles', got %q", src.Template)
	}
}

func TestAddCmd_AutoDeriveName(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"add", "pdf", "~/Books/Clean Code.pdf"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	loaded, _ := config.LoadFrom("distill.yaml")
	if _, ok := loaded.Sources["clean-code"]; !ok {
		t.Error("expected auto-derived name 'clean-code'")
	}
}

func TestAddCmd_NotionSource(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"add", "notion", "https://notion.so/page-abc123", "--name", "my-notion"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	loaded, _ := config.LoadFrom("distill.yaml")
	src := loaded.Sources["my-notion"]
	if src.URL != "https://notion.so/page-abc123" {
		t.Errorf("expected URL to be set, got %q", src.URL)
	}
	if src.Type != "notion" {
		t.Errorf("expected type 'notion', got %q", src.Type)
	}
}

func TestAddCmd_GitHubSource(t *testing.T) {
	dir := t.TempDir()
	origDir, _ := os.Getwd()
	os.Chdir(dir)
	defer os.Chdir(origDir)

	cfg := config.DefaultConfig()
	config.SaveTo(cfg, "distill.yaml")

	root := newRootCmd("dev")
	root.SetArgs([]string{"add", "github", "owner/repo", "--name", "upstream"})

	err := root.Execute()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	loaded, _ := config.LoadFrom("distill.yaml")
	src := loaded.Sources["upstream"]
	if src.Repo != "owner/repo" {
		t.Errorf("expected Repo 'owner/repo', got %q", src.Repo)
	}
}
