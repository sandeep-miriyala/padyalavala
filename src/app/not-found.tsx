import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap">
      <h1>ఈ పేజీ లేదు</h1>
      <p className="lead">ఇది వేరే చోటుకు మారి ఉండవచ్చు. మొదటి పేజీకి వెళ్ళండి, లేదా Ctrl + K నొక్కి అడగండి.</p>
      <p><Link className="btn primary" href="/">మొదటి పేజీ</Link></p>
    </section>
  );
}
