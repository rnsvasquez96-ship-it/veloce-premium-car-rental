import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
} from "lucide-react";

const navigation = [
  {
    label: "The collection",
    href: "/fleet",
  },
  {
    label: "The experience",
    href: "/#experience",
  },
  {
    label: "Your journey",
    href: "/#how-it-works",
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#060707] text-white">
      {/* =========================================================
          ARCHITECTURAL BACKGROUND
      ========================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-6 top-0 h-full w-px bg-white/[0.025] lg:left-10" />

        <div className="absolute right-6 top-0 h-full w-px bg-white/[0.025] lg:right-10" />

        <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.018]" />

        <div className="absolute bottom-[32%] left-0 h-px w-full bg-white/[0.025]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 pb-7 pt-20 sm:px-6 md:pt-28 lg:px-10 lg:pt-32">
        {/* =========================================================
            OPENING FOOTER STATEMENT
        ========================================================== */}

        <div className="grid gap-14 border-b border-white/12 pb-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:pb-20">
          <div>
            <Link
              href="/"
              aria-label="VELOCE home"
              className="inline-block text-[clamp(2.2rem,5vw,5.4rem)] font-medium uppercase leading-none tracking-[-0.065em] transition-opacity duration-300 hover:opacity-70"
            >
              VELOCE
            </Link>

            <p className="mt-5 text-[8px] uppercase tracking-[0.45em] text-white/30">
              Premium Car Rental / Philippines
            </p>

            <p className="mt-9 max-w-lg text-2xl leading-[1.08] tracking-[-0.045em] text-white/88 md:text-3xl lg:text-4xl">
              Exceptional machines.
              <span className="text-white/28">
                {" "}
                Personal journeys.
              </span>
            </p>
          </div>

          <div className="lg:justify-self-end lg:text-right">
            <p className="text-[8px] uppercase tracking-[0.42em] text-white/25">
              The VELOCE philosophy
            </p>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/46 lg:ml-auto">
              A considered way to move. From the machine you choose to the
              moment it arrives, every detail is part of the experience.
            </p>
          </div>
        </div>

        {/* =========================================================
            NAVIGATION / LOCATION / BACK TO TOP
        ========================================================== */}

        <div className="grid gap-14 border-b border-white/10 py-14 md:grid-cols-[1fr_0.7fr_0.7fr] lg:py-16">
          {/* Navigation */}

          <nav aria-label="Footer navigation">
            <p className="text-[7px] uppercase tracking-[0.45em] text-white/24">
              Discover
            </p>

            <div className="mt-6 max-w-sm">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-h-12 items-center justify-between gap-6 border-t border-white/10 py-3 first:border-t-0"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-[7px] tabular-nums tracking-[0.3em] text-white/18">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-sm tracking-[-0.02em] text-white/65 transition-colors duration-300 group-hover:text-white">
                      {item.label}
                    </span>
                  </div>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.2}
                    className="text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d8ff3e]"
                  />
                </Link>
              ))}
            </div>
          </nav>

          {/* Location */}

          <div>
            <p className="text-[7px] uppercase tracking-[0.45em] text-white/24">
              Based in
            </p>

            <p className="mt-6 text-lg leading-[1.45] tracking-[-0.025em] text-white/72">
              Metro Manila
              <br />
              Philippines
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d8ff3e]" />

              <p className="text-[7px] uppercase tracking-[0.38em] text-white/30">
                Private performance fleet
              </p>
            </div>
          </div>

          {/* Back to top */}

          <div className="md:text-right">
            <p className="text-[7px] uppercase tracking-[0.45em] text-white/24">
              Return
            </p>

            <a
              href="#top"
              className="group mt-6 inline-flex min-h-12 items-center gap-5 border-b border-white/15 text-[8px] uppercase tracking-[0.38em] text-white/50 transition-colors duration-300 hover:border-[#d8ff3e] hover:text-white"
            >
              Back to top

              <ArrowUp
                size={14}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:-translate-y-1"
              />
            </a>
          </div>
        </div>

        {/* =========================================================
            LEGAL / PORTFOLIO CONTEXT
        ========================================================== */}

        <div className="flex flex-col gap-5 py-7 text-[7px] uppercase tracking-[0.34em] text-white/22 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} VELOCE
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <p>
              Portfolio concept
            </p>

            <p>
              No live transactions
            </p>
          </div>
        </div>

        {/* =========================================================
            GIANT CLOSING WORDMARK
        ========================================================== */}

        <div className="relative overflow-hidden border-t border-white/[0.06] pt-8">
          <p
            aria-hidden="true"
            className="select-none whitespace-nowrap text-center text-[22vw] font-medium uppercase leading-[0.72] tracking-[-0.095em] text-white/[0.055]"
          >
            VELOCE
          </p>

          <div className="mt-6 flex items-center justify-between gap-6">
            <p className="text-[6px] uppercase tracking-[0.42em] text-white/18">
              Performance / Precision / Experience
            </p>

            <p className="hidden text-[6px] uppercase tracking-[0.42em] text-white/18 sm:block">
              The road is yours
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}