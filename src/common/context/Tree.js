import * as React from 'react';
import PropTypes from 'prop-types';

import { useReducerWithNotify } from './useReducerWithNotify';
import { addById, removeById } from './reducers';

const ADD_TREE_EXPAND_BY_ID = 'ADD_TREE_EXPAND_BY_ID';
const REMOVE_TREE_EXPAND_BY_ID = 'REMOVE_TREE_EXPAND_BY_ID';

const treeReducer = (state, action) => {
  switch (action.type) {
    case ADD_TREE_EXPAND_BY_ID: {
      return addById(state, action);
    }
    case REMOVE_TREE_EXPAND_BY_ID: {
      return removeById(state, action);
    }
    default:
      throw new Error();
  }
};

const TreeContext = React.createContext({});

const DEFAULT_TREE = {
  ids: []
};

const TreeProvider = ({ defaultTree = DEFAULT_TREE, children }) => {
  const [state, dispatch] = useReducerWithNotify(
    treeReducer,
    defaultTree,
    'tree',
    'treeState'
  );

  const onToggleTreeExpandById = React.useCallback(
    id => {
      dispatch({
        type: state.ids.includes(id)
          ? REMOVE_TREE_EXPAND_BY_ID
          : ADD_TREE_EXPAND_BY_ID,
        payload: { id }
      });
    },
    [state, dispatch]
  );

  return (
    <TreeContext.Provider
      value={{
        treeState: state,
        onToggleTreeExpandById
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};

TreeProvider.propTypes = {
  defaultTree: PropTypes.shape({
    ids: PropTypes.arrayOf(PropTypes.string)
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func
  ])
};

export { TreeContext, TreeProvider };
