# Task Completion Checklist

Run before considering a coding task done:
```bash
npm run lint     # must pass (ESLint flat config)
```
No test suite exists — don't invent one. If the change is type-sensitive, `npx tsc --noEmit` is reasonable ad hoc but isn't an enforced project step.
See `mem:suggested_commands` for the full command list.
