<!-- .github/copilot-instructions.md -->
# Copilot / AI agent instructions for this repo

Purpose
- Help contributors and AI agents understand and edit this repository safely and productively.

Quick context
- This repository currently contains only a top-level README at [README.md](README.md). No source files, build manifests, or tests were found during discovery.

If you see missing context
- Do not guess runtime, build, or test commands. Ask the maintainer for the project language, entrypoint, and expected dev workflow before making substantive edits.

Discovery checklist (what to look for first)
- Locate language/runtime files: `package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `Makefile`.
- Locate source roots: `src/`, `app/`, `cmd/`, or language-specific layouts.
- Locate CI and config: `.github/workflows/`, `Dockerfile`, `docker-compose.yml`.
- If none of the above exist, request clarification rather than inventing a build.

Big-picture guidance for this repo
- At present there are no service boundaries, data flows, or components to infer from code. Any attempt to define architecture must be validated with the repo owner.

Agent conventions for working here
- Before coding: run a repo scan and report findings. Example commands to propose to the user: `ls -la`, `rg "package.json|pyproject.toml|go.mod|Cargo.toml|Makefile" || true`.
- When adding code: include a short README update with run/build/test instructions.
- Keep changes minimal and reversible: prefer small commits and feature branches. Add tests only after confirming test framework choice with the maintainer.

Editing rules
- Preserve existing files and metadata. If adding project scaffolding, propose it in a PR and explain choices in the PR description.
- Do not add CI configuration or dependency manifests without explicit approval.

When to ask the user
- If you cannot find source files or a clear language/runtime, ask: "Which language/runtime and entrypoint should I target?" and "How do you run or test this project locally?"

Key places to check when more files appear
- Root README: [README.md](README.md)
- CI/workflows: `.github/workflows/` (if present)

Examples (how to reference during work)
- "I found `pyproject.toml` and `src/`. Proposed action: add GitHub Actions that run `poetry install && pytest` — ok to proceed?"
- "No build files found. Suggest creating `package.json` with `npm test` if you want JS scaffolding — do you approve?"

Feedback
- If any section is unclear or more repo files exist, I'll re-scan and update these instructions accordingly.
