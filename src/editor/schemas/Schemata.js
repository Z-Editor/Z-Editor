import React, {
  Component
} from 'react';

import {
  Editor,
  EditorState,
  EditorBlock,
  RichUtils
} from 'draft-js';

class Schemata extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return ( 
        <div>
            <EditorBlock { ...this.props}/> 
        </div>
    );
  }
}
export default Schemata;