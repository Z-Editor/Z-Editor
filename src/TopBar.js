import React, { Component } from 'react';

class TopBar extends Component {
    render() {
        return (
            <div className="head">
                    <div className="logo">Z-Editor</div>
                    <a className="github-button" href="https://github.com/Z-Editor/Z-Editor" target="_blank">
                        View on Github
                    </a>
                    <button className="button" onClick={() => {window.print()}}>
                        Print
                    </button>
                </div>
        );
    }
}

export default TopBar;