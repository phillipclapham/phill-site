/**
 * phillipclapham.com — behaviour layer
 * Card tilt, click ripple, theme toggle, Conway's Life footer, console note.
 * Everything here degrades to nothing if JS fails; the page is readable without it.
 */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Theme ---- */
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      if (dark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme-preference", "light");
        toggle.textContent = "dark";
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme-preference", "dark");
        toggle.textContent = "light";
      }
    });
    toggle.textContent =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
  }

  /* ---- Card tilt + ripple ---- */
  document.querySelectorAll(".card").forEach(function (card) {
    if (!reduced) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "rotateY(" + px * 7 + "deg) rotateX(" + -py * 7 + "deg) translateZ(6px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    }
    card.addEventListener("click", function (e) {
      var r = card.getBoundingClientRect();
      var span = document.createElement("span");
      span.className = "ripple";
      var size = Math.max(r.width, r.height) * 2.1;
      span.style.width = span.style.height = size + "px";
      span.style.left = e.clientX - r.left + "px";
      span.style.top = e.clientY - r.top + "px";
      card.appendChild(span);
      setTimeout(function () {
        span.remove();
      }, 800);
    });
  });

  /* ---- Conway's Life: emergence from simple rules ----
     Newborn cells flare gold; settled cells cool to patina, so the
     emergence is legible rather than noise. */
  var cv = document.getElementById("life");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d");
    var CELL = 7;
    var cols, rows, grid, age;

    function seed() {
      var dpr = window.devicePixelRatio || 1;
      cv.width = cv.offsetWidth * dpr;
      cv.height = cv.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(cv.offsetWidth / CELL);
      rows = Math.ceil(cv.offsetHeight / CELL);
      grid = new Uint8Array(cols * rows);
      age = new Uint8Array(cols * rows);
      for (var i = 0; i < grid.length; i++) {
        grid[i] = Math.random() < 0.3 ? 1 : 0;
      }
    }

    function step() {
      var next = new Uint8Array(cols * rows);
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var n = 0;
          for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue;
              n += grid[((y + dy + rows) % rows) * cols + ((x + dx + cols) % cols)];
            }
          }
          var i = y * cols + x;
          next[i] = grid[i] ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
          age[i] = next[i] ? Math.min(age[i] + 1, 9) : 0;
        }
      }
      grid = next;
    }

    function draw() {
      ctx.clearRect(0, 0, cv.offsetWidth, cv.offsetHeight);
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var i = y * cols + x;
          if (!grid[i]) continue;
          ctx.fillStyle =
            age[i] < 2
              ? "rgba(227,199,126,0.5)"
              : "rgba(74,138,120," + (0.34 - age[i] * 0.022) + ")";
          ctx.fillRect(x * CELL, y * CELL, CELL - 1.5, CELL - 1.5);
        }
      }
    }

    seed();
    draw();
    if (!reduced) setInterval(function () { step(); draw(); }, 190);
    window.addEventListener("resize", function () { seed(); draw(); });
  }

  /* ---- Console ---- */
  if (window.console && console.log) {
    console.log(
      "%cbuild systems to be governed, not trusted.",
      "color:#c9a961;font-size:13px;font-family:monospace"
    );
    console.log(
      "%csource: github.com/phillipclapham/phill-site",
      "color:#6f6759;font-family:monospace"
    );
  }
})();
