import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

type ExperienceStateProps = {
  eyebrow: string;
  title: string;
  message: string;
  href: string;
  action: string;
};

export function ExperienceState({
  eyebrow,
  title,
  message,
  href,
  action,
}: ExperienceStateProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative min-h-[100svh] overflow-x-clip bg-[#050606] text-white outline-none"
    >
      {/* =====================================================
          ARCHITECTURAL BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-5 top-0 h-full w-px bg-white/[0.025] sm:left-6 lg:left-10" />

        <div className="absolute right-5 top-0 h-full w-px bg-white/[0.025] sm:right-6 lg:right-10" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.012] lg:block" />

        <p className="absolute left-[-0.04em] top-[17%] select-none whitespace-nowrap text-[30vw] font-medium uppercase leading-none tracking-[-0.105em] text-white/[0.014]">
          VELOCE
        </p>

        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[60rem] max-w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-[100px]" />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1650px] flex-col px-5 pb-8 pt-7 sm:px-6 lg:px-10">
        {/* ===================================================
            TOP BAR
        ==================================================== */}

        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <Link
            href="/"
            aria-label="VELOCE home"
            className="group inline-flex min-h-10 items-center text-[11px] font-semibold uppercase tracking-[0.38em] text-white transition-colors hover:text-[#d8ff3e]"
          >
            VELOCE
          </Link>

          <p className="hidden text-[6px] uppercase tracking-[0.42em] text-white/18 sm:block">
            Private Performance Fleet
          </p>
        </header>

        {/* ===================================================
            STATE
        ==================================================== */}

        <section
          aria-labelledby="state-heading"
          className="my-auto py-20 md:py-28"
        >
          <div className="grid gap-12 border-t border-white/12 pt-8 md:grid-cols-[0.32fr_1fr] md:gap-16 lg:grid-cols-[0.28fr_1fr] lg:pt-12">
            {/* metadata */}

            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#d8ff3e]" />

                <p className="text-[7px] uppercase tracking-[0.44em] text-white/38">
                  {eyebrow}
                </p>
              </div>

              <p className="mt-6 hidden max-w-[150px] text-[6px] uppercase leading-5 tracking-[0.38em] text-white/14 md:block">
                VELOCE
                <br />
                Reservation Experience
              </p>
            </div>

            {/* main message */}

            <div>
              <h1
                id="state-heading"
                className="max-w-[1050px] text-[15vw] font-medium uppercase leading-[0.78] tracking-[-0.09em] sm:text-[11vw] md:text-[8vw] lg:text-[6.6vw] xl:text-[6rem]"
              >
                {title}
              </h1>

              <div className="mt-10 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <p className="max-w-xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
                  {message}
                </p>

                <Link
                  href={href}
                  className="group inline-flex min-h-12 w-fit items-center gap-8 border-b border-[#d8ff3e]/55 text-[8px] uppercase tracking-[0.36em] text-white transition-colors duration-300 hover:border-[#d8ff3e] hover:text-[#d8ff3e]"
                >
                  {action}

                  <ArrowUpRight
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <div className="flex items-center justify-between gap-6 border-t border-white/[0.06] pt-5">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-[6px] uppercase tracking-[0.4em] text-white/20 transition-colors hover:text-white/55"
          >
            <ArrowLeft
              aria-hidden="true"
              size={12}
              strokeWidth={1}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Return home
          </Link>

          <p className="text-[6px] uppercase tracking-[0.4em] text-white/14">
            Portfolio Concept / No Live Transactions
          </p>
        </div>
      </div>
    </main>
  );
}