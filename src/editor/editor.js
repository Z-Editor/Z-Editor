import React, { Component } from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import {insertTeXBlock} from './insert';
import {convertToRaw, convertFromRaw, Entity, Modifier, CompositeDecorator} from 'draft-js';
import '../App.css';

function findPlaceholders(contentBlock, callback) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            Entity.get(entityKey).getType() === 'PLACEHOLDER'
        );
    }, callback);
}

class ZEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {editorState: EditorState.createEmpty()};
        this.onChange = (editorState) => this.setState({editorState});
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    _insertT = () => {
      this.setState({
        editorState: insertTeXBlock(this.state.editorState),
      });
    }

    insertPlaceholder = () => {
        const label = "|----------------------------- \n|makeMilkCoffee \n|ΔtheCoffeeMachine \n|coffee? : ℕ \n|milk? : ℕ \n|------------------------- \n|coffee   0 \n|milk   0 \n|coffee  halfCupCapacity \n|milk  halfCupCapacity \n|------------------------- \n "
        const meta = "test test"
        const editorState = this.state.editorState;
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const entityKey = Entity.create('unstyled', 'IMMUTABLE', {meta});
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

    render() {
        return (
        <div className="container-content">
        <button onClick={this._insertT}>
            {'Insert'}
        </button>
        <button type="button" onClick={this.insertPlaceholder}>
            {'Insert 2'}
        </button>
        <div className="Zeditor-root">
            <div className="Zeditor-editor">
                <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            ref="editor"
            onChange={this.onChange}
            />
            </div>
        </div>
        </div>
        );
    }
}
export default ZEditor;