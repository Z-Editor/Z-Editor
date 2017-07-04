'use strict';

import React, { Component } from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import {insertTeXBlock} from './insert';

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
        <div>
        <button onClick={this._insertT}>
          {'Insert'}
        </button>
        <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
        />
        </div>
        );
    }
}
export default ZEditor;