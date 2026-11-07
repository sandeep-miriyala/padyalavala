import type { UiText } from "@yuktishaalaa/yuktai/experience";

// This site is Telugu only, so every word is in Telugu. The library uses "en" for the first
// render (and as the fallback), so "en" holds the same Telugu words: nothing flashes in English.
const TE = {
  home: "మొదటి పేజీ",
  about: "గురించి",
  poems: "పద్యాలు",
  allPoems: "అన్ని పద్యాలు",
  ratnalabala: "రత్నాలబాల",
  mira: "మిరా పద్యాలు",
  installApp: "యాప్‌గా పెట్టుకోండి",
  askThisPage: "ఈ పేజీని అడగండి…",
  ask: "అడగండి",
  backToTop: "పైకి వెళ్ళండి",
  skip: "విషయానికి వెళ్ళండి",
  darkTheme: "చీకటి థీమ్",
  copy: "కాపీ",
  copied: "కాపీ అయింది",
  loading: "లోడ్ అవుతోంది",
};

export const APP_TEXT: UiText = { en: TE, te: TE };
