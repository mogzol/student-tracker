module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: ["react-app", "plugin:@typescript-eslint/recommended"],
  plugins: ["prettier"],
  rules: {
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/self-closing-comp": "error",
    "prettier/prettier": "error",
  },
  ignorePatterns: ["webpack.config.js", "node_modules/"],
};
