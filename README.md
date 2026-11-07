# పద్యాలవాల

రత్నాలబాల – జ్ఞానమాల (మిరియాల వెంకటరత్నం) and మిరా పద్యాలు (డాక్టర్ మిరియాల రామకృష్ణ): Telugu poems for everyone, on any phone or computer. Built only with YuktAI (`@yuktishaalaa/yuktai`, `@yuktishaalaa/ask-page`) on Next.js.

## Add or change a poem

1. Add a `.md` file to `content/ratnalabala/` or `content/mira/`:

   ```
   ---
   title: శీర్షిక
   ---
   మొదటి పాదం
   రెండవ పాదం
   ```

2. Push to GitHub. The site rebuilds by itself.

A new book: add a folder under `content/`, then add it to `BOOKS` in `src/lib/poems.ts` and to the menu in `src/data/site.ts`.

| Page | What it shows |
|---|---|
| `/` | Both books and a poem of the day |
| `/poems/` | Every poem in a searchable list (YuktaiGrid) |
| `/poems/ratnalabala/`, `/poems/mira/` | All poems of one book, with copy, share and listen |

---

Made with [YuktAI](https://yuktaidocs.netlify.app) 1.3.0: Next.js, accessible by default, with AI that runs in the visitor's browser. Nothing a visitor types is sent anywhere.

## Start

```bash
npm install       # once
npm run dev       # http://localhost:3000
npm run build     # static site in out/
npm test          # checks the built site
npm run lint
```

## What is inside

| Page or part | What it does |
|---|---|
| Home `/` | Hero with Ask box, feature cards |
| About `/about/` | What the app is built with |
| Ask this page | Ctrl + K or the header button. Answers come from the page, with the source highlighted |
| ♿ Accessibility | Contrast, text size, dyslexia font, colour-blind filters, reduced motion |
| Install (PWA) | Install button in the header until installed (steps for Safari and Firefox), works offline after the first visit |
| ↑ Back to top | Bottom right, after you scroll |
| Light and dark | Theme button; follows the device by default |
| 🎨 Colour and font | Visitors pick any colour (kept at 7:1 contrast) and a font, including fonts on their own computer (desktop Chrome and Edge) |
| Loading screen | Your logo and "Welcome" in 7 languages, once per browser tab (15 s, Skip any time; `splash.seconds`) |
| 🌐 Language and animations | Menus and buttons in English + 6 Indian languages; animations: Device setting, Off, Calm or Lively |

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

Each moment is also a `yuktai:lifecycle` event on `window`. 

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
mira-poems/
├── yuktai.config.ts           name, colours, features: one place
├── src/
│   ├── app/                   pages (page.tsx = the home page)
│   │   └── about/
│   ├── components/
│   │   ├── yuktai/            header, logo, widget, Ask, install, theme, colour and font picker, lifecycle
│   │   └── ui/                your components
│   ├── data/                  menu, uiText.ts (your words in 7 languages)
│   ├── lib/core.ts            the app's core functions
│   └── styles/                tokens.css (colours), globals.css, look.css
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
  pageTools: false,     // QA report page and 🛠 button
  grid: false,          // data grid page
  icons: false,         // icons guide
  backend: false,       // Python API in backend/
},
theme: { picker: true, localFonts: true },  // 🎨 colour and font picker
grid: { assistant: true, voice: true, language: "en-IN", webmcp: true },
engine: "ts",          // "rust" (WebAssembly) or "ts"
```

## Put it online

GitHub Pages: push to GitHub, then **Settings → Pages → Source: GitHub Actions**. `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

## Privacy

Everything runs in the visitor's browser: the grid, Ask this page, the QA report and the accessibility settings. No server, no API key, no tracking. The QA report reads the page's markup and colours, never what anyone typed into a field.

## Learn more

- Docs and live demos: https://yuktaidocs.netlify.app
- [@yuktishaalaa/yuktai](https://www.npmjs.com/package/@yuktishaalaa/yuktai) · [@yuktishaalaa/ask-page](https://www.npmjs.com/package/@yuktishaalaa/ask-page) · [yuktai CLI](https://www.npmjs.com/package/yuktai)
