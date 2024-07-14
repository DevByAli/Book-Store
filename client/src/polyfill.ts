if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}
(window as any).process = { env: { DEBUG: undefined } };
