import React, { Component } from 'react';
import { string, func, array } from 'prop-types';
import SideToolBarBtn from './sideToolBarBtn';

class SideToolBar extends Component {
  static propTypes = {
    data: array.isRequired,
    side: string,
    insertFn: func
  };

  constructor(props) {
    super(props);

    this.state = {
      btns: this.props.data
    };
  }

  render() {
    const { side, insertFn } = this.props;
    const bt = this.state.btns.map(btn => <SideToolBarBtn type={btn} side={side} key={btn.id} insertFn={insertFn} />);
    return <ul className="rdw-editor-toolbar-side">{bt}</ul>;
  }
}
export default SideToolBar;
