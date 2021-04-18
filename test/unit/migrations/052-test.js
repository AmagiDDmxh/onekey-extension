import assert from 'assert';
import { isEqual, sortedUniqBy } from 'lodash';
import migration52 from '../../../app/scripts/migrations/052';

import {
  // GOERLI,
  // GOERLI_CHAIN_ID,
  // KOVAN,
  KOVAN_CHAIN_ID,
  // MAINNET,
  MAINNET_CHAIN_ID,
  // NETWORK_TYPE_RPC,
  // RINKEBY,
  RINKEBY_CHAIN_ID,
  // ROPSTEN,
  // ROPSTEN_CHAIN_ID,
} from '../../../shared/constants/network';

const TOKEN1 = { symbol: 'TST', address: '0x10', decimals: 18 };
const TOKEN2 = { symbol: 'TXT', address: '0x11', decimals: 18 };
const TOKEN3 = { symbol: 'TVT', address: '0x12', decimals: 18 };
const TOKEN4 = { symbol: 'TAT', address: '0x13', decimals: 18 };

describe('migration #52', function () {
  it('should update the version metadata', async function () {
    const oldStorage = {
      meta: {
        version: 52,
      },
      data: {},
    };

    const newStorage = await migration52.migrate(oldStorage);
    assert.deepStrictEqual(newStorage.meta, {
      version: 52,
    });
  });

  it(`tokens should be classified according to the network # Case 1`, async function () {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          accountHiddenTokens: {
            '0x1111': {
              [RINKEBY_CHAIN_ID]: [TOKEN1],
            },
            '0x1112': {
              [RINKEBY_CHAIN_ID]: [TOKEN3],
            },
          },
          accountTokens: {
            '0x1111': {
              [RINKEBY_CHAIN_ID]: [TOKEN1, TOKEN2],
            },
            '0x1112': {
              [RINKEBY_CHAIN_ID]: [TOKEN1, TOKEN3],
            },
          },
          bar: 'baz',
        },
        foo: 'bar',
      },
    };

    const newStorage = await migration52.migrate(oldStorage);
    assert.deepStrictEqual(newStorage.data, {
      PreferencesController: {
        accountHiddenTokens: {
          [RINKEBY_CHAIN_ID]: sortedUniqBy([TOKEN1, TOKEN3], isEqual),
        },
        accountTokens: {
          [RINKEBY_CHAIN_ID]: sortedUniqBy([TOKEN1, TOKEN2, TOKEN3], isEqual),
        },
        bar: 'baz',
      },
      foo: 'bar',
    });
  });

  it(`tokens should be classified according to the network # Case 2`, async function () {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          accountHiddenTokens: {
            '0x1111': {
              [RINKEBY_CHAIN_ID]: [TOKEN1],
              [MAINNET_CHAIN_ID]: [TOKEN4],
              [KOVAN_CHAIN_ID]: [TOKEN1, TOKEN2],
            },
            '0x1112': {
              [RINKEBY_CHAIN_ID]: [TOKEN3],
              [MAINNET_CHAIN_ID]: [TOKEN4],
            },
          },
          accountTokens: {
            '0x1111': {
              [RINKEBY_CHAIN_ID]: [TOKEN1, TOKEN2],
            },
            '0x1112': {
              [RINKEBY_CHAIN_ID]: [TOKEN1, TOKEN3],
            },
          },
          bar: 'baz',
        },
        foo: 'bar',
      },
    };

    const newStorage = await migration52.migrate(oldStorage);
    assert.deepStrictEqual(newStorage.data, {
      PreferencesController: {
        accountHiddenTokens: {
          [RINKEBY_CHAIN_ID]: sortedUniqBy([TOKEN1, TOKEN3], isEqual),
          [MAINNET_CHAIN_ID]: sortedUniqBy([TOKEN4], isEqual),
          [KOVAN_CHAIN_ID]: sortedUniqBy([TOKEN1, TOKEN2], isEqual),
        },
        accountTokens: {
          [RINKEBY_CHAIN_ID]: sortedUniqBy([TOKEN1, TOKEN2, TOKEN3], isEqual),
        },
        bar: 'baz',
      },
      foo: 'bar',
    });
  });
});
