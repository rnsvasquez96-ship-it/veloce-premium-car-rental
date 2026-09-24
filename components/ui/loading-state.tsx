export function LoadingState({
  reservation = false,
}: {
  reservation?: boolean;
}) {
  const eyebrow = reservation
    ? "VELOCE / Your Reservation"
    : "VELOCE / The Next Chapter";

  const title = reservation
    ? "Preparing your details."
    : "A moment, please.";

  const message = reservation
    ? "Bringing your machine, schedule, and reservation details into place."
    : "Everything in its place.";

  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-busy="true"
      aria-labelledby="loading-title"
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

        <p className="absolute left-[-0.04em] top-[15%] select-none whitespace-nowrap text-[30vw] font-medium uppercase leading-none tracking-[-0.105em] text-white/[0.012]">
          VELOCE
        </p>

        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[62rem] max-w-[110vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.012] blur-[110px]" />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1650px] flex-col px-5 pb-8 pt-7 sm:px-6 lg:px-10">
        {/* ===================================================
            TOP BAR
        ==================================================== */}

        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white">
            VELOCE
          </p>

          <p className="hidden text-[6px] uppercase tracking-[0.42em] text-white/18 sm:block">
            Private Performance Fleet
          </p>
        </header>

        {/* ===================================================
            LOADING MESSAGE
        ==================================================== */}

        <section className="my-auto py-20 md:py-28">
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
                Loading
                <br />
                Experience
              </p>
            </div>

            {/* status */}

            <div>
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <h1
                  id="loading-title"
                  className="max-w-[1000px] text-[14vw] font-medium uppercase leading-[0.78] tracking-[-0.09em] sm:text-[10vw] md:text-[7vw] lg:text-[5.8vw] xl:text-[5.4rem]"
                >
                  {title}
                </h1>

                <p className="mt-7 max-w-lg text-sm leading-7 text-white/42 sm:text-base sm:leading-8">
                  {message}
                </p>
              </div>

              {/* =================================================
                  LOADING INDICATOR
              ================================================== */}

              <div
                aria-hidden="true"
                className="mt-10 flex items-center gap-4"
              >
                <span className="h-[5px] w-[5px] rounded-full bg-[#d8ff3e] motion-safe:animate-pulse" />

                <div className="relative h-px w-28 overflow-hidden bg-white/10">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-[#d8ff3e]/70 motion-safe:animate-[pulse_1.4s_ease-in-out_infinite]" />
                </div>

                <p className="text-[6px] uppercase tracking-[0.42em] text-white/20">
                  Preparing
                </p>
              </div>

              {/* =================================================
                  SKELETON COMPOSITION
              ================================================== */}

              <div
                aria-hidden="true"
                className="mt-14 grid gap-8 border-t border-white/[0.07] pt-8 lg:grid-cols-[1.18fr_.82fr]"
              >
                {/* visual placeholder */}

                <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.025]">
                  <div className="absolute inset-0 border border-white/[0.05]" />

                  <div className="absolute inset-5 border border-white/[0.035]" />

                  <div className="absolute left-5 top-5 h-px w-10 bg-white/10" />

                  <div className="absolute bottom-5 right-5 h-px w-14 bg-[#d8ff3e]/25" />

                  <div className="absolute inset-0 motion-safe:animate-pulse bg-gradient-to-r from-transparent via-white/[0.025] to-transparent motion-reduce:animate-none" />
                </div>

                {/* information placeholder */}

                <div className="flex flex-col justify-center gap-7 py-2">
                  <SkeletonLine className="w-[28%]" />

                  <SkeletonLine className="h-3 w-[82%]" />

                  <SkeletonLine className="h-3 w-[64%]" />

                  <div className="mt-4 border-t border-white/[0.06] pt-7">
                    <SkeletonLine className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            FOOTNOTE
        ==================================================== */}

        <div className="flex items-center justify-between border-t border-white/[0.06] pt-5">
          <p className="text-[6px] uppercase tracking-[0.42em] text-white/14">
            VELOCE / Portfolio Concept
          </p>

          <p className="hidden text-[6px] uppercase tracking-[0.42em] text-white/14 sm:block">
            No Live Transactions
          </p>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function SkeletonLine({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={[
        "h-2 overflow-hidden bg-white/[0.045]",
        "motion-safe:animate-pulse motion-reduce:animate-none",
        className,
      ].join(" ")}
    />
  );
}