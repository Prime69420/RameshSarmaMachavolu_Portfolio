import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { registerHooks, stripTypeScriptTypes } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");

function fileFor(specifier, parentURL) {
  const raw = specifier.startsWith("@/")
    ? path.join(src, specifier.slice(2))
    : path.resolve(path.dirname(fileURLToPath(parentURL)), specifier);
  return [raw, `${raw}.ts`, `${raw}.tsx`, path.join(raw, "index.ts")].find((candidate) => existsSync(candidate));
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if ((specifier.startsWith("@/") || specifier.startsWith(".")) && context.parentURL) {
      const file = fileFor(specifier, context.parentURL);
      if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith("file:") && (url.endsWith(".ts") || url.endsWith(".tsx"))) {
      const source = stripTypeScriptTypes(readFileSync(fileURLToPath(url), "utf8"), { mode: "strip" });
      return { format: "module", source, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
