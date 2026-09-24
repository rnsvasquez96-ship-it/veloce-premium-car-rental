"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* =========================================================
   ROOT
========================================================= */

function Sheet({
  ...props
}: SheetPrimitive.Root.Props) {
  return (
    <SheetPrimitive.Root
      data-slot="sheet"
      {...props}
    />
  );
}

/* =========================================================
   TRIGGER
========================================================= */

function SheetTrigger({
  ...props
}: SheetPrimitive.Trigger.Props) {
  return (
    <SheetPrimitive.Trigger
      data-slot="sheet-trigger"
      {...props}
    />
  );
}

/* =========================================================
   CLOSE
========================================================= */

function SheetClose({
  ...props
}: SheetPrimitive.Close.Props) {
  return (
    <SheetPrimitive.Close
      data-slot="sheet-close"
      {...props}
    />
  );
}

/* =========================================================
   PORTAL
========================================================= */

function SheetPortal({
  ...props
}: SheetPrimitive.Portal.Props) {
  return (
    <SheetPrimitive.Portal
      data-slot="sheet-portal"
      {...props}
    />
  );
}

/* =========================================================
   OVERLAY
========================================================= */

function SheetOverlay({
  className,
  ...props
}: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      data-lenis-prevent
      className={cn(
        "fixed inset-0 z-50",
        "bg-black/60",
        "supports-backdrop-filter:backdrop-blur-[2px]",
        "transition-opacity duration-300 ease-out",
        "data-starting-style:opacity-0",
        "data-ending-style:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

/* =========================================================
   CONTENT
========================================================= */

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?:
    | "top"
    | "right"
    | "bottom"
    | "left";
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />

      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        data-lenis-prevent
        className={cn(
          "fixed z-50",
          "flex flex-col",
          "bg-popover bg-clip-padding",
          "text-sm text-popover-foreground",
          "shadow-2xl",
          "outline-none",

          "overflow-y-auto overscroll-contain",

          "transition-[transform,opacity] duration-300",
          "ease-[cubic-bezier(.16,1,.3,1)]",

          "data-starting-style:opacity-0",
          "data-ending-style:opacity-0",

          /* bottom */

          "data-[side=bottom]:inset-x-0",
          "data-[side=bottom]:bottom-0",
          "data-[side=bottom]:max-h-[90dvh]",
          "data-[side=bottom]:border-t",
          "data-[side=bottom]:data-starting-style:translate-y-full",
          "data-[side=bottom]:data-ending-style:translate-y-full",

          /* top */

          "data-[side=top]:inset-x-0",
          "data-[side=top]:top-0",
          "data-[side=top]:max-h-[90dvh]",
          "data-[side=top]:border-b",
          "data-[side=top]:data-starting-style:-translate-y-full",
          "data-[side=top]:data-ending-style:-translate-y-full",

          /* left */

          "data-[side=left]:inset-y-0",
          "data-[side=left]:left-0",
          "data-[side=left]:h-dvh",
          "data-[side=left]:w-[85vw]",
          "data-[side=left]:border-r",
          "data-[side=left]:data-starting-style:-translate-x-full",
          "data-[side=left]:data-ending-style:-translate-x-full",
          "data-[side=left]:sm:max-w-sm",

          /* right */

          "data-[side=right]:inset-y-0",
          "data-[side=right]:right-0",
          "data-[side=right]:h-dvh",
          "data-[side=right]:w-[85vw]",
          "data-[side=right]:border-l",
          "data-[side=right]:data-starting-style:translate-x-full",
          "data-[side=right]:data-ending-style:translate-x-full",
          "data-[side=right]:sm:max-w-sm",

          className,
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "absolute right-4 top-4 z-10",
                  "text-muted-foreground",
                  "hover:text-foreground",
                )}
              />
            }
          >
            <XIcon
              aria-hidden="true"
              className="size-4"
            />

            <span className="sr-only">
              Close
            </span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

/* =========================================================
   HEADER
========================================================= */

function SheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-col gap-1 p-4",
        className,
      )}
      {...props}
    />
  );
}

/* =========================================================
   FOOTER
========================================================= */

function SheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 p-4",
        className,
      )}
      {...props}
    />
  );
}

/* =========================================================
   TITLE
========================================================= */

function SheetTitle({
  className,
  ...props
}: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}

/* =========================================================
   DESCRIPTION
========================================================= */

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn(
        "text-sm leading-6 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};