export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: { attempts?: number; delay?: number } = {}
): Promise<T> {
  const { attempts = 3, delay = 1000 } = options;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
  
  throw new Error('Retry failed');
}

export async function timeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage = 'Timeout exceeded'
): Promise<T> {
  return Promise.race([
    promise,
    sleep(ms).then(() => Promise.reject(new Error(errorMessage))),
  ]);
}

export async function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): Promise<ReturnType<T>> {
  await sleep(ms);
  return fn();
}

