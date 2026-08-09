import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve as pathResolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = pathResolve(dirname(fileURLToPath(import.meta.url)), "..");

const CODE_EXTS = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".json"]);

function hasCodeExt(path) {
  return CODE_EXTS.has(extname(path));
}

function resolveTsPath(absWithoutExt) {
  const candidates = [
    absWithoutExt,
    `${absWithoutExt}.ts`,
    `${absWithoutExt}.tsx`,
    pathResolve(absWithoutExt, "index.ts"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return `${absWithoutExt}.ts`;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    const base = pathResolve(root, "src", rel);
    const abs = hasCodeExt(base) ? base : resolveTsPath(base);
    return nextResolve(pathToFileURL(abs).href, context);
  }

  // Rewrite relative imports that omit .ts inside src/
  if (
    context.parentURL &&
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !hasCodeExt(specifier)
  ) {
    try {
      const parentPath = fileURLToPath(context.parentURL);
      if (parentPath.includes(`${root}/src/`)) {
        const abs = resolveTsPath(pathResolve(dirname(parentPath), specifier));
        if (existsSync(abs)) {
          return nextResolve(pathToFileURL(abs).href, context);
        }
      }
    } catch {
      // fall through
    }
  }

  return nextResolve(specifier, context);
}
