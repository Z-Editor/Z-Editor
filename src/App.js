import React, { Component } from 'react';
import ZEditor from './editor/editor';
import './App.css';
import download from 'downloadjs';
import swal from 'sweetalert2';

class App extends Component {
  state = {
    downloadState: null
  };
  child = React.createRef();

  readFileContent = file => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(file);
    });
  };

  downloadZ = () => {
    let fileName = '';
    swal({
      title: 'Input file Name',
      input: 'text',
      inputPlaceholder: 'File name',
      allowOutsideClick: false,
      showCancelButton: true
    })
      .then(data => {
        fileName = data.value;
        if (fileName) download(JSON.stringify(this.state.downloadState), `${fileName}.ze`, 'text/plain');
      })
      .catch(error => swal('Error!', `Something went wrong!`, 'Error'));
  };

  setDownloadState = state => {
    this.setState({ downloadState: state });
  };

  uploadFile = event => {
    let file = event.target.files[0];
    if (file && file.name.substr(file.name.length - 2) !== 'ze') {
      swal('Warning!', `Not a Z Editor file!`, 'warning');
    } else if (!file) {
      swal('Warning!', `You didn't upload a file!`, 'warning');
    } else {
      this.readFileContent(file)
        .then(content => this.child.current.changeEditorStateByUpload(content))
        .catch(error => console.log(error));
    }
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

          <button
            className="button"
            onClick={() => {
              window.print();
            }}
          >
            Print
          </button>

          <button className="button" onClick={this.downloadZ}>
            Download
          </button>

          <div>
            <label style={{ fontSize: '15px', fontFamily: 'sans-serif' }} className="button" htmlFor="upload-file">
              Import
            </label>
            <input
              style={{
                opacity: 0,
                position: 'absolute',
                zIndex: -1
              }}
              className="button"
              type="file"
              name="myFile"
              onChange={this.uploadFile}
              id="upload-file"
            />
          </div>
        </div>

        <ZEditor ref={this.child} setDownloadState={this.setDownloadState} />
      </div>
    );
  }
}

export default App;
