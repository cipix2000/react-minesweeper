import React, { Component } from 'react';
import Board from './Board';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Minesweeper React</h2>
        </div>
        <div className="App-body">
            <Board></Board>
        </div>
      </div>
    );
  }
}

export default App;
