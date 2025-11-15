'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TxSimulator, TxSimulation } from '@/lib/utils/tx-simulator';

interface Props {
  txData: any;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TransactionPreview({ txData, onConfirm, onCancel }: Props) {
  const [simulation, setSimulation] = useState<TxSimulation | null>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    const result = await TxSimulator.simulate(txData);
    setSimulation(result);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Transaction Preview</h2>
        
        {!simulation ? (
          <button
            onClick={runSimulation}
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg"
          >
            {loading ? 'Simulating...' : 'Simulate Transaction'}
          </button>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Status</span>
                <span className={simulation.success ? 'text-green-600' : 'text-red-600'}>
                  {simulation.success ? 'Will Succeed' : 'Will Fail'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Gas Est.</span>
                <span>{simulation.gasUsed}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-3 bg-gray-200 rounded-lg">
                Cancel
              </button>
              <button onClick={onConfirm} className="flex-1 py-3 bg-blue-500 text-white rounded-lg">
                Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

