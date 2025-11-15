export async function generateQRCode(text: string): Promise<string> {
  // Create a simple SVG QR code placeholder
  // In production, use a library like 'qrcode' or 'qr-code-styling'
  const svg = `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">
        ${text.substring(0, 20)}...
      </text>
      <text x="100" y="120" text-anchor="middle" font-size="10" fill="gray">
        QR Code
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function downloadQRCode(dataUrl: string, filename: string = 'wallet-qr.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

