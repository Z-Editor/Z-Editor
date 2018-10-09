# Z-Editor

A tool to edit and create your formal [Z-notation](https://en.wikipedia.org/wiki/Z_notation) documents.

Try the **[Demo](https://z-editor.github.io/)**

<img src="https://github.com/Z-Editor/Z-Editor/blob/master/gif/demo.gif" width="800" height="400">

Finally hit the **print** button to take a copy of your Z-Notation Document.

Original repo is from [Open-SL](https://github.com/Open-SL) and inspired from [draft-wysiwyg](https://github.com/bkniffler/draft-wysiwyg) and [react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg).

### Getting started

```
git clone https://github.com/Z-Editor/Z-Editor.git
cd Z-Editor
npm start
```

in your console run
```
npm run build
``` 
to build the project

to be more familiarized with the react boilerplate find getting started from [create-react-app](https://github.com/facebookincubator/create-react-app#getting-started)

### Functionalities

Iconic schemas were created using [draft.js](https://draftjs.org/) blocks.

you can find,

- Schemas
- Logics
- Sets
- Relations
- Functions
- Sequences
- Bags

notations in Z-Editor toolbar

Rich Text Utilities were added make your life more easier

### Todo
- [ ]  implement a method save as file and upload and edit method
- [ ]  loose the coupling between rdw and Z-Editor (current version of **react-draft-wysiwyg** doesn't support ref and few problems were the reasons to add the edited version of [react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg))

## Something Missing?

If you have ideas for more or recipes that should be on this project, [let us know](https://github.com/Z-Editor/Z-Editor/issues) or [contribute](CONTRIBUTING.md
) some!

## License
Z-Editor is open-sourced software licensed under the [MIT License](LICENSE).
