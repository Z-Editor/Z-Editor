# Z-Editor 
[![Build Status](https://img.shields.io/travis/Z-Editor/Z-Editor/master.svg?)](https://travis-ci.org/Z-Editor/Z-Editor)  [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Z-Editor/Z-Editor/issues)

A tool to create, edit and print formal [Z-notation](https://en.wikipedia.org/wiki/Z_notation) documents.

Try out the **[Demo](https://z-editor.github.io/)**.

<img src="https://github.com/Z-Editor/Z-Editor/blob/master/gif/demo.gif" width="800" height="400">

### Table of Contents
- [Features](#features)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Build](#build)
  - [Start](#start)
- [Todo](#todo)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)
- [License](#license)

### Features

* Z-Editor supports following notations in the toolbar,
    - Schemas
    - Logics
    - Sets
    - Relations
    - Functions
    - Sequences
    - Bags
* Download Z-Editor work as a PDF or a ZE file.
* Import a ZE file to the editor and continue work.
* Iconic schemas were created using [draft.js](https://draftjs.org/) blocks.
* Rich Text Utilities.

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- git
- npm

### Install
```
git clone https://github.com/Z-Editor/Z-Editor.git
cd Z-Editor
npm install
```

### Build
```
npm run build
``` 

### Start
```
npm run start
``` 

## Todo
1. [ ]  Loose the coupling between **react-draft-wysiwyg** and Z-Editor.
    * Current version of **react-draft-wysiwyg** doesn't support ref and few other problems were the reasons to add the edited version of [react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg).

## Contributing

- We would greatly appreciate any [contribution](CONTRIBUTING.md) you make. 
- If you have ideas for more functionality or recipes that should be on this project, [let us know](https://github.com/Z-Editor/Z-Editor/issues).

## Acknowledgments

- Original repo is from [Open-SL](https://github.com/Open-SL).
- Z-Editor is inspired by [draft-wysiwyg](https://github.com/bkniffler/draft-wysiwyg) and [react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg).


## License
Z-Editor  is under the MIT license. See the [License](LICENSE) for more information.
