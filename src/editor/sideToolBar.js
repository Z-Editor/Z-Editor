import React, {
  Component
} from 'react';

import SideToolBarBtn from './sideToolBarBtn';

import {
  Editor,
  EditorState,
  EditorBlock,
  RichUtils
} from 'draft-js';


class SideToolBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
        btns : this.props.data
    }
  }

  render() {
    const bt = this.state.btns.map((btn) => {
        return (
        
            <SideToolBarBtn type={btn} side= {this.props.side} key={btn.id}
            insertFn = {this.props.insertFn}
            />
        
        )
    });
    return (<ul className="rdw-editor-toolbar">{bt}</ul>);
  }
}
export default SideToolBar;