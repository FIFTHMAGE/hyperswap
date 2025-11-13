/**
 * Wrapped sharing utilities
 */

export class WrappedShare {
  static async shareToTwitter(text: string, imageUrl?: string): Promise<void> {
    const tweetText = encodeURIComponent(text);
    const url = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(url, '_blank');
  }

  static async shareToFacebook(url: string): Promise<void> {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  static async shareNative(data: ShareData): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (err) {
        console.error('Share failed:', err);
        return false;
      }
    }
    return false;
  }

  static async copyLink(url: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    }
  }
}

