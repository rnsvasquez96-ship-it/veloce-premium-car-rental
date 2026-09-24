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
  Check,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { Step } from "@/components/reservation/booking-step";
import {
  hasScheduleData,
  useReservation,
} from "@/components/reservation/reservation-provider";
import { ExperienceState } from "@/components/ui/experience-state";
import { LoadingState } from "@/components/ui/loading-state";
import { vehicles } from "@/data/vehicles";

const SERVICE_FEE = 2500;

/* =========================================================
   PAGE
========================================================= */

export default function DriverDetailsPage() {
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

  const [
    attempted,
    setAttempted,
  ] = useState(false);

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
    storageError ||
    !hasScheduleData(
      reservation,
    ) ||
    !hasValidSchedule(
      reservation.pickupDate,
      reservation.returnDate,
    )
  ) {
    return (
      <ExperienceState
        eyebrow="Reservation / Schedule"
        title="Complete the schedule."
        message="Choose a valid pickup and return schedule before continuing to the driver details."
        href={`/reserve/${vehicle.slug}`}
        action="Return to schedule"
      />
    );
  }

  /* =======================================================
     SUMMARY
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
    rentalSubtotal +
    SERVICE_FEE;

  /* =======================================================
     FIELD VALIDATION
  ======================================================== */

  const errors =
    validateDriver(
      reservation,
      today,
    );

  const canContinue =
    Object.keys(
      errors,
    ).length ===
      0 &&
    reservation.termsAccepted;

  /* =======================================================
     UPDATE
  ======================================================== */

  function updateField(
    field:
      keyof typeof reservation,
    value:
      string | boolean,
  ) {
    updateReservation({
      [field]:
        value,
    });
  }

  /* =======================================================
     SUBMIT
  ======================================================== */

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setAttempted(
      true,
    );

    if (!canContinue) {
      return;
    }

    router.push(
      `/reserve/${vehicle.slug}/review`,
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
            href={`/reserve/${vehicle.slug}`}
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
              Back to schedule
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
              02 / 03
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
            active
          />

          <Step
            number="03"
            label="Review"
          />
        </div>
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="booking-grid mx-auto grid max-w-[1600px] lg:min-h-[calc(100svh-150px)] lg:grid-cols-[0.78fr_1.22fr]">
        {/* ===================================================
            LEFT / RESERVATION SUMMARY
        ==================================================== */}

        <aside className="booking-aside relative overflow-hidden border-b border-white/10 bg-[#070708] px-6 py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-[32%] h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.055)_0%,rgba(255,255,255,.015)_35%,transparent_70%)]" />

            <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] bg-[radial-gradient(ellipse_at_center,rgba(216,255,62,.03)_0%,transparent_70%)]" />

            <p className="absolute bottom-[17%] left-[-0.04em] whitespace-nowrap text-[11vw] font-medium uppercase leading-none tracking-[-0.09em] text-white/[0.017]">
              {vehicle.brand}
            </p>
          </div>

          <div className="relative z-10 flex h-full flex-col">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-[#d8ff3e]/65" />

                <span className="text-[7px] uppercase tracking-[0.42em] text-white/38">
                  Your reservation
                </span>
              </div>

              <p className="mt-7 text-[8px] uppercase tracking-[0.45em] text-white/38">
                {vehicle.brand}
              </p>

              <h1 className="mt-3 max-w-[520px] text-5xl font-medium uppercase leading-[0.82] tracking-[-0.065em] sm:text-6xl lg:text-[4vw]">
                {vehicle.model}
              </h1>
            </div>

            {/* =================================================
                CAR
            ================================================== */}

            <div className="booking-car relative my-10 min-h-[240px] lg:min-h-[330px]">
              <div className="absolute left-1/2 top-1/2 w-full max-w-[700px] -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-[4%] left-1/2 h-7 w-[60%] -translate-x-1/2 rounded-full bg-black/90 blur-xl"
                  />

                  <Image
                    src={
                      vehicle.image
                    }
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    width={1400}
                    height={800}
                    priority
                    quality={88}
                    sizes="(max-width: 1024px) 90vw, 36vw"
                    className="relative z-10 h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                RESERVATION INFO
            ================================================== */}

            <div className="mt-auto space-y-5 border-t border-white/10 pt-7">
              <BookingLine
                label="Pickup"
                value={
                  reservation.pickupLocation
                }
              />

              <BookingLine
                label="Return"
                value={
                  reservation.returnLocation
                }
              />

              <BookingLine
                label="Dates"
                value={`${formatDate(
                  reservation.pickupDate,
                )} — ${formatDate(
                  reservation.returnDate,
                )}`}
              />

              <BookingLine
                label="Duration"
                value={`${rentalDays} ${
                  rentalDays ===
                  1
                    ? "day"
                    : "days"
                }`}
              />

              <div className="border-t border-white/10 pt-6">
                <p className="text-[7px] uppercase tracking-[0.38em] text-white/32">
                  Estimated total
                </p>

                <p className="mt-3 text-3xl font-medium tracking-[-0.05em]">
                  ₱
                  {estimatedTotal.toLocaleString(
                    "en-PH",
                  )}
                </p>

                <p className="mt-3 text-[6px] uppercase tracking-[0.35em] text-white/18">
                  Rental + service fee
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ===================================================
            RIGHT / DRIVER FORM
        ==================================================== */}

        <section className="booking-panel bg-[#09090b] px-6 py-12 lg:px-10 lg:py-14">
          <form
            onSubmit={
              handleSubmit
            }
            noValidate
            className="mx-auto max-w-[760px]"
          >
            <p className="text-[7px] uppercase tracking-[0.43em] text-[#d8ff3e]/70">
              Step 02 / Driver
            </p>

            <h2 className="mt-5 text-5xl font-medium uppercase leading-[0.85] tracking-[-0.065em] sm:text-6xl lg:text-7xl">
              Who&apos;s

              <span className="block text-white/35">
                driving?
              </span>
            </h2>

            <p className="mt-6 max-w-[540px] text-sm leading-7 text-white/42">
              Add the information used to complete this portfolio
              reservation flow.
            </p>

            {/* =================================================
                DEMO NOTICE
            ================================================== */}

            <div className="mt-8 border-l border-[#d8ff3e]/45 pl-5">
              <p className="text-[7px] uppercase tracking-[0.38em] text-[#d8ff3e]/60">
                Portfolio demo
              </p>

              <p className="mt-3 max-w-xl text-xs leading-6 text-white/35">
                This information is stored only in this browser session.
                Do not enter real driver&apos;s license or sensitive personal
                information when testing the demo.
              </p>
            </div>

            {/* =================================================
                PERSONAL
            ================================================== */}

            <FormSection
              number="01"
              title="Personal information"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  icon={
                    <User
                      size={14}
                    />
                  }
                  label="First name"
                  placeholder="First name"
                  value={
                    reservation.firstName
                  }
                  autoComplete="given-name"
                  error={
                    attempted
                      ? errors.firstName
                      : undefined
                  }
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "firstName",
                      value,
                    )
                  }
                />

                <TextField
                  icon={
                    <User
                      size={14}
                    />
                  }
                  label="Last name"
                  placeholder="Last name"
                  value={
                    reservation.lastName
                  }
                  autoComplete="family-name"
                  error={
                    attempted
                      ? errors.lastName
                      : undefined
                  }
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "lastName",
                      value,
                    )
                  }
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  icon={
                    <Mail
                      size={14}
                    />
                  }
                  label="Email"
                  type="email"
                  placeholder="name@email.com"
                  value={
                    reservation.email
                  }
                  autoComplete="email"
                  inputMode="email"
                  error={
                    attempted
                      ? errors.email
                      : undefined
                  }
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "email",
                      value,
                    )
                  }
                />

                <TextField
                  icon={
                    <Phone
                      size={14}
                    />
                  }
                  label="Phone number"
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  value={
                    reservation.phone
                  }
                  autoComplete="tel"
                  inputMode="tel"
                  error={
                    attempted
                      ? errors.phone
                      : undefined
                  }
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "phone",
                      value,
                    )
                  }
                />
              </div>

              <TextField
                icon={
                  <User
                    size={14}
                  />
                }
                label="Date of birth"
                type="date"
                value={
                  reservation.birthDate
                }
                max={
                  today ||
                  undefined
                }
                autoComplete="bday"
                error={
                  attempted
                    ? errors.birthDate
                    : undefined
                }
                onChange={(
                  value,
                ) =>
                  updateField(
                    "birthDate",
                    value,
                  )
                }
              />
            </FormSection>

            {/* =================================================
                LICENSE
            ================================================== */}

            <FormSection
              number="02"
              title="Driver's license"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  icon={
                    <FileText
                      size={14}
                    />
                  }
                  label="License number"
                  placeholder="License number"
                  value={
                    reservation.licenseNumber
                  }
                  autoComplete="off"
                  error={
                    attempted
                      ? errors.licenseNumber
                      : undefined
                  }
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "licenseNumber",
                      value,
                    )
                  }
                />

                <TextField
                  icon={
                    <FileText
                      size={14}
                    />
                  }
                  label="License expiry"
                  type="date"
                  value={
                    reservation.licenseExpiry
                  }
                  min={
                    reservation.returnDate ||
                    today ||
                    undefined
                  }
                  error={
                    attempted
                      ? errors.licenseExpiry
                      : undefined
                  }
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "licenseExpiry",
                      value,
                    )
                  }
                />
              </div>

              <p className="text-[7px] uppercase leading-5 tracking-[0.32em] text-white/18">
                Expiry must be on or after the reservation return date.
              </p>
            </FormSection>

            {/* =================================================
                ADDRESS + NOTES
            ================================================== */}

            <FormSection
              number="03"
              title="Contact details"
            >
              <TextField
                icon={
                  <MapPin
                    size={14}
                  />
                }
                label="Residential address"
                placeholder="Street, Barangay, City"
                value={
                  reservation.address
                }
                autoComplete="street-address"
                error={
                  attempted
                    ? errors.address
                    : undefined
                }
                onChange={(
                  value,
                ) =>
                  updateField(
                    "address",
                    value,
                  )
                }
              />

              <div className="border border-white/10 bg-[#0c0c0e] p-5 transition-colors duration-300 focus-within:border-white/25">
                <label
                  htmlFor="reservation-notes"
                  className="text-[7px] uppercase tracking-[0.38em] text-white/32"
                >
                  Reservation notes
                </label>

                <textarea
                  id="reservation-notes"
                  value={
                    reservation.notes
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "notes",
                      event.target.value,
                    )
                  }
                  placeholder="Optional notes for this demo reservation..."
                  rows={4}
                  maxLength={500}
                  className="mt-4 w-full resize-none bg-transparent text-sm leading-7 text-white/70 outline-none placeholder:text-white/20"
                />

                <div className="mt-3 text-right">
                  <span className="text-[6px] uppercase tracking-[0.3em] text-white/15">
                    {
                      reservation.notes
                        .length
                    }{" "}
                    / 500
                  </span>
                </div>
              </div>
            </FormSection>

            {/* =================================================
                CONFIRMATION
            ================================================== */}

            <label className="group mt-10 flex cursor-pointer items-start gap-4 border-t border-white/10 pt-7">
              <input
                type="checkbox"
                checked={
                  reservation.termsAccepted
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "termsAccepted",
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
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-[#d8ff3e]/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#09090b]",
                  reservation.termsAccepted
                    ? "border-[#d8ff3e] bg-[#d8ff3e] text-black"
                    : "border-white/20 group-hover:border-white/40",
                ].join(
                  " ",
                )}
              >
                {reservation.termsAccepted && (
                  <Check
                    size={11}
                    strokeWidth={2}
                  />
                )}
              </span>

              <span className="max-w-[620px] text-xs leading-6 text-white/42">
                I confirm that the information entered for this demo
                reservation is accurate.
              </span>
            </label>

            {attempted &&
              !reservation.termsAccepted && (
                <p
                  role="alert"
                  className="mt-3 text-xs leading-5 text-[#e8c4a5]/75"
                >
                  Confirm the information before continuing.
                </p>
              )}

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="booking-actions mt-10 grid gap-4 sm:grid-cols-[auto_1fr]">
              <Link
                href={`/reserve/${vehicle.slug}`}
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
                className={[
                  "group flex min-h-16 items-center justify-between px-7 text-left",
                  "transition-colors duration-300",
                  canContinue
                    ? "bg-white text-black hover:bg-[#d8ff3e]"
                    : "bg-white/[0.07] text-white/35 hover:bg-white/[0.1]",
                ].join(
                  " ",
                )}
              >
                <div>
                  <p className="text-[7px] uppercase tracking-[0.4em] opacity-45">
                    Continue
                  </p>

                  <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em]">
                    Review reservation
                  </p>
                </div>

                <ArrowRight
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {attempted &&
              Object.keys(
                errors,
              ).length >
                0 && (
                <div
                  role="alert"
                  className="mt-6 border-l border-[#e8c4a5]/45 pl-5"
                >
                  <p className="text-xs leading-6 text-[#e8c4a5]/75">
                    Check the highlighted driver details before continuing.
                  </p>
                </div>
              )}

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

              <p className="text-[7px] uppercase leading-5 tracking-[0.32em] text-white/24">
                Portfolio concept / No identity verification is performed
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   VALIDATION
========================================================= */

type DriverErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  address?: string;
};

function validateDriver(
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
  },
  today: string,
): DriverErrors {
  const errors:
    DriverErrors = {};

  if (
    !reservation.firstName.trim()
  ) {
    errors.firstName =
      "Enter a first name.";
  }

  if (
    !reservation.lastName.trim()
  ) {
    errors.lastName =
      "Enter a last name.";
  }

  if (
    !isValidEmail(
      reservation.email,
    )
  ) {
    errors.email =
      "Enter a valid email address.";
  }

  if (
    !isValidPhone(
      reservation.phone,
    )
  ) {
    errors.phone =
      "Enter a valid phone number.";
  }

  if (
    !reservation.birthDate
  ) {
    errors.birthDate =
      "Enter a date of birth.";
  } else if (
    today &&
    reservation.birthDate >=
      today
  ) {
    errors.birthDate =
      "Enter a valid date of birth.";
  }

  if (
    reservation.licenseNumber
      .trim().length <
    4
  ) {
    errors.licenseNumber =
      "Enter a valid license number.";
  }

  if (
    !reservation.licenseExpiry
  ) {
    errors.licenseExpiry =
      "Enter the license expiry date.";
  } else if (
    reservation.returnDate &&
    reservation.licenseExpiry <
      reservation.returnDate
  ) {
    errors.licenseExpiry =
      "License must remain valid through the return date.";
  }

  if (
    reservation.address
      .trim().length <
    5
  ) {
    errors.address =
      "Enter a complete address.";
  }

  return errors;
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
   SCHEDULE HELPERS
========================================================= */

function hasValidSchedule(
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

  const difference =
    returned.getTime() -
    pickup.getTime();

  if (
    Number.isNaN(
      difference,
    ) ||
    difference <=
      0
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
      year:
        "numeric",
    },
  ).format(
    date,
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
   TEXT FIELD
========================================================= */

function TextField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
  error,
  autoComplete,
  inputMode,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "date";
  min?: string;
  max?: string;
  error?: string;
  autoComplete?: string;
  inputMode?:
    | "email"
    | "tel"
    | "text";
}) {
  return (
    <label
      className={[
        "booking-field group",
        error
          ? "border-[#e8c4a5]/45"
          : "",
      ].join(
        " ",
      )}
    >
      <span
        className={[
          "transition-colors duration-300",
          error
            ? "text-[#e8c4a5]/70"
            : "text-white/35 group-focus-within:text-[#d8ff3e]",
        ].join(
          " ",
        )}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[7px] uppercase tracking-[0.38em] text-white/32 transition-colors group-focus-within:text-white/55">
          {label}
        </span>

        <input
          type={type}
          value={value}
          min={min}
          max={max}
          autoComplete={
            autoComplete
          }
          inputMode={
            inputMode
          }
          aria-invalid={
            Boolean(error)
          }
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
          placeholder={
            placeholder
          }
          className="mt-2 w-full bg-transparent text-base text-white/75 outline-none placeholder:text-white/20 md:text-sm [color-scheme:dark]"
        />

        {error && (
          <span className="mt-2 block text-[11px] leading-5 text-[#e8c4a5]/75">
            {error}
          </span>
        )}
      </span>
    </label>
  );
}

/* =========================================================
   BOOKING LINE
========================================================= */

function BookingLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-[7px] uppercase tracking-[0.34em] text-white/30">
        {label}
      </span>

      <span className="text-right text-xs text-white/55">
        {value}
      </span>
    </div>
  );
}