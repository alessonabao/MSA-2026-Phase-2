# Agent Instructions & Tooling Configuration

This is a short, factual statement of what AI agent/tooling configuration existed for
this repository — no more and no less.

## What was NOT configured

- **No project-level `CLAUDE.md`.** There is no `CLAUDE.md` anywhere in this
  repository giving Claude Code standing instructions, conventions, or context
  about the project.
- **No custom subagents, hooks, or slash commands.** `.claude/` at the repo root
  is empty — no `agents/`, no `hooks/`, no `commands/`, no `settings.json`.
- **No special editor-level AI configuration.** `.vscode/settings.json` is a
  trivial 2-byte file (`{}`) — it carries no Claude Code or AI-related settings.

## What was actually used

- **Claude Code**, via the official VS Code extension, running with its
  out-of-the-box default agent and default tool access (file read/write, Bash,
  search, etc.) — no customisation layered on top. This was the primary tool used
  for implementation, debugging, and test-writing throughout the project, as
  evidenced by the real session transcripts mined into `specs/sessions/`.
- A separate **claude.ai browser Project** named **"MSA Phase 2"** was used for some
  earlier planning conversations (see `specs/browser-sessions/`, and specifically
  `specs/browser-sessions/06-agent-instructions.md` for the tech-stack/domain context
  and constraints given to it). This is a standard claude.ai Project workspace, not an
  agent/tooling configuration — it has no repo-level config file equivalent to mine.

In short: this project's AI-assisted development relied on Claude Code's default
behaviour in VS Code, plus ad-hoc conversations in a claude.ai Project, rather than
any bespoke agent, hook, or instruction-file setup.
