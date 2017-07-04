'use strict';

import React, { Component } from 'react';
import ZEditor from './editor/editor'
import './App.css';

class App extends Component {
  renderSide(){
       return (
           <div className="sidepanel">
               <span className="info">Drag & Drop area</span>
           </div>
       )
    }
    render() {
        return (
            <div className="flex-container">
              <div className="head">
                    <div className="logo">Z-Tool</div>
                    <a className="github-button" href="https://github.com/Open-SL/Z-TOOL" target="_blank">
                        View on Github
                    </a>
                    <button className="button">
                        See JSON
                    </button>
                    <button className="button">
                        See Editor
                    </button>
                    <button className="button">
                        Clear
                    </button>
                </div>
                {this.renderSide()}
                <div className="container-content">
                    <div className="TeXEditor-root">
                        <div className="TeXEditor-editor">
                          <ZEditor/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
