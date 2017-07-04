'use stric';

import {AtomicBlockUtils,Entity} from 'draft-js';

export function insertTeXBlock(editorState) {
    const entityKey = Entity.create(
        'TOKEN',
        'IMMUTABLE',
        {content: "test"}
    );

    return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
}