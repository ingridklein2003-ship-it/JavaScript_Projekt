"use strict";

/**
 * Faaborg ØH – Næste kamp + Mini-quiz
 * Dækker: JS + placering/udførelse, debugging, variabler/typer, operatorer,
 * arrays, if/else, loops, objekter, DOM, funktioner, scope (let/const), events,
 * (valgfrit) library: dayjs.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ===== Debugging =====
  const DEBUG = true;
  const log = (...args) => DEBUG && console.log("[FØH Widget]", ...args);

  // ===== (Valgfrit) Library: dayjs =====
  // Hvis du må: læg i HTML før din egen js:
  // <script src="https://unpkg.com/dayjs/dayjs.min.js"></script>
  // <script src="https://unpkg.com/dayjs/plugin/relativeTime.js"></script>
  // <script>dayjs.extend(dayjs_plugin_relativeTime)</script>
  const hasDayjs = typeof window.dayjs === "function";

  // ===== Data (objekter + typer) =====
  const nextMatch = {
    opponent: "Otterup serie",
    dateISO: "2026-02-15T14:19:45", // <-- ret dato/tid
    venue: "faaborg-hallen",
  };

  const quiz = [
    {
      id: 1,
      q: "Hvad gør 'let' ift. scope?",
      choices: ["Function-scope", "Block-scope", "Global-scope altid"],
      answerIndex: 1,
      explain: "let er block-scoped (fx inde i if/for).",
    },
    {
      id: 2,
      q: "Hvad giver 2 + '2' i JavaScript?",
      choices: ["4", "'22'", "NaN"],
      answerIndex: 1,
      explain: "+ laver string-konkatenation hvis en operand er string.",
    },
    {
      id: 3,
      q: "Hvilket event bruger man typisk på en knap?",
      choices: ["click", "hover", "resize"],
      answerIndex: 0,
      explain: "click er standard på knapper.",
    },
  ];

  const state = {
    quizIndex: 0,
    score: 0,
    answers: [],
  };

  // ===== Find "Hovedsponsorer" og indsæt lige over =====
  const sponsorSection = findHeadSponsorSection();
  const mount = document.createElement("section");
  mount.id = "foh-widget";
  mount.style.maxWidth = "900px";
  mount.style.margin = "16px auto";
  mount.style.padding = "16px";
  mount.style.border = "2px solid #111";
  mount.style.borderRadius = "14px";
  mount.style.background = "rgba(255,255,255,0.85)";

  if (sponsorSection?.parentNode) {
    sponsorSection.parentNode.insertBefore(mount, sponsorSection);
    log("Indsat lige over Hovedsponsorer ✅", sponsorSection);
  } else {
    // fallback: øverst i main/body
    (document.querySelector("main") || document.body).prepend(mount);
    log("Kunne ikke finde Hovedsponsorer – indsatte øverst som fallback ⚠️");
  }

  // ===== Render =====
  render();

  // ===== Funktioner =====
  function findHeadSponsorSection() {
    // 1) Prøv typiske selectors først
    const direct =
      document.querySelector("#hovedsponsorer") ||
      document.querySelector(".hovedsponsorer") ||
      document.querySelector(".head-sponsors") ||
      document.querySelector("[data-section='hovedsponsorer']");
    if (direct) return direct;

    // 2) Ellers: find en overskrift der indeholder “hoved sponsor”
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4"));
    for (const h of headings) {
      const txt = (h.textContent || "").toLowerCase().replace(/\s+/g, " ").trim();
      if (txt.includes("hoved") && txt.includes("sponsor")) {
        // DOM: find nærmeste “sektion”
        return h.closest("section,div,article") || h.parentElement;
      }
    }
    return null;
  }

  function render() {
    mount.innerHTML = `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:18px;font-weight:800;">Faaborg ØH Håndbold</div>
          <div style="font-size:13px;opacity:.85;">Næste kamp + Mini-quiz</div>
        </div>
        <div style="font-size:12px;opacity:.8;">
          ${new Date().toLocaleString("da-DK")}
        </div>
      </div>

      <hr style="margin:12px 0;" />

      <div style="display:grid;grid-template-columns:1fr;gap:12px;">
        <div style="padding:12px;border:1px solid #111;border-radius:12px;">
          <div style="font-weight:700;margin-bottom:6px;">🏟️ Næste kamp</div>
          <div><strong>Modstander:</strong> ${escapeHtml(nextMatch.opponent)}</div>
          <div><strong>Sted:</strong> ${escapeHtml(nextMatch.venue)}</div>
          <div><strong>Tid:</strong> ${formatMatchTime(nextMatch.dateISO)}</div>
          <div style="margin-top:8px;">
            <span style="font-weight:700;">⏳ Nedtælling:</span>
            <span id="countdownText">...</span>
          </div>
          <button id="remindBtn"
            style="margin-top:10px;padding:10px 12px;border:2px solid #111;border-radius:10px;cursor:pointer;">
            Vis kamp-info (debug)
          </button>
        </div>

        <div style="padding:12px;border:1px solid #111;border-radius:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
            <div style="font-weight:700;">🧠 Mini-quiz</div>
            <div style="font-size:12px;">Score: <strong>${state.score}</strong> / ${quiz.length}</div>
          </div>

          ${renderQuizInner()}
        </div>
      </div>
    `;

    // Events
    mount.querySelector("#remindBtn")?.addEventListener("click", () => {
      // Debugging + objekter
      log("Kamp-objekt:", nextMatch);
      alert(`Næste kamp:\n${nextMatch.opponent}\n${nextMatch.venue}\n${formatMatchTime(nextMatch.dateISO)}`);
    });

    wireQuizEvents();
  }

  function renderQuizInner() {
    const q = quiz[state.quizIndex];

    // if/else
    if (!q) {
      // loops: lav en kort opsummering
      let summary = "";
      for (const a of state.answers) {
        summary += `• ${a.correct ? "✅" : "❌"} ${a.text}\n`;
      }

      return `
        <div style="margin-top:8px;">
          <div style="font-weight:700;">Færdig! 🎉</div>
          <div style="margin-top:6px;white-space:pre-line;font-size:13px;">${escapeHtml(summary)}</div>
          <button id="restartQuizBtn"
            style="margin-top:10px;padding:10px 12px;border:2px solid #111;border-radius:10px;cursor:pointer;">
            Prøv igen
          </button>
        </div>
      `;
    }

    return `
      <form id="quizForm" style="margin-top:8px;">
        <div style="font-size:14px;margin-bottom:8px;">
          <strong>Spørgsmål ${state.quizIndex + 1}:</strong> ${escapeHtml(q.q)}
        </div>

        ${q.choices
          .map(
            (c, i) => `
            <label style="display:block;padding:8px;border:1px solid #111;border-radius:10px;margin:8px 0;cursor:pointer;">
              <input type="radio" name="choice" value="${i}" style="margin-right:8px;" />
              ${escapeHtml(c)}
            </label>
          `
          )
          .join("")}

        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
          <button type="submit"
            style="padding:10px 12px;border:2px solid #111;border-radius:10px;cursor:pointer;">
            Svar
          </button>
          <button type="button" id="skipBtn"
            style="padding:10px 12px;border:2px dashed #111;border-radius:10px;cursor:pointer;">
            Spring over
          </button>
        </div>

        <p id="feedback" style="margin-top:10px;font-weight:700;"></p>
      </form>
    `;
  }

  function wireQuizEvents() {
    const form = mount.querySelector("#quizForm");
    const feedback = mount.querySelector("#feedback");
    const skipBtn = mount.querySelector("#skipBtn");
    const restartBtn = mount.querySelector("#restartQuizBtn");

    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        state.quizIndex = 0;
        state.score = 0;
        state.answers = [];
        render();
      });
      return;
    }

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // scope demo: let i blok
      let pickedIndex = null;
      const picked = new FormData(form).get("choice");
      if (picked !== null) pickedIndex = Number(picked);

      // operatorer + if/else
      if (pickedIndex === null || Number.isNaN(pickedIndex)) {
        feedback.textContent = "Vælg et svar først 🙂";
        return;
      }

      const q = quiz[state.quizIndex];
      const correct = pickedIndex === q.answerIndex;

      // arrays + objekter
      state.answers.push({
        questionId: q.id,
        correct,
        text: q.q,
      });

      if (correct) state.score += 1;

      // debugging
      log("Svar:", { q: q.q, pickedIndex, correct });
      DEBUG && console.table([{ question: q.q, pickedIndex, correct }]);
      // debugger;

      feedback.textContent = correct ? `✅ Korrekt! ${q.explain}` : `❌ Forkert. ${q.explain}`;

      // udførelse: lille delay før næste
      setTimeout(() => {
        state.quizIndex += 1;
        render();
      }, 900);
    });

    skipBtn?.addEventListener("click", () => {
      state.answers.push({
        questionId: quiz[state.quizIndex]?.id,
        correct: false,
        text: quiz[state.quizIndex]?.q ?? "(ukendt)",
      });
      state.quizIndex += 1;
      render();
    });
  }

  function formatMatchTime(iso) {
    const d = new Date(iso);
    if (hasDayjs) return window.dayjs(d).format("DD-MM-YYYY HH:mm");
    return new Intl.DateTimeFormat("da-DK", { dateStyle: "short", timeStyle: "short" }).format(d);
  }

  // ===== Countdown (loops via interval + operatorer) =====
  const countdownEl = () => mount.querySelector("#countdownText");
  const targetMs = new Date(nextMatch.dateISO).getTime();

  setInterval(() => {
    const el = countdownEl();
    if (!el) return;

    const now = Date.now();
    let diff = targetMs - now;

    // if/else
    if (diff <= 0) {
      el.textContent = "Kampen er i gang (eller spillet) 🟢";
      return;
    }

    // operatorer + math
    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / (24 * 3600));
    const hours = Math.floor((sec % (24 * 3600)) / 3600);
    const mins = Math.floor((sec % 3600) / 60);

    el.textContent = `${days}d ${hours}t ${mins}m`;
  }, 1000);

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[m]));
  }
});
