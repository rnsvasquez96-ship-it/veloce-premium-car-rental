"use client";

import { LoadingState } from "@/components/ui/loading-state";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  CalendarDays,
  MapPin,
  User,
} from "lucide-react";

import { hasDriverData, hasScheduleData, useReservation } from "@/components/reservation/reservation-provider";
import { ExperienceState } from "@/components/ui/experience-state";
import { vehicles } from "@/data/vehicles";

export default function ReservationSuccessPage() {
  const params = useParams<{ slug: string }>();

  const {
    reservation,
    resetReservation,
    storageError,
    hydrated,
  } = useReservation();

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  const vehicle = useMemo(
    () =>
      vehicles.find(
        (item) => item.slug === params.slug
      ),
    [params.slug]
  );

  const reference = useMemo(
    () => generateBookingReference(params.slug),
    [params.slug]
  );

  if (!vehicle) {
    return <ExperienceState eyebrow="Reservation / Vehicle" title="Vehicle not found" message="The selected machine is not available in the current collection." href="/fleet" action="Return to the collection" />;
  }

  if (!hydrated) return <LoadingState reservation />;

  if (hydrated && (storageError || !hasScheduleData(reservation) || !hasDriverData(reservation))) {
    return <ExperienceState eyebrow="Reservation / Confirmation" title="Reservation unavailable" message="There is no complete reservation to display. Choose your vehicle and begin again." href="/fleet" action="Choose a vehicle" />;
  }

  const rentalDays = getRentalDays(
    reservation.pickupDate,
    reservation.returnDate
  );

  const rentalSubtotal =
    vehicle.pricePerDay * rentalDays;

  const serviceFee = 2500;
  const deliveryFee = 1500;
  const refundableDeposit = 15000;

  const bookingTotal =
    rentalSubtotal +
    serviceFee +
    deliveryFee;

  const driverName =
    `${reservation.firstName} ${reservation.lastName}`.trim();

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(
        reference
      );

      setCopied(true);
      setCopyError(false);
      if (copyTimer.current) clearTimeout(copyTimer.current);

      copyTimer.current = setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  function finishReservation() {
    resetReservation();
  }

  return (
    <main id="main-content" tabIndex={-1} className="success-page relative min-h-[100svh] overflow-hidden bg-[#050505] px-6 text-white lg:px-10">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[45%] h-[900px] w-[1200px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(216,255,62,0.055)_0%,rgba(255,255,255,0.018)_28%,transparent_68%)]" />

        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.025] to-transparent" />

        <div className="absolute top-[62%] h-px w-full bg-gradient-to-r from-transparent via-white/[0.025] to-transparent" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,5,5,0.25)_55%,#050505_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col">
        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="flex items-center justify-between border-b border-white/10 py-6">
          <Link href="/">
            <p className="text-sm font-semibold tracking-[0.32em]">
              VELOCE
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.38em] text-white/60">
              Premium Car Rental
            </p>
          </Link>

          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d8ff3e]" />

            <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">
              Reservation complete
            </p>
          </div>
        </header>

        {/* ===================================================
            MAIN
        =================================================== */}

        <section className="confirmation-launch" aria-labelledby="confirmation-heading">
          <div className="confirmation-launch-heading">
            <p className="eyebrow text-[#d8ff3e]">04 / Reservation confirmed</p>
            <h1 id="confirmation-heading">The road<br /><span>is yours.</span></h1>
          </div>
          <div className="confirmation-car vehicle-ground">
            <Image src={vehicle.image} alt={vehicle.brand + " " + vehicle.model} fill priority quality={85} sizes="(max-width: 768px) 100vw, 80vw" className="object-contain" />
          </div>
          <div className="confirmation-launch-caption eyebrow"><span>{vehicle.brand} / {vehicle.model}</span><span>Your next chapter awaits.</span></div>
        </section>
        <div className="confirmation-details grid flex-1 items-start gap-14 py-12 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:py-16">
          {/* ===============================================
              LEFT
          =============================================== */}

          <section>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d8ff3e] text-black">
              <Check size={20} />
            </div>

            <p className="mt-10 text-[10px] uppercase tracking-[0.45em] text-[#d8ff3e]/70">
              Reservation confirmed
            </p>

            <h2 className="confirmation-details-title">
              Every detail.

              <span className="block text-white/55">
                Considered.
              </span>
            </h2>

            <p className="mt-8 max-w-[560px] text-sm leading-7 text-white/60 sm:text-base">
              Your {vehicle.brand}{" "}
              {vehicle.model} reservation has
              been created. Your booking details
              are saved in this session. This portfolio
              experience does not place a live booking.
            </p>

            {/* REFERENCE */}

            <div className="confirmation-reference mt-10 max-w-[560px] border-y border-white/20 py-6">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">
                Booking reference
              </p>

              <div className="mt-4 flex items-center justify-between gap-6">
                <p className="booking-reference">
                  {reference}
                </p>

                <button
                  type="button"
                  onClick={copyReference}
                  aria-label="Copy booking reference"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black"
                >
                  {copied ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>

              {copyError && <p role="status" className="mt-3 text-sm text-[#e4c8a8]">Select the reference above to copy it manually.</p>}
              {copied && (
                <p role="status" className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[#d8ff3e]">
                  Reference copied
                </p>
              )}
            </div>

            {/* ACTIONS */}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/"
                onClick={finishReservation}
                className="group flex min-h-14 items-center justify-between gap-10 bg-white px-6 text-black transition-colors duration-300 hover:bg-[#d8ff3e]"
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.32em]">
                  Return home
                </span>

                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href={`/fleet/${vehicle.slug}`}
                className="flex min-h-14 items-center justify-center border border-white/10 px-6 text-[10px] uppercase tracking-[0.32em] text-white/50 transition-all duration-300 hover:border-white/30 hover:text-white"
              >
                View vehicle
              </Link>
            </div>
          </section>

          {/* ===============================================
              RIGHT — RESERVATION RECEIPT
          =============================================== */}

          <aside className="border border-white/10 bg-[#09090b]">
            <div className="border-b border-white/10 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">
                    Confirmed vehicle
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-white/60">
                    {vehicle.brand}
                  </p>

                  <h2 className="mt-1 text-3xl font-medium uppercase tracking-[-0.05em] sm:text-4xl">
                    {vehicle.model}
                  </h2>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8ff3e]/25 text-[#d8ff3e]">
                  <Check size={13} />
                </span>
              </div>
            </div>

            {/* INFO */}

            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              <SummaryCell
                icon={<User size={13} />}
                label="Primary driver"
                value={
                  driverName ||
                  "Driver"
                }
              />

              <SummaryCell
                icon={<MapPin size={13} />}
                label="Pickup"
                value={
                  reservation.pickupLocation ||
                  "Not selected"
                }
              />

              <SummaryCell
                icon={
                  <CalendarDays size={13} />
                }
                label="Pickup date"
                value={formatReservationDateTime(
                  reservation.pickupDate,
                  reservation.pickupTime
                )}
              />

              <SummaryCell
                icon={
                  <CalendarDays size={13} />
                }
                label="Return date"
                value={formatReservationDateTime(
                  reservation.returnDate,
                  reservation.returnTime
                )}
              />
            </div>

            {/* PRICE */}

            <div className="p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">
                Reservation summary
              </p>

              <div className="mt-7 space-y-4">
                <PriceLine
                  label={`${rentalDays} ${
                    rentalDays === 1
                      ? "day"
                      : "days"
                  } × ₱${vehicle.pricePerDay.toLocaleString(
                    "en-PH"
                  )}`}
                  value={`₱${rentalSubtotal.toLocaleString(
                    "en-PH"
                  )}`}
                />

                <PriceLine
                  label="Service fee"
                  value={`₱${serviceFee.toLocaleString(
                    "en-PH"
                  )}`}
                />

                <PriceLine
                  label="Vehicle delivery"
                  value={`₱${deliveryFee.toLocaleString(
                    "en-PH"
                  )}`}
                />
              </div>

              <div className="mt-7 border-t border-white/10 pt-7">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">
                      Booking total
                    </p>

                    <p className="mt-2 text-3xl font-medium tracking-[-0.045em]">
                      ₱
                      {bookingTotal.toLocaleString(
                        "en-PH"
                      )}
                    </p>
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/60">
                    {rentalDays}{" "}
                    {rentalDays === 1
                      ? "day"
                      : "days"}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-xs text-white/60">
                    Refundable security deposit
                  </span>

                  <span className="text-sm text-white/60">
                    ₱
                    {refundableDeposit.toLocaleString(
                      "en-PH"
                    )}
                  </span>
                </div>

                <p className="mt-3 text-[10px] uppercase leading-5 tracking-[0.27em] text-white/60">
                  Collected separately before
                  vehicle handover
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
            VELOCE / Portfolio Concept
          </p>

          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
            No live payment processed
          </p>
        </footer>
      </div>
    </main>
  );
}

/* =========================================================
   BOOKING REFERENCE
========================================================= */

function generateBookingReference(
  slug: string
) {
  const slugCode = slug
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 3)
    .toUpperCase();

  const timestamp = Date.now()
    .toString()
    .slice(-6);

  return `VLC-${slugCode}-${timestamp}`;
}

/* =========================================================
   RENTAL DAYS
========================================================= */

function getRentalDays(
  pickupDate: string,
  returnDate: string
) {
  if (!pickupDate || !returnDate) {
    return 1;
  }

  const pickup = new Date(
    `${pickupDate}T00:00:00`
  );

  const returned = new Date(
    `${returnDate}T00:00:00`
  );

  const difference =
    returned.getTime() -
    pickup.getTime();

  if (
    Number.isNaN(difference) ||
    difference <= 0
  ) {
    return 1;
  }

  return Math.max(
    1,
    Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    )
  );
}

/* =========================================================
   DATE / TIME
========================================================= */

function formatReservationDateTime(
  dateValue: string,
  timeValue: string
) {
  if (!dateValue) {
    return "Not selected";
  }

  const date = new Date(
    `${dateValue}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const formattedDate =
    new Intl.DateTimeFormat(
      "en-PH",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(date);

  if (!timeValue) {
    return formattedDate;
  }

  const [hourString, minuteString] =
    timeValue.split(":");

  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return `${formattedDate} · ${timeValue}`;
  }

  const time = new Date();

  time.setHours(
    hour,
    minute,
    0,
    0
  );

  const formattedTime =
    new Intl.DateTimeFormat(
      "en-PH",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    ).format(time);

  return `${formattedDate} · ${formattedTime}`;
}

/* =========================================================
   SUMMARY CELL
========================================================= */

function SummaryCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0b0b0d] p-5">
      <div className="flex items-center gap-3">
        <span className="text-white/60">
          {icon}
        </span>

        <p className="text-[10px] uppercase tracking-[0.32em] text-white/60">
          {label}
        </p>
      </div>

      <p className="mt-4 break-words text-sm text-white/65">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PRICE
========================================================= */

function PriceLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-8">
      <span className="text-xs text-white/60">
        {label}
      </span>

      <span className="shrink-0 text-sm text-white/60">
        {value}
      </span>
    </div>
  );
}
