import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";

export default function ComingSoon({ title }) {
  return (
    <AppShell title={title}>
      <div className="mx-auto mt-6 max-w-lg rounded-3xl border border-[#ebe9f3] bg-white px-6 py-14 text-center sm:mt-12">
        <span className="inline-block rounded-full bg-[#f4eafa] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#8064a5]">
          Coming soon
        </span>
        <h1 className="mt-5 font-['Instrument_Serif',serif] text-4xl">{title}</h1>
        <p className="mt-3 text-[15px] text-[#6b6985]">We're still building this part of Aadat. Check back soon.</p>
        <Link to="/dashboard" className="btn_ppl mt-7">
          Back to Today
        </Link>
      </div>
    </AppShell>
  );
}
