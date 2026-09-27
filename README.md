# Classic Wedding Invitation Template

Tier: **Classic (৳2,990)** · Mobile-first single-page digital invitation.

Emerald & gold ceremonial design with a Moorish arch hero, wax-seal monogram,
family welcome, live countdown, event cards with Google Maps + calendar links,
embedded venue map, and one-tap share.

## Included in this tier

- Couple names + gold monogram seal
- Wedding date + live countdown
- Family / welcome message
- Event details (unlimited event cards — side by side on desktop)
- Venue with Google Maps embed + directions (split details/map layout on desktop)
- Add-to-Calendar (Google Calendar) per event
- Shareable link (Web Share API + copy-link fallback)
- Mobile optimized; desktop gets a full-width layout (wide arch hero with
  flanking botanical branches, families side by side, event card grid,
  two-column venue section)
- Subtle scroll reveals (respects `prefers-reduced-motion`)
- Ambient finishing touches: drifting gold petals, self-drawing
  botanical line art, gold-foil names with a slow sheen, paper grain,
  breathing arch glow, corner flourishes and countdown digit settle
  (all motion collapses under `prefers-reduced-motion`)

Not in this tier (reserved for Signature / Luxury): photo gallery,
background music, RSVP, multiple animated scenes, custom typography/colors.

## Files

| File         | Purpose                                        |
|--------------|------------------------------------------------|
| `index.html` | Page structure. Rarely needs editing.          |
| `styles.css` | All styling + design tokens at the top.        |
| `config.js`  | **Every client-specific value lives here.**    |
| `script.js`  | Rendering, countdown, share, calendar, reveals.|
| `assets/`    | Favicon (and future images).                   |

## Customising for a client

Edit **`config.js` only** — names, blessing, date, families, events, venue,
closing line and studio credit. Every field is commented.

Two fields need small care:

- `weddingDateTime` — ISO format with timezone, e.g. `"2027-01-24T17:00:00+06:00"`.
  Drives the countdown.
- Each event's `mapQuery` — paste the venue name exactly as Google Maps knows
  it (or `23.7936,90.4043` style coordinates) so the map pins correctly.

Add a second event by duplicating an entry in `events: [ … ]`.

### Recolouring (if sold as an option)

All colours are CSS variables at the top of `styles.css`:

```css
--emerald: #123f32;   /* primary background */
--gold:    #c9a24d;   /* accent */
--cream:   #f6f1e6;   /* paper */
```

Change these three and the whole page follows.

## Languages (English / বাংলা)

The invite ships with a fixed top-right **EN | বাং** toggle. English is the
default; first-time visitors whose browser language starts with `bn` get
Bangla automatically. The choice is remembered in `localStorage`
(`invite-lang`) and restored on the next visit.

- **Client content** is localised through the optional `bn:` block in
  `config.js` — a mirror of the English fields (names, families, events,
  venue, closing line…). Objects merge key by key, so any field you omit
  falls back to its English value; the `events` array replaces wholesale
  (include `mapQuery`/`cal*` fields there).
- **UI strings** (headings, countdown labels, buttons, toast, aria-labels)
  live in the `UI` dictionary at the top of `script.js`.
- In Bangla mode, generated numerals (countdown, footer date) render as
  Bangla digits (০–৯) automatically. Write dates/times/addresses in the
  `bn:` block with Bangla digits directly.
- Delete the `bn:` block and the toggle hides itself — the site becomes
  English-only, exactly as before the feature existed.
- `Noto Serif Bengali` is already in every font stack, so no font or CSS
  work is needed for new Bangla content.

## Running locally

```bash
cd template1
python3 -m http.server 8080
# open http://localhost:8080
```

(Opening `index.html` directly via `file://` also works — only the map iframe
and clipboard need a real http(s) origin when deployed.)

When previewed on `localhost`, `127.0.0.1` or `file://`, the page forces the
decorative motion (petals, sways, parallax) on even if your OS reports
`prefers-reduced-motion` — see the "Local preview override" script in
`index.html`. Production visitors always get the accessible behaviour
(motion disabled when their device asks for it).

## Deploying

Any static host: GitHub Pages, Netlify, Vercel, Cloudflare Pages —
drag the folder in. One URL per couple = the shareable link.

## Fonts

Google Fonts loaded in `index.html`: Cormorant Garamond (serif),
Great Vibes (script), Manrope (sans), Noto Serif Bengali (Bangla text support).
Bangla renders correctly anywhere it appears (names, blessing, messages).
