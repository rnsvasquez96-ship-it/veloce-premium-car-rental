"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  {
    number: "01",
    label: "Collection",
    href: "/fleet",
  },
  {
    number: "02",
    label: "Experience",
    href: "/#experience",
  },
  {
    number: "03",
    label: "The journey",
    href: "/#how-it-works",
  },
];

export function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CLOSE MOBILE MENU WHEN DESKTOP NAV RETURNS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => {
      if (query.matches) {
        setMenuOpen(false);
      }
    };

    query.addEventListener("change", handleChange);

    return () => {
      query.removeEventListener("change", handleChange);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | NAVBAR SURFACE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function isActive(href: string) {
    if (href === "/fleet") {
      return pathname.startsWith("/fleet");
    }

    return false;
  }

  return (
    <header
      data-scrolled={scrolled}
      className={[
        "fixed inset-x-0 top-0 z-50 text-white",
        "transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "border-b border-white/10 bg-[#060707]/88 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      {/* subtle bottom highlight */}

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-x-0 bottom-0 h-px",
          "bg-gradient-to-r from-transparent via-white/10 to-transparent",
          "transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <div className="mx-auto flex h-[82px] max-w-[1600px] items-center px-6 lg:h-[88px] lg:px-10">
        {/* =========================================================
            BRAND
        ========================================================== */}

        <div className="flex min-w-0 flex-1 items-center">
          <Link
            href="/"
            aria-label="VELOCE home"
            className="group inline-flex min-h-11 flex-col justify-center"
          >
            <span className="text-[17px] font-semibold uppercase tracking-[0.34em] transition-opacity duration-300 group-hover:opacity-70">
              VELOCE
            </span>

            <span className="mt-1 text-[6px] uppercase tracking-[0.42em] text-white/32">
              Private performance fleet
            </span>
          </Link>
        </div>

        {/* =========================================================
            DESKTOP NAVIGATION
        ========================================================== */}

        <nav
          aria-label="Main navigation"
          className="hidden items-center justify-center lg:flex"
        >
          <div className="flex items-center gap-10 xl:gap-14">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex min-h-11 items-center"
                >
                  <span
                    className={[
                      "text-[8px] uppercase tracking-[0.36em]",
                      "transition-colors duration-300",
                      active
                        ? "text-white"
                        : "text-white/48 group-hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>

                  <span
                    aria-hidden="true"
                    className={[
                      "absolute bottom-[3px] left-0 h-px bg-[#d8ff3e]",
                      "transition-[width] duration-500 ease-out",
                      active
                        ? "w-full"
                        : "w-0 group-hover:w-full",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* =========================================================
            DESKTOP ACTION
        ========================================================== */}

        <div className="flex flex-1 items-center justify-end gap-3">
          <Link
            href="/#reserve"
            className="group hidden min-h-11 items-center gap-7 border border-white/18 px-5 text-[8px] uppercase tracking-[0.34em] text-white/70 transition-all duration-300 hover:border-white hover:bg-white hover:text-black lg:flex"
          >
            Find your drive

            <ArrowUpRight
              size={14}
              strokeWidth={1.3}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

          {/* =====================================================
              MOBILE MENU
          ====================================================== */}

          <Sheet
            open={menuOpen}
            onOpenChange={setMenuOpen}
          >
            <SheetTrigger
              aria-label="Open navigation"
              className="group flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors duration-300 hover:border-white lg:hidden"
            >
              <Menu
                size={18}
                strokeWidth={1.4}
              />
            </SheetTrigger>

            <SheetContent
              showCloseButton={false}
              side="right"
              className="w-full max-w-none overflow-y-auto border-0 bg-[#060707] p-0 text-white sm:max-w-none"
            >
              {/* =================================================
                  MOBILE ARCHITECTURAL BACKGROUND
              ================================================== */}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <div className="absolute left-6 top-0 h-full w-px bg-white/[0.035]" />

                <div className="absolute right-6 top-0 h-full w-px bg-white/[0.035]" />

                <div className="absolute bottom-[22%] left-0 h-px w-full bg-white/[0.025]" />

                <span className="absolute -right-[0.08em] top-[22%] select-none whitespace-nowrap text-[35vw] font-medium uppercase leading-none tracking-[-0.1em] text-white/[0.02]">
                  VELOCE
                </span>
              </div>

              <div className="relative flex min-h-[100svh] flex-col px-6 pb-8 pt-6">
                {/* ===============================================
                    MOBILE HEADER
                ================================================ */}

                <div className="flex items-start justify-between border-b border-white/10 pb-6">
                  <div>
                    <SheetTitle className="text-[17px] font-semibold uppercase tracking-[0.34em] text-white">
                      VELOCE
                    </SheetTitle>

                    <SheetDescription className="mt-2 text-[6px] uppercase tracking-[0.42em] text-white/30">
                      Private performance fleet
                    </SheetDescription>
                  </div>

                  <SheetClose
                    aria-label="Close navigation"
                    className="group flex h-11 w-11 items-center justify-center border border-white/20 transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                  >
                    <X
                      size={18}
                      strokeWidth={1.4}
                    />
                  </SheetClose>
                </div>

                {/* ===============================================
                    MENU LABEL
                ================================================ */}

                <div className="mt-12 flex items-center gap-4">
                  <span className="h-px w-9 bg-[#d8ff3e]" />

                  <p className="text-[7px] uppercase tracking-[0.45em] text-white/32">
                    Discover VELOCE
                  </p>
                </div>

                {/* ===============================================
                    MOBILE NAVIGATION
                ================================================ */}

                <nav
                  aria-label="Mobile navigation"
                  className="mt-8"
                >
                  {navItems.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="group grid min-h-[92px] grid-cols-[42px_1fr_auto] items-center gap-4 border-t border-white/10 first:border-t-0"
                      >
                        <span
                          className={[
                            "text-[7px] tabular-nums tracking-[0.34em]",
                            active
                              ? "text-[#d8ff3e]"
                              : "text-white/20",
                          ].join(" ")}
                        >
                          {item.number}
                        </span>

                        <span
                          className={[
                            "text-[clamp(2rem,9vw,3.3rem)] leading-none tracking-[-0.055em]",
                            "transition-all duration-300",
                            active
                              ? "text-white"
                              : "text-white/65 group-hover:translate-x-1 group-hover:text-white",
                          ].join(" ")}
                        >
                          {item.label}
                        </span>

                        <ArrowUpRight
                          size={18}
                          strokeWidth={1.15}
                          className="text-white/18 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d8ff3e]"
                        />
                      </Link>
                    );
                  })}
                </nav>

                {/* ===============================================
                    MOBILE RESERVE CTA
                ================================================ */}

                <div className="mt-auto pt-12">
                  <Link
                    href="/#reserve"
                    onClick={() => setMenuOpen(false)}
                    className="group flex min-h-[64px] w-full items-center justify-between border-y border-white/15 py-4"
                  >
                    <div>
                      <p className="text-[7px] uppercase tracking-[0.4em] text-white/28">
                        Begin your journey
                      </p>

                      <p className="mt-2 text-xl tracking-[-0.04em] text-white">
                        Find your drive
                      </p>
                    </div>

                    <span className="flex h-11 w-11 items-center justify-center border border-[#d8ff3e]/50 text-[#d8ff3e] transition-all duration-300 group-hover:bg-[#d8ff3e] group-hover:text-black">
                      <ArrowRight
                        size={17}
                        strokeWidth={1.3}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>

                  <div className="mt-8 flex items-center justify-between gap-6">
                    <p className="text-[6px] uppercase tracking-[0.4em] text-white/18">
                      Manila / Philippines
                    </p>

                    <p className="text-[6px] uppercase tracking-[0.4em] text-white/18">
                      Premium car rental
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}