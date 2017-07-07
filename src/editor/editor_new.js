// extracted from https://github.com/facebook/draft-js/issues/852

const React = require('react');
const {Editor, EditorState, convertToRaw, convertFromRaw, Entity, Modifier, CompositeDecorator} = require('draft-js');

const rawContent = {
  blocks: [
    {
      text: 'Hey First name',
      type: 'unstyled',
      entityRanges: [{key: 'first', length: 10, offset: 4}]
    },
    {
      text: '',
      type: 'unstyled',
    },
    {
      text: 'Placeholders can be inserted at the cursor position by clicking that button up there.',
      type: 'unstyled',
    },
  ],
  entityMap: {
    first: {
      type: 'PLACEHOLDER',
      mutability: 'IMMUTABLE',
      data: {
        content: 'firstName', // can be whatever
      },
    },
  },
};

const styles = {
    editor: {
        border: '1px solid gray',
        minHeight: 300,
        cursor: 'text',
    },
    placeholder: {
        display: 'inline-block',
        background: 'lightBlue',
        padding: '0 10px',
        borderRadius: 99
    },
};

const Placeholder = props => (
    <span {...props} style={styles.placeholder}>
        {props.children}
    </span>
);

const decorator = new CompositeDecorator([{
    strategy: findPlaceholders,
    component: Placeholder,
}]);


function findPlaceholders(contentBlock, callback) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            Entity.get(entityKey).getType() === 'PLACEHOLDER'
        );
    }, callback);
}

module.exports = React.createClass({
    getInitialState() {
        return {
            editorState: EditorState.createWithContent(convertFromRaw(rawContent), decorator)
        }
    },

    onChange(editorState) {
        this.setState({editorState})
    },

    logState() {
        const content = this.state.editorState.getCurrentContent();
        console.log(convertToRaw(content));
    },

    insertPlaceholder(label, meta) {
        const editorState = this.state.editorState;
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const entityKey = Entity.create('PLACEHOLDER', 'IMMUTABLE', {meta});
        const textWithEntity = Modifier.insertText(currentContent, selection, label, null, entityKey);

        this.setState({
            editorState: EditorState.push(editorState, textWithEntity, 'insert-characters')
        }, () => {
            this.focus();
        });
    },

    focus() {
        this.refs.editor.focus();
    },

    render() {
        return (
            <div>
                <button type="button" onClick={this.insertPlaceholder.bind(null, 'test', 'Some thing about some thing')}>
                    Some thing
                </button>
                <div style={styles.editor} onClick={this.focus}>
                    <Editor editorState={this.state.editorState}
                            ref="editor"
                            onChange={this.onChange} />
                </div>
                <button type="button" onClick={this.logState}>Log</button>
            </div>
        );
    }
});