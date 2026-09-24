"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
} from "lucide-react";

import { Step } from "@/components/reservation/booking-step";
import { useReservation } from "@/components/reservation/reservation-provider";
import { ExperienceState } from "@/components/ui/experience-state";
import { LoadingState } from "@/components/ui/loading-state";
import { vehicles } from "@/data/vehicles";

const LOCATIONS = [
  "BGC, Taguig",
  "Makati City",
  "Alabang, Muntinlupa",
  "NAIA Terminal 1",
  "NAIA Terminal 2",
  "NAIA Terminal 3",
];

const SERVICE_FEE = 2500;

/* =========================================================
   PAGE
========================================================= */

export default function ReservationSchedulePage() {
  const params =
    useParams<{
      slug: string;
    }>();

  const router =
    useRouter();

  const {
    reservation,
    updateReservation,
    storageError,
    hydrated,
  } = useReservation();

  const [
    today,
    setToday,
  ] = useState("");

  useEffect(() => {
    setToday(
      localDate(
        new Date(),
      ),
    );
  }, []);

  const vehicle =
    useMemo(
      () =>
        vehicles.find(
          (item) =>
            item.slug ===
            params.slug,
        ),
      [params.slug],
    );

  /* =======================================================
     GUARDS
  ======================================================== */

  if (!vehicle) {
    return (
      <ExperienceState
        eyebrow="Reservation / Vehicle"
        title="Vehicle not found."
        message="The selected machine is not available in the current VELOCE collection."
        href="/fleet"
        action="Return to the collection"
      />
    );
  }

  if (!hydrated) {
    return (
      <LoadingState reservation />
    );
  }

  if (
    hydrated &&
    storageError
  ) {
    return (
      <ExperienceState
        eyebrow="Reservation / Recovery"
        title="Reservation unavailable."
        message="Your previous reservation could not be restored safely. Choose a vehicle and begin again."
        href="/fleet"
        action="Choose a vehicle"
      />
    );
  }

  /* =======================================================
     CALCULATIONS
  ======================================================== */

  const rentalDays =
    getRentalDays(
      reservation.pickupDate,
      reservation.returnDate,
    );

  const rentalSubtotal =
    vehicle.pricePerDay *
    rentalDays;

  const estimatedTotal =
    rentalDays > 0
      ? rentalSubtotal +
        SERVICE_FEE
      : 0;

  const validDateRange =
    isValidDateRange(
      reservation.pickupDate,
      reservation.returnDate,
      today,
    );

  const canContinue =
    Boolean(
      today &&
        reservation.pickupLocation &&
        reservation.returnLocation &&
        reservation.pickupDate &&
        reservation.returnDate &&
        reservation.pickupTime &&
        reservation.returnTime &&
        validDateRange,
    );

  /* =======================================================
     DATE ERROR
  ======================================================== */

  let dateError = "";

  if (
    today &&
    reservation.pickupDate &&
    reservation.pickupDate <
      today
  ) {
    dateError =
      "Pickup date cannot be in the past.";
  } else if (
    reservation.pickupDate &&
    reservation.returnDate &&
    reservation.returnDate <=
      reservation.pickupDate
  ) {
    dateError =
      "Return date must be after the pickup date.";
  }

  /* =======================================================
     PICKUP DATE
  ======================================================== */

  function handlePickupDate(
    value: string,
  ) {
    const updates: {
      pickupDate: string;
      returnDate?: string;
    } = {
      pickupDate: value,
    };

    /*
     * If the current return date becomes invalid,
     * move it to the next day automatically.
     */
    if (
      value &&
      (
        !reservation.returnDate ||
        reservation.returnDate <=
          value
      )
    ) {
      updates.returnDate =
        nextDay(value);
    }

    updateReservation(
      updates,
    );
  }

  /* =======================================================
     CONTINUE
  ======================================================== */

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!canContinue) {
      return;
    }

    router.push(
      `/reserve/${vehicle.slug}/driver`,
    );
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="booking-page min-h-screen overflow-x-clip bg-[#050505] text-white outline-none"
    >
      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 lg:px-10">
          <Link
            href={`/fleet/${vehicle.slug}`}
            className="group flex items-center gap-4"
          >
            <span className="flex h-10 w-10 items-center justify-center border border-white/10 transition-[background-color,border-color,color] duration-300 group-hover:border-white/30 group-hover:bg-white group-hover:text-black">
              <ArrowLeft
                aria-hidden="true"
                size={14}
                strokeWidth={1.2}
              />
            </span>

            <span className="hidden text-[9px] uppercase tracking-[0.35em] text-white/45 transition-colors group-hover:text-white/75 sm:block">
              Back to vehicle
            </span>
          </Link>

          <Link
            href="/"
            aria-label="VELOCE home"
            className="text-center"
          >
            <p className="text-sm font-semibold tracking-[0.32em]">
              VELOCE
            </p>

            <p className="mt-1 text-[7px] uppercase tracking-[0.4em] text-white/35">
              Reservation
            </p>
          </Link>

          <div className="text-right">
            <p className="text-[7px] uppercase tracking-[0.4em] text-white/35">
              Booking
            </p>

            <p className="mt-1 text-[8px] tracking-[0.3em] text-white/45">
              01 / 04
            </p>
          </div>
        </div>
      </header>

      {/* =====================================================
          PROGRESS
      ====================================================== */}

      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-4 px-6 lg:px-10">
          <Step
            number="01"
            label="Schedule"
            active
          />

          <Step
            number="02"
            label="Driver"
          />

          <Step
            number="03"
            label="Review"
          />

          <Step
            number="04"
            label="Confirmed"
          />
        </div>
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="booking-grid mx-auto grid max-w-[1600px] lg:min-h-[calc(100svh-150px)] lg:grid-cols-[1fr_1fr]">
        {/* ===================================================
            LEFT / VEHICLE
        ==================================================== */}

        <aside className="booking-aside relative overflow-hidden border-b border-white/10 bg-[#070708] px-6 py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
          {/* background lighting */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-[40%] h-[650px] w-[760px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.065)_0%,rgba(255,255,255,.018)_35%,transparent_70%)]" />

            <div className="absolute bottom-[-14%] left-[-10%] h-[450px] w-[450px] bg-[radial-gradient(ellipse_at_center,rgba(216,255,62,.025)_0%,transparent_70%)]" />

            <p className="absolute bottom-[14%] left-[-0.04em] select-none whitespace-nowrap text-[12vw] font-medium uppercase leading-none tracking-[-0.09em] text-white/[0.018]">
              {vehicle.brand}
            </p>
          </div>

          <div className="relative z-10 flex h-full flex-col">
            {/* vehicle identity */}

            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#d8ff3e]/70" />

                <span className="text-[7px] uppercase tracking-[0.42em] text-white/38">
                  Selected vehicle
                </span>
              </div>

              <p className="mt-7 text-[8px] uppercase tracking-[0.45em] text-white/38">
                {vehicle.brand}
              </p>

              <h1 className="mt-3 max-w-[600px] text-5xl font-medium uppercase leading-[0.8] tracking-[-0.065em] sm:text-6xl lg:text-[4.7vw]">
                {vehicle.model}
              </h1>
            </div>

            {/* =================================================
                CAR STAGE
            ================================================== */}

            <div className="booking-car relative my-auto min-h-[320px] lg:min-h-[430px]">
              <div className="absolute left-1/2 top-1/2 w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-[4%] left-1/2 h-8 w-[62%] -translate-x-1/2 rounded-full bg-black/90 blur-xl"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute bottom-[7%] left-1/2 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  />

                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    width={1600}
                    height={900}
                    priority
                    quality={88}
                    sizes="(max-width: 1024px) 90vw, 42vw"
                    className="relative z-10 h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                SPECS
            ================================================== */}

            <div className="grid grid-cols-3 gap-5 border-t border-white/10 pt-6">
              <VehicleStat
                label="Power"
                value={`${vehicle.horsepower} HP`}
              />

              <VehicleStat
                label="0—100"
                value={
                  vehicle.acceleration
                }
              />

              <VehicleStat
                label="Transmission"
                value={
                  vehicle.transmission
                }
              />
            </div>
          </div>
        </aside>

        {/* ===================================================
            RIGHT / SCHEDULE
        ==================================================== */}

        <section className="booking-panel bg-[#09090b] px-6 py-12 lg:px-10 lg:py-14">
          <form
            onSubmit={
              handleSubmit
            }
            className="mx-auto max-w-[700px]"
          >
            <p className="text-[7px] uppercase tracking-[0.43em] text-[#d8ff3e]/70">
              Step 01 / Schedule
            </p>

            <h2 className="mt-5 text-5xl font-medium uppercase leading-[0.85] tracking-[-0.065em] sm:text-6xl lg:text-7xl">
              Plan your

              <span className="block text-white/35">
                drive.
              </span>
            </h2>

            <p className="mt-6 max-w-[500px] text-sm leading-7 text-white/42">
              Choose the location, date, and time that define the beginning
              and end of your reservation.
            </p>

            {/* =================================================
                LOCATION
            ================================================== */}

            <FormSection
              number="01"
              title="Location"
            >
              <SelectField
                icon={
                  <MapPin
                    size={14}
                  />
                }
                label="Pickup location"
                value={
                  reservation.pickupLocation
                }
                onChange={(
                  value,
                ) =>
                  updateReservation(
                    {
                      pickupLocation:
                        value,
                    },
                  )
                }
                options={
                  LOCATIONS
                }
              />

              <SelectField
                icon={
                  <MapPin
                    size={14}
                  />
                }
                label="Return location"
                value={
                  reservation.returnLocation
                }
                onChange={(
                  value,
                ) =>
                  updateReservation(
                    {
                      returnLocation:
                        value,
                    },
                  )
                }
                options={
                  LOCATIONS
                }
              />
            </FormSection>

            {/* =================================================
                PICKUP
            ================================================== */}

            <FormSection
              number="02"
              title="Pickup"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  icon={
                    <CalendarDays
                      size={14}
                    />
                  }
                  label="Pickup date"
                  type="date"
                  value={
                    reservation.pickupDate
                  }
                  min={
                    today ||
                    undefined
                  }
                  onChange={
                    handlePickupDate
                  }
                />

                <InputField
                  icon={
                    <Clock3
                      size={14}
                    />
                  }
                  label="Pickup time"
                  type="time"
                  value={
                    reservation.pickupTime
                  }
                  onChange={(
                    value,
                  ) =>
                    updateReservation(
                      {
                        pickupTime:
                          value,
                      },
                    )
                  }
                />
              </div>
            </FormSection>

            {/* =================================================
                RETURN
            ================================================== */}

            <FormSection
              number="03"
              title="Return"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  icon={
                    <CalendarDays
                      size={14}
                    />
                  }
                  label="Return date"
                  type="date"
                  value={
                    reservation.returnDate
                  }
                  min={
                    reservation.pickupDate
                      ? nextDay(
                          reservation.pickupDate,
                        )
                      : undefined
                  }
                  disabled={
                    !reservation.pickupDate
                  }
                  onChange={(
                    value,
                  ) =>
                    updateReservation(
                      {
                        returnDate:
                          value,
                      },
                    )
                  }
                />

                <InputField
                  icon={
                    <Clock3
                      size={14}
                    />
                  }
                  label="Return time"
                  type="time"
                  value={
                    reservation.returnTime
                  }
                  onChange={(
                    value,
                  ) =>
                    updateReservation(
                      {
                        returnTime:
                          value,
                      },
                    )
                  }
                />
              </div>
            </FormSection>

            {/* =================================================
                DATE ERROR
            ================================================== */}

            {dateError && (
              <div
                role="alert"
                className="mt-5 border-l border-[#e8c4a5]/45 pl-4"
              >
                <p className="text-sm leading-6 text-[#e8c4a5]/75">
                  {dateError}
                </p>
              </div>
            )}

            {/* =================================================
                SUMMARY
            ================================================== */}

            <div className="mt-12 border-y border-white/10">
              <div className="grid gap-px bg-white/10 sm:grid-cols-3">
                <SummaryCell
                  label="Duration"
                  value={
                    rentalDays >
                    0
                      ? `${rentalDays} ${
                          rentalDays ===
                          1
                            ? "day"
                            : "days"
                        }`
                      : "—"
                  }
                />

                <SummaryCell
                  label="Daily rate"
                  value={`₱${vehicle.pricePerDay.toLocaleString(
                    "en-PH",
                  )}`}
                />

                <SummaryCell
                  label="Service fee"
                  value={`₱${SERVICE_FEE.toLocaleString(
                    "en-PH",
                  )}`}
                />
              </div>

              <div className="grid gap-6 border-t border-white/10 p-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="text-[7px] uppercase tracking-[0.4em] text-white/35">
                    Estimated total
                  </p>

                  <p className="mt-3 text-3xl font-medium tracking-[-0.05em]">
                    {estimatedTotal >
                    0
                      ? `₱${estimatedTotal.toLocaleString(
                          "en-PH",
                        )}`
                      : "—"}
                  </p>
                </div>

                <p className="max-w-[220px] text-[7px] uppercase leading-5 tracking-[0.33em] text-white/25 sm:text-right">
                  Rental + service fee
                  <br />
                  Full summary at review
                </p>
              </div>
            </div>

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="booking-actions mt-10 grid gap-4 sm:grid-cols-[auto_1fr]">
              <Link
                href={`/fleet/${vehicle.slug}`}
                className="group flex min-h-16 items-center justify-center gap-4 border border-white/10 px-6 text-white/45 transition-[border-color,color] duration-300 hover:border-white/30 hover:text-white"
              >
                <ArrowLeft
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />

                <span className="text-[8px] uppercase tracking-[0.34em]">
                  Back
                </span>
              </Link>

              <button
                type="submit"
                disabled={
                  !canContinue
                }
                className="group flex min-h-16 items-center justify-between bg-white px-7 text-left text-black transition-colors duration-300 hover:bg-[#d8ff3e] disabled:cursor-not-allowed disabled:bg-white/[0.07] disabled:text-white/25"
              >
                <div>
                  <p className="text-[7px] uppercase tracking-[0.4em] opacity-45">
                    Continue
                  </p>

                  <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em]">
                    Driver details
                  </p>
                </div>

                <ArrowRight
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-disabled:translate-x-0"
                />
              </button>
            </div>

            {/* =================================================
                DISCLOSURE
            ================================================== */}

            <div className="mt-6 flex items-start gap-3 border-t border-white/[0.06] pt-5">
              <Check
                aria-hidden="true"
                size={11}
                strokeWidth={1.4}
                className="mt-[2px] shrink-0 text-[#d8ff3e]"
              />

              <p className="text-[7px] uppercase leading-5 tracking-[0.32em] text-white/25">
                Portfolio concept / No live payment is processed
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   DATE HELPERS
========================================================= */

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

function getRentalDays(
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

  const returned =
    new Date(
      `${returnDate}T12:00:00`,
    );

  if (
    Number.isNaN(
      pickup.getTime(),
    ) ||
    Number.isNaN(
      returned.getTime(),
    )
  ) {
    return 0;
  }

  const difference =
    returned.getTime() -
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

function isValidDateRange(
  pickupDate: string,
  returnDate: string,
  today: string,
) {
  if (
    !today ||
    !pickupDate ||
    !returnDate
  ) {
    return false;
  }

  if (
    pickupDate <
    today
  ) {
    return false;
  }

  return (
    returnDate >
    pickupDate
  );
}

/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-white/10 pt-7">
      <div className="mb-6 flex items-center gap-4">
        <span className="text-[7px] tracking-[0.42em] text-[#d8ff3e]/55">
          {number}
        </span>

        <span className="h-px w-8 bg-white/10" />

        <h3 className="text-[7px] uppercase tracking-[0.4em] text-white/32">
          {title}
        </h3>
      </div>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

function SelectField({
  icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  options: string[];
}) {
  return (
    <label className="booking-field group">
      <span className="text-white/35 transition-colors duration-300 group-focus-within:text-[#d8ff3e]">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[7px] uppercase tracking-[0.38em] text-white/32 transition-colors group-focus-within:text-white/55">
          {label}
        </span>

        <select
          required
          value={value}
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
          className="mt-2 w-full cursor-pointer appearance-none bg-transparent text-sm text-white/75 outline-none"
        >
          {options.map(
            (
              option,
            ) => (
              <option
                key={
                  option
                }
                value={
                  option
                }
                className="bg-[#111113] text-white"
              >
                {option}
              </option>
            ),
          )}
        </select>
      </span>
    </label>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  icon,
  label,
  type,
  value,
  onChange,
  min,
  disabled = false,
}: {
  icon: ReactNode;
  label: string;
  type:
    | "date"
    | "time";
  value: string;
  onChange: (
    value: string,
  ) => void;
  min?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={`booking-field group ${
        disabled
          ? "opacity-35"
          : ""
      }`}
    >
      <span className="text-white/35 transition-colors duration-300 group-focus-within:text-[#d8ff3e]">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[7px] uppercase tracking-[0.38em] text-white/32 transition-colors group-focus-within:text-white/55">
          {label}
        </span>

        <input
          required
          type={type}
          value={value}
          min={min}
          disabled={
            disabled
          }
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
          className="mt-2 w-full bg-transparent text-sm text-white/75 outline-none [color-scheme:dark] disabled:cursor-not-allowed"
        />
      </span>
    </label>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function SummaryCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0c0c0e] p-5">
      <p className="text-[7px] uppercase tracking-[0.38em] text-white/30">
        {label}
      </p>

      <p className="mt-3 text-sm tracking-[-0.02em] text-white/65">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   VEHICLE STAT
========================================================= */

function VehicleStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-base font-medium tracking-[-0.03em]">
        {value}
      </p>

      <p className="mt-1 text-[7px] uppercase tracking-[0.34em] text-white/30">
        {label}
      </p>
    </div>
  );
}