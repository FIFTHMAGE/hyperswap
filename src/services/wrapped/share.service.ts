/**
 * Wrapped sharing service
 * @module services/wrapped/share
 */

import { generateShareMessage } from './generator.service';
import type { WrappedStats } from '@/types/wrapped/stats';

/**
 * Share to Twitter
 */
export function shareToTwitter(stats: WrappedStats): void {
  const message = generateShareMessage(stats);
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

/**
 * Share to Facebook
 */
export function shareToFacebook(stats: WrappedStats): void {
  const message = generateShareMessage(stats);
  const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

/**
 * Copy share link
 */
export async function copyShareLink(stats: WrappedStats): Promise<boolean> {
  const message = generateShareMessage(stats);
  
  try {
    await navigator.clipboard.writeText(message);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate share image
 */
export async function generateShareImage(
  stats: WrappedStats,
  elementId: string
): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;
  
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#000000',
    });
    
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob));
    });
  } catch {
    return null;
  }
}

/**
 * Download wrapped as image
 */
export async function downloadWrappedImage(
  stats: WrappedStats,
  elementId: string
): Promise<void> {
  const blob = await generateShareImage(stats, elementId);
  
  if (!blob) {
    throw new Error('Failed to generate image');
  }
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `crypto-wrapped-${stats.year}.png`;
  link.click();
  
  URL.revokeObjectURL(url);
}

