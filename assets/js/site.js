/* Sitewide chrome behavior: theme toggle + mobile nav.
   External (not inline) so Chirpy's compress_html can't collapse newlines into
   line comments. Shares Chirpy's localStorage key "theme" and data-bs-theme
   attribute so the toggle and Chirpy's own loader/system-watcher stay in sync. */
(function () {
  var KEY = 'theme';
  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function stored() {
    return localStorage.getItem(KEY) || 'system';
  }

  function resolve(mode) {
    if (mode === 'dark' || mode === 'light') {
      return mode;
    }
    return mq.matches ? 'dark' : 'light';
  }

  function apply(mode) {
    root.setAttribute('data-bs-theme', resolve(mode));
  }

  /* Re-assert on load so bespoke surfaces agree with the stored choice. */
  apply(stored());

  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      /* Flip the currently visible theme — every click changes appearance.
         Before any click the site follows the OS (system); a click pins a choice. */
      var cur = root.getAttribute('data-bs-theme') || resolve('system');
      var next = cur === 'dark' ? 'light' : 'dark';
      localStorage.setItem(KEY, next);
      apply(next);
      btn.setAttribute('aria-label', 'Switch to ' + (next === 'dark' ? 'light' : 'dark') + ' theme');
      btn.setAttribute('title', next + ' theme');
    });
  }

  /* Follow the system only while in system mode. */
  mq.addEventListener('change', function () {
    if (stored() === 'system') {
      apply('system');
    }
  });

  /* Mobile nav disclosure */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
