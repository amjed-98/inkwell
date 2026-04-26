import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const packageJsonPath = path.join(repoRoot, "package.json");
const netlifyConfigPath = path.join(repoRoot, "netlify.toml");

describe("development infrastructure", () => {
  it("defines the expected quality and deployment scripts", () => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts).toMatchObject({
      build: "next build",
      lint: "eslint .",
      test: "vitest run",
      typecheck: "tsc --noEmit",
    });
  });

  it("includes an explicit Netlify build configuration for the Next.js app", () => {
    const netlifyConfig = fs.readFileSync(netlifyConfigPath, "utf8");

    expect(netlifyConfig).toContain("[build]");
    expect(netlifyConfig).toContain('command = "pnpm build"');
    expect(netlifyConfig).toContain('publish = ".next"');
  });
});
