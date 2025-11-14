/**
 * Download wrapped summary button
 * @module components/wrapped/DownloadButton
 */

'use client';

import { styled } from 'nativewind';
import { Button } from '../ui';

interface DownloadButtonProps {
  onDownload: () => Promise<void>;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload }) => {
  const handleDownload = async () => {
    try {
      await onDownload();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download Summary
    </Button>
  );
};

export default styled(DownloadButton);

