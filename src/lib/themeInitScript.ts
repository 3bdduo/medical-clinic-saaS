// Injected via <script dangerouslySetInnerHTML> in the root layout, BEFORE
// any React hydration or CSS paint, so there is never a flash of the wrong
// theme. Reads localStorage synchronously and applies the class immediately.
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('clinic-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;
