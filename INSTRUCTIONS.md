### Code Structure & Modularity
- Never create a file longer than 500 lines of code. If a file approaches this limit, refactor by splitting it into modules or helper files
- Organize code into clearly separated modules, grouped by feature or responsibility
- Write optimal and idiomatic code specific to the language
- Prioritize conciseness, even if it slightly reduces immediate readability
- Use comments sparingly, only for code sections that are not self-explanatory or involve complex logic

### Documentation & Explainability
- Comment non-obvious code and ensure everything is understandable to a mid-level developer
- When writing complex logic, add an inline "Reason:" comment explaining the why, not just the what

### AI Behavior Rules
- Never assume missing context. Ask questions if uncertain
- Never hallucinate libraries or functions
- Always confirm file paths and module names exist before referencing them in code or tests
- Never delete or overwrite existing code unless explicitly instructed to or if part of a task from TASK.md
