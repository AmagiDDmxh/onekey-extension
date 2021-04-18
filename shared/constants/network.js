export const ROPSTEN = 'ropsten';
export const RINKEBY = 'rinkeby';
export const KOVAN = 'kovan';
export const MAINNET = 'mainnet';
export const GOERLI = 'goerli';
export const HECO = 'heco';
export const BSC = 'bsc';
export const MATIC = 'matic';
export const NETWORK_TYPE_RPC = 'rpc';

export const MAINNET_NETWORK_ID = '1';
export const ROPSTEN_NETWORK_ID = '3';
export const RINKEBY_NETWORK_ID = '4';
export const GOERLI_NETWORK_ID = '5';
export const KOVAN_NETWORK_ID = '42';
export const HECO_NETWORK_ID = '128';
export const BSC_NETWORK_ID = '56';
export const MATIC_NETWORK_ID = '137';

export const MAINNET_CHAIN_ID = '0x1';
export const ROPSTEN_CHAIN_ID = '0x3';
export const RINKEBY_CHAIN_ID = '0x4';
export const GOERLI_CHAIN_ID = '0x5';
export const KOVAN_CHAIN_ID = '0x2a';
export const HECO_CHAIN_ID = '0x80';
export const BSC_CHAIN_ID = '0x38';
export const MATIC_CHAIN_ID = '0x89';

/**
 * The largest possible chain ID we can handle.
 * Explanation: https://gist.github.com/rekmarks/a47bd5f2525936c4b8eee31a16345553
 */
export const MAX_SAFE_CHAIN_ID = 4503599627370476;

export const ROPSTEN_DISPLAY_NAME = 'Ropsten';
export const RINKEBY_DISPLAY_NAME = 'Rinkeby';
export const KOVAN_DISPLAY_NAME = 'Kovan';
export const MAINNET_DISPLAY_NAME = 'Ethereum Mainnet';
export const GOERLI_DISPLAY_NAME = 'Goerli';
export const HECO_DISPLAY_NAME = 'Heco Mainnet';
export const BSC_DISPLAY_NAME = 'Bsc Mainnet';
export const MATIC_DISPLAY_NAME = 'Matic Mainnet';

export const INFURA_PROVIDER_TYPES = [ROPSTEN, RINKEBY, KOVAN, MAINNET, GOERLI];
export const BUILDINT_PROVIDER_TYPES = [HECO, BSC, MATIC];
export const SECURE_NETWORKS = []
  .concat(INFURA_PROVIDER_TYPES)
  .concat(BUILDINT_PROVIDER_TYPES);

export const HECO_RPC_URL = 'https://heco1.onekey.so/rpc';
export const HECO_TICKER = 'HT';
export const HECO_IMAGE = './images/ht_logo.svg';

export const BSC_RPC_URL = 'https://bsc1.onekey.so/rpc';
export const BSC_TICKER = 'BNB';
export const BSC_IMAGE = './images/bsc_logo.svg';

export const MATIC_RPC_URL = 'https://rpc-mainnet.matic.network';
export const MATIC_TICKER = 'MATIC';
export const MATIC_IMAGE = './images/matic_logo.svg';

export const NETWORK_TYPE_TO_TICKER_MAP = {
  [HECO]: HECO_TICKER,
  [BSC]: BSC_TICKER,
  [MATIC]: MATIC_TICKER,
};

export const TEST_CHAINS = [
  ROPSTEN_CHAIN_ID,
  RINKEBY_CHAIN_ID,
  GOERLI_CHAIN_ID,
  KOVAN_CHAIN_ID,
];

export const NETWORK_TYPE_TO_ID_MAP = {
  [MATIC]: {
    networkId: MATIC_NETWORK_ID,
    chainId: MATIC_CHAIN_ID,
    ticker: MATIC_TICKER,
    rpcUrl: MATIC_RPC_URL,
    image: MATIC_IMAGE,
  },
  [HECO]: {
    networkId: HECO_NETWORK_ID,
    chainId: HECO_CHAIN_ID,
    ticker: HECO_TICKER,
    rpcUrl: HECO_RPC_URL,
    image: HECO_IMAGE,
  },
  [BSC]: {
    networkId: BSC_NETWORK_ID,
    chainId: BSC_CHAIN_ID,
    ticker: BSC_TICKER,
    rpcUrl: BSC_RPC_URL,
    image: BSC_IMAGE,
  },
  [ROPSTEN]: { networkId: ROPSTEN_NETWORK_ID, chainId: ROPSTEN_CHAIN_ID },
  [RINKEBY]: { networkId: RINKEBY_NETWORK_ID, chainId: RINKEBY_CHAIN_ID },
  [KOVAN]: { networkId: KOVAN_NETWORK_ID, chainId: KOVAN_CHAIN_ID },
  [GOERLI]: { networkId: GOERLI_NETWORK_ID, chainId: GOERLI_CHAIN_ID },
  [MAINNET]: { networkId: MAINNET_NETWORK_ID, chainId: MAINNET_CHAIN_ID },
};

export const NETWORK_TO_NAME_MAP = {
  [ROPSTEN]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY]: RINKEBY_DISPLAY_NAME,
  [KOVAN]: KOVAN_DISPLAY_NAME,
  [MAINNET]: MAINNET_DISPLAY_NAME,
  [GOERLI]: GOERLI_DISPLAY_NAME,
  [HECO]: HECO_DISPLAY_NAME,
  [BSC]: BSC_DISPLAY_NAME,
  [MATIC]: MATIC_DISPLAY_NAME,

  [ROPSTEN_NETWORK_ID]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY_NETWORK_ID]: RINKEBY_DISPLAY_NAME,
  [KOVAN_NETWORK_ID]: KOVAN_DISPLAY_NAME,
  [GOERLI_NETWORK_ID]: GOERLI_DISPLAY_NAME,
  [MAINNET_NETWORK_ID]: MAINNET_DISPLAY_NAME,
  [HECO_NETWORK_ID]: HECO_DISPLAY_NAME,
  [BSC_NETWORK_ID]: BSC_DISPLAY_NAME,
  [MATIC_NETWORK_ID]: MATIC_DISPLAY_NAME,

  [ROPSTEN_CHAIN_ID]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY_CHAIN_ID]: RINKEBY_DISPLAY_NAME,
  [KOVAN_CHAIN_ID]: KOVAN_DISPLAY_NAME,
  [GOERLI_CHAIN_ID]: GOERLI_DISPLAY_NAME,
  [MAINNET_CHAIN_ID]: MAINNET_DISPLAY_NAME,
  [HECO_CHAIN_ID]: HECO_DISPLAY_NAME,
  [BSC_CHAIN_ID]: BSC_DISPLAY_NAME,
  [MATIC_CHAIN_ID]: MATIC_DISPLAY_NAME,
};

export const CHAIN_ID_TO_TYPE_MAP = Object.entries(
  NETWORK_TYPE_TO_ID_MAP,
).reduce((chainIdToTypeMap, [networkType, { chainId }]) => {
  chainIdToTypeMap[chainId] = networkType;
  return chainIdToTypeMap;
}, {});

export const CHAIN_ID_TO_NETWORK_ID_MAP = Object.values(
  NETWORK_TYPE_TO_ID_MAP,
).reduce((chainIdToNetworkIdMap, { chainId, networkId }) => {
  chainIdToNetworkIdMap[chainId] = networkId;
  return chainIdToNetworkIdMap;
}, {});
