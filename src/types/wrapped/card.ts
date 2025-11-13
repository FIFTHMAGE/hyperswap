/**
 * Wrapped card configuration types
 * @module types/wrapped/card
 */

/**
 * Wrapped story card types
 */
export type CardType =
  | 'welcome'
  | 'transactions'
  | 'gas_spent'
  | 'top_tokens'
  | 'nft_activity'
  | 'defi_protocols'
  | 'chain_distribution'
  | 'achievements'
  | 'comparison'
  | 'share';

/**
 * Card configuration
 */
export interface CardConfig {
  type: CardType;
  title: string;
  subtitle?: string;
  order: number;
  enabled: boolean;
  animation?: CardAnimation;
  theme?: CardTheme;
}

/**
 * Card animation settings
 */
export interface CardAnimation {
  type: 'fade' | 'slide' | 'zoom' | 'flip';
  duration: number;
  delay?: number;
  easing?: string;
}

/**
 * Card theme
 */
export interface CardTheme {
  background: string;
  textColor: string;
  accentColor: string;
  gradient?: {
    from: string;
    to: string;
    direction?: string;
  };
}

/**
 * Story flow configuration
 */
export interface StoryFlowConfig {
  cards: CardConfig[];
  autoPlay: boolean;
  autoPlayInterval: number;
  showProgress: boolean;
  allowSkip: boolean;
  enableKeyboardNav: boolean;
}

