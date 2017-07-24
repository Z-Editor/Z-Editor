import React, {
    Component
} from 'react';
import {
    Map
} from 'immutable';
import TodoBlock from './TodoBlock'
import {
    Editor,
    EditorState,
    RichUtils
} from 'draft-js';
import {
    convertToRaw,
    convertFromRaw,
    Entity,
    Modifier,
    CompositeDecorator,
    DefaultDraftBlockRenderMap
} from 'draft-js';
import '../App.css';

const TODO_BLOCK = 'todo';

function findPlaceholders(contentBlock, callback) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            Entity.get(entityKey).getType() === 'PLACEHOLDER'
        );
    }, callback);
}

/*
    Returns default block-level metadata for various block type. Empty object otherwise.
    */
const getDefaultBlockData = (blockType, initialData = {}) => {
    switch (blockType) {
        case TODO_BLOCK:
            return {
                checked: false
            };
        default:
            return initialData;
    }
};

/*
Changes the block type of the current block.
*/
const resetBlockType = (editorState, newType = 'unstyled') => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const key = selectionState.getStartKey();
    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(key);
    let newText = '';
    const text = block.getText();
    if (block.getLength() >= 2) {
        newText = text.substr(1);
    }
    const newBlock = block.merge({
        text: newText,
        type: newType,
        data: getDefaultBlockData(newType),
    });
    const newContentState = contentState.merge({
        blockMap: blockMap.set(key, newBlock),
        selectionAfter: selectionState.merge({
            anchorOffset: 0,
            focusOffset: 0,
        }),
    });
    return EditorState.push(editorState, newContentState, 'change-block-type');
};

/*
A higher-order function. http://bitwiser.in/2016/08/31/implementing-todo-list-in-draft-js.html
*/
const getBlockRendererFn = (getEditorState, onChange) => (block) => {
    const type = block.getType();
    switch (type) {
        case 'todo':
            return {
                component: TodoBlock,
                props: {
                    getEditorState,
                    onChange,
                },
            };
        default:
            return null;
    }
};

class ZEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
        };

        /* blockRenderMap */
        this.blockRenderMap = Map({
            [TODO_BLOCK]: {
                element: 'div',
            },
        }).merge(DefaultDraftBlockRenderMap);


        this.onChange = (editorState) => this.setState({
            editorState
        });

        this.handleBeforeInput = this.handleBeforeInput.bind(this);

        this.handleKeyCommand = this.handleKeyCommand.bind(this);


        // Get a blockRendererFn from the higher-order function.
        this.blockRendererFn = getBlockRendererFn(
            this.getEditorState, this.onChange);
    }

    componentDidMount() {
        this.refs.editor.focus();
    }

    blockStyleFn(block) {
        switch (block.getType()) {
            case TODO_BLOCK:
                return 'block block-todo';
            default:
                return 'block';
        }
    }



    insertPlaceholder = () => {
        const label = "|----------------------------- \n|makeMilkCoffee \n|ΔtheCoffeeMachine \n|coffee? : ℕ \n|milk? : ℕ \n|------------------------- \n|coffee   0 \n|milk   0 \n|coffee  halfCupCapacity \n|milk  halfCupCapacity \n|------------------------- \n "
        const meta = "test test"
        const editorState = this.state.editorState;
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const entityKey = Entity.create('unstyled', 'IMMUTABLE', {
            meta
        });
        const textWithEntity = Modifier.insertText(currentContent, selection, label, null, entityKey);

        this.setState({
            editorState: EditorState.push(editorState, textWithEntity, 'insert-characters')
        }, () => {
            this.refs.editor.focus();
        });
    }

    handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }


    /* Add this as a method inside MyTodoListEditor */

    handleBeforeInput(str) {
        if (str !== ']') {
            return false;
        }
        const {
            editorState
        } = this.state;
        /* Get the selection */
        const selection = editorState.getSelection();

        /* Get the current block */
        const currentBlock = editorState.getCurrentContent()
            .getBlockForKey(selection.getStartKey());
        const blockType = currentBlock.getType();
        const blockLength = currentBlock.getLength();
        if (blockLength === 1 && currentBlock.getText() === '[') {
            this.onChange(resetBlockType(editorState, blockType !== TODO_BLOCK ? TODO_BLOCK : 'unstyled'));
            return true;
        }
        return false;
    }

    render() {
        return ( 
            <div className = "container-content" >
            <button type = "button"
            onClick = {this.insertPlaceholder}>

            {'Insert 2'} 
            
            </button>
            <div className = "Zeditor-root" >
            <div className = "Zeditor-editor" >
            <Editor editorState = {this.state.editorState}
            handleKeyCommand = {this.handleKeyCommand}
            ref = "editor"
            onChange = {this.onChange}
            blockStyleFn = {this.blockStyleFn}
            blockRenderMap = {this.blockRenderMap}
            blockRendererFn = {this.blockRendererFn}
            handleBeforeInput = {this.handleBeforeInput}
            handleKeyCommand = {this.handleKeyCommand}
            />
            </div> 
            </div> 
            </div>
        );
    }
}
export default ZEditor;