import React, { Component } from 'react';
import ZEditor from './editor/editor'
import './App.css';

class App extends Component {
    onClick() {
    this.setState({childVisible: !this.state.childVisible});
    }
  
    render() {
        return (
            <div className="flex-container">
              <div className="head">
                    <div className="logo">Z-Editor</div>
                    <a className="github-button" href="https://github.com/Open-SL/Z-TOOL" target="_blank">
                        View on Github
                    </a>
                    <button className="button">
                        See JSON
                    </button>
                </div>
                
                <ZEditor/>
                
            </div>
        );
    }
}

export default App;
