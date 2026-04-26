import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const packageJsonPath = path.join(repoRoot, "package.json");
const netlifyConfigPath = path.join(repoRoot, "netlify.toml");

describe("development infrastructure", () => {
  it("keeps the lint verification step free of warnings", () => {
    const output = execFileSync("npm", ["run", "lint"], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(output).not.toContain(" warning ");
    expect(output).toContain("eslint .");
  });

  it("defines the expected quality and deployment scripts", () => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts).toMatchObject({
      build: "next build",
      lint: "eslint .",
      test: "vitest run",
      typecheck: "tsc --noEmit",
      verify: "npm run lint && npm run typecheck && npm run test && npm run build",
    });
  });

  it("includes an explicit Netlify build configuration for the Next.js app", () => {
    const netlifyConfig = fs.readFileSync(netlifyConfigPath, "utf8");

    expect(netlifyConfig).toContain("[build]");
    expect(netlifyConfig).toContain('command = "pnpm build"');
    expect(netlifyConfig).toContain('publish = ".next"');
  });

  it("documents the manual launch verification checklist", () => {
    const checklistPath = path.join(repoRoot, "docs", "launch-checklist.md");
    const checklist = fs.readFileSync(checklistPath, "utf8");

    expect(checklist).toContain("# Launch Checklist");
    expect(checklist).toContain("## Automated verification");
    expect(checklist).toContain("npm run verify");
    expect(checklist).toContain("## Manual validation");
    expect(checklist).toContain("Lighthouse");
    expect(checklist).toContain("structured data");
    expect(checklist).toContain("sitemap.xml");
    expect(checklist).toContain("rss.xml");
    expect(checklist).toContain("social preview");
    expect(checklist).toContain("Netlify");
  });
});
