import React, { Component } from 'react';
import ZEditor from './editor/editor';
import TopBar from './TopBar';
import './App.css';

class App extends Component {

    render() {
        return (
            <div className="flex-container">

                <TopBar />

                <ZEditor />

            </div>
        );
    }
}

export default App;
