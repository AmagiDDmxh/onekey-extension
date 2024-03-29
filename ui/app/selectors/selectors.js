import { stripHexPrefix } from 'ethereumjs-util';
import { createSelector } from 'reselect';
import { addHexPrefix } from '../../../app/scripts/lib/util';
import {
  MAINNET,
  TEST_CHAINS,
  NETWORK_TYPE_RPC,
  NETWORK_TYPE_TO_ID_MAP,
  BUILDINT_PROVIDER_TYPES
} from '../../../shared/constants/network';
import {
  shortenAddress,
  checksumAddress,
  getAccountByAddress,
} from '../helpers/utils/util';
import { contractMap } from "../../tokens"
import { getPermissionsRequestCount } from './permissions';

export function getNetworkIdentifier(state) {
  const {
    metamask: {
      provider: { type, nickname, rpcUrl },
    },
  } = state;

  return nickname || rpcUrl || type;
}

export function getMetricsNetworkIdentifier(state) {
  const { provider } = state.metamask;
  return provider.type === NETWORK_TYPE_RPC ? provider.rpcUrl : provider.type;
}

export function getCurrentChainId(state) {
  const { chainId } = state.metamask.provider;
  return chainId;
}

export function getCurrentKeyring(state) {
  const identity = getSelectedIdentity(state);

  if (!identity) {
    return null;
  }

  const simpleAddress = stripHexPrefix(identity.address).toLowerCase();

  const keyring = state.metamask.keyrings.find((kr) => {
    return (
      kr.accounts.includes(simpleAddress) ||
      kr.accounts.includes(identity.address)
    );
  });

  return keyring;
}

export function getAccountType(state) {
  const currentKeyring = getCurrentKeyring(state);
  const type = currentKeyring && currentKeyring.type;

  switch (type) {
    case 'Trezor Hardware':
    case 'Ledger Hardware':
      return 'hardware';
    case 'Simple Key Pair':
      return 'imported';
    default:
      return 'default';
  }
}

export function getCurrentNetworkId(state) {
  return state.metamask.network;
}

export const getMetaMaskAccounts = createSelector(
  getMetaMaskAccountsRaw,
  getMetaMaskCachedBalances,
  (currentAccounts, cachedBalances) =>
    Object.entries(currentAccounts).reduce(
      (selectedAccounts, [accountID, account]) => {
        if (account.balance === null || account.balance === undefined) {
          return {
            ...selectedAccounts,
            [accountID]: {
              ...account,
              balance: cachedBalances && cachedBalances[accountID],
            },
          };
        }
        return {
          ...selectedAccounts,
          [accountID]: account,
        };
      },
      {},
    ),
);

export function getSelectedAddress(state) {
  return state.metamask.selectedAddress;
}

export function getSelectedIdentity(state) {
  const selectedAddress = getSelectedAddress(state);
  const { identities } = state.metamask;

  return identities[selectedAddress];
}

export function getNumberOfAccounts(state) {
  return Object.keys(state.metamask.accounts).length;
}

export function getNumberOfTokens(state) {
  const { tokens } = state.metamask;
  return tokens ? tokens.length : 0;
}

export function getMetaMaskKeyrings(state) {
  return state.metamask.keyrings;
}

export function getMetaMaskIdentities(state) {
  return state.metamask.identities;
}

export function getMetaMaskAccountsRaw(state) {
  return state.metamask.accounts;
}

export function getMetaMaskCachedBalances(state) {
  const network = getCurrentNetworkId(state);

  return state.metamask.cachedBalances[network];
}

/**
 * Get ordered (by keyrings) accounts with identity and balance
 */
export const getMetaMaskAccountsOrdered = createSelector(
  getMetaMaskKeyrings,
  getMetaMaskIdentities,
  getMetaMaskAccounts,
  (keyrings, identities, accounts) =>
    keyrings
      .reduce((list, keyring) => list.concat(keyring.accounts), [])
      .filter((address) => Boolean(identities[address]))
      .map((address) => ({ ...identities[address], ...accounts[address] })),
);

export const getMetaMaskAccountsConnected = createSelector(
  getMetaMaskAccountsOrdered,
  (connectedAccounts) =>
    connectedAccounts.map(({ address }) => address.toLowerCase()),
);

export function isBalanceCached(state) {
  const selectedAccount = state.metamask.accounts[getSelectedAddress(state)]
  const selectedAccountBalance = selectedAccount && selectedAccount.balance;
  const cachedBalance = getSelectedAccountCachedBalance(state);
  
  return Boolean(!selectedAccountBalance && cachedBalance);
}

export function getSelectedAccountCachedBalance(state) {
  const cachedBalances = state.metamask.cachedBalances[state.metamask.network];
  const selectedAddress = getSelectedAddress(state);

  return cachedBalances && cachedBalances[selectedAddress];
}

export function getSelectedAccount(state) {
  const accounts = getMetaMaskAccounts(state);
  const selectedAddress = getSelectedAddress(state);

  return accounts[selectedAddress];
}

export function getTargetAccount(state, targetAddress) {
  const accounts = getMetaMaskAccounts(state);
  return accounts[targetAddress];
}

export const getTokenExchangeRates = (state) =>
  state.metamask.contractExchangeRates;

export function getAssetImages(state) {
  const assetImages = state.metamask.assetImages || {};
  return assetImages;
}

export function getContractMap(state) {
  const type = state.metamask.provider.type;
  return contractMap[type] ? contractMap[type] : contractMap.eth
}

export function getAddressBook(state) {
  const chainId = getCurrentChainId(state);
  if (!state.metamask.addressBook[chainId]) {
    return [];
  }
  return Object.values(state.metamask.addressBook[chainId]);
}

export function getAddressBookEntry(state, address) {
  const addressBook = getAddressBook(state);
  const entry = addressBook.find(
    (contact) => contact.address === checksumAddress(address),
  );
  return entry;
}

export function getAddressBookEntryName(state, address) {
  const entry =
    getAddressBookEntry(state, address) || state.metamask.identities[address];
  return entry && entry.name !== '' ? entry.name : shortenAddress(address);
}

export function accountsWithSendEtherInfoSelector(state) {
  const accounts = getMetaMaskAccounts(state);
  const identities = getMetaMaskIdentities(state);

  const accountsWithSendEtherInfo = Object.entries(identities).map(
    ([key, identity]) => {
      return { ...identity, ...accounts[key] };
    },
  );

  return accountsWithSendEtherInfo;
}

export function getAccountsWithLabels(state) {
  return getMetaMaskAccountsOrdered(state).map(
    ({ address, name, balance }) => ({
      address,
      addressLabel: `${name} (...${address.slice(address.length - 4)})`,
      label: name,
      balance,
    }),
  );
}

export function getCurrentAccountWithSendEtherInfo(state) {
  const currentAddress = getSelectedAddress(state);
  const accounts = accountsWithSendEtherInfoSelector(state);

  return getAccountByAddress(accounts, currentAddress);
}

export function getTargetAccountWithSendEtherInfo(state, targetAddress) {
  const accounts = accountsWithSendEtherInfoSelector(state);
  return getAccountByAddress(accounts, targetAddress);
}

export function getCurrentEthBalance(state) {
  return getCurrentAccountWithSendEtherInfo(state).balance;
}

export function getGasIsLoading(state) {
  return state.appState.gasIsLoading;
}

export function getCurrentCurrency(state) {
  return state.metamask.currentCurrency;
}

export function getTotalUnapprovedCount(state) {
  const {
    unapprovedMsgCount = 0,
    unapprovedPersonalMsgCount = 0,
    unapprovedDecryptMsgCount = 0,
    unapprovedEncryptionPublicKeyMsgCount = 0,
    unapprovedTypedMessagesCount = 0,
    pendingApprovalCount = 0,
  } = state.metamask;

  return (
    unapprovedMsgCount +
    unapprovedPersonalMsgCount +
    unapprovedDecryptMsgCount +
    unapprovedEncryptionPublicKeyMsgCount +
    unapprovedTypedMessagesCount +
    pendingApprovalCount +
    getUnapprovedTxCount(state) +
    getPermissionsRequestCount(state) +
    getSuggestedTokenCount(state)
  );
}

function getUnapprovedTxCount(state) {
  const { unapprovedTxs = {} } = state.metamask;
  return Object.keys(unapprovedTxs).length;
}

function getSuggestedTokenCount(state) {
  const { suggestedTokens = {} } = state.metamask;
  return Object.keys(suggestedTokens).length;
}

export function getIsMainnet(state) {
  const networkType = getNetworkIdentifier(state);
  return networkType === MAINNET;
}

export function getUnapprovedConfirmations(state) {
  const { pendingApprovals } = state.metamask;
  return Object.values(pendingApprovals);
}

export function getIsBuiltnet(state) {
  const networkType = getMetricsNetworkIdentifier(state);
  return BUILDINT_PROVIDER_TYPES.includes(networkType);
}

export function getIsTestnet(state) {
  const chainId = getCurrentChainId(state);
  return TEST_CHAINS.includes(chainId);
}

export function getPreferences({ metamask }) {
  return metamask.preferences;
}

export function getShouldShowFiat(state) {
  const isMainNet = getIsMainnet(state);
  const isBuiltNet = getIsBuiltnet(state);
  const { showFiatInTestnets } = getPreferences(state);
  return Boolean(isMainNet || isBuiltNet || showFiatInTestnets);
}

export function getProvider(state) {
  return state.metamask.provider;
}

export function getEtherLogo(state) {
  const type = state.metamask.provider.type;
  return (NETWORK_TYPE_TO_ID_MAP[type] && NETWORK_TYPE_TO_ID_MAP[type].image) || "./images/eth_logo.svg"
}

export function getAdvancedInlineGasShown(state) {
  return Boolean(state.metamask.featureFlags.advancedInlineGas);
}

export function getUseNonceField(state) {
  return Boolean(state.metamask.useNonceField);
}

export function getCustomNonceValue(state) {
  return String(state.metamask.customNonceValue);
}

export function getDomainMetadata(state) {
  return state.metamask.domainMetadata;
}

export const getBackgroundMetaMetricState = (state) => {
  return {
    network: getCurrentNetworkId(state),
    accountType: getAccountType(state),
    metaMetricsId: state.metamask.metaMetricsId,
    numberOfTokens: getNumberOfTokens(state),
    numberOfAccounts: getNumberOfAccounts(state),
    participateInMetaMetrics: state.metamask.participateInMetaMetrics,
  };
};

export function getRpcPrefsForCurrentProvider(state) {
  const { frequentRpcListDetail, provider } = state.metamask;
  const selectRpcInfo = frequentRpcListDetail.find(
    (rpcInfo) => rpcInfo.rpcUrl === provider.rpcUrl,
  );
  const { rpcPrefs = {} } = selectRpcInfo || {};
  return rpcPrefs;
}

export function getKnownMethodData(state, data) {
  if (!data) {
    return null;
  }
  const prefixedData = addHexPrefix(data);
  const fourBytePrefix = prefixedData.slice(0, 10);
  const { knownMethodData } = state.metamask;

  return knownMethodData && knownMethodData[fourBytePrefix];
}

export function getFeatureFlags(state) {
  return state.metamask.featureFlags;
}

export function getOriginOfCurrentTab(state) {
  return state.activeTab.origin;
}

export function getIpfsGateway(state) {
  return state.metamask.ipfsGateway;
}

export function getUSDConversionRate(state) {
  return state.metamask.usdConversionRate;
}

export function getWeb3ShimUsageStateForOrigin(state, origin) {
  return state.metamask.web3ShimUsageOrigins[origin];
}
