// Minimal GA4 wrapper. No dependency, no-ops when VITE_GA_ID is unset (dev/local).
type Params = Record<string, string | number | boolean>;

const GA_ID = import.meta.env.VITE_GA_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

if (GA_ID) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  // Report uncaught errors so bugs users hit are visible in GA4 (Reports -> exceptions).
  window.addEventListener('error', (e) => {
    track('exception', { description: `${e.message} @ ${e.filename}:${e.lineno}`, fatal: false });
  });
  window.addEventListener('unhandledrejection', (e) => {
    track('exception', { description: `unhandledrejection: ${String(e.reason)}`, fatal: false });
  });
}

export function track(name: string, params?: Params): void {
  if (GA_ID && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}
