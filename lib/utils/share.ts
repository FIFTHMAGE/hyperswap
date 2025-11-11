import html2canvas from 'html2canvas';

export async function downloadAsImage(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    throw error;
  }
}

export async function shareOnSocial(text: string, url: string): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Wallet Wrapped',
        text,
        url,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  } else {
    // Fallback: copy to clipboard
    const fullText = `${text}\n${url}`;
    await navigator.clipboard.writeText(fullText);
    alert('Link copied to clipboard!');
  }
}

