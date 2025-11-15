export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Camera permission denied:', error);
    return false;
  }
}

export async function scanQRCode(): Promise<string | null> {
  if (!('BarcodeDetector' in window)) {
    console.warn('Barcode Detection API not supported');
    return null;
  }

  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return null;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();

    const barcodeDetector = new (window as any).BarcodeDetector({
      formats: ['qr_code']
    });

    const detectQR = async (): Promise<string | null> => {
      const barcodes = await barcodeDetector.detect(video);
      
      if (barcodes.length > 0) {
        stream.getTracks().forEach(track => track.stop());
        return barcodes[0].rawValue;
      }
      
      return null;
    };

    // Try detecting for 10 seconds
    const timeout = 10000;
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const result = await detectQR();
      if (result) {
        return result;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    stream.getTracks().forEach(track => track.stop());
    return null;

  } catch (error) {
    console.error('QR scanning failed:', error);
    return null;
  }
}

