import React, { Component } from 'react';

import { Editor, EditorState, EditorBlock, RichUtils } from 'draft-js';

class SideToolBarBtn extends Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  render() {
    const side = this.props.side;

    let label = null;
    if (side == 'left') {
      label = (
        <div>
          <img src={this.props.type.icon} width="19" height="19" />
        </div>
      );
    } else {
      label = <div>{this.props.type.symbol}</div>;
    }
    return (
      <li>
        <div
          className="rdw-option-wrapper"
          onClick={() => {
            this.props.insertFn(this.props.type.symbol, this.props.type.type, this.props.side);
          }}
        >
          {label}
        </div>
      </li>
    );
  }
}

export default SideToolBarBtn;
