'use client';

import { useAccount } from 'wagmi';
import { WrappedStoryFlow } from '@/components/wrapped/WrappedStoryFlow';
import { ConnectButton } from '@/components/wallet/ConnectButton';

export default function WrappedPage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-white mb-8">
            Your Year On-Chain
          </h1>
          <p className="text-2xl text-white/80 mb-8">
            Connect your wallet to see your 2024 wrapped
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return <WrappedStoryFlow address={address!} />;
}
