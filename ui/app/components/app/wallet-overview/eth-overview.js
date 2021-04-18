import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';

import Identicon from '../../ui/identicon';
import { I18nContext } from '../../../contexts/i18n';
import { SEND_ROUTE } from '../../../helpers/constants/routes';
import { useMetricEvent } from '../../../hooks/useMetricEvent';
import Tooltip from '../../ui/tooltip';
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display';
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common';
import {
  isBalanceCached,
  getSelectedAccount,
  getShouldShowFiat,
  getEtherLogo,
  getProvider,
  getCurrentChainId,
} from '../../../selectors/selectors';
import SwapIcon from '../../ui/icon/swap-icon.component';
import SendIcon from '../../ui/icon/overview-send-icon.component';
import IconButton from '../../ui/icon-button';
import { openSwap } from '../../../../lib/swap-utils';
import WalletOverview from './wallet-overview';

const EthOverview = ({ className }) => {
  const t = useContext(I18nContext);
  const sendEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Send: Eth',
    },
  });
  const history = useHistory();
  const balanceIsCached = useSelector(isBalanceCached);
  const showFiat = useSelector(getShouldShowFiat);
  const etherLogo = useSelector(getEtherLogo);
  const { ticker = 'ETH' } = useSelector(getProvider);
  const selectedAccount = useSelector(getSelectedAccount);
  const { balance } = selectedAccount;
  const chainId = useSelector(getCurrentChainId);
  const handleSwap = useCallback(() => openSwap(ticker), [ticker]);
  const isSwapEnable = [1, 42, 56].includes(Number(chainId));

  return (
    <WalletOverview
      balance={
        <Tooltip
          position="top"
          title={t('balanceOutdated')}
          disabled={!balanceIsCached}
        >
          <div className="eth-overview__balance">
            <div className="eth-overview__primary-container">
              <UserPreferencedCurrencyDisplay
                className={classnames('eth-overview__primary-balance', {
                  'eth-overview__cached-balance': balanceIsCached,
                })}
                data-testid="eth-overview__primary-currency"
                value={balance}
                type={PRIMARY}
                ethNumberOfDecimals={4}
                hideTitle
              />
              {balanceIsCached ? (
                <span className="eth-overview__cached-star">*</span>
              ) : null}
            </div>
            {showFiat && (
              <UserPreferencedCurrencyDisplay
                className={classnames({
                  'eth-overview__cached-secondary-balance': balanceIsCached,
                  'eth-overview__secondary-balance': !balanceIsCached,
                })}
                data-testid="eth-overview__secondary-currency"
                value={balance}
                type={SECONDARY}
                ethNumberOfDecimals={4}
                hideTitle
              />
            )}
          </div>
        </Tooltip>
      }
      buttons={
        <>
          <IconButton
            className="eth-overview__button"
            data-testid="eth-overview-send"
            Icon={SendIcon}
            label={t('send')}
            onClick={() => {
              sendEvent();
              history.push(SEND_ROUTE);
            }}
          />
          <IconButton
            className="eth-overview__button"
            disabled={!isSwapEnable}
            Icon={SwapIcon}
            onClick={handleSwap}
            label={t('swap')}
            tooltipRender={(contents) => (
              <Tooltip
                title={t('onlyAvailableOnMainnet')}
                position="bottom"
                disabled={isSwapEnable}
              >
                {contents}
              </Tooltip>
            )}
          />
        </>
      }
      className={className}
      icon={<Identicon diameter={32} ethLogo={etherLogo} />}
    />
  );
};

EthOverview.propTypes = {
  className: PropTypes.string,
};

EthOverview.defaultProps = {
  className: undefined,
};

export default EthOverview;
