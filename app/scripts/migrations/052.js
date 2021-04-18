// next version number
/*

description of migration and what it does

*/

import { Object } from 'globalthis/implementation';
import { cloneDeep, sortedUniqBy, isEqual } from 'lodash';

const version = 52;

export default {
  version,

  async migrate(originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  },
};

function transformState(state) {
  if (state.PreferencesController) {
    const { accountTokens, accountHiddenTokens } = state.PreferencesController;

    const newAccountTokens = {};
    const newAccountHiddenTokens = {};

    if (accountTokens && Object.keys(accountTokens).length > 0) {
      for (const address of Object.keys(accountTokens)) {
        for (const chainId of Object.keys(accountTokens[address])) {
          if (!newAccountTokens[chainId]) {
            newAccountTokens[chainId] = [];
          }
          newAccountTokens[chainId] = [].concat(
            newAccountTokens[chainId],
            accountTokens[address][chainId],
          );
        }
      }
      state.PreferencesController.accountTokens = Object.entries(
        newAccountTokens,
      )
        .map(([key, tokens]) => {
          return { [key]: sortedUniqBy(tokens, isEqual) };
        })
        .reduce((result, item) => ({ ...result, ...item }), {});
    }

    if (accountHiddenTokens && Object.keys(accountHiddenTokens).length > 0) {
      for (const address of Object.keys(accountHiddenTokens)) {
        for (const chainId of Object.keys(accountHiddenTokens[address])) {
          if (!newAccountHiddenTokens[chainId]) {
            newAccountHiddenTokens[chainId] = [];
          }
          newAccountHiddenTokens[chainId] = [].concat(
            newAccountHiddenTokens[chainId],
            accountHiddenTokens[address][chainId],
          );
        }
      }
      state.PreferencesController.accountHiddenTokens = Object.entries(
        newAccountHiddenTokens,
      )
        .map(([key, tokens]) => {
          return { [key]: sortedUniqBy(tokens, isEqual) };
        })
        .reduce((result, item) => ({ ...result, ...item }), {});
    }
  }
  return state;
}
