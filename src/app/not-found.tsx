import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap" lang="te">
      <p className="kicker">404</p>
      <h1>ఈ పేజీ ఇక్కడ లేదు</h1>
      <p className="lead">అది వేరే చోటికి వెళ్ళి ఉండవచ్చు. మొదటి పేజీకి వెళ్ళండి, లేదా Ctrl + K నొక్కి అడగండి.</p>
      <p><Link className="btn primary" href="/">మొదటి పేజీ</Link></p>
    </section>
  );
}
