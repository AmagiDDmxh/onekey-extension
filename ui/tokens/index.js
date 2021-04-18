import EthTokenMap from '@metamask/contract-metadata';
import HecoTokenMap from './heco.json';
import BscTokenMap from './bsc.json';

const flatten = (map) => {
  return Object.entries(map).map(([address, tokenData]) => ({
    ...tokenData,
    address,
  }));
};

let EthTokens = Object.entries(EthTokenMap)
  .map(([address, tokenData]) => ({
    ...tokenData,
    address,
    logoURI: `/images/contract/${tokenData.logo}`,
  }))
  .filter((tokenData) => Boolean(tokenData.erc20));

const builtInTokens = [
  {
    address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    logoURI:
      'https://assets.coingecko.com/coins/images/12124/small/Curve.png?1597369484',
    name: 'Curve DAO Token',
    logo:
      'https://assets.coingecko.com/coins/images/12124/small/Curve.png?1597369484',
    symbol: 'CRV',
    decimals: '18',
  },
];

EthTokens = EthTokens.concat(builtInTokens);

const HecoTokens = flatten(HecoTokenMap);
const BscTokens = flatten(BscTokenMap);

export const contractTokens = {
  heco: HecoTokens,
  bsc: BscTokens,
  eth: EthTokens,
};

export const contractMap = {
  heco: HecoTokenMap,
  bsc: BscTokenMap,
  eth: EthTokens.reduce(function (result, item) {
    result[item.address] = item;
    return result;
  }, {}),
};
