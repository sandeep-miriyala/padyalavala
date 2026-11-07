import type { UiText } from "@yuktishaalaa/yuktai/experience";

// This app's own words in the 7 site languages (English + Telugu, Hindi, Tamil,
// Kannada, Malayalam, Bengali). Common words (Home, About, Install app, Ask this
// page, Back to top…) come from the library. English is used for anything missing.
// Add a word here, then use it with: const { t } = useUiText(APP_TEXT); t("myWord")
export const APP_TEXT: UiText = {
  en: { poems: "Poems", allPoems: "All poems", ratnalabala: "Ratnalabala", mira: "Mira poems", grid: "Data grid", qa: "QA report", icons: "Icons", backend: "Python API", agenticAI: "Agentic AI", gridAgent: "Grid Agent", rag: "Ask the documents", testingAgent: "Testing Agent", assistant: "YuktAI Assistant" },
  te: { poems: "పద్యాలు", allPoems: "అన్ని పద్యాలు", ratnalabala: "రత్నాలబాల", mira: "మిరా పద్యాలు", grid: "డేటా గ్రిడ్", qa: "QA రిపోర్ట్", icons: "ఐకాన్లు", backend: "Python API", agenticAI: "ఏజెంటిక్ AI", gridAgent: "గ్రిడ్ ఏజెంట్", rag: "పత్రాలను అడగండి", testingAgent: "టెస్టింగ్ ఏజెంట్", assistant: "YuktAI సహాయకుడు" },
  hi: { poems: "कविताएँ", allPoems: "सभी कविताएँ", ratnalabala: "रत्नालबाला", mira: "मिरा कविताएँ", grid: "डेटा ग्रिड", qa: "QA रिपोर्ट", icons: "आइकन", backend: "Python API", agenticAI: "एजेंटिक AI", gridAgent: "ग्रिड एजेंट", rag: "दस्तावेज़ों से पूछें", testingAgent: "टेस्टिंग एजेंट", assistant: "YuktAI सहायक" },
  ta: { poems: "கவிதைகள்", allPoems: "அனைத்து கவிதைகள்", ratnalabala: "ரத்னாலபாலா", mira: "மிரா கவிதைகள்", grid: "தரவு கட்டம்", qa: "QA அறிக்கை", icons: "ஐகான்கள்", backend: "Python API", agenticAI: "ஏஜென்டிக் AI", gridAgent: "கிரிட் ஏஜென்ட்", rag: "ஆவணங்களிடம் கேளுங்கள்", testingAgent: "சோதனை ஏஜென்ட்", assistant: "YuktAI உதவியாளர்" },
  kn: { poems: "ಪದ್ಯಗಳು", allPoems: "ಎಲ್ಲಾ ಪದ್ಯಗಳು", ratnalabala: "ರತ್ನಾಲಬಾಲ", mira: "ಮಿರಾ ಪದ್ಯಗಳು", grid: "ಡೇಟಾ ಗ್ರಿಡ್", qa: "QA ವರದಿ", icons: "ಐಕಾನ್‌ಗಳು", backend: "Python API", agenticAI: "ಏಜೆಂಟಿಕ್ AI", gridAgent: "ಗ್ರಿಡ್ ಏಜೆಂಟ್", rag: "ದಾಖಲೆಗಳನ್ನು ಕೇಳಿ", testingAgent: "ಪರೀಕ್ಷಾ ಏಜೆಂಟ್", assistant: "YuktAI ಸಹಾಯಕ" },
  ml: { poems: "കവിതകൾ", allPoems: "എല്ലാ കവിതകളും", ratnalabala: "രത്നാലബാല", mira: "മിരാ കവിതകൾ", grid: "ഡാറ്റ ഗ്രിഡ്", qa: "QA റിപ്പോർട്ട്", icons: "ഐക്കണുകൾ", backend: "Python API", agenticAI: "ഏജന്റിക് AI", gridAgent: "ഗ്രിഡ് ഏജന്റ്", rag: "രേഖകളോട് ചോദിക്കൂ", testingAgent: "ടെസ്റ്റിംഗ് ഏജന്റ്", assistant: "YuktAI സഹായി" },
  bn: { poems: "কবিতা", allPoems: "সব কবিতা", ratnalabala: "রত্নালবালা", mira: "মিরা কবিতা", grid: "ডেটা গ্রিড", qa: "QA রিপোর্ট", icons: "আইকন", backend: "Python API", agenticAI: "এজেন্টিক AI", gridAgent: "গ্রিড এজেন্ট", rag: "নথিকে জিজ্ঞেস করুন", testingAgent: "টেস্টিং এজেন্ট", assistant: "YuktAI সহকারী" },
};
