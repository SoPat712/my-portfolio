import { execFileSync } from "node:child_process";
import type { Commit } from "$lib/desktop/shared";
import type { PageServerLoad } from "./$types";

// Runs once at build time (the page is prerendered), so `git log` in the terminal shows real recent commits.
export const load: PageServerLoad = () => {
  let commits: Commit[] = [];
  try {
    const out = execFileSync("git", ["log", "-5", "--format=%h%x09%s"], { encoding: "utf8" });
    commits = out
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, ...subject] = line.split("\t");
        return { hash, subject: subject.join("\t") };
      });
  } catch {
    // No git in the build environment: the terminal says so instead of inventing history.
  }
  // Netlify sets URL to the site's main address (the custom domain, if there is one); link previews need it absolute.
  const site = (process.env.URL || "https://joshpatraportfolio.netlify.app").replace(/\/$/, "");
  return { commits, site };
};
