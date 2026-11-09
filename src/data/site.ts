// మెనూ, లింకులు. `key` అంటే src/data/uiText.ts లోని పదం.
import config from "@config";

type Feature = keyof typeof config.features;
export type NavLink = { href: string; label: string; key: string; feature?: Feature; hint?: string };
export type NavGroup = { label: string; key: string; feature?: Feature; children: NavLink[] };
export type NavItem = NavLink | NavGroup;
export const isGroup = (n: NavItem): n is NavGroup => "children" in n;

// వ్యాకరణం: ఆరు మాలలు. తర్వాత సాహిత్యం, కళలు కూడా ఇలాగే గుంపులుగా వస్తాయి.
export const VYAKARANAM: NavGroup = {
  label: "వ్యాకరణం",
  key: "vyakaranam",
  children: [
    { href: "/aksharamala/", label: "అక్షరమాల", key: "aksharamala", hint: "అచ్చులు, హల్లులు: విని, రాసి, పలికి నేర్చుకోండి" },
    { href: "/guninta/", label: "గుణింతమాల", key: "guninta", hint: "34 హల్లులు × 16 గుణింతాలు" },
    { href: "/padalu/", label: "పదాలమాల", key: "padalu", hint: "రెండు, మూడు, నాలుగు అక్షరాల పదాలు" },
    { href: "/sametalu/", label: "సామెతలమాల", key: "sametalu", hint: "తెలుగు సామెతలు, అక్షరం వారీగా" },
    { href: "/sandhi/", label: "సంధిమాల", key: "sandhi", hint: "26 సంధులు, పదం ఇస్తే సంధి గుర్తింపు" },
    { href: "/samasa/", label: "సమాసమాల", key: "samasa", hint: "సమాసాలు, విగ్రహ వాక్యాలు, గుర్తింపు" },
  ],
};

// సాహిత్యం: శతకాలు, కథలు. మిరా పద్యాలు, రత్నాలబాల పద్యాలు "పద్యాలవాల" సైట్‌లో ఉన్నాయి.
export const SAHITYAM: NavGroup = {
  label: "సాహిత్యం",
  key: "sahityam",
  children: [
    { href: "/shatakamu/", label: "శతకమాల", key: "shatakamu", hint: "11 శతకాలు: సుమతీ, దాశరథీ, శ్రీకాళహస్తీశ్వర, టీ శతకం…" },
    { href: "/kathamala/", label: "కథామాల", key: "kathamala", hint: "పిల్లల కథలు, వయసు వారీగా, నీతితో" },
    { href: "/ankitham/", label: "అంకితం", key: "ankitham", hint: "శ్రీ మిరియాల వెంకట రత్నం గారికి" },
  ],
};

const ALL: NavItem[] = [
  { href: "/", label: "మొదటి పేజీ", key: "home" },
  VYAKARANAM,
  SAHITYAM,
  { href: "/qa/", label: "QA రిపోర్ట్", key: "qa", feature: "pageTools" },
  { href: "/about/", label: "గురించి", key: "about" },
];

const on = (n: { feature?: Feature }) => !n.feature || Boolean(config.features[n.feature]);
export const NAV: NavItem[] = ALL.filter(on);

export const LINKS = {
  yuktai: "https://www.npmjs.com/package/@yuktishaalaa/yuktai",
  askPage: "https://www.npmjs.com/package/@yuktishaalaa/ask-page",
  docs: "https://yuktaidocs.netlify.app",
  github: "https://github.com/sandeep-miriyala/yuktai",
  oldSite: "https://ratnalabala.vercel.app",
  padyalavala: "https://sandeep-miriyala.github.io/padyalavala/",
};
