/* Buenos Aires trip app — router, views, interactive components, storage.
   Plain JS, no build step. State persists in localStorage under one key. */
(function () {
  "use strict";
  const T = window.TRIP;
  const KEY = "ba-trip:v1";

  /* ---------- state ---------- */
  const DEFAULTS = {
    decisions: {},                 // { tango: "porteno", museum: "colon", ferry: "buquebus" }
    bookings: {},                  // { donjulio: true }
    todos: { done: {}, custom: [] },
    food: {},                      // { empanadas: true }
    ui: { day: "sat", eat: "all", todoFilter: "all", todoSort: "group" },
  };
  let S = load();
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return {
          decisions: Object.assign({}, p.decisions || {}),
          bookings: Object.assign({}, p.bookings || {}),
          todos: { done: Object.assign({}, (p.todos && p.todos.done) || {}), custom: Array.isArray(p.todos && p.todos.custom) ? p.todos.custom : [] },
          food: Object.assign({}, p.food || {}),
          ui: Object.assign({}, DEFAULTS.ui, p.ui || {}),
        };
      }
    } catch (e) { /* storage unavailable or corrupt: start fresh */ }
    return JSON.parse(JSON.stringify(DEFAULTS));
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode */ } }

  /* ---------- helpers ---------- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ext = (url, label, cls) => `<a class="${cls || "link"}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}${I("external", "ico-inline")}</a>`;
  const mapLink = (q, raw, label) => ext(raw ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q) : T.maps(q), label || "Map", "maplink");
  const areaName = (id) => T.areaNames[id] || id;
  const optionOf = (key, id) => (T.decisions[key].options.find((o) => o.id === id) || null);
  const fmtDate = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  const daysBetween = (a, b) => Math.round((b - a) / 86400000);

  /* ---------- icons (24x24, stroke line-art) ---------- */
  const PATHS = {
    home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
    walk: '<circle cx="13" cy="4" r="1.6"/><path d="M10 21l2-6 3 2v4M8 12l2-4 3-1 3 3 3 1M9 21l1-4"/>',
    fork: '<path d="M7 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M9 12v9M17 3c-2 0-3 3-3 6v3h3v9"/>',
    market: '<path d="M3 9l2-5h14l2 5M3 9v11h18V9M3 9h18M8 20v-6h8v6"/><path d="M3 9c0 1.5 1.3 2.5 3 2.5S9 10.5 9 9c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5"/>',
    landmark: '<path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M2 10l10-6 10 6z"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="1.5"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>',
    tango: '<path d="M6 20c1-6 4-8 4-12a2 2 0 1 1 4 0c0 4 3 6 4 12M9 12h6M12 4V3"/>',
    ferry: '<path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M5 15l-1-5h16l-1 5M8 10V6h8v4M12 6V3"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 2-2V5h14v1a2 2 0 0 0 2 2v3a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2v3H5v-3a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z"/><path d="M13 5v14" stroke-dasharray="2 2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    flame: '<path d="M12 22c-4 0-7-3-7-7 0-3 2-5 3-7 0 2 1 3 2 3 0-4 2-7 4-8 0 3 1 4 2 5 2 2 3 4 3 7 0 4-3 7-7 7z"/>',
    pin: '<path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 13v6H5V6h6"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
    car: '<path d="M5 16l1.5-6h11L19 16M3 16h18v3H3zM7 19v2M17 19v2"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/>',
    passport: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><circle cx="12" cy="10" r="3"/><path d="M8 17h8"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    empanada: '<path d="M3 15c0-5 4-9 9-9s9 4 9 9z"/><path d="M6 15l1-2 1 2 1-2 1 2 1-2 1 2 1-2 1 2 1-2 1 2 1-2 1 2"/>',
    chori: '<path d="M3 12c0-3 3-4 9-4s9 1 9 4-3 5-9 5-9-2-9-5z"/><path d="M5 10c2 1 4 1.5 7 1.5s5-.5 7-1.5"/>',
    cheese: '<path d="M3 10l18-4v12H3zM3 10c0 1 1 2 2 2M9 13c0-1 1-1.5 2-1.5M15 14c0 1 1 1.5 2 1.5"/>',
    coffee: '<path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M7 4c0 1 1 1 1 2M11 4c0 1 1 1 1 2"/>',
    spoon: '<path d="M14 3c3 0 5 2 5 5s-2 5-4 5-3-1-3-3M12 10L4 20"/>',
    icecream: '<path d="M7 11h10l-5 10zM7 11a5 5 0 0 1 10 0"/>',
    wine: '<path d="M8 3h8l-1 7a3 3 0 0 1-6 0zM12 13v7M8 21h8"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
  };
  function I(name, cls) {
    return `<svg class="ico ${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name] || PATHS.pin}</svg>`;
  }
  const BALCONY = `<div class="balcony" aria-hidden="true"><svg viewBox="0 0 120 16" preserveAspectRatio="none"><pattern id="bal" width="24" height="16" patternUnits="userSpaceOnUse"><path d="M0 14c4 0 6-4 6-8 0 4 2 8 6 8s6-4 6-8c0 4 2 8 6 8" fill="none" stroke="currentColor" stroke-width="1"/><path d="M0 15h24" stroke="currentColor" stroke-width="1"/><circle cx="6" cy="6" r="1.2" fill="currentColor"/><circle cx="18" cy="6" r="1.2" fill="currentColor"/></pattern><rect width="120" height="16" fill="url(#bal)"/></svg></div>`;

  /* ---------- navigation ---------- */
  const NAV = [
    { href: "#/", label: "Overview", icon: "compass", match: (p) => p === "/" },
    { href: "#/itinerary", label: "Itinerary", icon: "calendar", match: (p) => p.startsWith("/itinerary"), short: "Days" },
    { href: "#/uruguay", label: "Uruguay", icon: "ferry", match: (p) => p === "/uruguay" },
    { href: "#/eat", label: "Where to eat", icon: "fork", match: (p) => p === "/eat", short: "Eat" },
    { href: "#/areas", label: "Neighbourhoods", icon: "map", match: (p) => p === "/areas", short: "Areas" },
    { href: "#/book", label: "To book", icon: "ticket", match: (p) => p === "/book", tab: false },
    { href: "#/todo", label: "To-do", icon: "list", match: (p) => p === "/todo", tab: false },
  ];
  const PLAN_TAB = { href: "#/book", label: "Plan", icon: "ticket", match: (p) => p === "/book" || p === "/todo" };

  function renderNav(path) {
    document.querySelector(".topnav-links").innerHTML = NAV.map((n) =>
      `<a href="${n.href}" class="${n.match(path) ? "is-active" : ""}" ${n.match(path) ? 'aria-current="page"' : ""}>${esc(n.label)}</a>`).join("");
    const tabs = NAV.filter((n) => n.tab !== false).concat([PLAN_TAB]);
    document.getElementById("tabbar").innerHTML = tabs.map((n) =>
      `<a href="${n.href}" class="${n.match(path) ? "is-active" : ""}" ${n.match(path) ? 'aria-current="page"' : ""}>${I(n.icon)}<span>${esc(n.short || n.label)}</span></a>`).join("");
  }

  /* ---------- shared components ---------- */
  function pageHead(eyebrow, title, lead) {
    return `<header class="page-head"><p class="eyebrow">${esc(eyebrow)}</p><h1 class="page-title">${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}${BALCONY}</header>`;
  }

  function donJulioStatus() {
    const d = T.donJulio, arrive = new Date(d.dinnerDate + "T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const open = new Date(arrive); open.setDate(open.getDate() - d.weeksAhead[1] * 7);
    const close = new Date(arrive); close.setDate(close.getDate() - d.weeksAhead[0] * 7);
    if (today > arrive) return { tone: "muted", text: "The trip has passed." };
    if (today < open) return { tone: "soon", text: `The 6–8 week booking window opens on ${fmtDate(open)}, in ${daysBetween(today, open)} days. Put a reminder in your calendar now.` };
    if (today <= close) return { tone: "now", text: `You are inside the 6–8 week booking window (until ${fmtDate(close)}). Book today.` };
    return { tone: "late", text: `The 6–8 week window closed on ${fmtDate(close)}. Try the site today anyway, and plan for the queue fallback below.` };
  }

  function donJulioCallout(compact) {
    const d = T.donJulio, st = donJulioStatus(), booked = !!S.bookings.donjulio;
    return `<aside class="callout callout-red ${booked ? "is-done" : ""}" aria-label="Don Julio booking">
      <div class="callout-head">${I("flame")}<p class="eyebrow eyebrow-red">${booked ? "Booked" : "Reserve now"} · ${esc(d.when)}</p></div>
      <h3 class="callout-title">${esc(d.name)} <span class="callout-sub">${esc(d.address)}</span></h3>
      <p>${esc(d.why)}</p>
      <p class="callout-status tone-${st.tone}">${esc(st.text)}</p>
      ${compact ? "" : `<p>${esc(d.booking)}</p><p class="muted">${esc(d.fallback)}</p>`}
      <div class="row-actions">
        ${ext(d.url, "Book at " + d.urlLabel, "btn btn-red")}
        ${ext(d.map, "Map", "btn btn-ghost")}
        <label class="check-inline"><input type="checkbox" data-action="toggle-booking" data-id="donjulio" ${booked ? "checked" : ""}> <span>Mark as booked</span></label>
      </div>
      ${compact ? "" : `<p class="backup"><strong>Backup:</strong> ${esc(d.backup.name)}. ${esc(d.backup.why)} ${ext(d.backup.map, "Map", "link")}</p>`}
    </aside>`;
  }

  function chooser(key) {
    const D = T.decisions[key], chosen = S.decisions[key];
    const cards = D.options.map((o) => {
      const sel = chosen === o.id;
      const links = (o.booking || []).map((b) => ext(b.url, b.label, "link")).join(" · ");
      let body = "";
      if (key === "tango") {
        body = `<p class="opt-why">${esc(o.why)}</p>
          <dl class="opt-facts"><div><dt>Price</dt><dd>${esc(o.price)}</dd></div><div><dt>Rating</dt><dd>${esc(o.rating)}</dd></div></dl>`;
      } else if (key === "museum") {
        body = `<p class="opt-what">${esc(o.what)}</p><p class="opt-why">${esc(o.why)}</p>
          <dl class="opt-facts"><div><dt>Time</dt><dd>${esc(o.time)}</dd></div><div><dt>Price</dt><dd>${esc(o.price)}</dd></div></dl>`;
      } else {
        body = `<dl class="opt-facts opt-facts-stack"><div><dt>Terminal</dt><dd>${esc(o.terminal)}</dd></div><div><dt>Crossing</dt><dd>${esc(o.crossing)}</dd></div><div><dt>Round trip</dt><dd>${esc(o.price)}</dd></div><div><dt>Best for</dt><dd>${esc(o.best)}</dd></div></dl>
          ${o.note ? `<p class="muted small">${esc(o.note)}</p>` : ""}`;
      }
      return `<article class="opt ${sel ? "is-selected" : ""} ${chosen && !sel ? "is-dimmed" : ""} opt-${key} ${o.tone ? "opt-" + o.tone : ""}">
        ${o.photo ? `<img class="opt-photo" src="./assets/img/${o.photo}" alt="${esc(o.alt)}" loading="lazy">` : ""}
        <div class="opt-body">
          ${o.recommended ? `<p class="badge badge-brass">${esc(o.recommended)}</p>` : ""}
          <h4 class="opt-name">${esc(o.name)}</h4>
          <p class="opt-sub">${esc(o.sub)}</p>
          ${body}
          <p class="opt-links">${links}${o.map ? " · " + ext(o.map, "Map", "link") : ""}</p>
          <button type="button" class="btn ${sel ? "btn-selected" : "btn-outline"}" data-action="select-decision" data-key="${key}" data-id="${o.id}" aria-pressed="${sel}">${sel ? I("check") + " Your pick" : "Choose " + esc(o.name)}</button>
        </div>
      </article>`;
    }).join("");
    const picked = chosen ? optionOf(key, chosen) : null;
    return `<section class="chooser chooser-${key}" aria-labelledby="ch-${key}">
      <div class="chooser-head"><p class="eyebrow eyebrow-red">${esc(D.eyebrow)}</p><h3 id="ch-${key}" class="chooser-title">${esc(D.title)}</h3><p class="chooser-prompt">${esc(D.prompt)}</p></div>
      <div class="opts opts-${D.options.length}">${cards}</div>
      <p class="chooser-foot">${picked ? `Your pick: <strong>${esc(picked.name)}</strong>. <button type="button" class="linkbtn" data-action="clear-decision" data-key="${key}">Clear</button>` : "No pick yet. Tap a card to choose; the itinerary and booking list update with it."}</p>
    </section>`;
  }

  function progressBar(done, total, label) {
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `<div class="progress" role="group" aria-label="${esc(label)}"><div class="progress-text"><span>${esc(label)}</span><strong>${done} of ${total} done</strong></div><div class="bar"><div class="bar-fill ${done === total && total ? "is-complete" : ""}" style="width:${pct}%"></div></div></div>`;
  }

  /* ---------- views ---------- */
  function viewHome() {
    const m = T.meta;
    const picks = ["tango", "museum", "ferry"].map((k) => {
      const D = T.decisions[k], o = S.decisions[k] ? optionOf(k, S.decisions[k]) : null;
      const route = k === "ferry" ? "#/uruguay" : k === "tango" ? "#/itinerary/sun" : "#/itinerary/tue";
      return `<li class="pick ${o ? "is-set" : ""}"><span class="pick-ico">${I(o ? "check" : "info")}</span><div><p class="pick-label">${esc(D.title)}</p><p class="pick-val">${o ? esc(o.name) : "Not chosen yet"}</p></div><a class="link" href="${route}">${o ? "Change" : "Decide"}</a></li>`;
    }).join("");
    const bTotal = T.bookings.filter((b) => !(b.conditional && S.decisions.museum === "malba")).length;
    const bDone = T.bookings.filter((b) => S.bookings[b.id] && !(b.conditional && S.decisions.museum === "malba")).length;
    const todos = allTodos(); const tDone = todos.filter((t) => S.todos.done[t.id]).length;
    const fDone = T.food.filter((f) => S.food[f.id]).length;
    const dayCards = T.days.map((d) => `<a class="daycard" href="#/itinerary/${d.id}">
      <div class="daycard-num"><span class="numeral">${d.num}</span><span class="daycard-wd">${esc(d.weekday)}<br>${esc(d.month)}</span></div>
      <h3 class="daycard-title">${esc(d.title)}</h3>
      <ul class="daycard-stops">${d.stops.slice(0, 4).map((s) => `<li>${I(s.icon, "ico-sm")} ${esc(s.title)}</li>`).join("")}</ul>
    </a>`).join("");
    return `
      <section class="hero">
        <img class="hero-img" src="./assets/img/hero-congreso.jpg" alt="The dome of the Congreso Nacional above the city at sunset" fetchpriority="high">
        <div class="hero-body">
          <p class="eyebrow eyebrow-light">A four-day itinerary for two</p>
          <h1 class="hero-title">${esc(m.title)}</h1>
          <p class="hero-dates">${esc(m.dates)} <span class="dot">·</span> ${esc(m.base)} <span class="dot">·</span> One day in Uruguay</p>
          <p class="hero-lead">${esc(m.summary)}</p>
          <div class="row-actions"><a class="btn btn-cream" href="#/itinerary">Open the itinerary</a><a class="btn btn-ghost-light" href="#/book">What to book</a></div>
        </div>
      </section>
      <div class="wrap">
        ${donJulioCallout(false)}
        <section class="grid-2">
          <div class="panel">
            <p class="eyebrow">Your picks</p>
            <ul class="picks">${picks}</ul>
          </div>
          <div class="panel">
            <p class="eyebrow">Progress</p>
            ${progressBar(bDone, bTotal, "To book")}
            ${progressBar(tDone, todos.length, "To-do")}
            ${progressBar(fDone, T.food.length, "Tasted")}
            <p class="row-actions small"><a class="link" href="#/book">To book</a><a class="link" href="#/todo">To-do</a><a class="link" href="#/eat">Where to eat</a></p>
          </div>
        </section>
        <section>
          <p class="eyebrow">Day by day</p>
          <div class="daycards">${dayCards}</div>
        </section>
        <section class="grid-2 links-row">
          <a class="panel panel-link" href="#/areas">${I("map")}<div><h3>Neighbourhood guides</h3><p class="muted">Palermo, San Telmo, La Boca, Recoleta, Puerto Madero.</p></div></a>
          <a class="panel panel-link" href="#/uruguay">${I("ferry")}<div><h3>Uruguay day trip</h3><p class="muted">Ferry options, border formalities and a walking plan for Colonia.</p></div></a>
        </section>
      </div>`;
  }

  function viewItinerary(dayId) {
    const day = T.days.find((d) => d.id === dayId) || T.days[0];
    S.ui.day = day.id; save();
    const rail = T.days.map((d) => `<a href="#/itinerary/${d.id}" class="daychip ${d.id === day.id ? "is-active" : ""}" ${d.id === day.id ? 'aria-current="true"' : ""}><span class="daychip-num">${d.num}</span><span class="daychip-wd">${esc(d.weekday.slice(0, 3))}</span></a>`).join("");
    const stops = day.stops.map((s) => {
      const tags = [];
      if (s.travel) tags.push(`<span class="tag">${I("car", "ico-sm")}${esc(s.travel)}</span>`);
      if (s.area) tags.push(`<a class="tag tag-link" href="#/areas#${s.area}">${I("map", "ico-sm")}${esc(areaName(s.area))} guide</a>`);
      const eats = s.eats ? `<p class="stop-eats">Options: ${s.eats.map((n) => { const r = T.restaurants.find((x) => x.name === n); return r ? `<a class="chip" href="#/eat">${esc(r.name)} <span class="tier">${r.tier}</span></a>` : esc(n); }).join(" ")}</p>` : "";
      let title = s.title;
      if (s.decision && S.decisions[s.decision]) title = `${s.title} <span class="stop-pick">· ${esc(optionOf(s.decision, S.decisions[s.decision]).name)}</span>`;
      return `<li class="stop ${s.decision ? "stop-decision" : ""}">
        <div class="stop-marker ${s.map || s.decision ? "is-place" : ""}">${I(s.icon)}</div>
        <div class="stop-body">
          <p class="stop-time">${esc(s.time)}</p>
          <h3 class="stop-title">${title}</h3>
          <p class="stop-text">${esc(s.text)}</p>
          ${tags.length || s.map ? `<p class="stop-tags">${tags.join("")}${s.map ? mapLink(s.map, s.mapRaw) : ""}</p>` : ""}
          ${eats}
          ${s.decision ? chooser(s.decision) : ""}
          ${s.donjulio ? donJulioCallout(false) : ""}
        </div>
      </li>`;
    }).join("");
    return `<div class="wrap">
      ${pageHead("Itinerary", "Day by day", "Four days, one ferry, two decisions to make. Tap a day.")}
      <div class="itin">
        <nav class="dayrail" aria-label="Days">${rail}</nav>
        <section class="day" data-day="${day.id}">
          <header class="day-head">
            <div class="day-numeral"><span class="numeral numeral-xl">${day.num}</span><span class="day-wd">${esc(day.weekday)}<br>${esc(day.month)}</span></div>
            <h2 class="day-title">${esc(day.title)}</h2>
            <p class="lead">${esc(day.intro)}</p>
            ${day.link ? `<p><a class="btn btn-outline" href="${day.link.route}">${I("ferry")} ${esc(day.link.label)}</a></p>` : ""}
          </header>
          <ol class="timeline">${stops}</ol>
        </section>
      </div>
    </div>`;
  }

  function viewUruguay() {
    const U = T.uruguay;
    return `
      <section class="pagehero">
        <img class="pagehero-img" src="./assets/img/colonia-faro.jpg" alt="The lighthouse of Colonia del Sacramento at sunset">
        <div class="pagehero-body"><p class="eyebrow eyebrow-light">Monday 30 November · Uruguay</p><h1 class="pagehero-title">Colonia del Sacramento</h1><p class="hero-lead">A day across the Río de la Plata. Cobbled lanes, a lighthouse, and a long lunch in an old town small enough to cover on foot.</p></div>
      </section>
      <div class="wrap">
        <section class="grid-2">
          <div class="panel panel-river">
            <p class="eyebrow">${I("passport", "ico-sm")} Border formalities</p>
            <ul class="plain">${U.formalities.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
          </div>
          <div class="panel">
            <p class="eyebrow">Book ahead</p>
            <p>${esc(U.advice)}</p>
            <p class="row-actions small"><a class="link" href="#/book">Add to the booking list</a></p>
          </div>
        </section>
        <figure class="figure"><img src="./assets/img/buquebus.jpg" alt="A Buquebus fast ferry at the Puerto Madero terminal" loading="lazy"><figcaption>The fast ferries leave from the Buquebus terminal in Puerto Madero, the closest terminal to Palermo.</figcaption></figure>
        ${chooser("ferry")}
        <section class="panel panel-tour">
          <p class="eyebrow">Guided day tour, if you would rather not self-organise</p>
          <p>${esc(U.tour.lead)}</p>
          <h3 class="h4">${esc(U.tour.name)}</h3>
          <dl class="opt-facts"><div><dt>Via</dt><dd>${esc(U.tour.via)}</dd></div><div><dt>Rating</dt><dd>${esc(U.tour.rating)}</dd></div><div><dt>Price</dt><dd>${esc(U.tour.price)}</dd></div><div><dt>Includes</dt><dd>${esc(U.tour.includes)}</dd></div></dl>
          <p>${ext(U.tour.url, "Search on " + U.tour.urlLabel, "btn btn-outline")}</p>
        </section>
        <section>
          <p class="eyebrow">The day, in order</p>
          <ol class="timeline timeline-compact">${U.schedule.map((s) => `<li class="stop"><div class="stop-marker is-place">${I("clock")}</div><div class="stop-body"><p class="stop-time">${esc(s.time)}</p><p class="stop-text">${esc(s.text)}</p></div></li>`).join("")}</ol>
          <p class="stop-tags">${U.places.map((p) => mapLink(p.q, true, p.name)).join("")}</p>
        </section>
        <figure class="figure"><img src="./assets/img/colonia-suspiros.jpg" alt="Calle de los Suspiros, a cobbled lane running down to the river" loading="lazy"><figcaption>Calle de los Suspiros, the most photographed lane in the Barrio Histórico.</figcaption></figure>
      </div>`;
  }

  function viewEat() {
    const f = S.ui.eat || "all";
    const areas = ["all"].concat(Object.keys(T.areaNames));
    const chips = areas.map((a) => `<button type="button" class="chip ${f === a ? "is-active" : ""}" data-action="eat-filter" data-id="${a}" aria-pressed="${f === a}">${a === "all" ? "All" : esc(areaName(a))}</button>`).join("");
    const list = T.restaurants.filter((r) => f === "all" || r.area === f);
    const grouped = f === "all" ? Object.keys(T.areaNames) : [f];
    const sections = grouped.map((a) => {
      const rs = list.filter((r) => r.area === a);
      const note = T.areaNotes[a] ? `<p class="note">${esc(T.areaNotes[a])}</p>` : "";
      if (!rs.length && !note) return "";
      return `<section class="eat-group"><h3 class="h4 eat-area">${esc(areaName(a))}</h3>${note}<div class="cards">${rs.map((r) => `
        <article class="card ${r.star ? "card-star" : ""}">
          <div class="card-head"><h4 class="card-title">${esc(r.name)}</h4><span class="tier" aria-label="Price tier">${r.tier}</span></div>
          <p class="card-text">${esc(r.desc)}</p>
          <p class="card-foot">${mapLink(r.q)}${r.star ? `<a class="link" href="#/book">Booking</a>` : ""}</p>
        </article>`).join("")}</div></section>`;
    }).join("");
    const fDone = T.food.filter((x) => S.food[x.id]).length;
    const food = T.food.map((x) => `<li><label class="food ${S.food[x.id] ? "is-done" : ""}"><input type="checkbox" data-action="toggle-food" data-id="${x.id}" ${S.food[x.id] ? "checked" : ""}><span class="food-ico">${I(x.icon)}</span><span class="food-body"><span class="food-name">${esc(x.name)}</span>${x.note ? `<span class="food-note">${esc(x.note)}</span>` : ""}</span><span class="food-check">${I("check")}</span></label></li>`).join("");
    return `<div class="wrap">
      ${pageHead("Where to eat", "Cafés, bars and parrillas", "Grouped by neighbourhood. Price tiers run from $ (a coffee) to $$$$ (the big night).")}
      <div class="chips" role="group" aria-label="Filter by neighbourhood">${chips}</div>
      ${sections}
      <section class="tasting">
        <p class="eyebrow">Don't leave without trying</p>
        ${progressBar(fDone, T.food.length, "Tasted")}
        <ul class="foods">${food}</ul>
      </section>
    </div>`;
  }

  function viewAreas() {
    const cards = T.neighborhoods.map((n) => `<article class="area" id="${n.id}">
      <img class="area-photo" src="./assets/img/${n.photo}" alt="${esc(n.alt)}" loading="lazy">
      <div class="area-body">
        <p class="eyebrow">${esc(n.tag)}</p>
        <h2 class="area-name">${esc(n.name)}</h2>
        <p>${esc(n.text)}</p>
        <p class="stop-tags">${n.spots.map(([label, q]) => mapLink(q, false, label)).join("")}</p>
        <p class="small"><a class="link" href="#/eat">Where to eat in ${esc(n.name)}</a></p>
      </div>
    </article>`).join("");
    return `<div class="wrap">${pageHead("Neighbourhood guides", "Five neighbourhoods", "Each with the specifics worth your time and a map link for every named spot.")}<div class="areas">${cards}</div></div>`;
  }

  function planTabs(active) {
    return `<div class="seg" role="tablist" aria-label="Planning"><a role="tab" href="#/book" class="${active === "book" ? "is-active" : ""}" aria-selected="${active === "book"}">${I("ticket", "ico-sm")} To book</a><a role="tab" href="#/todo" class="${active === "todo" ? "is-active" : ""}" aria-selected="${active === "todo"}">${I("list", "ico-sm")} To-do</a></div>`;
  }

  function viewBook() {
    const museum = S.decisions.museum;
    const rows = T.bookings.map((b) => {
      let item = b.item, skip = false, hint = "";
      if (b.dynamic && S.decisions[b.dynamic]) { item += ` · ${optionOf(b.dynamic, S.decisions[b.dynamic]).name}`; }
      else if (b.dynamic) { hint = `<a class="link" href="${b.dynamic === "ferry" ? "#/uruguay" : "#/itinerary/sun"}">Decide which first</a>`; }
      if (b.conditional) {
        const [k, v] = b.conditional.split(":");
        if (S.decisions[k] && S.decisions[k] !== v) { skip = true; hint = `Not needed. You picked ${esc(optionOf(k, S.decisions[k]).name)}.`; }
        else if (!S.decisions[k]) hint = `Only if you choose Teatro Colón. <a class="link" href="#/itinerary/tue">Decide</a>`;
      }
      const done = !!S.bookings[b.id];
      return `<li class="bk ${done ? "is-done" : ""} ${skip ? "is-skip" : ""}">
        <label class="bk-check"><input type="checkbox" data-action="toggle-booking" data-id="${b.id}" ${done ? "checked" : ""} ${skip ? "disabled" : ""}><span class="box">${I("check")}</span><span class="sr">Booked</span></label>
        <div class="bk-body">
          <p class="bk-item">${item}</p>
          ${b.note ? `<p class="bk-note">${esc(b.note)}</p>` : ""}
          ${hint ? `<p class="bk-hint">${hint}</p>` : ""}
          <p class="bk-meta"><span class="badge badge-${b.level}">${esc(b.urgency)}</span><span class="bk-price">${esc(b.price)}</span></p>
          <p class="bk-where">${b.where.map((w) => ext(w.url, w.label, "link")).join(" · ")}</p>
        </div>
      </li>`;
    }).join("");
    const active = T.bookings.filter((b) => !(b.conditional && museum && museum !== b.conditional.split(":")[1]));
    const done = active.filter((b) => S.bookings[b.id]).length;
    return `<div class="wrap wrap-narrow">
      ${pageHead("Planning", "To book", "Everything that needs a reservation, most urgent first. Ticks are remembered on this device.")}
      ${planTabs("book")}
      ${progressBar(done, active.length, "Reservations")}
      <ul class="bklist">${rows}</ul>
      <p class="note">${esc(T.bookingsFootnote)}</p>
    </div>`;
  }

  function allTodos() { return T.todos.concat(S.todos.custom); }
  const PRIO = { high: 3, medium: 2, low: 1 };
  function viewTodo() {
    const filter = S.ui.todoFilter || "all", sort = S.ui.todoSort || "group";
    const items = allTodos().filter((t) => filter === "all" || t.priority === filter);
    const total = allTodos().length, done = allTodos().filter((t) => S.todos.done[t.id]).length;
    const row = (t) => {
      const d = !!S.todos.done[t.id];
      const hint = t.decision && S.decisions[t.decision] ? `<span class="td-hint">Decided: ${esc(optionOf(t.decision, S.decisions[t.decision]).name)}</span>` : "";
      return `<li class="td ${d ? "is-done" : ""}">
        <label class="bk-check"><input type="checkbox" data-action="toggle-todo" data-id="${esc(t.id)}" ${d ? "checked" : ""}><span class="box">${I("check")}</span><span class="sr">Done</span></label>
        <div class="td-body"><p class="td-text">${esc(t.text)}${hint}</p></div>
        <span class="badge badge-p-${t.priority}">${t.priority}</span>
        ${t.custom ? `<button type="button" class="iconbtn" data-action="delete-todo" data-id="${esc(t.id)}" aria-label="Delete task">${I("trash")}</button>` : ""}
      </li>`;
    };
    let body;
    if (sort === "priority") {
      const sorted = items.slice().sort((a, b) => PRIO[b.priority] - PRIO[a.priority] || (S.todos.done[a.id] ? 1 : 0) - (S.todos.done[b.id] ? 1 : 0));
      body = `<ul class="tdlist">${sorted.map(row).join("")}</ul>`;
    } else {
      body = Object.keys(T.todoGroups).map((g) => {
        const gi = items.filter((t) => t.group === g);
        return `<section class="td-group"><h3 class="h4">${esc(T.todoGroups[g])}</h3>${g === "before" ? `<p class="note small">${esc(T.todoNote)}</p>` : ""}${gi.length ? `<ul class="tdlist">${gi.map(row).join("")}</ul>` : `<p class="muted small">Nothing at this priority.</p>`}</section>`;
      }).join("");
    }
    const fchips = ["all", "high", "medium", "low"].map((p) => `<button type="button" class="chip ${filter === p ? "is-active" : ""}" data-action="todo-filter" data-id="${p}" aria-pressed="${filter === p}">${p === "all" ? "All" : p[0].toUpperCase() + p.slice(1)}</button>`).join("");
    return `<div class="wrap wrap-narrow">
      ${pageHead("Planning", "To-do", "Everything to organise before departure, reservations and admin alike. Add your own items below.")}
      ${planTabs("todo")}
      ${progressBar(done, total, "Trip prep")}
      <div class="toolbar">
        <div class="chips" role="group" aria-label="Filter by priority">${fchips}</div>
        <div class="chips" role="group" aria-label="Sort"><button type="button" class="chip ${sort === "group" ? "is-active" : ""}" data-action="todo-sort" data-id="group" aria-pressed="${sort === "group"}">By group</button><button type="button" class="chip ${sort === "priority" ? "is-active" : ""}" data-action="todo-sort" data-id="priority" aria-pressed="${sort === "priority"}">By priority</button></div>
      </div>
      ${body}
      <form class="addform" data-action="add-todo" autocomplete="off">
        <p class="eyebrow">Add a task</p>
        <div class="addform-row">
          <input type="text" name="text" maxlength="140" placeholder="e.g. Print hotel confirmation" required aria-label="Task">
          <select name="priority" aria-label="Priority"><option value="high">High</option><option value="medium" selected>Medium</option><option value="low">Low</option></select>
          <select name="group" aria-label="Group"><option value="before" selected>Before you go</option><option value="bookings">Bookings</option></select>
          <button type="submit" class="btn btn-ink">${I("plus")} Add</button>
        </div>
      </form>
    </div>`;
  }

  /* ---------- router ---------- */
  const main = document.getElementById("main");
  let lastPath = null, lastDay = null;
  function route() {
    const hash = location.hash || "#/";
    const path = hash.slice(1).split("?")[0];
    const parts = path.split("/").filter(Boolean);
    let html, key = parts[0] || "";
    if (key === "") html = viewHome();
    else if (key === "itinerary") html = viewItinerary(parts[1] || S.ui.day);
    else if (key === "uruguay") html = viewUruguay();
    else if (key === "eat") html = viewEat();
    else if (key === "areas") html = viewAreas();
    else if (key === "book") html = viewBook();
    else if (key === "todo") html = viewTodo();
    else { location.replace("#/"); return; }
    renderNav("/" + parts.join("/"));
    main.innerHTML = html;
    document.title = (key ? (NAV.find((n) => n.href === "#/" + key) || {}).label + " · " : "") + "Buenos Aires, 28 Nov – 2 Dec";
    const sameSection = lastPath && lastPath.split("/")[1] === key;
    const dayPanel = main.querySelector(".day");
    const dayId = dayPanel ? dayPanel.getAttribute("data-day") : null;
    if (dayPanel && dayId !== lastDay) { dayPanel.classList.add("is-entering"); requestAnimationFrame(() => dayPanel.classList.remove("is-entering")); }
    lastDay = dayId;
    if (!(sameSection && key === "itinerary")) {
      const anchor = parts[1] && key === "areas" ? document.getElementById(parts[1]) : null;
      if (anchor) anchor.scrollIntoView({ behavior: "instant", block: "start" }); else window.scrollTo({ top: 0, behavior: "instant" });
    }
    lastPath = "/" + parts.join("/");
  }
  window.addEventListener("hashchange", route);

  /* ---------- actions ---------- */
  function rerender() { save(); const y = window.scrollY; route(); window.scrollTo({ top: y, behavior: "instant" }); }
  main.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el || el.tagName === "FORM" || el.tagName === "INPUT") return;
    const a = el.dataset.action, id = el.dataset.id;
    if (a === "select-decision") { S.decisions[el.dataset.key] = S.decisions[el.dataset.key] === id ? undefined : id; if (!S.decisions[el.dataset.key]) delete S.decisions[el.dataset.key]; rerender(); }
    else if (a === "clear-decision") { delete S.decisions[el.dataset.key]; rerender(); }
    else if (a === "eat-filter") { S.ui.eat = id; rerender(); }
    else if (a === "todo-filter") { S.ui.todoFilter = id; rerender(); }
    else if (a === "todo-sort") { S.ui.todoSort = id; rerender(); }
    else if (a === "delete-todo") { S.todos.custom = S.todos.custom.filter((t) => t.id !== id); delete S.todos.done[id]; rerender(); }
  });
  main.addEventListener("change", (e) => {
    const el = e.target.closest("input[data-action]");
    if (!el) return;
    const a = el.dataset.action, id = el.dataset.id;
    if (a === "toggle-booking") { S.bookings[id] = el.checked; rerender(); }
    else if (a === "toggle-todo") { S.todos.done[id] = el.checked; rerender(); }
    else if (a === "toggle-food") { S.food[id] = el.checked; rerender(); }
  });
  main.addEventListener("submit", (e) => {
    const f = e.target.closest("form[data-action='add-todo']");
    if (!f) return;
    e.preventDefault();
    const text = f.text.value.trim();
    if (!text) return;
    S.todos.custom.push({ id: "c-" + Date.now().toString(36), text, priority: f.priority.value, group: f.group.value, custom: true });
    rerender();
    const input = main.querySelector(".addform input[name=text]"); if (input) input.focus();
  });

  main.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.matches(".addform input[name=text]")) { e.preventDefault(); e.target.form.requestSubmit(); }
  });

  /* ---------- footer credits ---------- */
  fetch("./assets/img/credits.json").then((r) => r.json()).then((list) => {
    document.getElementById("credits").innerHTML = list.map((c) => `<li>${esc(c.title)} — ${esc(c.artist)}, ${esc(c.license)}, via ${ext(c.source, "Wikimedia Commons", "link")}</li>`).join("");
  }).catch(() => { document.getElementById("credits").innerHTML = "<li>Photographs from Wikimedia Commons under Creative Commons licences. See assets/img/credits.json.</li>"; });

  route();
})();
