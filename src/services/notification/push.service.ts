/**
 * Push notification service
 * @module services/notification/push
 */

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * Send browser notification
 */
export function sendNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  try {
    return new Notification(title, options);
  } catch {
    return null;
  }
}

/**
 * Send transaction notification
 */
export function notifyTransactionStatus(
  status: 'pending' | 'success' | 'failed',
  txHash: string
): void {
  const messages = {
    pending: 'Transaction submitted',
    success: 'Transaction confirmed',
    failed: 'Transaction failed',
  };

  sendNotification(messages[status], {
    body: `Hash: ${txHash.slice(0, 10)}...`,
    icon: '/icon-192.png',
    tag: txHash,
  });
}

/**
 * Check if notifications are supported
 */
export function areNotificationsSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Check if notifications are enabled
 */
export function areNotificationsEnabled(): boolean {
  return areNotificationsSupported() && Notification.permission === 'granted';
}

