<script lang="ts">
  import { onMount } from "svelte";
  import "./desktop.css";
  import {
    CATEGORIES,
    COURSES,
    EDUCATION,
    FALLBACK_REPOS,
    NOW,
    PROFILE,
    PROJECTS,
    SORTED_PROJECTS,
    summaryOf,
    type Category,
  } from "$lib/content";
  import { startDesktop, type Commit } from "./engine";
  import { loadRepos } from "./github";
  import Window from "./Window.svelte";
  import Buffer from "./Buffer.svelte";
  import KeysHelp from "./KeysHelp.svelte";
  import BootScreen from "./BootScreen.svelte";

  let { commits }: { commits: Commit[] } = $props();

  let repos = $state(FALLBACK_REPOS);

  const countIn = (c: "All" | Category) => (c === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.cats.includes(c)).length);
  const host = (url: string) => url.replace(/^https:\/\/(www\.)?/, "");

  onMount(() => {
    const ac = new AbortController();
    loadRepos(PROFILE.githubUser, ac.signal).then((live) => {
      if (live?.length) repos = live;
    });
    const stop = startDesktop({ commits });
    return () => {
      ac.abort();
      stop();
    };
  });
</script>

<a class="skip" href="#body-fetch">Skip to content</a>

<header class="bar" id="bar">
  <button class="run-btn" id="runBtn" type="button" aria-haspopup="dialog" aria-label="Open launcher"
    ><span class="k" aria-hidden="true">/</span>run</button
  >
  <span class="mode" id="mode" data-mode="normal" aria-hidden="true"
    ><span class="mode-name" id="modeName">NORMAL</span><span class="mode-pend" id="modePend"></span></span
  >
  <nav class="ws-nav" aria-label="Workspaces">
    {#each ["home", "projects", "experience", "education", "contact"] as name, i (name)}
      <button type="button" data-ws={i + 1} aria-current={i === 0 ? "true" : "false"}><span class="n">{i + 1}</span>{name}</button>
    {/each}
  </nav>
  <div class="bar-title" id="barTitle"></div>
  <div class="bar-right">
    <button class="bb lay-btn" id="layBtn" type="button" aria-label="Layout: tile. Change layout">[]=</button>
    <button class="bb rice-btn" id="riceBtn" type="button" aria-label="Color scheme: oxide. Change color scheme"><i></i><i></i><i></i></button>
    <button class="bb keys-btn" id="keysBtn" type="button" aria-label="Keybindings">?</button>
    <a class="bar-resume" id="resumeLink" href={PROFILE.resume} target="_blank" rel="noopener noreferrer">resume.pdf ↗</a>
    <time id="clock"></time>
  </div>
</header>

<main class="stage" id="stage">
  <section class="ws active" id="ws-1" data-n="1" aria-label="Workspace 1, home">
    {@render chrome(56)}

    <Window id="fetch" ws={1} label="fetch" info="~" title="fetch: josh@patra" closeLabel="fetch" class="w-fetch">
      <div class="win-body" id="body-fetch" tabindex="-1">
        <p class="cmd"><span class="u">josh@patra</span>:<span class="p">~</span>$ fetch</p>
        <h1 class="name">{PROFILE.name}</h1>
        <p class="role">{PROFILE.role}</p>
        <div class="fetch-grid">
          <button class="pf" id="pf" type="button" aria-pressed="false" aria-label="Portrait of Josh Patra, dithered. Press to show the photo.">
            <canvas id="dither" aria-hidden="true"></canvas>
            <img id="photo" src={PROFILE.photo} alt="" />
          </button>
          <div>
            <p class="who"><span>josh</span>@<span>patra</span></p>
            <p class="dash" aria-hidden="true">----------</p>
            <dl class="kv">
              <div><dt>Study</dt><dd>{PROFILE.study}</dd></div>
              <div><dt>GPA</dt><dd>{PROFILE.gpa}</dd></div>
              <div><dt>Focus</dt><dd>{PROFILE.focus}</dd></div>
              <div><dt>Languages</dt><dd>{PROFILE.languages}</dd></div>
              <div><dt>Spoken</dt><dd>{PROFILE.spoken}</dd></div>
              <div><dt>Projects</dt><dd>{PROJECTS.length}, on workspace 2</dd></div>
            </dl>
            <div class="swatches" aria-hidden="true">
              {#each ["--win-3", "--rust", "--moss", "--ochre", "--slate", "--clay", "--sage", "--fg"] as c (c)}
                <i style:--c="var({c})"></i>
              {/each}
            </div>
          </div>
        </div>
        <p class="bio">{PROFILE.bio}</p>
        <div class="actions">
          <a class="btn" href={PROFILE.resume} target="_blank" rel="noopener noreferrer" data-resume>resume.pdf ↗</a>
          <a class="lnk" href={PROFILE.github} target="_blank" rel="noopener noreferrer">github ↗</a>
          <a class="lnk" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">linkedin ↗</a>
          <button class="lnk" type="button" data-go="5">email →</button>
        </div>
      </div>
    </Window>

    <Window id="term" ws={1} label="terminal" info="guest@patra" title="terminal: guest@patra" closeLabel="terminal" class="w-term">
      <div class="win-body" id="termBody" tabindex="-1">
        <div class="term">
          <div class="term-out" id="termOut" role="log" aria-live="polite" aria-label="Terminal output"></div>
          <form class="term-line" id="termForm" autocomplete="off">
            <label for="termIn" id="termPrompt"></label>
            <input id="termIn" type="text" spellcheck="false" autocapitalize="off" autocorrect="off" aria-label="Terminal command" />
            <span class="rs-prev" id="rsPrev" hidden></span>
          </form>
        </div>
      </div>
    </Window>

    <Window id="now" ws={1} label="now" info="currently building" title="now: currently building" closeLabel="now" class="w-now">
      <div class="win-body" tabindex="-1">
        <ul class="now">
          {#each NOW as item (item.title)}
            <li>
              <p class="st"><i class={["dot", item.live && "live"]} aria-hidden="true"></i>{item.status}</p>
              <div class="now-h"><h3>{item.title}</h3><button class="lnk" type="button" data-open={item.slug}>open →</button></div>
              <p>{item.text}</p>
            </li>
          {/each}
        </ul>
      </div>
    </Window>
  </section>

  <section class="ws" id="ws-2" data-n="2" aria-label="Workspace 2, projects" inert>
    {@render chrome(50)}

    <Window id="files" ws={2} label="files" info="~/projects" title="files: ~/projects" closeLabel="files" class="w-files">
      <div class="win-body" tabindex="-1">
        <div class="fm">
          <div class="fm-tools">
            <div class="filters" id="filters" role="group" aria-label="Filter projects by category">
              {#each CATEGORIES as c (c)}
                <button type="button" data-cat={c} aria-pressed={c === "All"}>{c.toLowerCase()}<span class="c">{countIn(c)}</span></button>
              {/each}
            </div>
          </div>
          <div class="fm-head" aria-hidden="true"><span></span><span>name</span><span class="c-sum">description</span><span class="c-stack">stack</span><span></span></div>
          <ol class="fm-list" id="fmList" aria-label="Projects">
            {#each SORTED_PROJECTS as p, i (p.slug)}
              <li>
                <button class={["row", i === 0 && "sel"]} type="button" data-slug={p.slug} tabindex={i === 0 ? 0 : -1}>
                  <span class={["tile", p.fit === "contain" && "contain"]} style:--tile={p.tile} style:--pad={p.pad ?? "20%"} aria-hidden="true"
                    ><img src={p.img} alt="" loading="lazy" /></span
                  >
                  <span class="r-name"><strong>{p.name}</strong><small>{p.cats.map((c) => c.toLowerCase()).join(" / ")}</small></span>
                  <span class="r-sum">{summaryOf(p)}</span>
                  <span class="r-stack">{p.stack.slice(0, 3).join(", ")}{p.stack.length > 3 ? ` +${p.stack.length - 3}` : ""}</span>
                  <span class="r-go" aria-hidden="true">→</span>
                </button>
              </li>
            {/each}
          </ol>
        </div>
      </div>
      <div class="fm-status"><span id="fmPath">~/projects</span><span id="fmCount">{PROJECTS.length} items</span></div>
    </Window>
  </section>

  <section class="ws" id="ws-3" data-n="3" aria-label="Workspace 3, experience and skills" inert>
    {@render chrome(54)}

    <Window id="exp" ws={3} label="experience.md" info="nvim · markdown" title="nvim: experience.md" closeLabel="experience">
      <Buffer id="exp" />
    </Window>
    <Window id="skills" ws={3} label="skills.toml" info="nvim · toml" title="nvim: skills.toml" closeLabel="skills">
      <Buffer id="skills" />
    </Window>
  </section>

  <section class="ws" id="ws-4" data-n="4" aria-label="Workspace 4, education, achievements, and GitHub" inert>
    {@render chrome(50)}

    <Window id="edu" ws={4} label="education" info="~/rutgers" title="education: rutgers" closeLabel="education" class="w-edu">
      <div class="win-body" tabindex="-1">
        <p class="cmd"><span class="u">guest@patra</span>:<span class="p">~/rutgers</span>$ cat degree</p>
        <h2 class="edu-name">{EDUCATION.school}</h2>
        <p class="edu-deg">{EDUCATION.degree}</p>
        <p class="edu-gpa"><span>gpa <b>{EDUCATION.gpa}</b> / 4.0</span><span>{EDUCATION.honors}</span></p>
        <p class="sub"><span aria-hidden="true">## </span>coursework ({COURSES.length})</p>
        <div class="tbl-wrap">
          <table class="courses">
            <thead><tr><th scope="col">code</th><th scope="col">course</th><th scope="col">status</th></tr></thead>
            <tbody>
              {#each COURSES as [code, name] (code)}
                <tr><td>{code}</td><td>{name}</td><td>completed</td></tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </Window>
    <Window id="ach" ws={4} label="achievements.log" info="nvim · log" title="nvim: achievements.log" closeLabel="achievements">
      <Buffer id="ach" />
    </Window>
    <Window id="gh" ws={4} label="github" info={PROFILE.githubUser} title="github: {PROFILE.githubUser}" closeLabel="GitHub" class="w-gh">
      <div class="win-body" tabindex="-1">
        <p class="cmd"><span class="u">guest@patra</span>:<span class="p">~</span>$ gh repo list {PROFILE.githubUser} --limit 4</p>
        <ul class="repos">
          {#each repos as r (r.url)}
            <li>
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                ><span class="repo-n"><span>{PROFILE.githubUser}/</span>{r.name}</span><span class="repo-l">{r.language ?? ""}</span><span class="repo-d"
                  >{r.description ?? ""}</span
                ></a
              >
            </li>
          {/each}
        </ul>
        <p class="gh-foot"><a class="lnk" href={PROFILE.github} target="_blank" rel="noopener noreferrer">{host(PROFILE.github)} ↗</a></p>
      </div>
    </Window>
  </section>

  <section class="ws" id="ws-5" data-n="5" aria-label="Workspace 5, contact" inert>
    {@render chrome(46)}

    <Window id="contact" ws={5} label="contact" info="~/contact" title="contact" closeLabel="contact">
      <div class="win-body" tabindex="-1">
        <p class="cmd"><span class="u">guest@patra</span>:<span class="p">~</span>$ cat contact</p>
        <p class="mail-l">email is the fastest way to reach me</p>
        <a class="mail" id="mailAddr" href="mailto:{PROFILE.email}">{PROFILE.email}</a>
        <div><button class="copy" type="button" data-copy={PROFILE.email}>copy address</button></div>
        <ul class="links">
          <li>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer"
              ><span class="k">github</span><span class="v">{PROFILE.githubUser}</span><span class="g" aria-hidden="true">↗</span></a
            >
          </li>
          <li>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer"
              ><span class="k">linkedin</span><span class="v">{PROFILE.linkedinUser}</span><span class="g" aria-hidden="true">↗</span></a
            >
          </li>
          <li>
            <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer" data-resume
              ><span class="k">resume</span><span class="v">{PROFILE.resume.slice(1)}</span><span class="g" aria-hidden="true">↗</span></a
            >
          </li>
        </ul>
      </div>
    </Window>
    <Window id="compose" ws={5} label="compose" info="new message" title="compose: new message" closeLabel="compose">
      <div class="win-body" tabindex="-1">
        <form class="compose" id="form" novalidate>
          <div class="hdrs">
            <div class="h"><span class="hk">To:</span><span class="hv">{PROFILE.name} &lt;{PROFILE.email}&gt;</span></div>
            <div class="h">
              <label class="hk" for="f-name">Name:</label><input
                id="f-name"
                name="name"
                type="text"
                autocomplete="name"
                placeholder="Your name"
                aria-describedby="f-name-err"
              />
              <p class="err" id="f-name-err" hidden></p>
            </div>
            <div class="h">
              <label class="hk" for="f-email">Email:</label><input
                id="f-email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                aria-describedby="f-email-err"
              />
              <p class="err" id="f-email-err" hidden></p>
            </div>
            <div class="h"><span class="hk">Subject:</span><span class="hv dim" id="subj">Portfolio contact from …</span></div>
          </div>
          <label class="body-l" for="f-msg">message</label>
          <textarea class="body-in" id="f-msg" name="message" rows="6" placeholder="What would you like to talk about?" aria-describedby="f-msg-err"></textarea>
          <p class="err" id="f-msg-err" hidden style="grid-column:1;margin-top:6px"></p>
          <div class="compose-foot">
            <button class="btn" type="submit">open draft in mail app ↗</button>
            <span class="note">or <kbd>Esc</kbd> then <kbd>:wq</kbd></span>
          </div>
          <p class="note" id="formNote" role="status" style="margin-top:10px">This opens a draft in your mail app. Nothing is sent from this page.</p>
        </form>
      </div>
    </Window>
  </section>
</main>

<p class="conky" id="conky"></p>

<div class="notes" id="notes" aria-live="polite"></div>

<div class="wk" id="wk" hidden aria-live="polite"><p class="wk-h" id="wkH"></p><dl class="wk-list" id="wkList"></dl></div>

<div class="hints" id="hints" aria-hidden="true" hidden></div>

<div class="rofi" id="rofi" hidden>
  <div class="rofi-scrim"></div>
  <div class="rofi-panel" role="dialog" aria-modal="true" aria-label="Launcher">
    <div class="rofi-in">
      <label for="rofiIn">run:</label>
      <input
        id="rofiIn"
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls="rofiList"
        aria-autocomplete="list"
        autocomplete="off"
        spellcheck="false"
        autocapitalize="off"
        placeholder="workspaces, projects, links, windows, colorschemes"
      />
      <span class="rofi-count" id="rofiCount"></span>
    </div>
    <ul class="rofi-list" id="rofiList" role="listbox" aria-label="Results"></ul>
    <p class="rofi-foot">↑ ↓ or ctrl j / k move · enter runs · esc closes</p>
  </div>
</div>

<div class="cmdl" id="cmdl" hidden>
  <div class="cmd-msg" id="cmdMsg" role="status" aria-live="polite" hidden></div>
  <form class="cmd-line" id="cmdForm" autocomplete="off" hidden>
    <label for="cmdIn">:</label><input id="cmdIn" type="text" spellcheck="false" autocapitalize="off" autocorrect="off" aria-label="Command line" />
  </form>
</div>

<KeysHelp />
<BootScreen />

<!-- Per-workspace chrome the layout engine shows when needed: the empty hint, monocle tabs and the master/stack divider. -->
{#snippet chrome(mfact: number)}
  <p class="ws-empty" hidden>workspace empty · press <kbd>/</kbd> to launch</p>
  <div class="tabs" hidden></div>
  <!-- A focusable window splitter: arrow keys, Home and End resize it (the ARIA separator pattern). -->
  <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
  <button
    class="mdiv"
    type="button"
    role="separator"
    aria-orientation="vertical"
    aria-label="Resize master area"
    aria-valuemin="20"
    aria-valuemax="80"
    aria-valuenow={mfact}
    hidden
  ></button>
{/snippet}
