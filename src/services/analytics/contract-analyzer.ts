export interface ContractInteraction {
  address: string;
  name?: string;
  interactionCount: number;
  firstInteraction: string;
  lastInteraction: string;
  methods: string[];
}

export function analyzeContractInteractions(
  transactions: any[]
): ContractInteraction[] {
  const contractMap = new Map<string, ContractInteraction>();

  transactions.forEach(tx => {
    if (tx.to_address && tx.log_events && tx.log_events.length > 0) {
      const address = tx.to_address.toLowerCase();
      
      if (!contractMap.has(address)) {
        contractMap.set(address, {
          address,
          name: tx.to_address_label,
          interactionCount: 0,
          firstInteraction: tx.block_signed_at,
          lastInteraction: tx.block_signed_at,
          methods: [],
        });
      }

      const contract = contractMap.get(address)!;
      contract.interactionCount++;
      contract.lastInteraction = tx.block_signed_at;

      // Extract method names from log events
      tx.log_events.forEach((event: any) => {
        if (event.decoded?.name && !contract.methods.includes(event.decoded.name)) {
          contract.methods.push(event.decoded.name);
        }
      });
    }
  });

  return Array.from(contractMap.values())
    .sort((a, b) => b.interactionCount - a.interactionCount);
}

