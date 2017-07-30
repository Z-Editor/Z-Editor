import React, {
  Component
} from 'react';

import {
  Editor,
  EditorState,
  EditorBlock,
  RichUtils
} from 'draft-js';

class SideToolBarBtn extends Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  render() {
    return ( 
            <li>
                <button className = "rdw-option-wrapper" type = "button" onClick={() => 
                    {this.props.insertFn(this.props.type.symbol,this.props.type.type,this.props.side)}}>
                    {this.props.type.symbol}
                </button>
            </li>
    );
  }
}

export default SideToolBarBtn;