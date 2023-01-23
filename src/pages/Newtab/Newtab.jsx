import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import SmartToySharpIcon from '@mui/icons-material/SmartToySharp';
import Fab from '@mui/material/Fab';

const fabStyle = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed'
}

const Newtab = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Newtab/Newtab.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React Shirish!
        </a>
        <h6>The color of this paragraph is defined using SASS.</h6>
        <Fab style={fabStyle} aria-label="chatGPT" onClick={() => console.log('fab clicked')}>
          <SmartToySharpIcon />
        </Fab>
      </header>
    </div>
  );
};

export default Newtab;
