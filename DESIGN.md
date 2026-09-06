# Design tokens — Buenos Aires & Uruguay, 28 Nov – 2 Dec

The site is styled from one token sheet (`css/tokens.css`). Nothing in the
component CSS uses a raw hex value, font name, or pixel size that is not
defined here.

## Concept

"A concierge's leather folder, opened on a café table on Avenida de Mayo."

- **Grand-café elegance**: cream paper, hairline rules, a serif with real
  contrast for headings, small-caps eyebrow labels set in the sans (normal
  letterspacing, not tracked-out).
- **Tango-hall drama**: one deep ink ground for the hero, the nav and the
  decision cards; one red, used only where a decision or an urgent booking
  needs the eye.
- **Río de la Plata light**: the photographs are warm and sun-bleached; a
  muted river blue-green is reserved for water and "done" states.

## Colour

| Token            | Hex       | Role                                                        |
|------------------|-----------|-------------------------------------------------------------|
| `--ink`          | `#1B1D24` | Hero, nav, dark panels, primary text on cream              |
| `--ink-2`        | `#272A34` | Raised surfaces on ink (cards inside the hero, bottom bar)  |
| `--ink-3`        | `#3A3E4B` | Hairlines and muted text on ink                             |
| `--cream`        | `#F6F1E7` | Page background                                             |
| `--cream-2`      | `#EDE6D8` | Alternate bands, card backgrounds, table stripes            |
| `--cream-3`      | `#E2D9C6` | Pressed states, tag backgrounds                             |
| `--line`         | `#D6CCB6` | Hairline rules on cream                                     |
| `--text`         | `#1B1D24` | Body text                                                   |
| `--text-2`       | `#5E594E` | Secondary text, captions, times                             |
| `--text-on-ink`  | `#F6F1E7` | Text on ink                                                 |
| `--text-on-ink-2`| `#B9B3A5` | Secondary text on ink                                       |
| `--red`          | `#A8332B` | Tango red. Primary accent: selected state, urgency, CTAs    |
| `--red-2`        | `#8C271F` | Red hover/pressed                                           |
| `--red-tint`     | `#F3E1DD` | Red at 12% on cream (urgency banner background)             |
| `--brass`        | `#B8894A` | Aged brass. Eyebrow rules, icons, recommended badges        |
| `--brass-tint`   | `#F1E6D1` | Brass at 15% on cream                                       |
| `--river`        | `#5E8B7E` | Río de la Plata blue-green. Uruguay/ferry, "done" states    |
| `--river-tint`   | `#DDE9E3` | River at 15% on cream                                       |

Weighting rule: cream and ink carry 90% of any screen. Red appears at most
once per viewport unless several items are genuinely urgent. Brass is for
small metal: icons, rules, badges. River is only for water and completion.

## Typography

- **Display / headings**: `Fraunces` (Google Fonts, variable, optical size
  9–144). Set with `"opsz"` auto and `"SOFT" 30, "WONK" 1` for a little
  old-signage flavour at display sizes only.
- **Body / UI**: `Inter` (Google Fonts, variable). Tabular numerals on
  prices and times (`font-variant-numeric: tabular-nums`).
- Fallbacks: `Georgia, "Times New Roman", serif` and `-apple-system,
  "Helvetica Neue", Arial, sans-serif`.

| Token        | Size / line    | Use                                   |
|--------------|----------------|---------------------------------------|
| `--fs-xs`    | 12 / 16        | Tags, captions                        |
| `--fs-sm`    | 14 / 20        | Secondary text, table cells           |
| `--fs-md`    | 16 / 24        | Body                                  |
| `--fs-lg`    | 18 / 26        | Lead paragraphs                       |
| `--fs-h4`    | 22 / 28        | Card titles (serif)                   |
| `--fs-h3`    | 28 / 34        | Section titles (serif)                |
| `--fs-h2`    | 38 / 42        | Page titles (serif)                   |
| `--fs-h1`    | clamp(52, 9vw, 96) / 0.95 | Hero and day numerals (serif) |

Eyebrow labels: Inter 12px, weight 600, `font-variant-caps: all-small-caps`,
letterspacing 0.02em, brass colour.

## Spacing, radii, lines

4px base scale: `--s-1` 4, `--s-2` 8, `--s-3` 12, `--s-4` 16, `--s-5` 24,
`--s-6` 32, `--s-7` 48, `--s-8` 64, `--s-9` 96.

Radii are deliberately tight: `--r-sm` 3px (tags, inputs), `--r-md` 6px
(cards), `--r-pill` 999px only for the day selector chips. No 16–24px
"bubble" radii anywhere.

Lines: `--hair` 1px `--line`; `--rule-brass` 1px `--brass`. Cards on cream
have a hairline border and no drop shadow. Cards on ink have no border and a
1px `--ink-3` top rule.

## Layout

- `--measure` 68ch reading width, `--wide` 1120px page width.
- Mobile first. One column under 720px, two at 720px, itinerary gains a
  sticky left day rail at 960px.
- Navigation: sticky top bar on desktop (wordmark + 7 links); fixed bottom
  tab bar on mobile (6 icons + labels), 56px tall, sits above the safe area.

## Motifs

- **Balcony rule**: a repeating wrought-iron scroll drawn as an SVG pattern,
  used once per page as the divider under the page title. Never as a
  background texture.
- **Day numerals**: tango-poster typography for day headers — a huge Fraunces
  numeral ("29") with the weekday and month set small beside it.
- **Route line**: itinerary stops sit on a dotted vertical route with a pin
  marker per stop; the pin fills brass when the stop links to a place.

## Photography

Wikimedia Commons, Creative Commons licensed, credited in the footer. One
photo per: hero, neighbourhood card, Uruguay page header, ferry section, and
the Teatro Colón / MALBA comparison. Everything else is line icons.
Treatment: 3:2 crop for cards, 16:9 for page headers, a consistent warm
grade (`filter: saturate(0.85) sepia(0.12) contrast(1.05)`) plus an ink
gradient overlay where text sits on the image.

The tango-show comparison is typographic rather than photographic: no
free-license photo of either venue's interior exists on Commons, and the
brief asks for icon-led treatment rather than a stand-in.

## Motion

One transition: switching days in the itinerary (opacity + 8px rise,
220ms, ease-out). Selecting a decision card animates only the border and
check mark (150ms). Everything is disabled under
`prefers-reduced-motion: reduce`.
