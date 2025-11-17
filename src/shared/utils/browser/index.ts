/**
 * Browser utilities barrel export
 * @module utils/browser
 */

export * from './detection';
export * from './storage';
export * from './clipboard';

export { copyToClipboard, readFromClipboard, isClipboardSupported } from './clipboard';
