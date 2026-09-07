/**
 * The reveal engine, as a string, injected inline into <head>.
 *
 * It is deliberately NOT a React component. Scroll-reveal that depends on
 * hydration is how content ends up invisible until a hard refresh: if the
 * bundle is slow, throttled, or a hydration error occurs, the animation never
 * starts and the page has holes in it.
 *
 * So: this runs synchronously before first paint, adds `html.js` (which is what
 * makes `.reveal` elements start hidden — see globals.css), and then sweeps on
 * its own. If it never runs, nothing is ever hidden and the page simply renders.
 *
 * It also re-queries the DOM on each sweep rather than caching a node list, so
 * anything React mounts later — a filtered product grid, a new route — is picked
 * up without any registration step.
 */
export const REVEAL_ENGINE = `
(function () {
  var d = document, r = d.documentElement;
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  } catch (e) { return; }

  r.classList.add('js');

  var frame = 0;

  function sweep() {
    frame = 0;
    var els = d.querySelectorAll('[data-reveal]:not(.is-in)');
    if (!els.length) return;
    var vh = window.innerHeight || 800;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var top = el.getBoundingClientRect().top;
      // Entered the lower 92% of the viewport, or already scrolled past it.
      if (top < vh * 0.92) el.classList.add('is-in');
    }
  }

  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(sweep);
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('orientationchange', schedule, { passive: true });
  addEventListener('pageshow', schedule);
  d.addEventListener('readystatechange', schedule);
  d.addEventListener('DOMContentLoaded', schedule);
  addEventListener('load', schedule);

  // Catch late mounts (client navigation, filtered lists) without a
  // MutationObserver firing on every DOM change.
  var ticks = 0;
  var poll = setInterval(function () {
    sweep();
    if (++ticks > 40) clearInterval(poll); // ~10s, then scroll events take over
  }, 250);

  sweep();
})();
`;
