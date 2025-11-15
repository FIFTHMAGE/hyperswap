export function generateShareableURL(
  walletAddress: string,
  baseUrl: string = typeof window !== 'undefined' ? window.location.origin : ''
): string {
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  return `${baseUrl}/wrapped/${walletAddress}?share=true&addr=${encodeURIComponent(shortAddress)}`;
}

export function parseShareableURL(url: string): {
  walletAddress: string | null;
  isShareMode: boolean;
} {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const walletAddress = pathParts[pathParts.indexOf('wrapped') + 1];
    const isShareMode = urlObj.searchParams.get('share') === 'true';

    return {
      walletAddress: walletAddress || null,
      isShareMode,
    };
  } catch {
    return {
      walletAddress: null,
      isShareMode: false,
    };
  }
}

