"use client";

import {
  useEffect,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import {
  cancelFrame,
  frame,
} from "motion/react";

import "lenis/dist/lenis.css";

export function CampaignRuntime() {
  const pathname =
    usePathname();

  const cursor =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    const motionPreference =
      window.matchMedia(
        "(prefers-reduced-motion: no-preference)",
      );

    const finePointer =
      window.matchMedia(
        "(pointer: fine)",
      );

    let dispose =
      () => {};

    function setup() {
      dispose();

      dispose =
        () => {};

      /*
      |--------------------------------------------------------------------------
      | RESERVATION ROUTES
      |--------------------------------------------------------------------------
      |
      | Keep transactional pages calm and predictable.
      | No Lenis / reveal choreography there.
      |
      */

      if (
        !motionPreference.matches ||
        pathname.startsWith(
          "/reserve",
        )
      ) {
        return;
      }

      let alive =
        true;

      let ticking =
        false;

      let mutationFrame:
        number | null =
        null;

      const animations =
        new Map<
          Element,
          Animation
        >();

      const pending =
        new Set<Element>();

      const observed =
        new WeakSet<Element>();

      /*
      |--------------------------------------------------------------------------
      | REVEAL OBSERVER
      |--------------------------------------------------------------------------
      */

      const revealObserver =
        new IntersectionObserver(
          (
            entries,
          ) => {
            if (!alive) {
              return;
            }

            for (
              const entry of
              entries
            ) {
              const {
                isIntersecting,
                target,
              } =
                entry;

              if (
                !isIntersecting ||
                !target.isConnected ||
                !pending.has(
                  target,
                )
              ) {
                continue;
              }

              revealObserver.unobserve(
                target,
              );

              pending.delete(
                target,
              );

              const element =
                target as HTMLElement;

              const masked =
                element.dataset
                  .reveal ===
                "mask";

              const delay =
                Number(
                  element.dataset
                    .delay ||
                    0,
                );

              const animation =
                element.animate(
                  masked
                    ? [
                        {
                          clipPath:
                            "inset(12% 8% 12% 8%)",
                          opacity:
                            0.2,
                        },
                        {
                          clipPath:
                            "inset(0% 0% 0% 0%)",
                          opacity:
                            1,
                        },
                      ]
                    : [
                        {
                          opacity:
                            0,
                          transform:
                            "translate3d(0, 32px, 0)",
                        },
                        {
                          opacity:
                            1,
                          transform:
                            "translate3d(0, 0, 0)",
                        },
                      ],
                  {
                    duration:
                      masked
                        ? 1250
                        : 900,

                    delay,

                    easing:
                      "cubic-bezier(.16,1,.3,1)",

                    fill:
                      "backwards",
                  },
                );

              animations.set(
                target,
                animation,
              );

              animation.onfinish =
                () => {
                  animations.delete(
                    target,
                  );
                };

              if (
                document.hidden
              ) {
                animation.pause();
              }
            }
          },
          {
            threshold:
              0.12,

            rootMargin:
              "0px 0px -5% 0px",
          },
        );

      /*
      |--------------------------------------------------------------------------
      | DISCOVER REVEALS
      |--------------------------------------------------------------------------
      */

      function discover() {
        if (!alive) {
          return;
        }

        for (
          const element of
          pending
        ) {
          if (
            !element.isConnected
          ) {
            revealObserver.unobserve(
              element,
            );

            pending.delete(
              element,
            );
          }
        }

        for (
          const [
            element,
            animation,
          ] of animations
        ) {
          if (
            !element.isConnected
          ) {
            animation.onfinish =
              null;

            animation.cancel();

            animations.delete(
              element,
            );
          }
        }

        document
          .querySelectorAll(
            "[data-reveal]",
          )
          .forEach(
            (
              element,
            ) => {
              if (
                observed.has(
                  element,
                )
              ) {
                return;
              }

              observed.add(
                element,
              );

              pending.add(
                element,
              );

              revealObserver.observe(
                element,
              );
            },
          );
      }

      /*
      |--------------------------------------------------------------------------
      | LENIS
      |--------------------------------------------------------------------------
      */

      const lenis =
        finePointer.matches
          ? new Lenis({
              lerp:
                0.085,

              smoothWheel:
                true,

              syncTouch:
                false,

              anchors:
                false,

              stopInertiaOnNavigate:
                true,

              prevent: (
                node,
              ) =>
                Boolean(
                  node.closest(
                    [
                      '[data-slot="sheet-content"]',
                      "[data-lenis-prevent]",
                      "input",
                      "select",
                      "textarea",
                    ].join(
                      ",",
                    ),
                  ),
                ),
            })
          : null;

      const tick = ({
        timestamp,
      }: {
        timestamp: number;
      }) => {
        if (!alive) {
          return;
        }

        lenis?.raf(
          timestamp,
        );
      };

      /*
      |--------------------------------------------------------------------------
      | UI LOCK STATE
      |--------------------------------------------------------------------------
      */

      function sheetOpen() {
        return Boolean(
          document.querySelector(
            '[data-slot="sheet-content"][data-state="open"]',
          ),
        );
      }

      function syncRuntime() {
        if (!alive) {
          return;
        }

        const blocked =
          document.hidden ||
          sheetOpen();

        if (lenis) {
          if (blocked) {
            lenis.stop();

            if (
              ticking
            ) {
              cancelFrame(
                tick,
              );

              ticking =
                false;
            }
          } else {
            lenis.start();

            if (
              !ticking
            ) {
              frame.update(
                tick,
                true,
              );

              ticking =
                true;
            }
          }
        }

        for (
          const animation of
          animations.values()
        ) {
          if (
            document.hidden
          ) {
            animation.pause();
          } else if (
            animation.playState ===
            "paused"
          ) {
            animation.play();
          }
        }
      }

      /*
      |--------------------------------------------------------------------------
      | BATCH DOM MUTATIONS
      |--------------------------------------------------------------------------
      |
      | Important for the Three.js section.
      |
      | We do NOT query the full document repeatedly for every
      | individual React DOM mutation.
      |
      */

      function scheduleRefresh() {
        if (
          mutationFrame !==
          null
        ) {
          return;
        }

        mutationFrame =
          window.requestAnimationFrame(
            () => {
              mutationFrame =
                null;

              discover();

              syncRuntime();
            },
          );
      }

      const mutationObserver =
        new MutationObserver(
          scheduleRefresh,
        );

      mutationObserver.observe(
        document.body,
        {
          childList:
            true,

          subtree:
            true,

          attributes:
            true,

          attributeFilter: [
            "data-state",
          ],
        },
      );

      /*
      |--------------------------------------------------------------------------
      | INITIALIZE
      |--------------------------------------------------------------------------
      */

      discover();

      syncRuntime();

      document.addEventListener(
        "visibilitychange",
        syncRuntime,
      );

      /*
      |--------------------------------------------------------------------------
      | SAME-PAGE ANCHORS
      |--------------------------------------------------------------------------
      */

      function handleAnchorClick(
        event:
          MouseEvent,
      ) {
        if (
          !lenis ||
          event.defaultPrevented ||
          event.button !==
            0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          sheetOpen()
        ) {
          return;
        }

        const eventTarget =
          event.target;

        if (
          !(
            eventTarget instanceof
            Element
          )
        ) {
          return;
        }

        const link =
          eventTarget.closest<HTMLAnchorElement>(
            "a[href]",
          );

        if (
          !link ||
          link.hasAttribute(
            "download",
          ) ||
          (
            link.target &&
            link.target !==
              "_self"
          )
        ) {
          return;
        }

        const url =
          new URL(
            link.href,
            window.location.href,
          );

        /*
         * Preserve native skip-link
         * focus behavior.
         */
        if (
          url.hash ===
          "#main-content"
        ) {
          return;
        }

        if (
          url.origin !==
            window.location
              .origin ||
          url.pathname !==
            window.location
              .pathname ||
          url.search !==
            window.location
              .search ||
          !url.hash
        ) {
          return;
        }

        let target:
          HTMLElement | null =
          null;

        try {
          target =
            document.getElementById(
              decodeURIComponent(
                url.hash.slice(
                  1,
                ),
              ),
            );
        } catch {
          return;
        }

        if (!target) {
          return;
        }

        event.preventDefault();

        window.history.pushState(
          null,
          "",
          url.hash,
        );

        lenis.scrollTo(
          target,
          {
            offset:
              -96,

            duration:
              1.15,
          },
        );
      }

      window.addEventListener(
        "click",
        handleAnchorClick,
      );

      /*
      |--------------------------------------------------------------------------
      | PREMIUM POINTER HALO
      |--------------------------------------------------------------------------
      */

      const halo =
        cursor.current;

      function moveCursor(
        event:
          PointerEvent,
      ) {
        if (
          !halo ||
          !finePointer.matches ||
          event.pointerType !==
            "mouse"
        ) {
          return;
        }

        halo.style.transform =
          `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;

        halo.dataset.visible =
          "true";

        const target =
          event.target;

        if (
          !(
            target instanceof
            Element
          )
        ) {
          halo.dataset.active =
            "false";

          halo.dataset.label =
            "";

          return;
        }

        const interactive =
          target.closest(
            [
              "a",
              "button",
              "select",
              "input",
              '[role="button"]',
            ].join(","),
          );

        const cursorTarget =
          target.closest(
            "[data-cursor]",
          );

        halo.dataset.active =
          interactive
            ? "true"
            : "false";

        halo.dataset.label =
          cursorTarget?.getAttribute(
            "data-cursor",
          ) ||
          "";
      }

      function hideCursor() {
        if (!halo) {
          return;
        }

        halo.dataset.visible =
          "false";

        halo.dataset.active =
          "false";

        halo.dataset.label =
          "";
      }

      document.addEventListener(
        "pointermove",
        moveCursor,
        {
          passive:
            true,
        },
      );

      document.addEventListener(
        "pointerleave",
        hideCursor,
      );

      document.addEventListener(
        "keydown",
        hideCursor,
      );

      window.addEventListener(
        "blur",
        hideCursor,
      );

      /*
      |--------------------------------------------------------------------------
      | CLEANUP
      |--------------------------------------------------------------------------
      */

      dispose = () => {
        if (!alive) {
          return;
        }

        alive =
          false;

        revealObserver.disconnect();

        mutationObserver.disconnect();

        pending.clear();

        for (
          const animation of
          animations.values()
        ) {
          animation.onfinish =
            null;

          animation.cancel();
        }

        animations.clear();

        if (
          mutationFrame !==
          null
        ) {
          window.cancelAnimationFrame(
            mutationFrame,
          );

          mutationFrame =
            null;
        }

        cancelFrame(
          tick,
        );

        ticking =
          false;

        lenis?.destroy();

        document.removeEventListener(
          "visibilitychange",
          syncRuntime,
        );

        window.removeEventListener(
          "click",
          handleAnchorClick,
        );

        document.removeEventListener(
          "pointermove",
          moveCursor,
        );

        document.removeEventListener(
          "pointerleave",
          hideCursor,
        );

        document.removeEventListener(
          "keydown",
          hideCursor,
        );

        window.removeEventListener(
          "blur",
          hideCursor,
        );

        hideCursor();
      };
    }

    setup();

    motionPreference.addEventListener(
      "change",
      setup,
    );

    finePointer.addEventListener(
      "change",
      setup,
    );

    return () => {
      dispose();

      motionPreference.removeEventListener(
        "change",
        setup,
      );

      finePointer.removeEventListener(
        "change",
        setup,
      );
    };
  }, [
    pathname,
  ]);

  return (
    <>
      <div
        ref={cursor}
        aria-hidden="true"
        className="campaign-cursor"
      >
        <span />
      </div>

      {pathname.startsWith(
        "/fleet",
      ) && (
        <div
          key={
            pathname
          }
          aria-hidden="true"
          className="route-veil"
        >
          <span>
            VELOCE
          </span>
        </div>
      )}
    </>
  );
}