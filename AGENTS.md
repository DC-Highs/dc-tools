# DC Tools - Agent Guidelines

This document provides guidelines for agents working on this codebase.

---

## 1. Commands

### Development
```bash
npm run dev              # Start Vite dev server
npm run build            # Build the app (tsc -b && vite build)
npm run preview          # Preview production build
```

### Linting & Formatting
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run format           # Run Prettier (formats src and root files)
```

### Testing
```bash
npm run test             # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report (requires 100% coverage)
```

To run a single test file:
```bash
npx vitest run <path-to-test-file>
# Example: npx vitest run electron/handlers/some.handler.test.ts
```

---

## 2. Project Structure

```
dc-tools/
├── electron/                    # Electron main process (Backend)
│   ├── handlers/               # IPC handlers (domain:action pattern)
│   │   ├── downloader.handler.ts
│   │   ├── http-request.handler.ts
│   │   └── ...
│   ├── lib/                   # Utilities and instances
│   │   ├── constants.ts
│   │   ├── store.ts
│   │   └── to-app-url.util.ts
│   ├── main.ts               # Entry point
│   └── preload.ts            # Context bridge
├── src/                       # React frontend
│   ├── components/
│   │   ├── composition/     # Composed UI components
│   │   └── ui/               # Shadcn UI base components
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Route pages
│   ├── schemas/              # Zod validation schemas
│   ├── utils/                # Utility functions
│   └── lib/                  # Frontend lib (utils, etc.)
└── vite.config.ts            # Vite + Vitest config
```

---

## 3. Code Style Guidelines

### Formatting
- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Double quotes only (`"`)
- **Semicolons**: NO semicolons
- **Line breaks**: Avoid unnecessary blank lines inside components
  - Exception: Always blank line before `return`
  - Exception: Blank line before and after `console.log` (unless in sequence)

### Imports
- Use named imports: `import { FC, useEffect } from "react"`
- NEVER use: `import React from "react"` or `import * as React from "react"`
- Use `import type` for type-only imports
- Frontend path alias: `@/` maps to `./src`

### Naming Conventions
- **Variables/Functions**: camelCase, descriptive names (NO abbreviations)
- **Components**: PascalCase (e.g., `PageContainer`)
- **Files**: kebab-case (e.g., `download-form-actions.tsx`)
- **IPC Channels**: `domain:action` pattern (e.g., `file:download`, `store:get`)
- **Loop variables**: Use descriptive names like `currentItem`, `currentEntity`, `index`
- **Event handlers**: Name as `event` (not `e`)
- **Callbacks**: Use descriptive names like `newValue`, `updatedData`

### React Patterns
- **Components**: Use `const Name: FC<Props> = () => {}`
- **NEVER use**: `function Name() {}` or `function handleEvent() {}`
- **Props**: Don't use prefix (avoid `IProps`, `TProps`)
- **Forms**: Use `Controller` from react-hook-form (NEVER spread register)
- **Schema inference**: Name as `{Name}FormValues` (e.g., `LoginFormValues`)

### Error Handling
- Throw descriptive errors with context
- Use try/catch in async handlers
- Return `null` for cancelled operations (not throw)

---

## 4. Testing Requirements

- **Coverage**: 100% required for Electron (main process) files
- **Scope**: Only test `electron/**/*` files
- **Exclusions**: `main.ts`, `preload.ts`, and test files are excluded from coverage
- **Framework**: Vitest with jsdom environment

---

## 5. Key Dependencies

- **Frontend**: React 19, React Router DOM 7, Tailwind CSS 4
- **UI**: Shadcn UI, Radix UI, Lucide React
- **Forms**: React Hook Form + Zod
- **Backend**: Electron 40, Express, electron-store
- **Build**: Vite 7, TypeScript 5.9

---

## 6. Pre-Commit Checklist

Before committing:
1. Run `npm run lint:fix`
2. Run `npm run format`
3. Run `npm run test:coverage` (if modifying Electron files)
4. Ensure all tests pass

---

## 7. Common Issues

- **Windows execution**: Use `;` to chain commands (not `&&`)
- **Import errors**: Use relative imports for local files
- **Type errors**: Use `import type` for interfaces/types
