import { connect } from 'react-redux';

import { addTokens, clearPendingTokens } from '../../store/actions';
import { getMostRecentOverviewPage } from '../../ducks/history/history';
import { getContractMap } from '../../selectors/selectors';
import ConfirmAddToken from './confirm-add-token.component';

const mapStateToProps = (state) => {
  const {
    metamask: { pendingTokens },
  } = state;
  return {
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    contractMap: getContractMap(state),
    pendingTokens,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTokens: (tokens) => dispatch(addTokens(tokens)),
    clearPendingTokens: () => dispatch(clearPendingTokens()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmAddToken);
