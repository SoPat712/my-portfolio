<!-- Boot log, tuigreet greeter and i3lock-style lock screen. The engine drives all three. -->
<div class="boot" id="boot" aria-hidden="true" hidden>
  <div class="boot-log" id="bootLog"></div>
  <div class="greeter" id="greeter" hidden>
    <div class="gr-box">
      <p class="gr-tl">tuigreet</p>
      <p class="gr-clock" id="grClock"></p>
      <p class="gr-date" id="grDate"></p>
      <p class="gr-wel">Welcome to patra</p>
      <div class="gr-fields">
        <p><span class="gk">Username:</span><span><span id="grUser"></span><span class="gr-caret" id="grCaret"></span></span></p>
        <p><span class="gk">Session:</span><span>tiling</span></p>
      </div>
      <p class="gr-status" id="grStatus"></p>
    </div>
  </div>
  <div class="lockscr" id="lockscr" hidden>
    <p class="lk-clock" id="lkClock"></p>
    <p class="lk-date" id="lkDate"></p>
    <div class="lk-ring" id="lkRing"></div>
    <p class="lk-hint">type anything to unlock</p>
  </div>
  <button class="boot-skip" id="bootSkip" type="button" tabindex="-1">skip ›</button>
</div>
