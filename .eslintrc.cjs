module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "import"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    ignorePatterns: ["dist", "node_modules"],
    rules: {
        "import/order": [
        "error",
        {
            "alphabetize": { "order": "asc", "caseInsensitive": true }
        }
        ]
    }
};
