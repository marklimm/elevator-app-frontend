module.exports = {
  env: {
    browser: true, //  my project is meant to run in the browser
    es2021: true,
    node: true, //  specifying this prevents an error for "module" on the first line of this file
  },
  extends: [
    "eslint:recommended", //  the recommended eslint rules
    "plugin:react/recommended", //  react recommended eslint rules
    "plugin:@typescript-eslint/recommended", //  typescript recommended eslint rules
    "plugin:prettier/recommended", //  disables rules that interfere with prettier (with eslint-config-prettier) and adds the prettier rules.  See https://github.com/prettier/eslint-plugin-prettier#recommended-configuration for reference
  ],
  parser: "@typescript-eslint/parser", //  tells eslint how to parse typescript files
  parserOptions: {
    ecmaFeatures: {
      jsx: true, //  I believe this setting tells eslint how to parse JSX
    },
    ecmaVersion: 12,
    sourceType: "module", //  I'm using import/export for modules
  },
  plugins: [
    "react", //  using react eslint rules
    "@typescript-eslint", //  using typescript eslint rules
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto", //  rule added to override "delete CR" prettier error https://stackoverflow.com/a/63654585.  This might relate to being on Windows?
      },
    ],
  },
  settings: {
    react: {
      version: "detect", //  adding this setting to prevent this error https://stackoverflow.com/a/61002263
    },
  },
};
