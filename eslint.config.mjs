import tseslint from "typescript-eslint";

export default tseslint.config(
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                },
            ],
            "@/object-curly-spacing": ["error", "always"],
        },
    },
    {
        ignores: ["dist/*"],
    },
);
