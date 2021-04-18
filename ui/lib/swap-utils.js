export function openSwap(inputCurrency = 'ETH') {
  global.platform?.openTab({
    url: `https://swap.onekey.so#/swap?inputCurrency=${inputCurrency}`,
  });
}
