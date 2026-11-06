<!-- The :help sheet. Opened by ?, <Space>?, :help &#123;topic&#125; (scrolls to #help-&#123;topic&#125;) and the bar button. -->
<div class="win kwin" id="keys" role="dialog" aria-modal="false" aria-labelledby="keysT" hidden>
  <div class="win-bar"><span class="win-t" id="keysT">help.txt · keybindings</span><span class="win-i">:help patra</span><button class="x" id="keysClose" type="button" aria-label="Close keybindings">×</button></div>
  <div class="win-body help" id="keysBody" tabindex="-1">
    <div class="help-top">
      <p><span class="tag">*patra-keys*</span>  patra keybindings, written like <span class="tag">:help</span></p>
      <button class="vim-tog" id="vimTog" type="button" aria-pressed="true">vim keys <span class="sw" id="vimTogSw">on</span></button>
    </div>
    <p>Single-key shortcuts only work when focus is not in a text field. Turn them off here or with <b>:set novim</b>; CTRL-K and &lt;Esc&gt; always work.</p>

    <h3 class="hd" id="help-tutor"><span>1. Tutor</span><span class="tag">*patra-tutor*</span></h3>
    <ol>
      <li>1  Press <b>f</b>, then type a label, to click anything on screen.</li>
      <li>2  Press <b>&lt;Space&gt;</b> and wait: a menu lists what comes next.</li>
      <li>3  Press <b>w</b> then <b>l</b> to move to the window on the right.</li>
      <li>4  Type <b>:ls</b> and press &lt;Enter&gt; to list open windows.</li>
      <li>5  Press <b>/</b> and type <b>flutter</b> to find a project.</li>
      <li>6  In the terminal, try <b>grep flutter</b> or <b>man patra</b>.</li>
      <li>7  Press <b>&lt;Esc&gt;</b> to back out of anything.</li>
    </ol>

    <h3 class="hd" id="help-normal"><span>2. Normal mode</span><span class="tag">*patra-normal*</span></h3>
    <dl>
      <dt>1 … 5</dt><dd>switch workspace</dd>
      <dt>gt  gT</dt><dd>next / previous workspace</dd>
      <dt>h  l</dt><dd>focus the window to the left / right</dd>
      <dt>j  k</dt><dd>down / up: the focused app's own motion, else scroll, else the window below / above</dd>
      <dt>gg  G</dt><dd>top / bottom of the focused window</dd>
      <dt>d  u</dt><dd>half a page down / up (also CTRL-D  CTRL-U)</dd>
      <dt>i  a</dt><dd>focus the window's input (terminal prompt, compose)</dd>
      <dt>n  N</dt><dd>next / previous project, in a project window</dd>
      <dt>f  F</dt><dd>link hints; F opens links in a new tab</dd>
      <dt>/</dt><dd>find: the launcher</dd>
      <dt>:</dt><dd>command line</dd>
      <dt>?</dt><dd>this help</dd>
      <dt>&lt;Esc&gt;</dt><dd>close the topmost thing: launcher, command line, popup, help, project window</dd>
    </dl>
    <p>In files: j  k move, gg  G jump, l  o  &lt;Enter&gt; open. In a project window: h goes back to the list. In buffers (experience.md, skills.toml, achievements.log): j  k move the cursor line.</p>

    <h3 class="hd" id="help-window"><span>3. Windows</span><span class="tag">*patra-window*</span></h3>
    <p>w is the window prefix, standing in for CTRL-W, which browsers keep for themselves.</p>
    <dl>
      <dt>w h  w j  w k  w l</dt><dd>focus left / down / up / right</dd>
      <dt>w w  w W</dt><dd>next / previous window</dd>
      <dt>w q</dt><dd>close the window</dd>
      <dt>w o</dt><dd>toggle monocle (one window, tab strip)</dd>
      <dt>w =</dt><dd>reset the master / stack split</dd>
      <dt>w &lt;  w &gt;</dt><dd>shrink / grow the master area</dd>
      <dt>w H  w L</dt><dd>make the window master / send master to the stack</dd>
    </dl>
    <p>Layouts: tile []=, monocle [M], float &gt;&lt;&gt;. Click the symbol in the bar, or &lt;Space&gt;l. In float, drag a title bar to move and the corner to resize. Drag the line between master and stack to resize it.</p>

    <h3 class="hd" id="help-leader"><span>4. Leader</span><span class="tag">*patra-leader*</span></h3>
    <dl>
      <dt>&lt;Space&gt;f</dt><dd>find (launcher)</dd>
      <dt>&lt;Space&gt;e</dt><dd>explorer (files)</dd>
      <dt>&lt;Space&gt;c</dt><dd>cycle colorscheme</dd>
      <dt>&lt;Space&gt;l</dt><dd>cycle layout</dd>
      <dt>&lt;Space&gt;r</dt><dd>open the résumé</dd>
      <dt>&lt;Space&gt;m</dt><dd>compose mail</dd>
      <dt>&lt;Space&gt;?</dt><dd>this help</dd>
    </dl>

    <h3 class="hd" id="help-hints"><span>5. Hints</span><span class="tag">*patra-hints*</span></h3>
    <p>f labels every visible link, button and field. Type a label to activate it; &lt;BS&gt; edits, &lt;Esc&gt; cancels. F opens links in a new tab.</p>

    <h3 class="hd" id="help-search"><span>6. Find</span><span class="tag">*patra-search*</span></h3>
    <p>/ or CTRL-K opens the launcher. Type to fuzzy-filter workspaces, projects, links, windows, colorschemes and layouts. &lt;Up&gt; &lt;Down&gt;, CTRL-J CTRL-K or &lt;Tab&gt; move; &lt;Enter&gt; runs.</p>

    <h3 class="hd" id="help-cmdline"><span>7. Command line</span><span class="tag">*patra-cmdline*</span></h3>
    <dl>
      <dt>:q  :q!</dt><dd>close the focused window</dd>
      <dt>:qa</dt><dd>close every window on this workspace</dd>
      <dt>:w  :wq  :x</dt><dd>open the compose draft in your mail app (:wq also closes compose)</dd>
      <dt>:e &#123;file&#125;</dt><dd>open a window or project, e.g. :e skills.toml, :e allstarr</dd>
      <dt>:ls  :b &#123;n&#125;</dt><dd>list windows as buffers, jump to one</dd>
      <dt>:1 … :5</dt><dd>workspace (also :tabn  :tabp)</dd>
      <dt>:Ex  :terminal</dt><dd>files, terminal</dd>
      <dt>:colorscheme &#123;name&#125;</dt><dd>oxide, paper or sodium</dd>
      <dt>:layout &#123;name&#125;</dt><dd>tile, monocle or float</dd>
      <dt>:set novim</dt><dd>turn single-key shortcuts off (:set vim turns them on)</dd>
      <dt>:help &#123;topic&#125;</dt><dd>tutor, normal, window, leader, hints, search, cmdline, insert</dd>
    </dl>
    <p>Terminal commands also work here, e.g. :grep flutter. &lt;Tab&gt; completes, &lt;Up&gt; &lt;Down&gt; recall history.</p>

    <h3 class="hd" id="help-insert"><span>8. Insert mode and the terminal</span><span class="tag">*patra-insert*</span></h3>
    <p>Any focused text field is INSERT mode; &lt;Esc&gt; leaves it. In the terminal:</p>
    <dl>
      <dt>&lt;Tab&gt;</dt><dd>complete commands, files, projects</dd>
      <dt>&lt;Up&gt;  &lt;Down&gt;</dt><dd>history</dd>
      <dt>CTRL-R</dt><dd>reverse search history; CTRL-R again for older, &lt;Enter&gt; runs, &lt;Esc&gt; cancels</dd>
      <dt>CTRL-A  CTRL-E</dt><dd>start / end of line</dd>
      <dt>CTRL-U  CTRL-K</dt><dd>delete to start / end of line</dd>
      <dt>CTRL-C  CTRL-L</dt><dd>cancel the line / clear the screen</dd>
    </dl>
    <p>Try help, man patra, neofetch, tree, grep flutter, ps, cal, fortune, git log --oneline.</p>

    <h3 class="hd" id="help-mouse"><span>9. Mouse and phones</span><span class="tag">*patra-mouse*</span></h3>
    <p>Everything works by mouse: the bar, close buttons, the split line, and the launcher behind “run”. On phones the windows stack, a project opens as a full sheet, and the vim keys stay off.</p>
  </div>
</div>
