import React from 'react';

import { EditorBlock } from 'draft-js';

function SchemataUp(props) {
  return (
    <div>
      <span className="up_span">
        <EditorBlock {...props} />
      </span>
    </div>
  );
}

export default SchemataUp;
