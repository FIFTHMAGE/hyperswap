/**
 * Wrapped API endpoints
 */

export class WrappedAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/wrapped') {
    this.baseUrl = baseUrl;
  }

  async generateWrapped(address: string, year: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, year }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate wrapped');
    }

    return await response.json();
  }

  async getWrapped(address: string, year: number): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/${address}/${year}`
    );

    if (!response.ok) {
      throw new Error('Wrapped not found');
    }

    return await response.json();
  }

  async saveWrapped(address: string, year: number, data: any): Promise<void> {
    await fetch(`${this.baseUrl}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, year, data }),
    });
  }

  async getLeaderboard(year: number, metric: string): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/leaderboard/${year}?metric=${metric}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    return await response.json();
  }
}

export const wrappedAPI = new WrappedAPI();

