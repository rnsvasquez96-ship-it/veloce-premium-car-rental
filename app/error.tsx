"use client";

import Link from "next/link";
import { ArrowUpRight, RotateCcw } from "lucide-react";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main id="main-content" tabIndex={-1} className="state-stage page-gutter">
      <div className="content-width">
        <p className="eyebrow">VELOCE / A brief interruption</p>
        <h1 className="state-title mt-10">Let&apos;s get you<br />back on the road.</h1>
        <p className="mt-7 max-w-md text-sm leading-7 text-white/70">We couldn&apos;t load this part of the experience. Try again, or return to the collection.</p>
        <div className="mt-10 flex flex-wrap gap-4"><button type="button" onClick={retry} className="primary-link">Try again <RotateCcw size={16} /></button><Link href="/fleet" className="secondary-link">The collection <ArrowUpRight size={16} /></Link></div>
      </div>
    </main>
  );
}
