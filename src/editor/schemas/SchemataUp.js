import React, {
  Component
} from 'react';

import {
  Editor,
  EditorState,
  EditorBlock,
  RichUtils
} from 'draft-js';

class SchemataUp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return ( 
        <div>
            <span className='up_span'><EditorBlock { ...this.props}/></span>
        </div>
    );
  }
}
export default SchemataUp;