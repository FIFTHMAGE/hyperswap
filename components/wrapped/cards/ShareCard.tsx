'use client';

import { StoryCard } from '../StoryCard';
import { Button } from '@/components/ui/Button';

interface ShareCardProps {
  onShare: () => void;
  onDownload: () => void;
}

export function ShareCard({ onShare, onDownload }: ShareCardProps) {
  return (
    <StoryCard gradient="from-purple-900 via-pink-900 to-rose-900">
      <div className="text-center space-y-8">
        <h2 className="text-4xl font-bold text-white">
          Share Your Wrapped
        </h2>
        <p className="text-xl text-white/70">
          Show off your year on-chain
        </p>
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <Button
            onClick={onDownload}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Download as Image
          </Button>
          <Button
            onClick={onShare}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Share on Social
          </Button>
        </div>
        <p className="text-sm text-white/50 mt-8">
          Made with Wallet Wrapped
        </p>
      </div>
    </StoryCard>
  );
}

