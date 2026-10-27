import reactRefresh from "eslint-plugin-react-refresh"
import prettierConfig from "eslint-config-prettier"
import reactHooks from "eslint-plugin-react-hooks"
import prettier from "eslint-plugin-prettier"
import tseslint from "typescript-eslint"
import globals from "globals"
import js from "@eslint/js"

export default tseslint.config(
    { ignores: ["dist", "dist-electron"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, prettierConfig],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            prettier: prettier,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "prettier/prettier": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
)
