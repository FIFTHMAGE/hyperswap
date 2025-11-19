export const connectWallet = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  }
  throw new Error('No wallet found');
};
