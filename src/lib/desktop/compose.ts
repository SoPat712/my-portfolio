// The compose window: a small form that hands the visitor's message to their mail app as a draft. Nothing is sent
// from the page.
import { PROFILE } from "$lib/content";
import { $ } from "./shared";

type Field = { el: HTMLInputElement | HTMLTextAreaElement; err: HTMLElement; check: (v: string) => true | string };

/** Wires up the form. Returns its submit, which is true when the draft was handed off, or the first problem. */
export function setupCompose() {
  const subj = $("#subj");
  const fields: Record<"name" | "email" | "msg", Field> = {
    name: {
      el: $<HTMLInputElement>("#f-name"),
      err: $("#f-name-err"),
      check: (v) => v.length >= 2 || "Enter your name (at least 2 characters).",
    },
    email: {
      el: $<HTMLInputElement>("#f-email"),
      err: $("#f-email-err"),
      check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter an email address like you@example.com.",
    },
    msg: {
      el: $<HTMLTextAreaElement>("#f-msg"),
      err: $("#f-msg-err"),
      check: (v) => v.length >= 20 || `Write at least 20 characters (${v.length} so far).`,
    },
  };

  fields.name.el.addEventListener("input", () => {
    const n = fields.name.el.value.trim();
    subj.textContent = `Portfolio contact from ${n || "…"}`;
    subj.classList.toggle("dim", !n);
  });
  for (const f of Object.values(fields)) {
    f.el.addEventListener("input", () => {
      if (f.el.getAttribute("aria-invalid") !== "true") return;
      f.el.removeAttribute("aria-invalid");
      f.err.hidden = true;
    });
  }

  function submit(focusBad = true): true | string {
    let firstBad: Field | null = null,
      firstMsg = "";
    for (const f of Object.values(fields)) {
      const r = f.check(f.el.value.trim());
      f.err.hidden = r === true;
      if (r === true) {
        f.el.removeAttribute("aria-invalid");
        continue;
      }
      f.el.setAttribute("aria-invalid", "true");
      f.err.textContent = r;
      if (!firstBad) {
        firstBad = f;
        firstMsg = r;
      }
    }
    if (firstBad) {
      if (focusBad) firstBad.el.focus();
      return firstMsg;
    }
    const name = fields.name.el.value.trim(),
      email = fields.email.el.value.trim(),
      msg = fields.msg.el.value.trim();
    const first = PROFILE.name.split(" ")[0];
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`Hi ${first},\n\n${msg}\n\nThanks,\n${name}\n${email}`);
    const a = document.createElement("a");
    a.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    a.click();
    $("#formNote").textContent =
      `Your mail app should open with this draft. If nothing opened, copy the address and email ${PROFILE.email} directly.`;
    return true;
  }

  $("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    submit(true);
  });
  return submit;
}
