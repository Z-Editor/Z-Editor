import React, { Component } from 'react';
import ZEditor from './editor/editor';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="flex-container">
        <div className="head">
          <div className="logo">Z-Editor</div>
          <a
            className="github-button"
            href="https://github.com/Z-Editor/Z-Editor"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Github
          </a>
          <button
            className="button"
            onClick={() => {
              window.print();
            }}
          >
            Print
          </button>
        </div>

        <ZEditor />
      </div>
    );
  }
}

export default App;
