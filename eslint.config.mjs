
import nextConfig from "eslint-config-next";

// nextConfig is an array, so it must be spread.
export default [
  ...nextConfig,
  {
    rules: {
      // Disabling this rule as it can be noisy during development.
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
