import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function CoverflowCarousel({
  slides = [],
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(148px, 22vw, 260px)",
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  autoplay = true,
  autoplayInterval = 4500,
  label = "Cover carousel",
  className,
  cardClassName,
  onChange,
  renderCaption,
  renderActions,
}) {
  const count = slides.length;

  const frameRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const isHoveredRef = React.useRef(false);
  const isInteractingRef = React.useRef(false);
  const lastInteractedRef = React.useRef(Date.now());
  const pressedCardRef = React.useRef(null);
  const justDraggedRef = React.useRef(false);

  const [selected, setSelected] = React.useState(0);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos) => {
      if (!count) return 0;
      return ((Math.round(pos) % count) + count) % count;
    },
    [count],
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    if (!count) return;
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop && count > 1) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible.
      const edge = loop && count > 1 ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      const nextIndex = indexAt(target);
      setSelected(nextIndex);
      onChange?.(nextIndex, slides[nextIndex]);

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // ponytail: exponential ease-out, not a spring. Swap in a spring only
        // if the settle needs overshoot.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index) => {
      if (!count) return;
      lastInteractedRef.current = Date.now();
      const currentBase = Math.round(posRef.current);
      // Take the shorter way round rather than unwinding the whole ring.
      const target =
        loop && count > 1
          ? index + Math.round((currentBase - index) / count) * count
          : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by) => {
      lastInteractedRef.current = Date.now();
      settle(clamp(Math.round(targetRef.current) + by));
    },
    [clamp, settle],
  );

  // Helper to reliably detect which card was clicked/tapped under any browser environment
  const resolveCardAtPoint = React.useCallback(
    (clientX, clientY, targetEl) => {
      // Layer 1: Direct DOM element check
      const directCard = targetEl?.closest?.("[data-slide-index]");
      if (directCard) {
        const idx = parseInt(directCard.getAttribute("data-slide-index"), 10);
        if (!isNaN(idx)) return idx;
      }

      // Layer 2: document.elementFromPoint check
      if (typeof document !== "undefined" && clientX !== undefined && clientY !== undefined) {
        const el = document.elementFromPoint(clientX, clientY)?.closest?.("[data-slide-index]");
        if (el) {
          const idx = parseInt(el.getAttribute("data-slide-index"), 10);
          if (!isNaN(idx)) return idx;
        }
      }

      // Layer 3: Check projected 2D bounding boxes of all card elements
      if (clientX !== undefined && clientY !== undefined && count > 0) {
        let bestIndex = null;
        let minDistance = Infinity;

        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          ) {
            let offset = i - posRef.current;
            if (loop && count > 1) {
              offset = ((offset % count) + count) % count;
              if (offset > count / 2) offset -= count;
            }
            const dist = Math.abs(offset);
            if (dist < minDistance) {
              minDistance = dist;
              bestIndex = i;
            }
          }
        });

        if (bestIndex !== null) return bestIndex;
      }

      // Layer 4: Geometric horizontal offset fallback relative to carousel center
      if (frameRef.current && clientX !== undefined) {
        const frameRect = frameRef.current.getBoundingClientRect();
        if (
          clientX >= frameRect.left &&
          clientX <= frameRect.right &&
          clientY >= frameRect.top &&
          clientY <= frameRect.bottom
        ) {
          const centerX = frameRect.left + frameRect.width / 2;
          const clickOffset = clientX - centerX;
          const cardW = widthRef.current || frameRect.width * 0.22;
          const pitch = cardW * (1 + gap);

          if (Math.abs(clickOffset) > cardW * 0.35) {
            const step = Math.sign(clickOffset) * Math.max(1, Math.round(Math.abs(clickOffset) / pitch));
            return indexAt(Math.round(posRef.current) + step);
          }
        }
      }

      return null;
    },
    [count, gap, indexAt, loop],
  );

  // Autoplay loop with auto-pause on hover, touch, and recent interaction
  React.useEffect(() => {
    if (!autoplay || count <= 1) return;

    const interval = setInterval(() => {
      if (
        isHoveredRef.current ||
        isInteractingRef.current ||
        (typeof document !== "undefined" && document.hidden) ||
        Date.now() - lastInteractedRef.current < 3000
      ) {
        return;
      }
      nudge(1);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, count, nudge]);

  const onPointerDown = (event) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    isInteractingRef.current = true;
    lastInteractedRef.current = Date.now();

    // Check which card was targeted
    const cardIdx = resolveCardAtPoint(event.clientX, event.clientY, event.target);
    pressedCardRef.current = cardIdx;

    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
      startTime: performance.now(),
      isDragging: false,
      captured: false,
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const dist = Math.hypot(dx, dy);

    // Only engage dragging if movement exceeds threshold (8px)
    if (!drag.isDragging) {
      if (dist > 8) {
        drag.isDragging = true;
        pressedCardRef.current = null; // Movement invalidates simple tap/click
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.captured = true;
        } catch (_) {}
      } else {
        return; // Preserve clean click on micro-movement
      }
    }

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - dx / pitch);
    // Cards per second, for momentum throw
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    isInteractingRef.current = false;
    lastInteractedRef.current = Date.now();

    if (drag.captured) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch (_) {}
    }

    const wasDragging = drag.isDragging;
    const totalDist = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    const clickedCardIndex = pressedCardRef.current;
    dragRef.current = null;
    pressedCardRef.current = null;

    if (wasDragging || totalDist > 10) {
      justDraggedRef.current = true;
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 250);

      const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
      settle(clamp(Math.round(posRef.current + carried)));
      return;
    }

    // User clicked or tapped a card without dragging
    let targetIndex = clickedCardIndex;
    if (targetIndex === null || isNaN(targetIndex)) {
      targetIndex = resolveCardAtPoint(event.clientX, event.clientY, event.target);
    }

    if (targetIndex !== null && !isNaN(targetIndex)) {
      goTo(targetIndex);
    } else {
      settle(clamp(Math.round(posRef.current)));
    }
  };

  const onFrameClick = (event) => {
    if (justDraggedRef.current) return;
    const targetIndex = resolveCardAtPoint(event.clientX, event.clientY, event.target);
    if (targetIndex !== null && !isNaN(targetIndex)) {
      goTo(targetIndex);
    }
  };

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // Sync selected index when slides list changes (e.g., search/tabs filtering)
  React.useEffect(() => {
    if (count > 0) {
      if (selected >= count) {
        setSelected(0);
        posRef.current = 0;
        targetRef.current = 0;
      }
      paint();
    }
  }, [count, paint, selected]);

  if (!slides || slides.length === 0) return null;

  const active = slides[selected];

  return (
    <div
      className={cn("w-full select-none", className)}
      style={{ "--cf-card": cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          onClick={onFrameClick}
          // Vertical padding keeps the drop shadows clear of the overflow clip.
          className="cursor-grab overflow-hidden py-8 sm:py-12 outline-none ring-primary/40 focus-visible:ring-2 active:cursor-grabbing select-none"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none pointer-events-none"
            style={{
              height: "var(--cf-card)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                data-slide-index={index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                role="button"
                tabIndex={0}
                aria-roledescription="slide"
                aria-label={`${slide.title || `Slide ${index + 1}`} (${index + 1} of ${count})`}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  pressedCardRef.current = index;
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (justDraggedRef.current) return;
                  goTo(index);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goTo(index);
                  }
                }}
                className={cn(
                  "absolute left-1/2 top-0 aspect-square overflow-hidden rounded-2xl sm:rounded-3xl bg-muted shadow-2xl will-change-transform cursor-pointer border border-border/40 transition-[border-color,box-shadow] duration-300 hover:border-primary/70 hover:shadow-primary/20 select-none pointer-events-auto",
                  cardClassName,
                )}
                style={{ width: "var(--cf-card)" }}
              >
                <img
                  src={slide.src}
                  alt={slide.alt || slide.title || "Event photo"}
                  draggable={false}
                  loading="lazy"
                  className="h-full w-full select-none object-cover pointer-events-none"
                />
                {/* Subtle sheen gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
                {slide.title && (
                  <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold drop-shadow-md truncate sm:hidden pointer-events-none">
                    {slide.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-2 sm:left-6 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur-md p-2.5 sm:p-3 shadow-lg border border-border/50 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-2 sm:right-6 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur-md p-2.5 sm:p-3 shadow-lg border border-border/50 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {showCaption && (
        renderCaption ? (
          renderCaption(active, selected)
        ) : active?.title ? (
          <div
            key={selected}
            className="mt-4 flex flex-col items-center px-4 sm:px-6 text-center transition-all duration-300"
          >
            <p className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
              {active.title}
            </p>
            {active.subtitle && (
              <p className="mt-1 text-sm sm:text-base text-muted-foreground font-medium">
                {active.subtitle}
              </p>
            )}
            {active.meta && active.meta.length > 0 && (
              <dl className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
                {active.meta.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/80 border border-border/60 backdrop-blur-xs"
                  >
                    <dt className="text-muted-foreground font-medium">{row.label}:</dt>
                    <dd className="font-semibold text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {active.description && (
              <p className="mt-3 text-sm text-muted-foreground max-w-xl line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {active.description}
              </p>
            )}
            {renderActions ? (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {renderActions(active, selected)}
              </div>
            ) : active.actions ? (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {active.actions}
              </div>
            ) : null}
          </div>
        ) : null
      )}

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                index === selected
                  ? "w-7 bg-primary opacity-100 shadow-sm"
                  : "w-2 bg-muted-foreground/30 opacity-60 hover:opacity-100",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
