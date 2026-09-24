"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ReservationData = {
  pickupLocation: string;
  returnLocation: string;

  pickupDate: string;
  pickupTime: string;

  returnDate: string;
  returnTime: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;

  licenseNumber: string;
  licenseExpiry: string;

  address: string;
  notes: string;

  termsAccepted: boolean;
};

type ReservationContextType = {
  reservation: ReservationData;

  hydrated: boolean;
  storageError: boolean;

  updateReservation: (
    values: Partial<ReservationData>,
  ) => void;

  resetReservation: () => void;
};

const STORAGE_KEY =
  "veloce-reservation";

const defaultReservation: ReservationData = {
  pickupLocation: "BGC, Taguig",
  returnLocation: "BGC, Taguig",

  pickupDate: "",
  pickupTime: "10:00",

  returnDate: "",
  returnTime: "10:00",

  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: "",

  licenseNumber: "",
  licenseExpiry: "",

  address: "",
  notes: "",

  termsAccepted: false,
};

const ReservationContext =
  createContext<ReservationContextType | null>(
    null,
  );

/* =========================================================
   PROVIDER
========================================================= */

export function ReservationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    reservation,
    setReservation,
  ] = useState<ReservationData>(() => ({
    ...defaultReservation,
  }));

  const [
    hydrated,
    setHydrated,
  ] = useState(false);

  const [
    storageError,
    setStorageError,
  ] = useState(false);

  /* =======================================================
     LOAD SESSION
  ======================================================== */

  useEffect(() => {
    try {
      const saved =
        sessionStorage.getItem(
          STORAGE_KEY,
        );

      if (saved) {
        const parsed:
          unknown =
          JSON.parse(saved);

        setReservation(
          sanitizeReservation(
            parsed,
          ),
        );
      }

      setStorageError(
        false,
      );
    } catch {
      /*
       * Corrupt or inaccessible storage should
       * never crash the reservation UI.
       */

      setReservation({
        ...defaultReservation,
      });

      try {
        sessionStorage.removeItem(
          STORAGE_KEY,
        );
      } catch {
        // Storage may be completely unavailable.
      }

      setStorageError(
        true,
      );
    } finally {
      setHydrated(
        true,
      );
    }
  }, []);

  /* =======================================================
     SAVE SESSION
  ======================================================== */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          reservation,
        ),
      );

      /*
       * A successful write means storage is
       * currently usable again.
       */

      setStorageError(
        false,
      );
    } catch {
      setStorageError(
        true,
      );
    }
  }, [
    reservation,
    hydrated,
  ]);

  /* =======================================================
     UPDATE
  ======================================================== */

  const updateReservation =
    useCallback(
      (
        values:
          Partial<ReservationData>,
      ) => {
        setReservation(
          (
            current,
          ) => ({
            ...current,
            ...values,
          }),
        );
      },
      [],
    );

  /* =======================================================
     RESET
  ======================================================== */

  const resetReservation =
    useCallback(() => {
      /*
       * Reset React state first.
       *
       * The persistence effect will then write the
       * clean reservation back to sessionStorage.
       */

      setReservation({
        ...defaultReservation,
      });

      try {
        sessionStorage.removeItem(
          STORAGE_KEY,
        );

        setStorageError(
          false,
        );
      } catch {
        setStorageError(
          true,
        );
      }
    }, []);

  /* =======================================================
     CONTEXT VALUE
  ======================================================== */

  const value =
    useMemo<ReservationContextType>(
      () => ({
        reservation,
        hydrated,
        storageError,
        updateReservation,
        resetReservation,
      }),
      [
        reservation,
        hydrated,
        storageError,
        updateReservation,
        resetReservation,
      ],
    );

  return (
    <ReservationContext.Provider
      value={value}
    >
      {children}
    </ReservationContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useReservation() {
  const context =
    useContext(
      ReservationContext,
    );

  if (!context) {
    throw new Error(
      "useReservation must be used inside ReservationProvider",
    );
  }

  return context;
}

/* =========================================================
   FLOW GUARDS
========================================================= */

export function hasScheduleData(
  reservation:
    ReservationData,
) {
  return Boolean(
    reservation.pickupLocation &&
      reservation.returnLocation &&
      reservation.pickupDate &&
      reservation.returnDate &&
      reservation.pickupTime &&
      reservation.returnTime,
  );
}

export function hasDriverData(
  reservation:
    ReservationData,
) {
  return Boolean(
    reservation.firstName.trim() &&
      reservation.lastName.trim() &&
      reservation.email.trim() &&
      reservation.phone.trim() &&
      reservation.birthDate &&
      reservation.licenseNumber.trim() &&
      reservation.licenseExpiry &&
      reservation.address.trim() &&
      reservation.termsAccepted,
  );
}

/* =========================================================
   STORAGE SANITIZER
========================================================= */

function sanitizeReservation(
  value: unknown,
): ReservationData {
  if (
    !value ||
    typeof value !==
      "object" ||
    Array.isArray(
      value,
    )
  ) {
    return {
      ...defaultReservation,
    };
  }

  const source =
    value as Record<
      string,
      unknown
    >;

  const result:
    ReservationData = {
    ...defaultReservation,
  };

  (
    Object.keys(
      defaultReservation,
    ) as Array<
      keyof ReservationData
    >
  ).forEach(
    (
      key,
    ) => {
      const incoming =
        source[key];

      const expected =
        defaultReservation[
          key
        ];

      if (
        typeof incoming ===
        typeof expected
      ) {
        /*
         * TS cannot infer the matching value
         * type from the runtime typeof check,
         * but this assignment is safe because
         * every ReservationData property is
         * either string or boolean.
         */

        if (
          typeof expected ===
          "boolean"
        ) {
          (
            result[
              key
            ] as boolean
          ) =
            incoming as boolean;
        } else {
          (
            result[
              key
            ] as string
          ) =
            incoming as string;
        }
      }
    },
  );

  return result;
}