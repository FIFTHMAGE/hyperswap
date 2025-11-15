export interface TwitterShareOptions {
  text: string;
  url?: string;
  hashtags?: string[];
  via?: string;
}

export function shareOnTwitter(options: TwitterShareOptions): void {
  const params = new URLSearchParams();
  
  params.append('text', options.text);
  
  if (options.url) {
    params.append('url', options.url);
  }
  
  if (options.hashtags && options.hashtags.length > 0) {
    params.append('hashtags', options.hashtags.join(','));
  }
  
  if (options.via) {
    params.append('via', options.via);
  }

  const twitterUrl = `https://twitter.com/intent/tweet?${params.toString()}`;
  
  window.open(
    twitterUrl,
    'twitter-share',
    'width=550,height=420,location=yes,scrollbars=yes'
  );
}

export function generateWrappedTweet(stats: {
  transactions: number;
  gasSpent: number;
  chains: number;
}): string {
  return `🎉 My Crypto Wrapped 2024:
  
💸 ${stats.transactions} transactions
⛽ $${stats.gasSpent.toFixed(2)} in gas
🌐 ${stats.chains} chains explored

Check out your own stats! #WalletWrapped #Crypto2024`;
}

