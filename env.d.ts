/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

// JSON module declarations for i18n
declare module '*.json' {
  const value: Record<string, unknown>
  export default value
}
