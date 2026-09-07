# Handover Brief: Buenos Aires & Uruguay Trip App

This document is a complete content and design brief for building a static web app documenting a trip to Buenos Aires (with a day trip to Uruguay). It is meant to be handed to an AI coding assistant (e.g. Claude Code) to build a finished site. It contains everything needed: trip facts, copy, links, prices, structure, and design direction. Nothing here should need to be invented; where a decision is left open, it says so explicitly and should become an interactive choice in the app rather than a guess.

Hand this whole file to the coding assistant as the starting prompt.

---

## 1. Project brief

**What to build:** A single, elegant, static website presenting a 4-day Buenos Aires itinerary (28 Nov to 2 Dec) for two travelers, in the style of a bespoke luxury travel agency's client itinerary. Think "a boutique concierge prepared this for you," not a generic travel blog or listicle.

**Hosting:** GitHub Pages, so the output must be a fully static site (plain HTML/CSS/JS, or a static export from a framework like Astro/Vite/React). No backend, no build step that requires a server at runtime. If using a framework, configure the base path correctly for a GitHub Pages project site (e.g. `/repo-name/`).

**Audience:** The two travelers themselves, viewing this on both desktop and mobile (mobile especially, since they'll reference it while walking around the city). It should feel premium, calm, and easy to navigate on a phone in the sun.

**Core interaction principle:** Several things in this trip are genuinely undecided (which tango show, which museum, which ferry company). Do not silently pick one. Build these as interactive choice components — cards the user can tap/click to compare and select — so the app functions as a real planning tool, not just a static readout. Persist the user's choices in the browser (e.g. `localStorage`) so their picks are remembered on return visits. This is a personal single-user app, not multi-user, so simple client-side storage is appropriate here (do not need any backend or shared state).

**Tone of writing throughout the app:** warm, confident, concierge-like. Plain language, no filler, no hype-speak ("amazing," "must-see" overused). Say what a thing is and why it's worth the traveler's time. Every recommendation should read like it came from someone who actually knows the city, not a scraped listicle.

---

## 2. Design direction

Do not default to generic "AI travel app" styling (soft rounded cards, teal-to-purple gradients, stock beach photography, tracked-out uppercase eyebrow labels). This needs a distinct point of view rooted in Buenos Aires itself: European-grand-cafe elegance meets tango-hall drama meets sun-bleached Río de la Plata light.

**Suggested direction (adjust as needed, but commit to something specific and consistent):**

- **Palette**: deep ink navy or near-black (`#1B1D24`-ish) as a grounding dark tone for headers/hero sections, paired with a warm parchment/cream background for reading sections (`#F6F1E7`-ish), an accent drawn from tango-hall red or aged brass/gold (`#A8332B` or `#B8894A`-ish), and a muted eucalyptus or Río de la Plata blue-green for secondary accents. Use these deliberately and sparingly, not as a rainbow of equally-weighted colors.
- **Type**: one elegant serif for headings (something with real character, e.g. a display serif evoking old Buenos Aires signage/typography, like Fraunces, Canela, or similar) paired with a clean, highly legible sans-serif for body text and UI (e.g. Inter, Söhne, or similar). Avoid the generic "big rounded sans everywhere" look.
- **Motifs**: consider subtle nods to Buenos Aires visual culture without being kitschy: wrought-iron balcony line work, tango-poster typographic energy for section dividers, a map-pin/route motif for the itinerary. Avoid cliché tango-dancer silhouette clipart.
- **Layout**: a clear day-by-day narrative structure (see Section 4) with a persistent way to jump between days (tabs, a sticky day-selector, or a timeline sidebar on desktop that collapses to a horizontal scroller on mobile).
- **Motion**: restrained. One well-executed transition (e.g. day-switching, or a card flip when comparing options) beats fade-ins on every element.
- **Images**: no real trip photos exist yet, so use free-license stock photography (Unsplash, Pexels, or similar) selected deliberately per real location, never generic travel stock. Use judgment on where photography vs. an icon/illustration system creates the more premium feel, rather than defaulting to one everywhere:
  - Photography earns its place where a place's visual character is the point and does real work: the hero/overview section, the top of each neighborhood guide, the top of the Uruguay day-trip page, and probably the two decision-point comparisons (Section 6), where seeing Rojo Tango's cabaret interior next to Tango Porteño's theater, or Teatro Colón's gilded hall next to MALBA's gallery space, genuinely helps someone choose.
  - Icons/line-art fit better for small, repeated, functional elements: itinerary timeline markers, the booking checklist, the food-to-try list, price/time/category tags. Photography at that density would feel busy and slow the page down, not premium.
  - Whichever mix is chosen, apply it consistently by content type (e.g. "every neighborhood card gets one photo," not ad hoc), keep photo treatment consistent (crop ratio, a subtle consistent filter/duotone if it fits the palette), and never fabricate a broken-looking placeholder if a suitable real photo can't be sourced. If sourcing real photos isn't feasible in the build environment, fall back to the icon-led approach for that section rather than leaving a placeholder.
- **Maps**: see Section 7, embed or link Google Maps per location.

Build a short internal design token list (exact hex values, font names, spacing scale) before writing code, and stay consistent to it site-wide.

---

## 3. Trip facts

- Travelers: 2 adults
- Destination: Buenos Aires, Argentina, with a day trip to Uruguay
- Arrival: Saturday 28 November, midday
- Departure: Wednesday 2 December, early morning
- Accommodation: Palermo neighborhood (exact hotel not specified, treat Palermo as the "home base" for travel-time calculations)
- Trip length: approx. 3.5 days
- First time visiting Buenos Aires

---

## 4. Day-by-day itinerary (content for the main itinerary view)

Structure this as 4 tabs/sections: Sat 28, Sun 29, Mon 30, Tue 1. Each stop below should render as a card/timeline item with: time, title, short description, and (where noted) a decision point that must be an interactive chooser rather than fixed text.

### Day 1 — Saturday 28 November (arrival day, deliberately light)

| Time | Stop | Notes |
|---|---|---|
| Midday | Arrive, check in, Palermo | Rest after the flight. No heavy plans, deliberately light day given jet lag. |
| Afternoon | Palermo Soho stroll | Easy walk through Plaza Serrano, boutiques, street art. No fixed itinerary needed, just wandering. |
| Evening | Light dinner in Palermo | Casual, not a big steak dinner (that's saved for the last night). Empanadas or a light bistro. Suggest 2-3 options from Section 8 (Palermo casual list). |

### Day 2 — Sunday 29 November

| Time | Stop | Notes |
|---|---|---|
| 10:00 | Feria de San Telmo | Sunday antiques and street market at Plaza Dorrego. Only happens on Sundays, this is why it's scheduled today. ~30 min from Palermo by taxi or subte. |
| 13:00 | Plaza de Mayo & Casa Rosada | Historic center: presidential palace, Cabildo. 10 min walk from the San Telmo market. Casa Rosada interior tours are free but only run certain days and require advance online booking via argentina.gob.ar — flag this as a "book ahead if interested" note, do not assume it's open. |
| 14:30 | La Boca / Caminito | Colorful houses, Boca Juniors stadium/museum nearby. ~15 min taxi from Plaza de Mayo. Note in copy: stick to the main Caminito strip and a few surrounding blocks, go before dusk. |
| 20:00 | Tango dinner show | **Decision point — build as an interactive comparison, see Section 6.** |

### Day 3 — Monday 30 November (Uruguay day trip)

Full detail in Section 5. Summary for the itinerary card:

| Time | Stop | Notes |
|---|---|---|
| ~07:30 | Depart via ferry to Colonia del Sacramento, Uruguay | ~25 min taxi from Palermo to the ferry terminal. **Ferry company is a decision point, see Section 5.** |
| 09:00–16:00 | Explore Colonia's old town | Barrio Histórico, lighthouse, Calle de los Suspiros, Plaza Mayor, ruins of the Convent of San Francisco. |
| ~17:00 | Return ferry to Buenos Aires | Back in the city by evening. |

### Day 4 — Tuesday 1 December (last full day)

| Time | Stop | Notes |
|---|---|---|
| 09:30 | Recoleta Cemetery | Evita's grave, elaborate mausoleums. ~15 min taxi from Palermo. |
| 11:30 | MALBA or Teatro Colón | **Decision point — build as an interactive comparison, see Section 6.** |
| 17:00 | Puerto Madero | Sunset walk along the docks, Puente de la Mujer bridge. ~20 min taxi. Keep this a walk, not a full second meal stop (dinner is the big event tonight). |
| 20:30 | Parrilla dinner in Palermo | The trip's big final dinner. Recommendation: **Don Julio** (see Section 6 for full detail and booking urgency — this needs to be booked months ahead, flag this prominently in the UI, e.g. a highlighted "book this now" banner, since by the time this app is used it may already be late). |

---

## 5. Uruguay day trip — full detail (dedicated page/section)

This deserves its own page, not just a line in the itinerary, since it involves cross-border logistics.

**Formalities**: Both Argentine exit and Uruguayan entry immigration are processed at the Buenos Aires ferry terminal, back to back, before boarding — travelers do not go through separate immigration in Uruguay. Bring passports. Arrive 1 to 1.5 hours before departure (2 hours during high season, and late November is the start of high season in this region, so lean toward the longer buffer).

**Ferry company comparison — build this as an interactive comparison/decision component:**

| | Buquebus | Colonia Express | Seacat |
|---|---|---|---|
| Positioning | Premium | Budget-friendly | Budget tier, same parent company as Buquebus |
| Terminal | Puerto Madero (closest to Palermo, ~25 min taxi) | Terminal further out (Dock Sud area, ~30 min taxi) | Online sales mainly |
| Crossing time | As fast as 50 min | ~1h to 1h15 | Similar to Buquebus |
| Round-trip price | ~$100–170 USD, dynamic pricing (can double in high season if booked late) | ~$100–130 USD | Typically cheapest of the three |
| Booking site | buquebus.com | coloniaexpress.com | seacatcolonia.com |
| Best for | Convenience, fastest crossing, closest terminal to Palermo | Better value, still reliable | Budget-conscious travelers comfortable booking online only |

**Advice to surface in the UI**: book 2 to 3 weeks ahead regardless of company. Late November is early high season, prices climb and cheap seats disappear closer to the date.

**Guided day tour alternative**: since Colonia's old town is small and easily walkable independently, a paid guided tour isn't necessary, but present it as an option for travelers who'd rather not self-organize.
- Best-rated option: "Colonia del Sacramento Small-Group Day Trip" via Viator, ~4.5/5 from ~170 reviews, ~$250 per person, includes transfers, ferry, and a walking tour. Link: viator.com (search "Colonia del Sacramento Small-Group Day Trip").

**Suggested schedule for the day** (same as the itinerary table in Section 4, can be repeated here in more narrative form):
Depart Buenos Aires ~7:30–8:00am → arrive Colonia ~9:00–9:30am → old town is a 15–20 min walk from the port → explore Barrio Histórico, climb the lighthouse, walk Calle de los Suspiros, see Plaza Mayor and the ruins of the Convent of San Francisco → lunch in the old town → optional bike rental for the afternoon → return ferry ~17:00–18:00 → back in Buenos Aires by evening.

---

## 6. Decision points — build these as interactive comparison components

These three choices should NOT be flattened into a single recommendation in the app. Present each as a card-based chooser (e.g. two or three cards side by side, tap/click to "select," selection persisted in localStorage and reflected back in the day's itinerary view).

### 6a. Tango dinner show (Day 2 evening)

**Option A — Tango Porteño (Platea dinner show tier), recommended default**
- Why: Best value-for-quality, rated 4.5–4.6, full à la carte dinner with unlimited wine, large live orchestra, round-trip hotel transfer included.
- Price: roughly $90–110 per person
- Booking: tango-porteno.tangoshowba.com (also bookable via GetYourGuide)
- Google Maps: https://www.google.com/maps/search/?api=1&query=Tango+Porte%C3%B1o+Buenos+Aires

**Option B — Rojo Tango at the Faena Hotel (luxury alternative)**
- Why: The most exclusive, intimate tango experience in the city (only ~100 seats), rated 4.9, but dinner reviews are more mixed than the show itself.
- Price: roughly $260–300 per person
- Booking: via GetYourGuide or directly through Hotel Faena
- Google Maps: https://www.google.com/maps/search/?api=1&query=Rojo+Tango+Faena+Hotel+Buenos+Aires

Present as: "Two very different nights out — which matters more, value or exclusivity?"

### 6b. MALBA vs. Teatro Colón (Day 4 late morning)

**Option A — Teatro Colón (recommended default for first-timers)**
- What it is: world-famous opera house, 19th-century architecture
- Time needed: ~50 min guided tour
- Best for: architecture and history lovers, and this being a genuine bucket-list landmark
- Price: ~$40–45 for the guided tour
- Booking: teatrocolon.org.ar or GetYourGuide
- Google Maps: https://www.google.com/maps/search/?api=1&query=Teatro+Colon+Buenos+Aires

**Option B — MALBA**
- What it is: Latin American modern/contemporary art museum
- Time needed: ~1.5–2 hours, self-paced
- Best for: travelers who specifically want an art-focused stop, or a return trip
- Price: ~$12–15 entry, no advance ticket usually needed
- Booking: malba.org.ar
- Google Maps: https://www.google.com/maps/search/?api=1&query=MALBA+Buenos+Aires

Present as: "One slot, two very different Buenos Aires landmarks — pick your afternoon."

### 6c. Final-night parrilla (Day 4 dinner) — not a toggle, but needs a prominent urgency callout

**Primary recommendation: Don Julio**
- Why: the most celebrated steakhouse in Buenos Aires, ranked in the World's 50 Best Restaurants
- Address: Guatemala 4699, Palermo
- Booking: essential, and needs to be made roughly 6–8 weeks in advance via the restaurant's official website (parrilladonjulio.com — verify current URL when building, avoid third-party lookalike booking sites). No-booking fallback: queue 30–45 min before opening; the restaurant offers waiting guests sparkling wine and empanadas.
- Google Maps: https://www.google.com/maps/search/?api=1&query=Don+Julio+Palermo+Buenos+Aires
- **UI treatment**: this should appear as a highlighted "reserve now" callout somewhere prominent (e.g. on the trip overview page and on the Day 4 card), since the booking window is tight and time-sensitive relative to travel dates.

**Backup option: La Cabrera**
- Why: also top-rated, generally easier to get a table than Don Julio, generous sides included with every steak
- Google Maps: https://www.google.com/maps/search/?api=1&query=La+Cabrera+Palermo+Buenos+Aires

---

## 7. Neighborhood guides (dedicated section, one card/page per neighborhood)

For each neighborhood below, include: a short descriptive paragraph, the "don't miss" specifics, and a Google Maps link (use the universal search URL format `https://www.google.com/maps/search/?api=1&query=<place>+Buenos+Aires` for each named spot, no exact coordinates needed).

**Palermo** (home base)
Soho has the boutiques, street art, and a weekend craft fair at Plaza Serrano. Hollywood is quieter by day, livelier at night for bars and restaurants. The Bosques de Palermo parks are good for a relaxed morning walk, including the Rose Garden and the Japanese Garden.

**San Telmo**
Cobblestone streets, the Sunday antiques fair centered on Plaza Dorrego, impromptu tango dancing in the street, and the covered Mercado de San Telmo for a snack.

**La Boca**
Stick to the Caminito strip and the immediately surrounding blocks; touristy but photogenic. The Boca Juniors stadium and museum are right there for football fans.

**Recoleta**
The cemetery is the headline. The surrounding area has a Sunday craft fair at Plaza Francia and good cafés for a break afterward.

**Puerto Madero**
Modern docks, the Puente de la Mujer bridge, and the ecological reserve (Reserva Ecológica Costanera Sur) for a longer waterside walk if time allows.

---

## 8. Restaurant & café recommendations (dedicated "Where to Eat" section, grouped by neighborhood)

Render as cards grouped by neighborhood tab/filter. Include name, one-line description, approximate price tier ($/$$/$$$/$$$$), and a Google Maps link for each.

**Palermo**
- **Don Julio** — the must-book destination parrilla, see Section 6c for full detail. $$$$
- **El Preferido de Palermo** — classic, casual cantina, great for a relaxed lunch or brunch. $$
- **La Cabrera** — top-rated parrilla, generous sides, easier reservation than Don Julio. $$$
- **Niño Gordo** — Asian-Argentine fusion, good change of pace from beef-heavy meals. $$$
- **Café Cuervo** or **Lattente** — solid specialty coffee for mornings in Soho. $

**San Telmo**
- **Café San Juan** — modern bistro-parrilla with a strong local following, good post-market lunch. $$$
- **Bar El Federal** / **Café La Poesía** — historic "bares notables" with beautiful old interiors, great for coffee or a picada (cured meats and cheese board). $$
- **Mercado de San Telmo** — covered market, good for grazing (empanadas, Coffee Town for espresso) rather than a sit-down meal. $

**La Boca**
Treat as a walk-through stop for a quick snack or ice cream rather than a dining destination; save appetite for elsewhere.

**Recoleta**
- **La Biela** — the classic Recoleta café, right across from the cemetery, iconic terrace coffee or light lunch. $$
- **El Ateneo Grand Splendid** — a former theater turned bookstore with a café on the old stage; worth a stop for the architecture alone. $

**Puerto Madero**
- **El Mercado** (inside the Faena Hotel) — excellent, upscale steakhouse. $$$$
- **Cabaña Las Lilas** — long-established, canal-side steakhouse, popular with visitors, book ahead. $$$$
- **La Parolaccia** — reliable Italian with canal views, good if craving a break from beef. $$$

Note in the copy: since Don Julio is already the trip's big final dinner, treat Puerto Madero as primarily a sunset walk rather than a second major meal.

---

## 9. Food to try beyond the steak dinner (short "Don't Leave Without Trying" list)

A compact list, could render as a simple icon-grid or checklist component (maybe letting the user mark items as tried, using localStorage):
- Empanadas
- Choripán (chorizo sandwich, great street food)
- Provoleta (grilled provolone, common parrilla starter)
- Medialunas with a café con leche, ideally at a classic café like Café Tortoni or La Biela
- Dulce de leche in any dessert form
- Argentine-style helado (ice cream) — Rapa Nui or Freddo are reliable chains
- A glass of Malbec at a proper wine bar, not just at dinner

---

## 10. Master booking checklist (dedicated "To Book" page — this is important, make it a genuinely useful checklist UI, e.g. checkboxes with localStorage persistence)

| Item | Where to book | Approx. price (per person) | Urgency |
|---|---|---|---|
| Don Julio dinner reservation | parrilladonjulio.com (verify current official URL) | Included in dinner cost | Book 6–8 weeks ahead — highest urgency item in this whole trip |
| Tango dinner show (Tango Porteño or Rojo Tango, per Section 6a) | tango-porteno.tangoshowba.com or GetYourGuide | $90–110 (Porteño) / $260–300 (Rojo Tango) | Book 2–3 weeks ahead |
| Ferry to Colonia, Uruguay | buquebus.com or coloniaexpress.com | $100–170 round trip | Book 2–3 weeks ahead, prices rise closer to date |
| Teatro Colón guided tour (if chosen) | teatrocolon.org.ar or GetYourGuide | $40–45 | Book at least a few days ahead |
| Casa Rosada interior tour (optional, free) | argentina.gob.ar | Free | Only runs certain days, book ahead if wanted |

Everything else (San Telmo market, Recoleta Cemetery, La Boca wandering, Puerto Madero, MALBA if chosen) is free or pay-on-arrival and needs no advance booking.

---

## 11. To-do list / trip planning tracker (dedicated page, separate from the booking checklist)

This is broader than Section 10's booking checklist: it should cover everything that needs organizing before departure, not just the items that require a paid reservation. Build this as a genuinely usable tracker: each item has a priority (High / Medium / Low), a checkbox for done/not done, and the list should be sortable or filterable by priority. Persist state in localStorage. A small progress indicator (e.g. "6 of 12 done") is a nice premium touch.

Seed the tracker with the following items. Group them under two headings, "Bookings" and "Before You Go," so the trip-specific reservations aren't buried under generic travel admin.

**Bookings**
| Task | Priority |
|---|---|
| Book Don Julio dinner reservation | High |
| Book ferry to Colonia, Uruguay | High |
| Book tango dinner show | High |
| Decide: Tango Porteño vs. Rojo Tango | Medium |
| Decide: MALBA vs. Teatro Colón | Medium |
| Book Teatro Colón guided tour (if chosen) | Medium |
| Book Casa Rosada interior tour (optional, only if interested) | Low |

**Before you go**
| Task | Priority |
|---|---|
| Check passport validity (most countries require 6 months beyond travel dates) | High |
| Notify bank/card provider of travel dates to Argentina and Uruguay | Medium |
| Check ATM/currency exchange strategy for Argentine pesos | Medium |
| Arrange travel insurance | Medium |
| Check power adapter needs (Argentina uses Type C/I plugs, 220V) | Low |
| Download offline maps for Buenos Aires and Colonia | Low |
| Save this app / bookmark it for offline reference while traveling | Low |

Note in the UI copy that the "Before you go" items are general travel-admin reminders, not trip-specific research, so the traveler knows they weren't individually verified against their personal situation (e.g. their specific passport's validity or their bank's policies).

Also let the traveler add their own custom items with a priority level, since a static seeded list stops being useful the moment something personal comes up (e.g. "pick up dry cleaning," "print hotel confirmation"). A simple inline "add task" input with a priority selector is enough.

---

## 12. Suggested site structure / information architecture

1. **Home / Overview** — hero section with trip dates, a one-line trip summary, and the Don Julio booking urgency callout front and center
2. **Itinerary** — the day-by-day view (Section 4), with the two embedded decision points (tango show, MALBA/Teatro Colón) resolving inline
3. **Uruguay Day Trip** — dedicated deep-dive page (Section 5)
4. **Where to Eat** — neighborhood-filterable restaurant guide (Section 8) plus the "don't miss" food list (Section 9)
5. **Neighborhood Guides** — Section 7 content, could be merged into the Itinerary page as expandable detail per stop, or its own page — builder's choice, pick whichever reads less cluttered
6. **To Book** — the checklist (Section 10), this is a genuinely functional page, not just a summary
7. **To-Do** — the broader trip-planning tracker with priorities (Section 11); keep this distinct from "To Book" since it covers more than reservations

Navigation should work well as a bottom tab bar or sticky top nav on mobile, given this is a phone-first "walking around the city" use case.

---

## 13. Technical notes for the builder

- Static output only, must run on GitHub Pages with no backend
- Use relative paths / correct base path configuration for GitHub Pages project sites
- Client-side persistence (localStorage) for: decision-point selections (Section 6), booking checklist state (Section 10), the to-do tracker's done/not-done state and any custom items added (Section 11), and optionally the food-tried checklist (Section 9)
- Fully responsive, mobile-first given actual on-the-ground usage
- All external links (booking sites, Google Maps) should open in a new tab
- Verify all external booking URLs still resolve at build time before finalizing, since travel booking sites occasionally restructure; if a link can't be verified, note it clearly rather than guessing
- Respect reduced-motion preferences
- No fabricated reviews, prices, or ratings beyond what's provided in this document — if something isn't specified here, don't invent a number, leave it as a link to check current pricing instead
