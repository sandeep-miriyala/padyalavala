import type { UiText } from "@yuktishaalaa/yuktai/experience";

// ఈ సైట్ తెలుగులోనే. Library మొదటి render కి (fallback కి కూడా) "en" వాడుతుంది, అందుకే
// "en" లో కూడా అవే తెలుగు పదాలు: ఇంగ్లీష్ ఒక్క క్షణం కూడా కనిపించదు.
const TE = {
  home: "మొదటి పేజీ",
  about: "గురించి",
  vyakaranam: "వ్యాకరణం",
  aksharamala: "అక్షరమాల",
  guninta: "గుణింతమాల",
  padalu: "పదాలమాల",
  sametalu: "సామెతలమాల",
  sandhi: "సంధిమాల",
  samasa: "సమాసమాల",
  sahityam: "సాహిత్యం",
  shatakamu: "శతకమాల",
  kathamala: "కథామాల",
  ankitham: "అంకితం",
  qa: "QA రిపోర్ట్",
  installApp: "యాప్‌గా పెట్టుకోండి",
  askThisPage: "ఈ పేజీని అడగండి…",
  ask: "అడగండి",
  backToTop: "పైకి వెళ్ళండి",
  skip: "విషయానికి వెళ్ళండి",
  darkTheme: "చీకటి థీమ్",
  copy: "కాపీ",
  copied: "కాపీ అయింది",
  loading: "లోడ్ అవుతోంది",
  skipIntro: "దాటవేయి",
  settings: "భాష, యానిమేషన్లు",
  language: "భాష",
  motion: "యానిమేషన్లు",
  motionAuto: "పరికరం సెట్టింగ్",
  motionOff: "ఆఫ్",
  motionCalm: "నెమ్మదిగా",
  motionLively: "ఉత్సాహంగా",
  saved: "ఈ బ్రౌజర్‌లో మాత్రమే సేవ్ అవుతుంది.",
  uiNote: "మెనూలు, బటన్లు ఎంచుకున్న భాషలో మారతాయి. పాఠాలు తెలుగులోనే.",
};

export const APP_TEXT: UiText = { en: TE, te: TE };
