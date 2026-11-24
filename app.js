/* Vocabulary Trainer - app.js
   You do not need to edit this file. Add words in words.js instead. */
(function () {
  "use strict";

  /* ---------- prepare the data ---------- */
  const ALL = [], BYK = {};
  LEVELS.forEach(l => l.units.forEach(u => u.words.forEach(w => {
    w.k = u.id + "|" + w.w; w.level = l.name; w.unitId = u.id;
    ALL.push(w); BYK[w.k] = w;
  })));

  /* ---------- saved progress (in the student's own browser) ---------- */
  const STORE = "vocabTrainer.v1";
  const fresh = () => ({ lang: "uz", box: {}, wrong: {}, streak: { last: "", count: 0 }, reviewed: 0 });
  let state = load();
  function load() {
    try { const s = JSON.parse(localStorage.getItem(STORE)); if (s) return Object.assign(fresh(), s); } catch (e) {}
    return fresh();
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }

  /* ---------- small helpers ---------- */
  const $ = s => document.querySelector(s);
  const app = $("#app");
  let current = null; // function that redraws the current screen (used when language changes)

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function norm(s) { return String(s).toLowerCase().replace(/\s+/g, " ").trim(); }

  /* the meaning shown to the student depends on the chosen language */
  function meaning(it) {
    if (state.lang === "uz" && it.uz) return it.uz;
    if (state.lang === "ru" && it.ru) return it.ru;
    return it.def;
  }

  function speak(text) {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; u.rate = 0.9;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ---------- streak ---------- */
  function ds(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function yesterday() { const y = new Date(); y.setDate(y.getDate() - 1); return ds(y); }
  function streakNow() {
    const s = state.streak;
    return (s.last === ds(new Date()) || s.last === yesterday()) ? s.count : 0;
  }
  function badge() { const n = streakNow(); $("#streak").textContent = "🔥 " + n + " day" + (n === 1 ? "" : "s"); }
  function touch() {
    const t = ds(new Date());
    if (state.streak.last === t) return;
    state.streak.count = (state.streak.last === yesterday()) ? state.streak.count + 1 : 1;
    state.streak.last = t; save(); badge();
  }

  /* ---------- spaced repetition (Leitner boxes 1-5) ---------- */
  const boxOf = k => state.box[k] || 0;          // 0 = never studied
  const learned = k => boxOf(k) >= 4;            // box 4 or 5 = learned
  function mark(it, ok) {
    touch();
    const b = boxOf(it.k);
    if (ok) { state.box[it.k] = b === 0 ? 2 : Math.min(5, b + 1); delete state.wrong[it.k]; }
    else { state.box[it.k] = 1; state.wrong[it.k] = true; }
    state.reviewed++; save();
  }

  /* ---------- HOME ---------- */
  function home() {
    current = home; badge();
    let h = "<h2>Choose a level</h2>";
    LEVELS.forEach(l => {
      h += `<h3>${esc(l.name)}</h3><div class="grid">`;
      l.units.forEach(u => {
        const n = u.words.filter(w => learned(w.k)).length, p = pct(n, u.words.length);
        h += `<button class="card" data-unit="${esc(u.id)}"><b>${esc(u.title)}</b>
              <span>${u.words.length} words</span>
              <div class="bar"><i style="width:${p}%"></i></div><small>${p}% learned</small></button>`;
      });
      h += "</div>";
    });
    app.innerHTML = h;
    app.querySelectorAll("[data-unit]").forEach(b => b.onclick = () => {
      let found;
      LEVELS.forEach(l => l.units.forEach(u => { if (u.id === b.dataset.unit) found = { l, u }; }));
      menu(found.l.name + " · " + found.u.title, found.u.words);
    });
  }

  /* ---------- MODE MENU ---------- */
  function menu(title, pool) {
    current = () => menu(title, pool);
    const toRev = pool.filter(i => !learned(i.k)).length;
    const wrongN = pool.filter(i => state.wrong[i.k]).length;
    app.innerHTML = `
      <button class="link" id="back">← Back</button>
      <h2>${esc(title)}</h2><p class="muted">${pool.length} words</p>
      <div class="grid">
        <button class="card" data-m="fc"><b>🃏 Flashcards</b><span>Flip, listen and sort</span></button>
        <button class="card" data-m="mc"><b>✅ Multiple choice</b><span>Pick the right meaning</span></button>
        <button class="card" data-m="ty"><b>⌨️ Type the word</b><span>Write the English word</span></button>
        <button class="card" data-m="ma"><b>🔗 Matching</b><span>Connect the pairs</span></button>
      </div>
      <div class="opts">
        <label><input type="checkbox" id="oRev"> Only words not learned yet (${toRev})</label>
        <label><input type="checkbox" id="oWr"> Only my mistakes (${wrongN})</label>
        <label><input type="checkbox" id="oSh" checked> Shuffle</label>
      </div>
      <h3>Word list</h3>
      <ul class="wl">${pool.map(i => `<li><button class="say" data-say="${esc(i.w)}">🔊</button>
        <div><b>${esc(i.w)}</b> <em>${esc(i.pos || "")}</em><br><span>${esc(meaning(i))}</span></div></li>`).join("")}</ul>`;
    $("#back").onclick = home;
    const modes = { fc: flash, mc: quizMC, ty: quizType, ma: matching };
    app.querySelectorAll("[data-m]").forEach(b => b.onclick = () => {
      let p = pool.slice();
      if ($("#oRev").checked) p = p.filter(i => !learned(i.k));
      if ($("#oWr").checked) p = p.filter(i => state.wrong[i.k]);
      if (!p.length) { alert("No words match these options."); return; }
      if (b.dataset.m === "ma" && p.length < 2) { alert("Matching needs at least 2 words."); return; }
      if ($("#oSh").checked) p = shuffle(p);
      modes[b.dataset.m](title, p, () => menu(title, pool));
    });
  }

  /* ---------- finish screen ---------- */
  function done(msg, back, again) {
    current = null; badge();
    app.innerHTML = `<div class="center"><div class="big">🎉</div><h2>Well done!</h2><p>${esc(msg)}</p>
      <div class="row"><button class="btn" id="again">Practise again</button>
      <button class="btn ghost" id="bk">Back</button></div></div>`;
    $("#again").onclick = again; $("#bk").onclick = back;
  }

  /* ---------- FLASHCARDS ---------- */
  function flash(title, deck, back) {
    current = null;
    const queue = deck.slice(), total = deck.length;
    let know = 0, learn = 0, front = true;

    function draw() {
      if (!queue.length) return done(`You knew ${know} cards and marked ${learn} to practise again.`, back, () => flash(title, shuffle(deck), back));
      const it = queue[0]; front = true;
      const left = new Set(queue.map(x => x.k)).size;
      app.innerHTML = `
        <button class="link" id="back">← Stop</button>
        <div class="prog"><i style="width:${pct(total - left, total)}%"></i></div>
        <p class="muted">${left} word${left === 1 ? "" : "s"} left</p>
        <div class="flip" id="flip"></div>
        <div class="row" id="btns" hidden>
          <button class="btn again" id="no">Still learning</button>
          <button class="btn good" id="yes">I know it</button>
        </div>`;
      $("#back").onclick = back;
      const card = $("#flip");
      function face() {
        if (front) {
          card.innerHTML = `<div class="big">${esc(it.w)}</div><em class="muted">${esc(it.pos || "")}</em>
            <button class="say" data-say="${esc(it.w)}">🔊</button><small class="muted">Tap the card to flip</small>`;
        } else {
          const m = meaning(it);
          card.innerHTML = `<div class="big sm">${esc(m)}</div>
            ${m !== it.def ? `<p>${esc(it.def)}</p>` : ""}<p class="ex">“${esc(it.ex || "")}”</p>`;
        }
        $("#btns").hidden = front;
      }
      card.onclick = e => { if (e.target.closest("[data-say]")) return; front = !front; face(); };
      $("#yes").onclick = () => { mark(it, true); know++; queue.shift(); draw(); };
      $("#no").onclick = () => { mark(it, false); learn++; queue.shift(); queue.splice(Math.min(4, queue.length), 0, it); draw(); };
      face();
    }
    draw();
  }

  /* ---------- MULTIPLE CHOICE ---------- */
  function quizMC(title, deck, back) {
    current = null;
    let i = 0, score = 0;
    function q() {
      if (i >= deck.length) return done(`Score: ${score} / ${deck.length}`, back, () => quizMC(title, shuffle(deck), back));
      const it = deck[i];
      const cand = ALL.filter(x => x.k !== it.k && meaning(x) !== meaning(it));
      const picks = shuffle(cand.filter(x => x.level === it.level)).concat(shuffle(cand.filter(x => x.level !== it.level))).slice(0, 3);
      const opts = shuffle([it].concat(picks));
      app.innerHTML = `
        <button class="link" id="back">← Stop</button>
        <div class="prog"><i style="width:${pct(i, deck.length)}%"></i></div>
        <div class="qbox"><p class="muted">Question ${i + 1} of ${deck.length}</p>
          <div class="big">${esc(it.w)} <button class="say" data-say="${esc(it.w)}">🔊</button></div>
          <p>What does it mean?</p></div>
        <div class="opts-col">${opts.map(o => `<button class="opt" data-k="${esc(o.k)}">${esc(meaning(o))}</button>`).join("")}</div>
        <div id="next"></div>`;
      $("#back").onclick = back;
      const btns = app.querySelectorAll(".opt");
      btns.forEach(b => b.onclick = () => {
        const ok = b.dataset.k === it.k;
        btns.forEach(x => { x.disabled = true; if (x.dataset.k === it.k) x.classList.add("ok"); });
        if (!ok) b.classList.add("bad"); else score++;
        mark(it, ok);
        $("#next").innerHTML = `<div class="row"><button class="btn" id="nx">${i + 1 >= deck.length ? "Finish" : "Next"}</button></div>`;
        $("#nx").onclick = () => { i++; q(); };
      });
    }
    q();
  }

  /* ---------- TYPE THE WORD ---------- */
  function quizType(title, deck, back) {
    current = null;
    let i = 0, score = 0;
    function hint(it) {
      const ex = it.ex || "", at = ex.toLowerCase().indexOf(it.w.toLowerCase());
      return at >= 0 ? ex.slice(0, at) + "_____" + ex.slice(at + it.w.length) : "";
    }
    function q() {
      if (i >= deck.length) return done(`Score: ${score} / ${deck.length}`, back, () => quizType(title, shuffle(deck), back));
      const it = deck[i], h = hint(it);
      let answered = false;
      app.innerHTML = `
        <button class="link" id="back">← Stop</button>
        <div class="prog"><i style="width:${pct(i, deck.length)}%"></i></div>
        <div class="qbox"><p class="muted">Question ${i + 1} of ${deck.length}</p>
          <div class="big sm">${esc(meaning(it))}</div>
          <p class="muted">${esc(it.pos || "")} · ${it.w.length} characters · starts with “${esc(it.w[0])}”</p>
          ${h ? `<p class="ex">${esc(h)}</p>` : ""}</div>
        <input id="ans" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Type the English word">
        <div class="row"><button class="btn" id="chk">Check</button></div><div id="fb"></div>`;
      $("#back").onclick = back;
      const input = $("#ans"); input.focus();
      function act() {
        if (answered) { i++; q(); return; }
        const ok = norm(input.value) === norm(it.w);
        answered = true; input.disabled = true;
        if (ok) score++;
        mark(it, ok);
        $("#fb").innerHTML = ok ? `<div class="fb ok">Correct! ✔</div>` : `<div class="fb bad">Not quite. The answer is: ${esc(it.w)}</div>`;
        $("#chk").textContent = i + 1 >= deck.length ? "Finish" : "Next";
      }
      $("#chk").onclick = act;
      input.onkeydown = e => { if (e.key === "Enter") act(); };
    }
    q();
  }

  /* ---------- MATCHING ---------- */
  function matching(title, deck, back) {
    current = null;
    let pos = 0;
    const bad = {};
    function round() {
      if (pos >= deck.length) return done(`You matched all ${deck.length} pairs.`, back, () => matching(title, shuffle(deck), back));
      const remaining = deck.length - pos, n = remaining <= 6 ? remaining : 5;
      const set = deck.slice(pos, pos + n);
      let left = set.length, sel = null;
      app.innerHTML = `
        <button class="link" id="back">← Stop</button>
        <div class="prog"><i style="width:${pct(pos, deck.length)}%"></i></div>
        <p class="muted">Tap a word, then tap its meaning.</p>
        <div class="mgrid">
          <div class="opts-col">${shuffle(set).map(x => `<button class="cell" data-side="a" data-k="${esc(x.k)}">${esc(x.w)}</button>`).join("")}</div>
          <div class="opts-col">${shuffle(set).map(x => `<button class="cell" data-side="b" data-k="${esc(x.k)}">${esc(meaning(x))}</button>`).join("")}</div>
        </div>`;
      $("#back").onclick = back;
      app.querySelectorAll(".cell").forEach(btn => btn.onclick = () => {
        if (btn.disabled) return;
        if (!sel) { sel = btn; btn.classList.add("sel"); return; }
        if (sel === btn) { btn.classList.remove("sel"); sel = null; return; }
        if (sel.dataset.side === btn.dataset.side) { sel.classList.remove("sel"); sel = btn; btn.classList.add("sel"); return; }
        const a = sel; sel = null; a.classList.remove("sel");
        if (a.dataset.k === btn.dataset.k) {
          a.classList.add("done"); btn.classList.add("done"); a.disabled = btn.disabled = true;
          mark(BYK[a.dataset.k], !bad[a.dataset.k]);
          if (--left === 0) setTimeout(() => { pos += n; round(); }, 500);
        } else {
          bad[a.dataset.k] = true; bad[btn.dataset.k] = true;
          btn.classList.add("bad"); a.classList.add("bad");
          setTimeout(() => { btn.classList.remove("bad"); a.classList.remove("bad"); }, 400);
        }
      });
    }
    round();
  }

  /* ---------- MISTAKES ---------- */
  function mistakes() {
    const p = ALL.filter(i => state.wrong[i.k]);
    if (!p.length) {
      current = mistakes;
      app.innerHTML = `<h2>My mistakes</h2><p>No mistakes saved yet. Words you get wrong in flashcards or quizzes will appear here so you can practise them again.</p>`;
    } else menu("My mistakes", p);
  }

  /* ---------- PROGRESS ---------- */
  function progress() {
    current = progress; badge();
    const total = ALL.length, lc = ALL.filter(i => learned(i.k)).length;
    const rev = ALL.filter(i => boxOf(i.k) > 0 && !learned(i.k)).length;
    let h = `<h2>My progress</h2><div class="stats">
      <div class="stat"><b>${lc}</b>words learned</div>
      <div class="stat"><b>${rev}</b>to review</div>
      <div class="stat"><b>🔥 ${streakNow()}</b>day streak</div>
      <div class="stat"><b>${state.reviewed}</b>answers given</div></div><h3>By level</h3>`;
    LEVELS.forEach(l => {
      const ws = ALL.filter(i => i.level === l.name), n = ws.filter(i => learned(i.k)).length;
      h += `<p style="margin:10px 0 0"><b>${esc(l.name)}</b> <span class="muted">${n} / ${ws.length}</span></p><div class="bar"><i style="width:${pct(n, ws.length)}%"></i></div>`;
    });
    h += `<button class="danger" id="reset">Reset my progress</button>`;
    app.innerHTML = h;
    $("#reset").onclick = () => { if (confirm("Delete all your progress on this device?")) { state = fresh(); save(); progress(); } };
  }

  /* ---------- start ---------- */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-say]");
    if (b) speak(b.dataset.say);
  });
  document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => ({ home, mistakes, progress })[b.dataset.go]());
  $("#siteTitle").textContent = typeof SITE_TITLE === "string" ? SITE_TITLE : "Vocabulary Trainer";
  $("#brand").onclick = home;
  $("#lang").value = state.lang;
  $("#lang").onchange = e => { state.lang = e.target.value; save(); if (current) current(); };
  home();
})();
