import type { Repo } from "$lib/content";

type GhRepo = {
  name: string;
  html_url: string;
  language: string | null;
  description: string | null;
  fork: boolean;
  archived: boolean;
};

/** The four most recently pushed public repos, like `gh repo list`. Null if GitHub doesn't answer. */
export async function loadRepos(user: string, signal: AbortSignal): Promise<Repo[] | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=30`, { signal });
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    const list = (await res.json()) as GhRepo[];
    return list
      .filter((r) => !r.fork && !r.archived)
      .slice(0, 4)
      .map((r) => ({ name: r.name, url: r.html_url, language: r.language, description: r.description }));
  } catch (error) {
    if (!signal.aborted) console.warn("GitHub repos unavailable; showing the saved list.", error);
    return null;
  }
}
