/**
 * GDGC AI Agent — Action Executor & Validation
 *
 * Centralised, secure action system. The AI model returns structured commands
 * which are validated against strict allowlists before execution.
 * No arbitrary code, eval, or window.location manipulation is ever performed.
 */

// ── Site map ────────────────────────────────────────────────────────────
// Maps logical target names to React Router paths or scroll selectors.
export const SITE_MAP = {
  home:      { type: 'route', path: '/' },
  about:     { type: 'route', path: '/about' },
  events:    { type: 'route', path: '/events' },
  community: { type: 'route', path: '/about' },   // community info lives on the About page
  team:      { type: 'route', path: '/team' },
  join:      { type: 'route', path: '/contact' },  // join CTA lives on the Contact page
  contact:   { type: 'route', path: '/contact' },
  footer:    { type: 'scroll', selector: 'footer' },
};

export const ALLOWED_ACTIONS = [
  'navigate', 'scroll', 'highlight', 'back', 'home', 'open_link', 'open_external', 'register',
];

export const ALLOWED_TARGETS = Object.keys(SITE_MAP);

// ── Validation ──────────────────────────────────────────────────────────

/**
 * Validate an action object returned by the AI.
 * Returns { valid: true, action } or { valid: false, reason }.
 */
export function validateAction(action) {
  if (!action || typeof action !== 'object') {
    return { valid: false, reason: 'No action provided.' };
  }

  const type = String(action.type || '').toLowerCase();
  const target = String(action.target || '').toLowerCase();

  if (!ALLOWED_ACTIONS.includes(type)) {
    return { valid: false, reason: `Unknown action type: ${type}` };
  }

  // 'back' action doesn't strictly need a target
  if (type === 'back') {
    return { valid: true, action: { type, target: target || 'home' } };
  }

  if (!ALLOWED_TARGETS.includes(target)) {
    return { valid: false, reason: `Unknown target: ${target}` };
  }

  return {
    valid: true,
    action: {
      type,
      target,
      data: action.data || null,
    },
  };
}

// ── Highlight helper ────────────────────────────────────────────────────

/**
 * Briefly highlight the destination section with a Google-blue glow.
 */
function highlightSection(element) {
  if (!element) return;

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  element.classList.add('gdgc-ai-highlight');
  setTimeout(() => {
    element.classList.remove('gdgc-ai-highlight');
  }, 2000);
}

// ── Scroll helper ───────────────────────────────────────────────────────

/**
 * Smooth-scroll to an element, accounting for the sticky navbar.
 */
function scrollToElement(element) {
  if (!element) return;

  // Navbar height: 64px on mobile (h-16), 80px on desktop (lg:h-20)
  const navbarOffset = window.innerWidth >= 1024 ? 80 : 64;
  const extraPadding = 16;
  const top =
    element.getBoundingClientRect().top +
    window.pageYOffset -
    navbarOffset -
    extraPadding;

  window.scrollTo({ top, behavior: 'smooth' });
}

// ── Main executor ───────────────────────────────────────────────────────

/**
 * Execute a validated agent action.
 *
 * @param {Object}   action      - { type, target, data }
 * @param {Function} navigate    - React Router navigate function
 * @returns {Promise<{ success: boolean, message: string, data?: any }>}
 */
export async function executeAgentAction(action, navigate) {
  const { valid, action: safeAction, reason } = validateAction(action);

  if (!valid) {
    return { success: false, message: reason || 'Invalid action.' };
  }

  const { type, target, data } = safeAction;

  try {
    switch (type) {
      // ── Auto-register for an event ─────────────────────────────────
      case 'register': {
        const entry = SITE_MAP[target] || SITE_MAP.events;
        if (entry && entry.type === 'route') {
          navigate(entry.path);
          await new Promise((r) => setTimeout(r, 350));
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const mainEl = document.querySelector('main');
          if (mainEl) highlightSection(mainEl);
        }

        // Store registration in localStorage for persistence
        try {
          const existing = JSON.parse(localStorage.getItem('gdgc_registrations') || '[]');
          const record = {
            id: `reg-${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...data,
          };
          existing.push(record);
          localStorage.setItem('gdgc_registrations', JSON.stringify(existing));
          window.dispatchEvent(new CustomEvent('gdgc-event-registered', { detail: record }));
        } catch (e) {
          console.warn('LocalStorage save error:', e);
        }

        return { success: true, message: 'Event registration confirmed!', data };
      }

      // ── Navigate to a route ─────────────────────────────────────────
      case 'navigate':
      case 'home': {
        const entry = SITE_MAP[target];
        if (!entry) {
          return { success: false, message: `Unknown target: ${target}` };
        }

        if (entry.type === 'route') {
          navigate(entry.path);

          // After navigation, scroll to top and highlight the main content
          await new Promise((r) => setTimeout(r, 350)); // wait for route transition
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Highlight the first section of the new page
          const mainEl = document.querySelector('main');
          if (mainEl) highlightSection(mainEl);
        } else if (entry.type === 'scroll') {
          const el = document.querySelector(entry.selector);
          if (el) {
            scrollToElement(el);
            await new Promise((r) => setTimeout(r, 600));
            highlightSection(el);
          }
        }

        return { success: true, message: `Navigated to ${target}.` };
      }

      // ── Scroll to a section ─────────────────────────────────────────
      case 'scroll':
      case 'highlight': {
        const entry = SITE_MAP[target];
        if (!entry) {
          return { success: false, message: `Unknown target: ${target}` };
        }

        if (entry.type === 'route') {
          navigate(entry.path);
          await new Promise((r) => setTimeout(r, 350));
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const mainEl = document.querySelector('main');
          if (mainEl) highlightSection(mainEl);
        } else if (entry.type === 'scroll') {
          const el = document.querySelector(entry.selector);
          if (el) {
            scrollToElement(el);
            await new Promise((r) => setTimeout(r, 600));
            highlightSection(el);
          }
        }

        return { success: true, message: `Scrolled to ${target}.` };
      }

      // ── Go back ────────────────────────────────────────────────────
      case 'back': {
        navigate(-1);
        return { success: true, message: 'Went back.' };
      }

      // ── Open external link ─────────────────────────────────────────
      case 'open_link':
      case 'open_external': {
        return {
          success: false,
          message: 'External link navigation is not yet supported.',
        };
      }

      default:
        return { success: false, message: `Unhandled action type: ${type}` };
    }
  } catch (err) {
    console.error('Agent action execution error:', err);
    return { success: false, message: 'Failed to execute the action.' };
  }
}
