import * as React from 'react';
import PropTypes from 'prop-types';

import { TableContext } from './Table';
import { useReducerWithNotify } from './useReducerWithNotify';
import { addById, removeById, byAll } from './reducers';

const ADD_SELECT_BY_ID = 'ADD_SELECT_BY_ID';
const REMOVE_SELECT_BY_ID = 'REMOVE_SELECT_BY_ID';

const SELECT_ALL = 'SELECT_ALL';

const selectReducer = (state, action) => {
  switch (action.type) {
    case ADD_SELECT_BY_ID: {
      return addById(state, action);
    }
    case REMOVE_SELECT_BY_ID: {
      return removeById(state, action);
    }
    case SELECT_ALL: {
      return byAll(state, action);
    }
    default:
      throw new Error();
  }
};

const SelectContext = React.createContext({});

const DEFAULT_SELECT = {
  ids: []
};

const SelectProvider = ({
  defaultSelect = DEFAULT_SELECT,
  children
}) => {
  const { list } = React.useContext(TableContext);

  const [state, dispatch] = useReducerWithNotify(
    selectReducer,
    defaultSelect,
    'select',
    'selectState'
  );

  const onToggleSelectById = React.useCallback(
    id =>
      dispatch({
        type: state.ids.includes(id)
          ? REMOVE_SELECT_BY_ID
          : ADD_SELECT_BY_ID,
        payload: { id }
      }),
    [state, dispatch]
  );

  const onToggleSelectAll = React.useCallback(
    () =>
      dispatch({
        type: SELECT_ALL,
        payload: { ids: list.map(item => item.id) }
      }),
    [list, dispatch]
  );

  const allSelected =
    state.ids.sort().join(',') ===
    list
      .map(item => item.id)
      .sort()
      .join(',');

  const noneSelected = !state.ids.length;

  return (
    <SelectContext.Provider
      value={{
        selectState: {
          ...state,
          allSelected,
          noneSelected
        },
        onToggleSelectById,
        onToggleSelectAll
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};

SelectProvider.propTypes = {
  defaultSelect: PropTypes.shape({
    ids: PropTypes.arrayOf(PropTypes.string)
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func
  ])
};

export { SelectContext, SelectProvider };
