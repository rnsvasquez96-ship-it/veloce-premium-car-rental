import { ReactNode } from "react";

import { ReservationProvider } from "@/components/reservation/reservation-provider";

export default function ReservationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ReservationProvider>
      {children}
    </ReservationProvider>
  );
}