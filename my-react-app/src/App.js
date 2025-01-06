import logo from './logo.svg';
import './App.scss';
import React, {useState} from 'react';



function GenerateButton() {
  return (
      <button>generate a random graph</button>
  );
}

function NRangeSlider() {
  const [value, setValue] = useState(0); 
  const MAX = 100; 
  const getBackgroundSize = () => { 
  return { backgroundSize: `${(value * 100) / MAX}% 100%` }; }; 

  return (
    <input type="range" 
    min="0" 
    max={MAX} 
    onChange={(e) => setValue(e.target.value)} 
    style={getBackgroundSize()} value={value} 
    />
  );
}

function PRangeSlider() {
  const [value, setValue] = useState(0); 
  const MAX = 1; 
  const getBackgroundSize = () => { 
  return { backgroundSize: `${(value * 100) / MAX}% 100%` }; }; 

  return (
    <input type="range" 
    min="0" 
    max={MAX} 
    onChange={(e) => setValue(e.target.value)} 
    style={getBackgroundSize()} value={value} 
    step="0.01"
    />
  );
}


export default function MyApp() {
  return (
      <div>
        <NRangeSlider />
        <PRangeSlider />
        <br></br>
        <GenerateButton />
      </div>
  );
}

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
