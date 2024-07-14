const ALCHEMY_API_KEY = 'JG3mOl7GCd3oU_skAHEpl7qWDsoyitZA';
const PLACEHOLDER_ADDRESS = `0x4d8152386Ce4aC935d8Cfed93Ae06077025eAd9E`;

export default {
  primaryColor: '#1F2937',
  // Light blue gray
  backgroundColor: '#f4f4f4',
  lightTextColor: '#a0a0a0',
  redColor: '#cc5555',
  greenColor: '#55aa55',
  explorers: {
    ethereum: {
      sepolia: {
        url: 'https://eth-sepolia.blockscout.com/tx/',
      },
    },
    gnosis: {
      chiado: {
        url: 'https://gnosis.blockscout.com/tx/',
      },
    },
    celo: {
      alfajores: {
        url: 'https://explorer.celo.org/alfajores/tx',
      },
    },
    linea: {
      sepolia: {
        url: 'https://explorer.sepolia.linea.build/',
      },
    },
  },
  tokens: {
    USDC: {
      ethereum: {
        sepolia: {
          address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
          decimals: 6,
        },
      },
      polygon: {
        amoy: {
          address: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
          decimals: 6,
        },
      },
    },
  },
  chains: {
    ethereum: {
      sepolia: {
        rpc: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
        chainId: 11155111,
      },
    },
    polygon: {
      amoy: {
        rpc: 'https://rpc-amoy.polygon.technology',
        chainId: 80002,
      },
    },
    scroll: {
      sepolia: {
        rpc: 'https://scroll-rpc.sepolia.io',
        chainId: 534351,
      },
    },
    linea: {
      sepolia: {
        rpc: 'https://linea-sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        chainId: 59141,
      },
    },
    celo: {
      alfajores: {
        rpc: 'https://alfajores-forno.celo-testnet.org',
        chainId: 44787,
      },
    },
    gnosis: {
      chiado: {
        rpc: 'https://1rpc.io/gnosis',
        chainId: 10200,
      },
    },
  },
  safeAddresses: {
    ethereum: {
      sepolia: PLACEHOLDER_ADDRESS,
    },
    polygon: {
      amoy: PLACEHOLDER_ADDRESS,
    },
    scroll: {
      sepolia: PLACEHOLDER_ADDRESS,
    },
    linea: {
      sepolia: PLACEHOLDER_ADDRESS,
    },
    celo: {
      alfajores: PLACEHOLDER_ADDRESS,
    },
    gnosis: {
      chiado: PLACEHOLDER_ADDRESS,
    },
  },
};
