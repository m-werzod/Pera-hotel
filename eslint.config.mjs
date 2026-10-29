import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * eslint-config-next v16 ships flat configs directly, so these are imported
 * as-is. Routing them through `FlatCompat` instead makes ESLint 9 choke
 * serialising the plugin graph ("Converting circular structure to JSON").
 */
const asArray = (config) => (Array.isArray(config) ? config : [config]);

const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "out/**"] },
  ...asArray(nextCoreWebVitals),
  ...asArray(nextTypescript),
];

export default config;
