import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import jest from "eslint-plugin-jest";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "src/data",
        "src/**/*.test.ts",
        "src/**/*.test.js",
        "src/**/*.test.tsx",
        "src/**/*.test.jsx",
    ],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
), {
    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
        prettier,
        jest,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser,
            ...jest.environments.globals.globals,
            process: true,
        },

        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            pragma: "React",
            version: "detect",
        },
    },

    rules: {
        "prettier/prettier": ["error", {
            singleQuote: true,
            semi: false,
            trailingComma: "none",
            printWidth: 120,
        }],

        "react/prop-types": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/camelcase": 0,
        "@typescript-eslint/explicit-function-return-type": 0,
        "react/no-unescaped-entities": 0,
        "@typescript-eslint/ban-ts-ignore": 0,
        "@typescript-eslint/ban-ts-comment": 0,
        "@typescript-eslint/prefer-as-const": 0,
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "ban-ts-ignore": 0,
        "react/display-name": 0,
    },
}];