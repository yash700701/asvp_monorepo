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

// ESLint is a guardrail that prevents small mistakes, bad habits, and team chaos before they hit production.