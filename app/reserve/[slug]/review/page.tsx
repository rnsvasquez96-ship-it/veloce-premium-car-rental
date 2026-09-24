"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";

import { Step } from "@/components/reservation/booking-step";
import {
  hasDriverData,
  hasScheduleData,
  useReservation,
} from "@/components/reservation/reservation-provider";
import { ExperienceState } from "@/components/ui/experience-state";
import { LoadingState } from "@/components/ui/loading-state";
import { vehicles } from "@/data/vehicles";

const SERVICE_FEE = 2500;
const DELIVERY_FEE = 1500;
const REFUNDABLE_DEPOSIT = 15000;

export default function ReviewReservationPage() {
  const params =
    useParams<{
      slug: string;
    }>();

  const router =
    useRouter();

  const {
    reservation,
    storageError,
    hydrated,
  } = useReservation();

  const [
    accepted,
    setAccepted,
  ] = useState(false);

  const [
    confirming,
    setConfirming,
  ] = useState(false);

  const confirmTimer =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

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

  useEffect(() => {
    return () => {
      if (
        confirmTimer.current
      ) {
        clearTimeout(
          confirmTimer.current,
        );
      }
    };
  }, []);

  /* =========================================================
     VEHICLE GUARD
  ========================================================= */

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

  /* =========================================================
     HYDRATION
  ========================================================= */

  if (!hydrated) {
    return (
      <LoadingState reservation />
    );
  }

  /* =========================================================
     FLOW GUARD
  ========================================================= */

  const scheduleValid =
    hasScheduleData(
      reservation,
    ) &&
    isValidSchedule(
      reservation.pickupDate,
      reservation.returnDate,
    );

  const driverValid =
    hasDriverData(
      reservation,
    ) &&
    isValidDriver(
      reservation,
    );

  if (
    storageError ||
    !scheduleValid ||
    !driverValid
  ) {
    return (
      <ExperienceState
        eyebrow="Reservation / Review"
        title="Journey incomplete."
        message="Complete the schedule and driver details before reviewing the reservation."
        href={`/reserve/${vehicle.slug}`}
        action="Return to reservation"
      />
    );
  }

  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const rentalDays =
    getRentalDays(
      reservation.pickupDate,
      reservation.returnDate,
    );

  const rentalSubtotal =
    vehicle.pricePerDay *
    rentalDays;

  /*
   * Portfolio pricing model.
   *
   * Security deposit is intentionally NOT included
   * in bookingTotal.
   */

  const bookingTotal =
    rentalSubtotal +
    SERVICE_FEE +
    DELIVERY_FEE;

  const driverName =
    `${reservation.firstName.trim()} ${reservation.lastName.trim()}`;

  const canConfirm =
    accepted &&
    !confirming &&
    rentalDays > 0;

  /* =========================================================
     CONFIRM
  ========================================================= */

  function confirmReservation() {
    if (!canConfirm) {
      return;
    }

    setConfirming(
      true,
    );

    /*
     * This delay is only a visual transition for the
     * portfolio concept. No request is sent and no
     * payment or live reservation is created.
     */

    confirmTimer.current =
      setTimeout(
        () => {
          router.push(
            `/reserve/${vehicle.slug}/success`,
          );
        },
        650,
      );
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="booking-page booking-review min-h-screen overflow-x-clip bg-[#050505] text-white outline-none"
    >
      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 lg:px-10">
          <Link
            href={`/reserve/${vehicle.slug}/driver`}
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
              Back to driver
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
              03 / 03
            </p>
          </div>
        </div>
      </header>

      {/* =====================================================
          PROGRESS
      ====================================================== */}

      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-3 px-6 lg:px-10">
          <Step
            number="01"
            label="Schedule"
            completed
          />

          <Step
            number="02"
            label="Driver"
            completed
          />

          <Step
            number="03"
            label="Review"
            active
          />
        </div>
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[0.85fr_1.15fr]">
        {/* ===================================================
            LEFT / MACHINE
        ==================================================== */}

        <aside className="booking-aside relative overflow-hidden border-b border-white/10 bg-[#070708] px-6 py-10 lg:min-h-[calc(100svh-150px)] lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-[35%] h-[540px] w-[650px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.06)_0%,rgba(255,255,255,.018)_35%,transparent_70%)]" />

            <div className="absolute bottom-[-12%] right-[-10%] h-[420px] w-[420px] bg-[radial-gradient(ellipse_at_center,rgba(216,255,62,.03)_0%,transparent_70%)]" />

            <p className="absolute bottom-[15%] left-[-0.04em] whitespace-nowrap text-[11vw] font-medium uppercase leading-none tracking-[-0.09em] text-white/[0.016]">
              {vehicle.brand}
            </p>
          </div>

          <div className="relative z-10 flex h-full flex-col">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#d8ff3e]/65" />

                <span className="text-[7px] uppercase tracking-[0.42em] text-white/38">
                  Final selection
                </span>
              </div>

              <p className="mt-7 text-[8px] uppercase tracking-[0.45em] text-white/38">
                {vehicle.brand}
              </p>

              <h1 className="mt-3 max-w-[540px] text-5xl font-medium uppercase leading-[0.82] tracking-[-0.065em] sm:text-6xl lg:text-[4vw]">
                {vehicle.model}
              </h1>
            </div>

            {/* =================================================
                CAR
            ================================================== */}

            <div className="booking-car relative my-10 min-h-[250px] lg:min-h-[360px]">
              <div className="absolute left-1/2 top-1/2 w-full max-w-[760px] -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-[4%] left-1/2 h-8 w-[62%] -translate-x-1/2 rounded-full bg-black/90 blur-xl"
                  />

                  <Image
                    src={
                      vehicle.image
                    }
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    width={1500}
                    height={850}
                    priority
                    quality={88}
                    sizes="(max-width: 1024px) 90vw, 38vw"
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

            {/* =================================================
                JOURNEY SUMMARY
            ================================================== */}

            <div className="mt-9 space-y-5 border-t border-white/10 pt-7">
              <BookingLine
                icon={
                  <MapPin
                    size={12}
                  />
                }
                label="Pickup"
                value={
                  reservation.pickupLocation
                }
              />

              <BookingLine
                icon={
                  <MapPin
                    size={12}
                  />
                }
                label="Return"
                value={
                  reservation.returnLocation
                }
              />

              <BookingLine
                icon={
                  <CalendarDays
                    size={12}
                  />
                }
                label="Dates"
                value={`${formatDate(
                  reservation.pickupDate,
                )} — ${formatDate(
                  reservation.returnDate,
                )}`}
              />

              <BookingLine
                icon={
                  <User
                    size={12}
                  />
                }
                label="Driver"
                value={
                  driverName
                }
              />

              <BookingLine
                icon={
                  <CalendarDays
                    size={12}
                  />
                }
                label="Duration"
                value={`${rentalDays} ${
                  rentalDays ===
                  1
                    ? "day"
                    : "days"
                }`}
              />
            </div>
          </div>
        </aside>

        {/* ===================================================
            RIGHT / REVIEW
        ==================================================== */}

        <section className="booking-panel bg-[#09090b] px-6 py-12 lg:px-10 lg:py-14">
          <div className="mx-auto max-w-[780px]">
            <p className="text-[7px] uppercase tracking-[0.43em] text-[#d8ff3e]/70">
              Step 03 / Review
            </p>

            <h2 className="mt-5 text-5xl font-medium uppercase leading-[0.85] tracking-[-0.065em] sm:text-6xl lg:text-7xl">
              One last

              <span className="block text-white/35">
                look.
              </span>
            </h2>

            <p className="mt-6 max-w-[540px] text-sm leading-7 text-white/42">
              Review the machine, schedule, driver details, and simulated
              pricing summary before completing the portfolio reservation.
            </p>

            {/* =================================================
                JOURNEY
            ================================================== */}

            <ReviewSection
              number="01"
              title="Your journey"
            >
              <Link
                href={`/reserve/${vehicle.slug}`}
                className="review-edit"
              >
                Edit schedule

                <ArrowUpRight
                  aria-hidden="true"
                  size={13}
                />
              </Link>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ReviewCard
                  label="Pickup location"
                  value={
                    reservation.pickupLocation
                  }
                  detail="Starting point"
                />

                <ReviewCard
                  label="Return location"
                  value={
                    reservation.returnLocation
                  }
                  detail={
                    reservation.returnLocation ===
                    reservation.pickupLocation
                      ? "Same as pickup"
                      : "Different return point"
                  }
                />

                <ReviewCard
                  label="Pickup"
                  value={formatLongDate(
                    reservation.pickupDate,
                  )}
                  detail={formatTime(
                    reservation.pickupTime,
                  )}
                />

                <ReviewCard
                  label="Return"
                  value={formatLongDate(
                    reservation.returnDate,
                  )}
                  detail={formatTime(
                    reservation.returnTime,
                  )}
                />
              </div>
            </ReviewSection>

            {/* =================================================
                DRIVER
            ================================================== */}

            <ReviewSection
              number="02"
              title="Primary driver"
            >
              <Link
                href={`/reserve/${vehicle.slug}/driver`}
                className="review-edit"
              >
                Edit driver details

                <ArrowUpRight
                  aria-hidden="true"
                  size={13}
                />
              </Link>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ReviewCard
                  label="Driver"
                  value={
                    driverName
                  }
                  detail="Primary driver"
                />

                <ReviewCard
                  label="Contact"
                  value={
                    reservation.phone
                  }
                  detail={
                    reservation.email
                  }
                />

                <ReviewCard
                  label="License"
                  value={
                    reservation.licenseNumber
                  }
                  detail={`Expires ${formatLongDate(
                    reservation.licenseExpiry,
                  )}`}
                />

                <ReviewCard
                  label="Address"
                  value={
                    reservation.address
                  }
                  detail="Demo reservation information"
                />
              </div>

              <div className="mt-4">
                <ReviewCard
                  label="Reservation notes"
                  value={
                    reservation.notes ||
                    "No additional notes"
                  }
                  detail="Optional"
                />
              </div>
            </ReviewSection>

            {/* =================================================
                PRICE
            ================================================== */}

            <ReviewSection
              number="03"
              title="Estimated pricing"
            >
              <div className="border-y border-white/10">
                <PriceRow
                  label={`${rentalDays} ${
                    rentalDays ===
                    1
                      ? "day"
                      : "days"
                  } × ₱${vehicle.pricePerDay.toLocaleString(
                    "en-PH",
                  )}`}
                  value={`₱${rentalSubtotal.toLocaleString(
                    "en-PH",
                  )}`}
                />

                <PriceRow
                  label="Service fee"
                  value={`₱${SERVICE_FEE.toLocaleString(
                    "en-PH",
                  )}`}
                />

                <PriceRow
                  label="Delivery fee"
                  value={`₱${DELIVERY_FEE.toLocaleString(
                    "en-PH",
                  )}`}
                />

                <div className="mx-5 border-t border-white/10" />

                <div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <p className="text-[7px] uppercase tracking-[0.38em] text-white/32">
                      Estimated booking total
                    </p>

                    <p className="mt-3 text-3xl font-medium tracking-[-0.05em]">
                      ₱
                      {bookingTotal.toLocaleString(
                        "en-PH",
                      )}
                    </p>
                  </div>

                  <p className="max-w-[220px] text-[7px] uppercase leading-5 tracking-[0.3em] text-white/23 sm:text-right">
                    Deposit excluded
                    <br />
                    from booking total
                  </p>
                </div>
              </div>

              {/* Deposit disclosure */}

              <div className="mt-4 flex items-start gap-4 border border-white/10 px-5 py-5">
                <ShieldCheck
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.2}
                  className="mt-0.5 shrink-0 text-[#d8ff3e]"
                />

                <div>
                  <p className="text-xs leading-6 text-white/55">
                    ₱
                    {REFUNDABLE_DEPOSIT.toLocaleString(
                      "en-PH",
                    )}{" "}
                    simulated refundable security deposit
                  </p>

                  <p className="mt-2 text-[7px] uppercase leading-5 tracking-[0.3em] text-white/22">
                    Shown for interface demonstration only / Not collected
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-6 text-white/28">
                All amounts on this page are part of the VELOCE portfolio
                concept and do not represent a live quotation or transaction.
              </p>
            </ReviewSection>

            {/* =================================================
                CONFIRMATION CONSENT
            ================================================== */}

            <label className="group mt-10 flex cursor-pointer items-start gap-4 border-t border-white/10 pt-7">
              <input
                type="checkbox"
                checked={
                  accepted
                }
                onChange={(
                  event,
                ) =>
                  setAccepted(
                    event.target
                      .checked,
                  )
                }
                className="peer sr-only"
              />

              <span
                aria-hidden="true"
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border",
                  "transition-[background-color,border-color,color] duration-300",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-[#d8ff3e]/40",
                  "peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#09090b]",
                  accepted
                    ? "border-[#d8ff3e] bg-[#d8ff3e] text-black"
                    : "border-white/20 group-hover:border-white/40",
                ].join(
                  " ",
                )}
              >
                {accepted && (
                  <Check
                    size={11}
                    strokeWidth={2}
                  />
                )}
              </span>

              <span className="max-w-[640px] text-xs leading-6 text-white/42">
                I have reviewed the information above and understand that
                confirming this screen only completes the simulated VELOCE
                portfolio reservation.
              </span>
            </label>

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="booking-actions mt-10 grid gap-4 sm:grid-cols-[auto_1fr]">
              <Link
                href={`/reserve/${vehicle.slug}/driver`}
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
                type="button"
                disabled={
                  !canConfirm
                }
                onClick={
                  confirmReservation
                }
                className="group flex min-h-16 items-center justify-between bg-white px-7 text-left text-black transition-colors duration-300 hover:bg-[#d8ff3e] disabled:cursor-not-allowed disabled:bg-white/[0.07] disabled:text-white/25"
              >
                {confirming ? (
                  <>
                    <div>
                      <p className="text-[7px] uppercase tracking-[0.4em] opacity-45">
                        Finalizing demo
                      </p>

                      <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em]">
                        Preparing confirmation
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border border-current border-r-transparent"
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-[7px] uppercase tracking-[0.4em] opacity-45">
                        Final step
                      </p>

                      <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em]">
                        Confirm demo reservation
                      </p>
                    </div>

                    <ArrowRight
                      aria-hidden="true"
                      size={15}
                      strokeWidth={1.1}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-disabled:translate-x-0"
                    />
                  </>
                )}
              </button>
            </div>

            {/* =================================================
                DISCLOSURE
            ================================================== */}

            <div className="mt-6 flex items-start gap-3 border-t border-white/[0.06] pt-5">
              <CheckCircle2
                aria-hidden="true"
                size={11}
                strokeWidth={1.4}
                className="mt-[2px] shrink-0 text-[#d8ff3e]"
              />

              <p className="text-[7px] uppercase leading-5 tracking-[0.32em] text-white/24">
                Portfolio concept / No payment or live reservation is created
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   FLOW VALIDATION
========================================================= */

function isValidSchedule(
  pickupDate: string,
  returnDate: string,
) {
  if (
    !pickupDate ||
    !returnDate
  ) {
    return false;
  }

  return (
    returnDate >
    pickupDate
  );
}

function isValidDriver(
  reservation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    licenseNumber: string;
    licenseExpiry: string;
    returnDate: string;
    address: string;
    termsAccepted: boolean;
  },
) {
  return Boolean(
    reservation.firstName.trim() &&
      reservation.lastName.trim() &&
      isValidEmail(
        reservation.email,
      ) &&
      isValidPhone(
        reservation.phone,
      ) &&
      reservation.birthDate &&
      reservation.licenseNumber.trim().length >=
        4 &&
      reservation.licenseExpiry &&
      reservation.licenseExpiry >=
        reservation.returnDate &&
      reservation.address.trim().length >=
        5 &&
      reservation.termsAccepted,
  );
}

function isValidEmail(
  value: string,
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim(),
  );
}

function isValidPhone(
  value: string,
) {
  const normalized =
    value.replace(
      /[\s()-]/g,
      "",
    );

  return /^\+?[0-9]{7,15}$/.test(
    normalized,
  );
}

/* =========================================================
   RENTAL DAYS
========================================================= */

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

/* =========================================================
   DATE FORMATTERS
========================================================= */

function formatDate(
  value: string,
) {
  if (!value) {
    return "Not selected";
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
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-PH",
    {
      day:
        "2-digit",
      month:
        "short",
    },
  ).format(
    date,
  );
}

function formatLongDate(
  value: string,
) {
  if (!value) {
    return "Not selected";
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
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-PH",
    {
      day:
        "2-digit",
      month:
        "short",
      year:
        "numeric",
    },
  ).format(
    date,
  );
}

function formatTime(
  value: string,
) {
  if (!value) {
    return "Time not selected";
  }

  const [
    hourString,
    minuteString,
  ] =
    value.split(":");

  const hour =
    Number(
      hourString,
    );

  const minute =
    Number(
      minuteString,
    );

  if (
    Number.isNaN(
      hour,
    ) ||
    Number.isNaN(
      minute,
    )
  ) {
    return value;
  }

  const date =
    new Date();

  date.setHours(
    hour,
    minute,
    0,
    0,
  );

  return new Intl.DateTimeFormat(
    "en-PH",
    {
      hour:
        "numeric",
      minute:
        "2-digit",
    },
  ).format(
    date,
  );
}

/* =========================================================
   REVIEW SECTION
========================================================= */

function ReviewSection({
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
      <div className="flex items-center gap-4">
        <span className="text-[7px] tracking-[0.42em] text-[#d8ff3e]/55">
          {number}
        </span>

        <span className="h-px w-8 bg-white/10" />

        <h3 className="text-[7px] uppercase tracking-[0.4em] text-white/32">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   REVIEW CARD
========================================================= */

function ReviewCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="review-entry border border-white/[0.08] bg-white/[0.015] p-5">
      <p className="text-[7px] uppercase tracking-[0.38em] text-white/28">
        {label}
      </p>

      <p className="mt-3 break-words text-sm leading-6 text-white/70">
        {value}
      </p>

      <p className="mt-2 break-words text-[7px] uppercase leading-5 tracking-[0.28em] text-white/22">
        {detail}
      </p>
    </div>
  );
}

/* =========================================================
   PRICE ROW
========================================================= */

function PriceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-8 px-5 py-4">
      <span className="text-xs leading-6 text-white/42">
        {label}
      </span>

      <span className="shrink-0 text-sm text-white/65">
        {value}
      </span>
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

/* =========================================================
   BOOKING LINE
========================================================= */

function BookingLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 text-white/30">
          {icon}
        </span>

        <span className="text-[7px] uppercase tracking-[0.34em] text-white/30">
          {label}
        </span>
      </div>

      <span className="max-w-[58%] break-words text-right text-xs leading-5 text-white/55">
        {value}
      </span>
    </div>
  );
}