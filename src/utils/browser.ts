export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function copyToClipboard(text: string): Promise<void> {
  if (!isBrowser()) {
    return Promise.reject(new Error('Not in browser environment'));
  }
  return navigator.clipboard.writeText(text);
}

