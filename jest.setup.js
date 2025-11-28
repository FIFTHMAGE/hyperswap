import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: jest.fn().mockImplementation(() => null),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  default: {
    manifest: {
      extra: {},
    },
    expoConfig: {
      extra: {},
    },
  },
}));

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    providers: {
      JsonRpcProvider: jest.fn(),
      Web3Provider: jest.fn(),
    },
    Contract: jest.fn(),
    utils: {
      formatEther: jest.fn((val) => val),
      parseEther: jest.fn((val) => val),
      formatUnits: jest.fn((val) => val),
      parseUnits: jest.fn((val) => val),
    },
  },
  JsonRpcProvider: jest.fn(),
  Contract: jest.fn(),
  formatEther: jest.fn((val) => val),
  parseEther: jest.fn((val) => val),
  formatUnits: jest.fn((val) => val),
  parseUnits: jest.fn((val) => val),
}));

// Mock viem
jest.mock('viem', () => ({
  createPublicClient: jest.fn(),
  createWalletClient: jest.fn(),
  http: jest.fn(),
  parseEther: jest.fn((val) => BigInt(val)),
  formatEther: jest.fn((val) => val.toString()),
  parseUnits: jest.fn((val) => BigInt(val)),
  formatUnits: jest.fn((val) => val.toString()),
}));

// Mock wagmi
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    address: undefined,
    isConnected: false,
    isConnecting: false,
    isDisconnected: true,
  })),
  useConnect: jest.fn(() => ({
    connect: jest.fn(),
    connectors: [],
    isLoading: false,
    error: null,
  })),
  useDisconnect: jest.fn(() => ({
    disconnect: jest.fn(),
  })),
  useBalance: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
  })),
  useNetwork: jest.fn(() => ({
    chain: undefined,
    chains: [],
  })),
  useSwitchNetwork: jest.fn(() => ({
    switchNetwork: jest.fn(),
    isLoading: false,
    error: null,
  })),
  WagmiConfig: ({ children }) => children,
}));

// Global test timeout
jest.setTimeout(10000);

// Suppress specific console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    const message = args[0];
    // Filter out known warnings
    if (
      typeof message === 'string' &&
      (message.includes('React Native') ||
        message.includes('Animated') ||
        message.includes('useNativeDriver'))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    const message = args[0];
    // Filter out known errors that are expected in tests
    if (
      typeof message === 'string' &&
      (message.includes('Warning: ReactDOM.render') ||
        message.includes('act(...)'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock matchMedia
global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);
