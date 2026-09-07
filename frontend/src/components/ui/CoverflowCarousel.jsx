import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/utils/cn";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function CoverflowCarousel({
  slides = [],
  rotate = 32,
  depth = 0.52,
  perspective = 3.2,
  falloff = 0.62,
  fade = 0.12,
  cardWidth = "clamp(230px, 26vw, 330px)",
  cardHeight = "clamp(300px, 35vw, 420px)",
  gap = 0.08,
  loop = true,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  autoplay = true,
  autoplayInterval = 6000,
  label = "Event Cards Carousel",
  className,
  cardClassName,
  onChange,
  renderCaption,
  renderActions,
}) {
  const count = slides.length;

  const frameRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  /** Fractional card index at the center. Single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle animation is headed. */
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

  // Paint 3D transforms straight to the DOM for silky 60fps performance
  const paint = React.useCallback(() => {
    if (!count) return;
    let width = widthRef.current;
    if (!width) {
      const frame = frameRef.current;
      const card = cardRefs.current[0];
      width = card?.offsetWidth || (frame ? Math.min(330, Math.max(230, frame.offsetWidth * 0.26)) : 280);
      widthRef.current = width;
    }
    if (!width) return;

    const pitch = width * (1 + gap);
    const pos = posRef.current;

    for (let index = 0; index < count; index++) {
      const card = cardRefs.current[index];
      if (!card) continue;

      // Fold distance into the shorter way round the ring
      let offset = index - pos;
      if (loop && count > 1) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translate3d(calc(-50% + ${offset * pitch}px), 0px, ${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop && count > 1 ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      const opacityVal = Math.max(0, 1 - fade * distance) * edge;
      card.style.opacity = String(opacityVal);
      card.style.zIndex = String(100 - Math.round(distance));

      // Active card dynamic styling
      const isCenter = distance < 0.5;
      card.setAttribute("data-active", isCenter ? "true" : "false");
    }
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target, initialVelocity = 0) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      targetRef.current = target;
      const nextIndex = indexAt(target);
      setSelected(nextIndex);
      onChange?.(nextIndex, slides[nextIndex]);

      const startPos = posRef.current;
      const diff = target - startPos;
      if (Math.abs(diff) < 0.0002 && Math.abs(initialVelocity) < 0.01) {
        posRef.current = target;
        paint();
        return;
      }

      // Time-based critically damped spring physics for buttery smooth gliding
      const startTime = performance.now();
      const omega = 10.5; // natural angular frequency (smooth glide)
      const A = startPos - target;
      const clampedV0 = Math.max(-12, Math.min(12, initialVelocity));
      const B = clampedV0 + omega * A;
      const maxDuration = 800; // ms safety ceiling

      const step = (now) => {
        const t = (now - startTime) / 1000;
        if (t <= 0) {
          rafRef.current = requestAnimationFrame(step);
          return;
        }

        const exp = Math.exp(-omega * t);
        const currentDiff = (A + B * t) * exp;
        posRef.current = target + currentDiff;
        paint();

        if (Math.abs(currentDiff) < 0.0004 || (now - startTime) >= maxDuration) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }

        rafRef.current = requestAnimationFrame(step);
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, onChange, paint, slides],
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
      const target =
        loop && count > 1
          ? index + Math.round((currentBase - index) / count) * count
          : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by, isUser = false) => {
      if (isUser) {
        lastInteractedRef.current = Date.now();
      }
      settle(clamp(Math.round(targetRef.current) + by), by * 1.8);
    },
    [clamp, settle],
  );

  // Helper to reliably detect which card was clicked/tapped
  const resolveCardAtPoint = React.useCallback(
    (clientX, clientY, targetEl) => {
      const directCard = targetEl?.closest?.("[data-slide-index]");
      if (directCard) {
        const idx = parseInt(directCard.getAttribute("data-slide-index"), 10);
        if (!isNaN(idx)) return idx;
      }

      if (typeof document !== "undefined" && clientX !== undefined && clientY !== undefined) {
        const el = document.elementFromPoint(clientX, clientY)?.closest?.("[data-slide-index]");
        if (el) {
          const idx = parseInt(el.getAttribute("data-slide-index"), 10);
          if (!isNaN(idx)) return idx;
        }
      }

      if (clientX !== undefined && clientY !== undefined && count > 0) {
        let bestIndex = null;
        let minDistance = Infinity;

        for (let i = 0; i < count; i++) {
          const card = cardRefs.current[i];
          if (!card) continue;
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
        }
        if (bestIndex !== null) return bestIndex;
      }

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
          const cardW = widthRef.current || frameRect.width * 0.26;
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

  // Autoplay cycle with pause on hover/interaction
  React.useEffect(() => {
    if (!autoplay || count <= 1) return;

    const interval = setInterval(() => {
      if (
        isHoveredRef.current ||
        isInteractingRef.current ||
        (typeof document !== "undefined" && document.hidden) ||
        Date.now() - lastInteractedRef.current < autoplayInterval * 0.8
      ) {
        return;
      }
      nudge(1, false);
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

    if (!drag.isDragging) {
      if (dist > 8) {
        drag.isDragging = true;
        pressedCardRef.current = null;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.captured = true;
        } catch (_) {}
      } else {
        return;
      }
    }

    const pitch = (widthRef.current || 280) * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - dx / pitch);
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

      const initialV = Math.max(-8, Math.min(8, (drag.v || 0) * 0.4));
      const carried = Math.max(-2, Math.min(2, (drag.v || 0) * 0.22));
      settle(clamp(Math.round(posRef.current + carried)), initialV);
      return;
    }

    let targetIndex = clickedCardIndex;
    if (targetIndex === null || isNaN(targetIndex)) {
      targetIndex = resolveCardAtPoint(event.clientX, event.clientY, event.target);
    }

    if (targetIndex !== null && !isNaN(targetIndex)) {
      goTo(targetIndex);
    } else {
      settle(clamp(Math.round(posRef.current)), 0);
    }
  };

  const onFrameClick = (event) => {
    if (justDraggedRef.current) return;
    const targetIndex = resolveCardAtPoint(event.clientX, event.clientY, event.target);
    if (targetIndex !== null && !isNaN(targetIndex)) {
      goTo(targetIndex);
    }
  };

  // Card measurement and resize observer
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      const measured = card?.offsetWidth || (frame ? Math.min(330, Math.max(230, frame.offsetWidth * 0.26)) : 280);
      if (measured) {
        widthRef.current = measured;
        paint();
      }
    };

    measure();
    const rafId = requestAnimationFrame(measure);
    const tId = setTimeout(measure, 120);
    const observer = new ResizeObserver(measure);
    observer.observe(frame);

    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(tId);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [paint]);

  // Initial 3D entrance fan-out glide
  React.useEffect(() => {
    if (count > 1) {
      posRef.current = -0.7;
      targetRef.current = 0;
      paint();
      const timer = setTimeout(() => {
        settle(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [count, paint, settle]);

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
      className={cn("w-full select-none overflow-hidden py-2", className)}
      style={{
        "--cf-card": cardWidth,
        "--cf-card-h": cardHeight,
      }}
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
              nudge(-1, true);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1, true);
            }
          }}
          onClick={onFrameClick}
          className="cursor-grab py-8 sm:py-12 outline-none ring-primary/40 focus-visible:ring-2 active:cursor-grabbing select-none"
          style={{
            perspective: "1100px",
            perspectiveOrigin: "50% 50%",
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none pointer-events-none"
            style={{
              height: "var(--cf-card-h)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isCenter = index === selected;
              const isBlackout = slide.title?.toUpperCase().includes("BLACKOUT") || slide.isFlagship;

              return (
                <div
                  key={slide.id ?? index}
                  data-slide-index={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="button"
                  tabIndex={0}
                  aria-roledescription="slide"
                  aria-label={`${slide.title || `Slide ${index + 1}`} (${index + 1} of ${count})`}
                  onPointerDown={() => {
                    pressedCardRef.current = index;
                  }}
                  onClick={(e) => {
                    e.preventDefault();
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
                    "group absolute left-1/2 top-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-card shadow-2xl cursor-pointer border select-none pointer-events-auto transition-[box-shadow,border-color] duration-300",
                    isCenter
                      ? "border-primary/80 shadow-[0_15px_40px_rgba(66,133,244,0.25)] ring-2 ring-primary/50"
                      : "border-border/50 hover:border-primary/60 hover:shadow-xl",
                    isBlackout && isCenter && "border-red-500/80 shadow-[0_15px_40px_rgba(234,67,53,0.3)] ring-2 ring-red-500/50",
                    cardClassName,
                  )}
                  style={{
                    width: "var(--cf-card)",
                    height: "var(--cf-card-h)",
                    willChange: "transform, opacity",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
                      {slide.type || "Event"}
                    </span>
                    {slide.domain && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#4285F4]/80 backdrop-blur-md text-white border border-white/20 shadow-sm">
                        {slide.domain}
                      </span>
                    )}
                  </div>

                  {/* Event Image */}
                  <img
                    src={slide.src}
                    alt={slide.alt || slide.title || "Event banner"}
                    draggable={false}
                    loading="lazy"
                    className="h-full w-full select-none object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Cinematic Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                  {/* Bottom Info Glass Scrim */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white pointer-events-none z-20">
                    <h3 className="text-sm sm:text-base font-bold text-white drop-shadow-md line-clamp-2 leading-snug">
                      {slide.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-white/80 drop-shadow-sm mt-1 flex items-center gap-1.5 font-medium">
                      <span>{slide.date}</span>
                      {slide.subtitle?.includes("•") && (
                        <>
                          <span>•</span>
                          <span className="truncate">{slide.subtitle.split("•")[1]?.trim()}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Previous / Next Controls */}
        {showNavigation && count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1, true)}
              className="absolute left-2 sm:left-6 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur-md p-2.5 sm:p-3 shadow-lg border border-border/50 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1, true)}
              className="absolute right-2 sm:right-6 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur-md p-2.5 sm:p-3 shadow-lg border border-border/50 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Expanded Active Event Caption & Actions */}
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
              <p className="mt-1 text-sm sm:text-base text-muted-foreground font-medium flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {active.subtitle}
              </p>
            )}
            {active.meta && active.meta.length > 0 && (
              <dl className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
                {active.meta.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/80 border border-border/60 backdrop-blur-xs shadow-xs"
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

      {/* Pagination Indicator Dots */}
      {showPagination && count > 1 && (
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
