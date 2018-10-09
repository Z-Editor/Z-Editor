import React from 'react';
import { string, func, object } from 'prop-types';

SideToolBarBtn.propTypes = {
  insertFn: func.isRequired,
  side: string,
  type: object
};

function SideToolBarBtn({ type, side, insertFn }) {
  let label = null;
  if (side === 'left') {
    label = (
      <div>
        <img alt="icon" src={type.icon} width="19" height="19" />
      </div>
    );
  } else {
    label = <div>{type.symbol}</div>;
  }
  return (
    <li>
      <div
        className="rdw-option-wrapper"
        onClick={() => {
          insertFn(type.symbol, type.type, side);
        }}
      >
        {label}
      </div>
    </li>
  );
}

export default SideToolBarBtn;
