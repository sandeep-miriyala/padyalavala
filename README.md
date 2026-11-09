# రత్నాలబాల: వ్యాకరణం, సాహిత్యం

తెలుగు నేర్చుకోవడానికి ఒక ఇల్లు. రత్నాలబాల కొత్త రూపం, [YuktAI](https://github.com/sandeep-miriyala/yuktai) తో. **వ్యాకరణం**:

| మాల | పేజీ | ఏముంది |
|---|---|---|
| అక్షరమాల | `/aksharamala/` | 52 అక్షరాలు, బొమ్మలు; వినండి, **రాసి చూడండి** (Rust సరిచూస్తుంది), **పలికి చూడండి** |
| గుణింతమాల | `/guninta/` | 34 హల్లులు × 16 గుణింతాలు = 544, ఒక్కొక్కటి వినిపిస్తుంది |
| పదాలమాల | `/padalu/` | 145 పదాలు, అక్షరం అక్షరంగా విడగొట్టి, వినిపిస్తుంది |
| సామెతలమాల | `/sametalu/` | 768 సామెతలు, ఈ రోజు సామెత, కాపీ, WhatsApp |
| సంధిమాల | `/sandhi/` | 26 సంధులు, పదం ఇస్తే సంధి గుర్తింపు |
| సమాసమాల | `/samasa/` | 6 సమాసాలు, రకాలు, విగ్రహ వాక్యాలు, సమాసం గుర్తింపు |

**సాహిత్యం**:

| మాల | పేజీ | ఏముంది |
|---|---|---|
| శతకమాల | `/shatakamu/` | 11 శతకాలు, 1,140 పద్యాలు; అన్ని పద్యాల్లో Rust వెతుకులాట, ఈ రోజు పద్యం; ఒక్కో శతకానికి ఒక పేజీ (`/shatakamu/Sumati/`…), భావం ఉన్న చోట భావం, వినండి, కాపీ, WhatsApp |
| కథామాల | `/kathamala/` | పిల్లల కోసం 100 కథలు, 4 వయసు గుంపులు, ప్రతి కథకు నీతి, కథ మొత్తం వినిపిస్తుంది |
| అంకితం | `/ankitham/` | శ్రీ మిరియాల వెంకట రత్నం గారికి |

మిరా పద్యాలు, రత్నాలబాల పద్యాలు: [పద్యాలవాల](https://sandeep-miriyala.github.io/padyalavala/).

ప్రతి మాలలో YuktaiGrid (Rust వెతుకులాట, తెలుగు గ్రిడ్ AI సహాయకుడు, 🎤 మాట, WebMCP), ♿ widget, 🎨 రంగు/ఫాంట్, 🌐 7 భాషల మెనూ, Ctrl + K ఈ పేజీని అడగండి, PWA (ఆఫ్‌లైన్). సర్వర్ లేదు, API key లేదు, analytics లేదు.

Data: `src/data/bhashaMala.ts`, `src/data/akshara.ts`, `content/sametalu/*.json`, `content/shatakamu/<శతకం>/*.md`, `content/kathamala.json`, బొమ్మలు `public/akshara/` (అన్నీ పాత రత్నాలబాల నుంచే).

## Vercel లో

`vercel.json` సిద్ధంగా ఉంది: GitHub కి push చేసి vercel.com/new లో repository ని Import చేసి Deploy నొక్కండి. Settings మార్చక్కర్లేదు. ఉచిత Hobby plan వ్యక్తిగత, వాణిజ్యేతర సైట్లకు మాత్రమే. ఒకసారి Jio, Vi మొబైల్ డేటాలో తెరిచి చూడండి.

---


Made with [YuktAI](https://yuktaidocs.netlify.app) 1.4.0: Next.js + Rust (WebAssembly), accessible by default, with AI that runs in the visitor's browser. Nothing a visitor types is sent anywhere.

## Start

```bash
npm install       # once
npm run dev       # http://localhost:3000
npm run build     # static site in out/
npm test          # checks the built site
npm run lint
```

Rust is optional. With it installed, `yuktai dev` and `yuktai build` compile `rust/` to `public/wasm/core.wasm` first; without it the app uses the TypeScript fallback in `src/lib/core.ts`.

```bash
# once, from https://rustup.rs
rustup target add wasm32-unknown-unknown
```

## What is inside

| Page or part | What it does |
|---|---|
| Home `/` | Hero with Ask box, feature cards |
| Data grid `/grid/` | 25 lakh (2,500,000) sample orders made in the browser (10 lakh on phones). Search and sort every column in Rust, **Show all** (every row in one smooth scrolling list) or pages, the Grid AI Assistant, 🎤 voice, 24 input languages, row selection, browser-agent tools (WebMCP) |
| QA report `/qa/` | 15 WCAG 2.2 checks, score, what to fix, Markdown download. The 🛠 button has it on every page |
| About `/about/` | What the app is built with |
| Ask this page | Ctrl + K or the header button. Answers come from the page, with the source highlighted |
| ♿ Accessibility | Contrast, text size, dyslexia font, colour-blind filters, reduced motion |
| Install (PWA) | Install button in the header until installed (steps for Safari and Firefox), works offline after the first visit |
| ↑ Back to top | Bottom right, after you scroll |
| Light and dark | Theme button; follows the device by default |
| 🎨 Colour and font | Visitors pick any colour (kept at 7:1 contrast) and a font, including fonts on their own computer (desktop Chrome and Edge) |
| Loading screen | Your logo and "Welcome" in 7 languages, once per browser tab (15 s, Skip any time; `splash.seconds`) |
| 🌐 Language and animations | Menus and buttons in English + 6 Indian languages; animations: Device setting, Off, Calm or Lively |

## Data grid: 25 lakh rows

`src/data/orders.ts` makes the rows in the browser with a seeded random generator (the same rows every time, nothing downloaded). Six columns, five data types:

| Column | Type | Example |
|---|---|---|
| `id` | text | `ORD-0000001` |
| `customer` | text | `Lakshmi Reddy` |
| `city` | badge | `Hyderabad` |
| `amount` | number | `₹24,999.50` |
| `date` | date | `2025-03-14` |
| `paid` | boolean | Yes / No |

### Grid AI Assistant

Type or say what you want: `how many rows`, `unpaid`, `search Pune`, `sort by date`, `clear filters`. The assistant runs the grid's own tools (search, filter, sort, count) in the browser, in a second or two on 25 lakh rows. Nothing is sent anywhere.

- **Languages:** English and the 22 Indian scheduled languages for typing and 🎤 voice (Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Marathi, Gujarati…). Pick one in the assistant; set the default in `yuktai.config.ts` (`grid.language`). Commands are understood in English and Telugu today.
- **Your own words:** `rules` in `OrdersGrid.tsx` maps phrases ("unpaid", "బాకీ", "बकाया") to grid tools. Add rules for your data.
- **Browser agents (WebMCP):** with `grid.webmcp` on, AI agents in Chrome (WebMCP enabled) can use 11 grid tools. The page shows whether they are ready.
- **Restyle it:** the grid follows this site's colours through `--yk-grid-*` CSS variables in `src/styles/grid.css`.

Pick 1,000, 1,00,000, 10,00,000 or 25,00,000 rows on the page (phones start at 10 lakh). To use your own data, replace `makeOrders()` and the `columns` list in `src/app/grid/OrdersGrid.tsx`.

## Lifecycle

Every part has three moments, from `src/components/yuktai/lifecycle.ts`:

| Hook | When | Use it to |
|---|---|---|
| `onStart` | The part is on the page and ready | Load data, start a timer |
| `onChange` | The visitor changed something | Show a count, save a filter |
| `onEnd` | The part leaves the page | Stop timers, free memory |

```tsx
const life = useLifecycle({
  part: "grid",
  onStart: () => console.log("ready"),
  onChange: (what) => console.log(what),
  onEnd: () => console.log("bye"),
});
life.change({ query: "pune" }); // runs onChange
```

Each moment is also a `yuktai:lifecycle` event on `window`. The grid shows its own lifecycle under the table.

## Colour and font

The 🎨 button in the header lets each visitor choose:

- **A colour:** six ready colours or any colour. It is darkened (light theme) or lightened (dark theme) until text reaches 7:1 contrast (WCAG AAA), so no choice can make the site hard to read.
- **A font:** ready choices that need no download (easy-to-read, serif, Telugu, Devanagari, Tamil), or, on desktop Chrome and Edge, any font installed on their computer. The browser asks first; the font list never leaves the device. Phones, tablets, Safari and Firefox see the ready choices only.

Choices are saved in that browser only. Turn it off with `theme.picker` and `theme.localFonts` in `yuktai.config.ts`; the code is in `src/components/yuktai/look.ts`.

## Language and animations

The 🌐 button in the header (`features.preferences`):

- **Language:** English, తెలుగు Telugu, हिन्दी Hindi, தமிழ் Tamil, ಕನ್ನಡ Kannada, മലയാളം Malayalam, বাংলা Bengali for menus and buttons. Common words come from `@yuktishaalaa/yuktai/experience`; add your own in `src/data/uiText.ts` and use them with `const { t, lang } = useUiText(APP_TEXT)`. Put `lang={lang}` on what you translate so screen readers read it correctly.
- **Animations:** the visitor decides. Device setting follows the computer's reduced-motion setting; Off stops every animation on the page; Calm fades and slides; Lively adds float, pop and shimmer. Use `<Reveal>` to fade a part in on scroll, and the classes `yk-lift`, `yk-float`, `yk-pop`, `yk-shimmer`.

The loading screen (`features.splash`) shows your logo and "Welcome" in all 7 languages once per browser tab. It is `<YuktaiSplash>` in `src/app/layout.tsx`.

## Install (PWA)

`public/manifest.json` has normal, maskable and monochrome (Android themed) icons, shortcuts to the main pages and two screenshots for Chrome's install window. Replace `public/screenshots/*.png` with pictures of your app.

## Folders

```
ratnalabala-yuktai/
├── yuktai.config.ts           name, colours, features: one place
├── src/
│   ├── app/                   pages (page.tsx = the home page)
│   │   ├── grid/              data grid page
│   │   ├── qa/                QA report page
│   │   └── about/
│   ├── components/
│   │   ├── yuktai/            header, logo, widget, Ask, install, theme, colour and font picker, lifecycle
│   │   └── ui/                your components
│   ├── data/                  menu, uiText.ts (your words in 7 languages), sample orders
│   ├── lib/core.ts            the app's core functions (loads the Rust WebAssembly)
│   └── styles/                tokens.css (colours), globals.css, look.css, grid.css, qa.css
├── rust/                      Rust core → public/wasm/core.wasm
├── public/                    icons, manifest.json, service worker
└── tests/                     checks for the built site
```

## Settings

Turn parts on or off in `yuktai.config.ts`:

```ts
features: {
  accessibility: true,  // ♿ widget
  ask: true,            // Ask this page, Ctrl + K
  pwa: true,            // Install button, offline
  splash: true,         // loading screen, once per tab
  preferences: true,    // 🌐 language and animations
  pageTools: true,     // QA report page and 🛠 button
  grid: true,          // data grid page
  icons: false,         // icons guide
  backend: false,       // Python API in backend/
},
theme: { picker: true, localFonts: true },  // 🎨 colour and font picker
grid: { assistant: true, voice: true, language: "en-IN", webmcp: true },
engine: "rust",          // "rust" (WebAssembly) or "ts"
```

There is no `next.config` file to look after: `npm run dev` and `npm run build` make one for each run (static export, the GitHub Pages path) and remove it afterwards. Need a Next.js setting of your own? Add `next.config.ts`; YuktAI then uses yours and leaves it alone.

## Put it online

Vercel: push to GitHub, then on https://vercel.com/new **Import** the repository and press **Deploy**. `vercel.json` already has the build command and the `out` folder, so leave the settings as they are. Every push to `main` goes live; every pull request gets its own preview link.

Vercel's build machines have no Rust, so the build runs `npm run build -- --setup-rust`: it installs a minimal Rust toolchain first. If that ever fails, the site still builds and uses the TypeScript engine.

Good to know:

- The free **Hobby** plan is for personal, non-commercial sites only: no ads, no selling, no being paid to build or host the site. Asking for donations is fine. See [Vercel's fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines).
- In India, open the site on **Jio and Vi mobile data** once. Some custom domains on Vercel don't load there while the `.vercel.app` address does.
- Vercel Analytics and Speed Insights are not added: nothing about your visitors is collected.

## Privacy

Everything runs in the visitor's browser: the grid, Ask this page, the QA report and the accessibility settings. No server, no API key, no tracking. The QA report reads the page's markup and colours, never what anyone typed into a field.

## Learn more

- Docs and live demos: https://yuktaidocs.netlify.app
- [@yuktishaalaa/yuktai](https://www.npmjs.com/package/@yuktishaalaa/yuktai) · [@yuktishaalaa/ask-page](https://www.npmjs.com/package/@yuktishaalaa/ask-page) · [yuktai CLI](https://www.npmjs.com/package/yuktai)
