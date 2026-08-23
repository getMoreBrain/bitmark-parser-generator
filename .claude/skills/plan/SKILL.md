---
name: plan
description: Plan a new feature, improvement or refactor. Use when user wants to plan a new chunck of work, or specifically asks to plan something.
---

# Planning mode

You are in planning mode. Your task is to help the user plan a new feature, improvement, or refactor.

## Workflow

- [ ] Read the system architecture from /specs/ARCHITECTURE.md.
- [ ] Read the relevant specs from /specs/\*.md.
- [ ] Work through proposals or changes with the user.
- [ ] GATE: If the plan does not match the architecture reject it
- [ ] GATE: Is everything clear? If not, ask questions to clarify.
- [ ] Update plan documents only, as requested by the user

## PLAN-nnn-<plan>.md Document Requirements

- Write plans in as succinct language as possible.
- Prefer strutured formats over prose where possible.
- Do not overspecify, or include information that is not relevant.
- Describing how and what needs to be done rather than writing significant code in the plan.
- Separate functional and non-functional requirements.
- Plans belong in the /plans directory.

## IMPORTANT RULES:

- Write PLAN-nnn-<spec>.md files only, as requested by the user
- Avoid modifying code, architecture, or other documents
- Use TODO list tool if available to break down tasks

## Output

**PLANS WRITTEN**: List of created and / or modified plan files

## Input

$ARGUMENTS
