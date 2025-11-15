let deferredPrompt: any = null;

export function initInstallPrompt() {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Dispatch custom event
    const event = new CustomEvent('pwa-installable', {
      detail: { canInstall: true },
    });
    window.dispatchEvent(event);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    
    const event = new CustomEvent('pwa-installed');
    window.dispatchEvent(event);
  });
}

export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  deferredPrompt = null;
  return outcome === 'accepted';
}

export function isInstallable(): boolean {
  return deferredPrompt !== null;
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

