import React from 'react';

import { EditorBlock } from 'draft-js';

function Schemata(props) {
  return (
    <div>
      <EditorBlock {...props} />
    </div>
  );
}

export default Schemata;
