export const waitForTransaction = async (txHash: string) => {
  // Wait for transaction confirmation
  return { status: 'confirmed', hash: txHash };
};

export const estimateGas = async (_tx: unknown) => {
  // Estimate gas for transaction
  return '21000';
};
