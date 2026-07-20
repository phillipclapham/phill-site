/**
 * founder-copy.js — the half of the toggle that changes what the site SAYS.
 *
 * founder-mode.js has always dispatched `founderModeChange` with a comment
 * promising content transformation as "future expansion." That expansion was
 * never built — every version in git mutates exactly one string, the 🌀 icon.
 * This is that half, and it runs in the direction Phill actually wanted.
 *
 * THE DIRECTION. The site's default copy is the real, considered voice, and
 * that is what every visitor lands on. Finding the 🌀 in the footer turns the
 * presentation DOWN (motion off, calm rings) and the WORDS UP: the same claims,
 * told stranger. Two axes moving opposite. The weird version is a reward for
 * poking at the thing, not an ambush for someone arriving from a job posting.
 *
 * WHAT IT IS NOT. An earlier draft made the toggle produce LinkedIn-safe
 * corporate copy as satire. Killed, correctly: the joke only lands for a reader
 * already holding the argument in their head, and everyone else just reads bland
 * claims in Phill's name on Phill's site. Satire that requires a footnote is a
 * liability on a credibility surface.
 *
 * THE CONSTRAINT ON STRANGE COPY. Every alternate must still be TRUE and still
 * carry the same receipt as the line it replaces. Turned up, not made up. The
 * ledger's Receipt column does not move when the toggle fires, so a strange
 * claim that its receipt no longer supports would break the site's one rule.
 *
 * HOW COPY IS AUTHORED. In the HTML, next to the line it replaces:
 *
 *   <p class="hero-claim" data-strange="Nothing in here is thinking. …">
 *     Intelligence is an arrangement, not a <em>substance</em>.
 *   </p>
 *
 * The default text is the real markup, so JS-off readers get the considered
 * voice and lose only the easter egg.
 *
 * SAFETY. Alternates are applied with textContent, never innerHTML, so the
 * attribute cannot inject markup. The original is captured once as innerHTML and
 * restored verbatim, preserving <em> emphasis a flat attribute cannot carry.
 */
(function () {
  "use strict";

  var nodes = document.querySelectorAll("[data-strange]");
  if (!nodes.length) return;

  var ORIGINAL = "__composedHTML";

  function toStrange() {
    nodes.forEach(function (el) {
      if (el[ORIGINAL] === undefined) el[ORIGINAL] = el.innerHTML;
      var alt = el.getAttribute("data-strange");
      if (alt) el.textContent = alt;
    });
  }

  function toComposed() {
    nodes.forEach(function (el) {
      if (el[ORIGINAL] !== undefined) el.innerHTML = el[ORIGINAL];
    });
  }

  // Rewriting several headings and claims in place is silent to a screen
  // reader — the user hears nothing and has no reason to re-read the page.
  // One polite live region announces the switch instead of making six
  // separate elements announce themselves.
  var announcer = null;
  function announce(message) {
    if (!announcer) {
      announcer = document.createElement("p");
      announcer.className = "sr-only";
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("role", "status");
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  }

  // `active` is founder-mode's default-ON state = the composed voice.
  // Toggled OFF ("raw") is where the words get stranger.
  function apply(active, speak) {
    if (active) toComposed();
    else toStrange();
    if (speak) {
      announce(
        active
          ? "Composed voice restored."
          : "Raw mode. The wording on this page has changed."
      );
    }
  }

  // Nothing to announce on first paint — this is simply how the page loaded.
  apply(document.documentElement.getAttribute("data-mode") !== "raw", false);

  window.addEventListener("founderModeChange", function (e) {
    apply(!!(e.detail && e.detail.active), true);
  });
})();
