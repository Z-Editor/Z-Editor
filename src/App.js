import React, { Component } from 'react';
import ZEditor from './editor/editor';
import './App.css';
import download from 'downloadjs';

class App extends Component {
  state = {
    downloadState: null
  };

  importZ = () => {
    console.log('test');
  };

  downloadZ = () => {
    download(JSON.stringify(this.state.downloadState), 'download.ze', 'text/plain');
  };

  setDownloadState = state => {
    this.setState({ downloadState: state });
  };

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
          <button className="button" onClick={this.importZ}>
            Import
          </button>
          <button className="button" onClick={this.downloadZ}>
            Download
          </button>
          <button
            className="button"
            onClick={() => {
              window.print();
            }}
          >
            Print
          </button>
        </div>

        <ZEditor setDownloadState={this.setDownloadState} />
      </div>
    );
  }
}

export default App;
