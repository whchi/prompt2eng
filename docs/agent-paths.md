# Supported Agent Paths Reference

## Universal Agents (`.agents/skills` project dir)

These agents share `.agents/skills` as the project-level skills directory. Skills installed for any of them go to the same canonical location.

| Agent Key        | Display Name   | Project Skills Dir | Global Skills Dir              |
| ---------------- | -------------- | ------------------ | ------------------------------ |
| `antigravity`    | Antigravity    | `.agents/skills`   | `~/.gemini/antigravity/skills` |
| `codex`          | Codex          | `.agents/skills`   | `~/.codex/skills`              |
| `cursor`         | Cursor         | `.agents/skills`   | `~/.cursor/skills`             |
| `gemini-cli`     | Gemini CLI     | `.agents/skills`   | `~/.gemini/skills`             |
| `github-copilot` | GitHub Copilot | `.agents/skills`   | `~/.copilot/skills`            |
| `opencode`       | Open Code      | `.opencode/skills` | `~/.config/opencode/skills`    |
| `kiro`           | Kiro CLI       | `.kiro/skills`     | `~/.kiro/skills`               |

## Config/Instruction Files (per-agent)

Each agent reads its own instruction file at the project root:

| Agent                | Config File                        |
| -------------------- | ---------------------------------- |
| Claude Code          | `CLAUDE.md`                        |
| OpenCode             | `AGENTS.md`                        |
| Cursor               | `.cursorrules` or `.cursor/rules/` |
| Codex                | `AGENTS.md`                        |
| Gemini CLI           | `GEMINI.md`                        |
| Kiro CLI             | `AGENTS.md`                        |
| All universal agents | `AGENTS.md`                        |
