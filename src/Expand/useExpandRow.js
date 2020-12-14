import { css } from 'styled-components';
import cs from 'classnames';

import { isRowClick } from '@common/util/isRowClick';

import { EXPAND_TYPES } from './config';

const useExpandRow = ({
  expansionPanel,
  isExpanded,
  onToggleExpandById,
  expandType = EXPAND_TYPES.RowClick
}) => {
  const theme = css`
    &.expandable-row {
      cursor: pointer;
    }
  `;

  const className = cs('row-expand', {
    'expandable-row': expandType === EXPAND_TYPES.RowClick,
    'expanded-row': isExpanded
  });

  const onClick = (tableItem, event) => {
    if (!isRowClick(event)) return;

    if (expandType === EXPAND_TYPES.RowClick) {
      onToggleExpandById(tableItem.id);
    }
  };

  return {
    theme,
    className,
    onClick,
    expand: {
      expansionPanel: isExpanded ? expansionPanel : null
    }
  };
};

export { useExpandRow };
