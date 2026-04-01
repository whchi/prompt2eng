# prompt2eng

CLI tool to generate customized prompt2eng skills for AI agents.

## Installation

### Global installation
```bash
bun install -g prompt2eng
```

### Using bunx (no install)
```bash
bunx prompt2eng
```

## Usage

Run the CLI without any arguments to start the interactive installer:

```bash
prompt2eng
```

### Interactive Flow

1. **Select AI Tool**
   - `OpenCode` — for OpenCode CLI
   - `Claude` — for claude.ai / Claude Code
   - `Other` — for Codex, Gemini, and other agents

2. **Select Language** (BCP-47 tag)
   - Choose from supported languages: zh, ja, ko, es, ru, fr, de, pt, it

3. **Select Region** (if multiple options)
   - For languages with multiple regions, select the appropriate one
   - Single-region languages (ja, ko, ru, pt) are auto-selected

4. **Select CEFR Level**
   - A1–C2 (default: B2)

5. **Confirm** — Review and generate

### Example Session

```
$ prompt2eng

Prompt Translator Skill Generator

? Which AI tool are you using? OpenCode
  → config: ~/.config/opencode/AGENTS.md  skills: ~/.config/opencode/skills/prompt2eng

? Language tag (type to search): zh
? Region for zh? TW

  ✓ BCP-47 tag: zh-TW

? Target English level (CEFR): B2 — Upper Intermediate (recommended)

  Tool:     OpenCode
  Language: zh-TW
  CEFR:     B2
  Skills:   ~/.config/opencode/skills/prompt2eng

? Generate skill with these settings? Yes
```

## Installation Paths

### OpenCode
- Skills directory: `~/.config/opencode/skills/prompt2eng/`
- Config file: `~/.config/opencode/AGENTS.md`

### Claude
- Skills directory: `~/.claude/skills/prompt2eng/`
- Config file: `~/.claude/CLAUDE.md`

### Other (Codex, Gemini, etc.)
- Skills directory: `~/.agents/skills/prompt2eng/`
- Config file: `~/.agents/AGENTS.md`

## Configuration File Update

The CLI will:

1. **Scan** for existing `CLAUDE.md` or `AGENTS.md`
2. **If found**: Ask whether to add the skill to `## Required Skills`
3. **If not found**: Print a snippet for you to add manually

### Manual Snippet

If no config file exists, add this to your `AGENTS.md` or `CLAUDE.md`:

```markdown
## Required Skills

- **prompt2eng**: Use when the user's prompt contains [Language] text that needs translation to English before processing. Translates [Language] to CEFR [Level] English while preserving existing English, technical terms, and proper nouns.
```

## CEFR Levels

| Level | Name | Description |
|-------|------|-------------|
| A1 | Beginner | Basic phrases and familiar everyday expressions |
| A2 | Elementary | Simple sentences and frequently used expressions |
| B1 | Intermediate | Clear standard communication on familiar matters |
| **B2** | **Upper Intermediate** | **Complex texts and technical discussion** *(default)* |
| C1 | Advanced | Fluent expression without much searching |
| C2 | Proficient | Near-native precision and nuance |

## Supported Languages

The following BCP-47 language tags are supported:

### Chinese
- `zh-TW` — Traditional Chinese (Taiwan)
- `zh-HK` — Traditional Chinese (Hong Kong)
- `zh-CN` — Simplified Chinese (China)

### Japanese
- `ja-JP` — Japanese (Japan)

### Korean
- `ko-KR` — Korean (South Korea)

### Spanish
- `es-ES` — Spanish (Spain)
- `es-MX` — Spanish (Mexico)

### Russian
- `ru-RU` — Russian (Russia)

### French
- `fr-FR` — French (France)
- `fr-CA` — French (Canada)

### German
- `de-DE` — German (Germany)
- `de-CH` — German (Switzerland)

### Portuguese
- `pt-BR` — Portuguese (Brazil)

### Italian
- `it-IT` — Italian (Italy)
- `it-CH` — Italian (Switzerland)

## Development

### Setup
```bash
bun install
```

### Build
```bash
bun run build
```

### Test
```bash
bun run test
```

## Project Structure

```
prompt2eng/
├── src/
│   ├── cli.ts           # CLI entry point
│   ├── interactive.ts   # Interactive prompts
│   ├── generate.ts      # Skill generation logic
│   ├── languages.ts     # Language name utilities
│   ├── cefr.ts          # CEFR level definitions
│   ├── paths.ts         # File path resolution
│   └── install.ts       # Config file installation
├── templates/
│   ├── SKILL.md.hbs     # Skill template (Handlebars)
│   └── languages.json   # Example translations per language
└── README.md
```

### Adding/Modifying Examples

Edit `templates/languages.json` to add or modify translation examples. Each language key contains an array of `{input, output}` pairs:

```json
{
  "zh": [
    { "input": "請幫我寫一個 Python script", "output": "Please help me write a Python script" },
    ...
  ],
  "ja": [...],
  ...
}
```

### Template Customization

Edit `templates/SKILL.md.hbs` to modify the skill structure:
- `{{skillName}}` — Name of the skill
- `{{languageName}}` — Human-readable language name
- `{{cefrLevel}}` — CEFR level (A1–C2)
- `{{cefrDescription}}` — Description of the level
- `{{#each examples}}` — Loop through examples
