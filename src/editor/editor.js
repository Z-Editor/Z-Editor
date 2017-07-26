import React, {
    Component
} from 'react';
import {
    Map
} from 'immutable';
import { Editor } from 'react-draft-wysiwyg';
import '../App.css';
import './styles.css';
import TodoBlock from './TodoBlock';
import Schemata from './Schemata';
import SchemataUp from './SchemataUp';
import SchemataDown from './SchemataDown';
import {
    EditorState,
    RichUtils
} from 'draft-js';
import {
    convertToRaw,
    convertFromRaw,
    Entity,
    Modifier,
    CompositeDecorator,
    DefaultDraftBlockRenderMap,
    AtomicBlockUtils,
    genKey,
    ContentBlock
} from 'draft-js';


const TODO_BLOCK = 'todo';
const SCHEMA = 'schemata';
const SCHEMA_UP = 'schemata_up';
const SCHEMA_DOWN = 'schemata_down';

const convertBlock = (type,editorState, selectionState, contentState) => {

    const newType = type;
    // const editorState = this.state.editorState;
    // const contentState = editorState.getCurrentContent();
    // const selectionState = editorState.getSelection();
    const key = selectionState.getStartKey();
    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(key);
    const newText = block.getText();
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

    return newBlock;
}

const insert_block = (editorState, selection, contentState, currentBlock) => {
    
    const newBlock = convertBlock('schemata_up',editorState, selection, contentState);
    const blockMap = contentState.getBlockMap()
    // Split the blocks
    const blocksBefore = blockMap.toSeq().takeUntil(function (v) {
        return v === currentBlock
    })
    const blocksAfter = blockMap.toSeq().skipUntil(function (v) {
        return v === currentBlock
    }).rest()
    const newBlockKey = genKey();
    const newBlockKey2 = genKey();
    const newBlockKey3 = genKey();
    const newBlockKey4 = genKey();
    const newBlockKey5 = genKey();
    const newBlockKeyFirst = genKey();
    const newBlockKeyLast = genKey();

    // schema table building from here
    let newBlocks =[
        [newBlockKeyFirst, new ContentBlock({
            key: newBlockKeyFirst,
            type: 'unstyled',
            text: ''
        })],
        [currentBlock.getKey(), newBlock],
        [newBlockKey, new ContentBlock({
            key: newBlockKey,
            type: 'schemata',
            text: ''
        })],     
        [newBlockKey3, new ContentBlock({
            key: newBlockKey3,
            type: 'schemata_down',
            text: ''
        })],
        [newBlockKey4, new ContentBlock({
            key: newBlockKey4,
            type: 'schemata',
            text: ''
        })],
        [newBlockKey5, new ContentBlock({
            key: newBlockKey5,
            type: 'schemata',
            text: ''
        })],
        [newBlockKey2, new ContentBlock({
            key: newBlockKey2,
            type: 'schemata_down',
            text: ''
        })],
        [newBlockKeyLast, new ContentBlock({
            key: newBlockKeyLast,
            type: 'unstyled',
            text: ''
        })]
    ];

    //////// schema ends ///////////////////////////

    const newBlockMap = blocksBefore.concat(newBlocks, blocksAfter).toOrderedMap()
    const newContentState = contentState.merge({
        blockMap: newBlockMap,
        selectionBefore: selection,
        selectionAfter: selection,
    })
    return EditorState.push(editorState, newContentState, 'insert-fragment');

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
        case 'atomic':
            return {
                component: TodoBlock,
                props: {
                    getEditorState,
                    onChange,
                },
                };
        case 'todo':
            return {
                component: TodoBlock,
                props: {
                    getEditorState,
                    onChange,
                },
            };
        case 'schemata':
            return {
                component: Schemata,
                props: {
                    getEditorState,
                    onChange,
                },
            };
        case 'schemata_up':
            return {
                component: SchemataUp,
                props: {
                    getEditorState,
                    onChange,
                },
            };
        case 'schemata_down':
            return {
                component: SchemataDown,
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
            [SCHEMA]: {
                element: 'div',
            },
            [SCHEMA_UP]: {
                element: 'div',
            },
            [SCHEMA_DOWN]: {
                element: 'div',
            },
        }).merge(DefaultDraftBlockRenderMap);


        this.onEditorStateChange = (editorState) => {
            this.setState({
            editorState,
            });
        }
        // this.onChange = (editorState) => this.setState({
        //     editorState
        // });

        this.handleBeforeInput = this.handleBeforeInput.bind(this);

        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        // Get a blockRendererFn from the higher-order function.
        this.blockRendererFn = getBlockRendererFn(
            this.getEditorState, this.onEditorStateChange);

    }

    componentDidMount() {
        console.log(refs);
        this.refs.editor.focus();
    }

    // componentDidMount(){
    //     console.log(this.domEditor);
    //     this.domEditor.focus()
    // }

    blockStyleFn(block) {
        switch (block.getType()) {
            case 'atomic':
                return 'block block-todo';
            case TODO_BLOCK:
                return 'block block-todo';
            case SCHEMA:
                return 'schemata';
            case SCHEMA_UP:
                return 'schemata_up';
            case SCHEMA_DOWN:
                return 'schemata_down';    
            default:
                return 'block';
        }
    }
    insert = () => {
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const key = selectionState.getStartKey();
        const blockMap = contentState.getBlockMap();
        const block = blockMap.get(key);

        console.log("inside insert");

        this.setState({
            editorState: insert_block(editorState, selectionState, contentState, block)
        }, () => {
            // this.refs.editor.focus();
        });
    }

    insertPlaceholder = (type) => {

        /// convert current block :) 
        const newType = type;
        const editorState = this.state.editorState;
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

        this.setState({
            editorState: EditorState.push(editorState, newContentState, 'change-block-type')
        }, () => {
            // this.refs.editor.focus();
        });


        // typical method of creating an entity and add it to the blocks

        // const label = "|----------------------------- \n|makeMilkCoffee \n|ΔtheCoffeeMachine \n|coffee? : ℕ \n|milk? : ℕ \n|------------------------- \n|coffee   0 \n|milk   0 \n|coffee  halfCupCapacity \n|milk  halfCupCapacity \n|------------------------- \n "
        // const meta = "na"
        // const editorState = this.state.editorState;

        // // const selectionState = editorState.getSelection();
        // const contentState = editorState.getCurrentContent();

        // const contentStateWithEntity = contentState.createEntity(
        // 'todo',
        // 'MUTABLE',{
        //     text:meta
        // }
        // );
        // const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        // const newEditorState = EditorState.set(
        //     editorState,
        //     { currentContent: contentStateWithEntity }
        // );

        // const newEditorStateWithBlock = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
        // this.setState({ TODO_BLOCK: Map() , editorState: newEditorStateWithBlock });

        ////////////////////////////////////////////////
        // const newContentState = Modifier.applyEntity(
        // contentState,
        // selectionState,
        // entityKey
        // );

        // this.setState({
        //     editorState: EditorState.push(editorState, textWithEntity, 'insert-characters')
        // }, () => {
        //     this.refs.editor.focus();
        // });
        // associate the text in the selection (from - to) to the entety and get a new content state
        // const newContentState = Modifier.insertText(contentState, selectionState, 'test', null, entityKey);

        // insert a new atomic block with the entity and a whit space as the text

        

        // this.setState({
        //     editorState: EditorState.push(editorState, newContentState, 'apply-entity')
        // }, () => {
        //     this.refs.editor.focus();
        // });
    }

    handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onEditorStateChange(newState);
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
            this.onEditorStateChange(resetBlockType(editorState, blockType !== TODO_BLOCK ? TODO_BLOCK : 'unstyled'));
            return true;
        }
        return false;
    }


    render() {
        const { editorState } = this.state;
        return ( 
            <div className = "container-content">
                <button type = "button"
                onClick = {this.insert}>

                {'Insert 2'} 
                
                </button>
                <div>
                    <div>
                        <Editor
                        editorState={editorState}
                        onEditorStateChange={this.onEditorStateChange}
                        blockStyleFn = {this.blockStyleFn}
                        blockRenderMap = {this.blockRenderMap}
                        blockRendererFn = {this.blockRendererFn}
                        handleKeyCommand = {this.handleKeyCommand}
                        handleBeforeInput = {this.handleBeforeInput}
                        editorClassName = "page"
                        ref = "editor"
                        toolbarOnFocus/>
                    </div> 
                </div>
                <div>
                    JSON
                    <pre >{JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()), null, 1)}</pre>
                </div>
            </div>
        );
    }
}
export default ZEditor;