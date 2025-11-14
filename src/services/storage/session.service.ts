/**
 * Session management service
 * @module services/storage/session
 */

import { getItem, setItem, removeItem } from '@/utils/browser/storage';

const SESSION_KEY = 'app_session';

export interface SessionData {
  userId?: string;
  walletAddress?: string;
  chainId?: number;
  connectedAt?: number;
  lastActivity?: number;
}

/**
 * Get current session
 */
export function getSession(): SessionData | null {
  return getItem<SessionData>(SESSION_KEY);
}

/**
 * Set session data
 */
export function setSession(data: SessionData): boolean {
  return setItem(SESSION_KEY, {
    ...data,
    lastActivity: Date.now(),
  });
}

/**
 * Update session
 */
export function updateSession(updates: Partial<SessionData>): boolean {
  const current = getSession();
  
  if (!current) {
    return false;
  }

  return setSession({
    ...current,
    ...updates,
  });
}

/**
 * Clear session
 */
export function clearSession(): boolean {
  return removeItem(SESSION_KEY);
}

/**
 * Check if session is active
 */
export function isSessionActive(): boolean {
  const session = getSession();
  
  if (!session) {
    return false;
  }

  // Session expires after 24 hours of inactivity
  const maxInactivityMs = 24 * 60 * 60 * 1000;
  const now = Date.now();

  if (session.lastActivity && now - session.lastActivity > maxInactivityMs) {
    clearSession();
    return false;
  }

  return true;
}

/**
 * Update last activity timestamp
 */
export function touchSession(): boolean {
  return updateSession({ lastActivity: Date.now() });
}

