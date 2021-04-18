import * as networkEnums from '../../shared/constants/network';

/**
 * Gets the etherscan.io URL prefix for a given network ID.
 *
 * @param {string} networkId - The network ID to get the prefix for.
 * @returns {string} The etherscan.io URL prefix for the given network ID.
 */
export function getEtherscanNetworkPrefix(networkId) {
  switch (networkId) {
    case networkEnums.ROPSTEN_NETWORK_ID:
      return 'ropsten.';
    case networkEnums.RINKEBY_NETWORK_ID:
      return 'rinkeby.';
    case networkEnums.KOVAN_NETWORK_ID:
      return 'kovan.';
    case networkEnums.GOERLI_NETWORK_ID:
      return 'goerli.';
    default:
      // also covers mainnet
      return '';
  }
}

export function getEtherscanNetwork(networkId, rpcPrefs = {}) {
  if (rpcPrefs.blockExplorerUrl) {
    return `${rpcPrefs.blockExplorerUrl.replace(/\/+$/u, '')}`;
  }
  switch (Number(networkId)) {
    case 1: // main net
      return `https://etherscan.io`;
    case 2: // morden test net
      return `https://morden.etherscan.io`;
    case 3: // ropsten test net
      return `https://ropsten.etherscan.io`;
    case 4: // rinkeby test net
      return `https://rinkeby.etherscan.io`;
    case 42: // kovan test net
      return `https://kovan.etherscan.io`;
    case 5: // goerli test net
      return `https://goerli.etherscan.io`;
    case 128:
      return `https://hecoinfo.com`;
    case 56:
      return `https://bscscan.com`;
    case 137:
      return `https://explorer-mainnet.maticvigil.com`;
    default:
      return '';
  }
}
