import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import { contractTokens } from '../../../../tokens';
import TokenSearch from './token-search.component';

const fuse = new Fuse([], {
  shouldSort: true,
  threshold: 0.45,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'symbol', weight: 0.5 },
  ],
});

const mapStateToProps = (state) => {
  const {
    metamask: {
      provider: { type },
    },
  } = state;
  const tokens = contractTokens[type]
    ? contractTokens[type]
    : contractTokens.eth;
  fuse.setCollection(tokens);
  return {
    tokens,
    fuse,
  };
};

export default connect(mapStateToProps)(TokenSearch);
