"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

const LOCATIONS = [
  "BGC, Taguig",
  "Makati City",
  "Alabang, Muntinlupa",
  "NAIA Terminal 1",
  "NAIA Terminal 2",
  "NAIA Terminal 3",
];

const STORAGE_KEY =
  "veloce-reservation";

function localDate(
  date: Date,
) {
  return [
    date.getFullYear(),
    String(
      date.getMonth() + 1,
    ).padStart(2, "0"),
    String(
      date.getDate(),
    ).padStart(2, "0"),
  ].join("-");
}

function nextDay(
  value: string,
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(
      `${value}T12:00:00`,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  date.setDate(
    date.getDate() + 1,
  );

  return localDate(
    date,
  );
}

function calculateRentalDays(
  pickupDate: string,
  returnDate: string,
) {
  if (
    !pickupDate ||
    !returnDate
  ) {
    return 0;
  }

  const pickup =
    new Date(
      `${pickupDate}T12:00:00`,
    );

  const dropoff =
    new Date(
      `${returnDate}T12:00:00`,
    );

  if (
    Number.isNaN(
      pickup.getTime(),
    ) ||
    Number.isNaN(
      dropoff.getTime(),
    )
  ) {
    return 0;
  }

  const difference =
    dropoff.getTime() -
    pickup.getTime();

  if (
    difference <= 0
  ) {
    return 0;
  }

  return Math.ceil(
    difference /
      (
        1000 *
        60 *
        60 *
        24
      ),
  );
}

export function RentalSearch() {
  const router =
    useRouter();

  const [
    location,
    setLocation,
  ] = useState(
    LOCATIONS[0],
  );

  const [
    pickupDate,
    setPickupDate,
  ] = useState("");

  const [
    returnDate,
    setReturnDate,
  ] = useState("");

  const [
    today,
    setToday,
  ] = useState("");

  const [
    storageReady,
    setStorageReady,
  ] = useState(false);

  const [
    storageFailed,
    setStorageFailed,
  ] = useState(false);

  /* =========================================================
     CLIENT DATE + RESTORE EXISTING JOURNEY
  ========================================================= */

  useEffect(() => {
    const currentToday =
      localDate(
        new Date(),
      );

    setToday(
      currentToday,
    );

    try {
      const raw =
        sessionStorage.getItem(
          STORAGE_KEY,
        );

      if (raw) {
        const parsed:
          unknown =
          JSON.parse(raw);

        if (
          parsed &&
          typeof parsed ===
            "object" &&
          !Array.isArray(
            parsed,
          )
        ) {
          const saved =
            parsed as Record<
              string,
              unknown
            >;

          if (
            typeof saved.pickupLocation ===
              "string" &&
            LOCATIONS.includes(
              saved.pickupLocation,
            )
          ) {
            setLocation(
              saved.pickupLocation,
            );
          }

          if (
            typeof saved.pickupDate ===
              "string" &&
            saved.pickupDate >=
              currentToday
          ) {
            setPickupDate(
              saved.pickupDate,
            );
          }

          if (
            typeof saved.returnDate ===
              "string" &&
            typeof saved.pickupDate ===
              "string" &&
            saved.returnDate >
              saved.pickupDate &&
            saved.pickupDate >=
              currentToday
          ) {
            setReturnDate(
              saved.returnDate,
            );
          }
        }
      }
    } catch {
      /*
       * An invalid old session should not
       * stop the visitor from starting again.
       */
    }

    setStorageReady(
      true,
    );
  }, []);

  /* =========================================================
     RENTAL LENGTH
  ========================================================= */

  const rentalDays =
    useMemo(
      () =>
        calculateRentalDays(
          pickupDate,
          returnDate,
        ),
      [
        pickupDate,
        returnDate,
      ],
    );

  const validDates =
    Boolean(
      storageReady &&
        today &&
        pickupDate &&
        returnDate &&
        pickupDate >=
          today &&
        returnDate >
          pickupDate &&
        rentalDays > 0,
    );

  /* =========================================================
     PICKUP CHANGE
  ========================================================= */

  function handlePickupDate(
    value: string,
  ) {
    setPickupDate(
      value,
    );

    /*
     * Preserve a valid return date.
     * Otherwise move it to the next day.
     */
    if (
      value &&
      (
        !returnDate ||
        returnDate <=
          value
      )
    ) {
      setReturnDate(
        nextDay(value),
      );
    }
  }

  /* =========================================================
     CONTINUE
  ========================================================= */

  function findCar(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !validDates
    ) {
      return;
    }

    setStorageFailed(
      false,
    );

    try {
      let current:
        Record<
          string,
          unknown
        > = {};

      try {
        const parsed:
          unknown =
          JSON.parse(
            sessionStorage.getItem(
              STORAGE_KEY,
            ) || "{}",
          );

        if (
          parsed &&
          typeof parsed ===
            "object" &&
          !Array.isArray(
            parsed,
          )
        ) {
          current =
            parsed as Record<
              string,
              unknown
            >;
        }
      } catch {
        /*
         * Corrupt reservation state
         * is replaced safely.
         */
      }

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...current,

          pickupLocation:
            location,

          returnLocation:
            location,

          pickupDate,

          returnDate,

          pickupTime:
            typeof current.pickupTime ===
            "string"
              ? current.pickupTime
              : "10:00",

          returnTime:
            typeof current.returnTime ===
            "string"
              ? current.returnTime
              : "10:00",
        }),
      );

      router.push(
        "/fleet",
      );
    } catch {
      setStorageFailed(
        true,
      );
    }
  }

  return (
    <section
      id="reserve"
      aria-labelledby="search-heading"
      className="relative overflow-clip bg-[#050606] text-white"
    >
      {/* =====================================================
          ARCHITECTURE
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-6 top-0 h-full w-px bg-white/[0.025] lg:left-10" />

        <div className="absolute right-6 top-0 h-full w-px bg-white/[0.025] lg:right-10" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.014] lg:block" />

        <div className="absolute left-[19%] top-0 hidden h-full w-px bg-white/[0.009] xl:block" />

        <div className="absolute right-[19%] top-0 hidden h-full w-px bg-white/[0.009] xl:block" />

        {/* giant ghost word */}

        <p className="absolute -right-[0.035em] top-[7%] select-none whitespace-nowrap text-[25vw] font-medium uppercase leading-none tracking-[-0.105em] text-white/[0.014]">
          RESERVE
        </p>

        {/* restrained studio light */}

        <div className="absolute left-1/2 top-[42%] h-[30rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.018] blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-[1650px] px-5 py-24 sm:px-6 md:py-32 lg:px-10 lg:py-40">
        {/* =====================================================
            SECTION LABEL
        ====================================================== */}

        <div
          data-reveal
          className="flex items-center justify-between gap-6 border-b border-white/10 pb-5"
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-9 bg-[#d8ff3e]" />

            <p className="text-[8px] uppercase tracking-[0.45em] text-white/50">
              03 / Begin Your Journey
            </p>
          </div>

          <p className="hidden text-[8px] uppercase tracking-[0.42em] text-white/22 md:block">
            Reservation / Step Zero
          </p>
        </div>

        {/* =====================================================
            INTRO
        ====================================================== */}

        <div className="grid gap-14 pb-16 pt-16 lg:grid-cols-[1.25fr_.75fr] lg:items-end lg:pb-24 lg:pt-24">
          <div>
            <p
              data-reveal
              className="text-[7px] uppercase tracking-[0.46em] text-white/24"
            >
              Set the moment
            </p>

            <h2
              id="search-heading"
              data-reveal
              className="mt-7 max-w-[1000px] text-[15vw] font-medium uppercase leading-[0.75] tracking-[-0.092em] sm:text-[11vw] lg:text-[6.7vw] xl:text-[6.2rem]"
            >
              Where will

              <span className="block translate-x-[7%] text-white/24">
                you go?
              </span>
            </h2>
          </div>

          <div
            data-reveal
            className="max-w-[390px] lg:justify-self-end lg:pb-2"
          >
            <p className="text-xl leading-[1.18] tracking-[-0.045em] text-white/90 md:text-2xl">
              Choose the place.
              <br />
              Define the moment.
              <br />
              Find the machine.
            </p>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/40">
              Start with the essentials. Your selection carries into the
              collection and through the reservation journey.
            </p>
          </div>
        </div>

        {/* =====================================================
            DESK META
        ====================================================== */}

        <div className="mb-5 flex items-center justify-between">
          <p className="text-[6px] uppercase tracking-[0.45em] text-white/18">
            VELOCE / Reservation Desk
          </p>

          <p className="hidden text-[6px] uppercase tracking-[0.45em] text-white/18 sm:block">
            01 Location / 02 Pickup / 03 Return
          </p>
        </div>

        {/* =====================================================
            RESERVATION CONSOLE
        ====================================================== */}

        <form
          onSubmit={
            findCar
          }
          className="relative border-y border-white/12"
        >
          <div className="grid xl:grid-cols-[1.28fr_1fr_1fr_.82fr]">
            {/* =================================================
                01 LOCATION
            ================================================== */}

            <label className="group relative flex min-h-[170px] flex-col justify-between border-b border-white/10 px-5 py-7 transition-colors duration-500 focus-within:bg-white/[0.025] sm:px-7 xl:border-b-0 xl:border-r">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[6px] uppercase tracking-[0.4em] text-[#d8ff3e]/60">
                    01
                  </p>

                  <span className="mt-3 block text-[7px] uppercase tracking-[0.42em] text-white/30 transition-colors group-focus-within:text-white/55">
                    Location
                  </span>
                </div>

                <MapPin
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.1}
                  className="mt-1 text-white/18 transition-colors group-focus-within:text-[#d8ff3e]"
                />
              </div>

              <div className="relative mt-8">
                <select
                  value={
                    location
                  }
                  onChange={(
                    event,
                  ) =>
                    setLocation(
                      event
                        .target
                        .value,
                    )
                  }
                  aria-label="Pickup location"
                  className="w-full cursor-pointer appearance-none bg-transparent pr-8 text-xl tracking-[-0.04em] text-white outline-none sm:text-2xl"
                >
                  {LOCATIONS.map(
                    (
                      item,
                    ) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                        className="bg-[#101212] text-white"
                      >
                        {
                          item
                        }
                      </option>
                    ),
                  )}
                </select>

                <ArrowDownMarker />
              </div>

              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-0 bg-[#d8ff3e] transition-[width] duration-500 group-focus-within:w-full"
              />
            </label>

            {/* =================================================
                02 PICKUP
            ================================================== */}

            <label className="group relative flex min-h-[170px] flex-col justify-between border-b border-white/10 px-5 py-7 transition-colors duration-500 focus-within:bg-white/[0.025] sm:px-7 xl:border-b-0 xl:border-r">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[6px] uppercase tracking-[0.4em] text-[#d8ff3e]/60">
                    02
                  </p>

                  <span className="mt-3 block text-[7px] uppercase tracking-[0.42em] text-white/30 transition-colors group-focus-within:text-white/55">
                    Pickup
                  </span>
                </div>

                <CalendarDays
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.1}
                  className="mt-1 text-white/18 transition-colors group-focus-within:text-[#d8ff3e]"
                />
              </div>

              <input
                required
                type="date"
                aria-label="Pickup date"
                value={
                  pickupDate
                }
                min={
                  today ||
                  undefined
                }
                disabled={
                  !storageReady
                }
                onChange={(
                  event,
                ) =>
                  handlePickupDate(
                    event
                      .target
                      .value,
                  )
                }
                className="mt-8 min-w-0 w-full bg-transparent text-xl tracking-[-0.04em] text-white outline-none [color-scheme:dark] disabled:opacity-30 sm:text-2xl"
              />

              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-0 bg-[#d8ff3e] transition-[width] duration-500 group-focus-within:w-full"
              />
            </label>

            {/* =================================================
                03 RETURN
            ================================================== */}

            <label className="group relative flex min-h-[170px] flex-col justify-between border-b border-white/10 px-5 py-7 transition-colors duration-500 focus-within:bg-white/[0.025] sm:px-7 xl:border-b-0 xl:border-r">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[6px] uppercase tracking-[0.4em] text-[#d8ff3e]/60">
                    03
                  </p>

                  <span className="mt-3 block text-[7px] uppercase tracking-[0.42em] text-white/30 transition-colors group-focus-within:text-white/55">
                    Return
                  </span>
                </div>

                <CalendarDays
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.1}
                  className="mt-1 text-white/18 transition-colors group-focus-within:text-[#d8ff3e]"
                />
              </div>

              <input
                required
                type="date"
                aria-label="Return date"
                value={
                  returnDate
                }
                min={
                  pickupDate
                    ? nextDay(
                        pickupDate,
                      )
                    : today ||
                      undefined
                }
                disabled={
                  !storageReady ||
                  !pickupDate
                }
                onChange={(
                  event,
                ) =>
                  setReturnDate(
                    event
                      .target
                      .value,
                  )
                }
                className="mt-8 min-w-0 w-full bg-transparent text-xl tracking-[-0.04em] text-white outline-none [color-scheme:dark] disabled:opacity-30 sm:text-2xl"
              />

              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-0 bg-[#d8ff3e] transition-[width] duration-500 group-focus-within:w-full"
              />
            </label>

            {/* =================================================
                CTA
            ================================================== */}

            <button
              type="submit"
              disabled={
                !validDates
              }
              className="group relative flex min-h-[170px] flex-col justify-between overflow-hidden bg-[#efefea] px-6 py-7 text-left text-[#080909] transition-[background-color,color] duration-500 hover:bg-[#d8ff3e] disabled:cursor-not-allowed disabled:bg-[#101212] disabled:text-white/24 sm:px-7"
            >
              <div className="flex w-full items-start justify-between gap-6">
                <span className="text-[6px] uppercase tracking-[0.42em] opacity-45">
                  Continue
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  size={21}
                  strokeWidth={1.1}
                  className="transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-disabled:translate-x-0 group-disabled:translate-y-0"
                />
              </div>

              <div>
                <p className="text-[1.65rem] leading-[0.95] tracking-[-0.055em] sm:text-3xl">
                  Find your
                  <br />
                  machine.
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <span className="h-px w-8 bg-current opacity-30" />

                  <p className="text-[6px] uppercase tracking-[0.37em] opacity-45">
                    The collection
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* =================================================
              LIVE SUMMARY
          ================================================== */}

          <div className="grid gap-6 border-t border-white/10 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <p className="text-[7px] uppercase tracking-[0.38em] text-white/22">
                Same-location return
              </p>

              <span className="hidden h-[2px] w-[2px] rounded-full bg-white/20 sm:block" />

              <p className="text-[7px] uppercase tracking-[0.38em] text-white/22">
                Default time / 10:00
              </p>

              <span className="hidden h-[2px] w-[2px] rounded-full bg-white/20 md:block" />

              <p className="hidden text-[7px] uppercase tracking-[0.38em] text-white/22 md:block">
                No live payment
              </p>
            </div>

            <div className="sm:text-right">
              {rentalDays >
              0 ? (
                <div className="flex items-center gap-4 sm:justify-end">
                  <p className="text-[7px] uppercase tracking-[0.4em] text-white/28">
                    Duration
                  </p>

                  <span className="h-px w-8 bg-[#d8ff3e]/60" />

                  <p className="text-[9px] uppercase tracking-[0.38em] text-white/55">
                    {
                      rentalDays
                    }{" "}
                    {rentalDays ===
                    1
                      ? "day"
                      : "days"}
                  </p>
                </div>
              ) : (
                <p className="text-[7px] uppercase tracking-[0.4em] text-white/22">
                  Select dates to continue
                </p>
              )}
            </div>
          </div>
        </form>

        {/* =====================================================
            JOURNEY PREVIEW
        ====================================================== */}

        {validDates && (
          <div className="mt-8 grid gap-8 border-b border-white/[0.07] pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-[6px] uppercase tracking-[0.42em] text-white/18">
                Your starting point
              </p>

              <p className="mt-3 text-lg tracking-[-0.035em] text-white/65">
                {location}
              </p>
            </div>

            <div className="flex items-center gap-4 sm:justify-end">
              <p className="text-[7px] uppercase tracking-[0.4em] text-white/22">
                {pickupDate}
              </p>

              <ArrowRight
                aria-hidden="true"
                size={13}
                strokeWidth={1}
                className="text-[#d8ff3e]/70"
              />

              <p className="text-[7px] uppercase tracking-[0.4em] text-white/22">
                {returnDate}
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            STORAGE ERROR
        ====================================================== */}

        {storageFailed && (
          <div
            role="alert"
            className="mt-7 flex flex-col gap-4 border-l border-[#e8c4a5]/45 pl-5 text-sm leading-6 text-[#e8c4a5]/75 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="max-w-2xl">
              This browser could not save the reservation details.
              Session storage must be available to continue the guided flow.
            </p>

            <Link
              href="/fleet"
              className="inline-flex shrink-0 items-center gap-2 text-[7px] uppercase tracking-[0.38em] text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-[#d8ff3e]"
            >
              View collection

              <ArrowUpRight
                size={13}
                strokeWidth={1}
              />
            </Link>
          </div>
        )}

        {/* =====================================================
            FOOTNOTE
        ====================================================== */}

        <div className="mt-14 flex items-center justify-between border-t border-white/[0.06] pt-5">
          <p className="text-[6px] uppercase tracking-[0.42em] text-white/16">
            VELOCE / Portfolio Concept
          </p>

          <p className="hidden text-[6px] uppercase tracking-[0.42em] text-white/16 sm:block">
            No live transactions
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CUSTOM SELECT INDICATOR
========================================================= */

function ArrowDownMarker() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-1 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center"
    >
      <span className="block h-[6px] w-[6px] rotate-45 border-b border-r border-white/35" />
    </span>
  );
}