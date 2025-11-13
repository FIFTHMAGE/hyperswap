export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export async function share(data: ShareData): Promise<boolean> {
  if (!navigator.share) {
    console.warn('Web Share API not supported');
    return fallbackShare(data);
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      // User cancelled
      return false;
    }
    console.error('Share failed:', error);
    return fallbackShare(data);
  }
}

export async function shareFiles(files: File[], data?: Omit<ShareData, 'files'>): Promise<boolean> {
  if (!navigator.canShare || !navigator.canShare({ files })) {
    console.warn('File sharing not supported');
    return false;
  }

  return share({ ...data, files });
}

export async function shareImage(blob: Blob, filename: string, data?: Omit<ShareData, 'files'>): Promise<boolean> {
  const file = new File([blob], filename, { type: blob.type });
  return shareFiles([file], data);
}

function fallbackShare(data: ShareData): boolean {
  // Fallback to clipboard
  if (data.url) {
    navigator.clipboard?.writeText(data.url).then(() => {
      console.log('URL copied to clipboard');
    });
    return true;
  }
  
  if (data.text) {
    navigator.clipboard?.writeText(data.text).then(() => {
      console.log('Text copied to clipboard');
    });
    return true;
  }

  return false;
}

export function canShare(): boolean {
  return 'share' in navigator;
}

export function canShareFiles(): boolean {
  return canShare() && 'canShare' in navigator;
}

