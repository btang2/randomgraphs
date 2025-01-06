import logo from './logo.svg';
import './App.scss';
import React, {useState} from 'react';



var button = document.getElementById("generate");
let cooldownTime= 2000;
let isOnCooldown = false;

var n = 1;
var p = 0.00;


function generateGraph(n, p) {
  //actually build the graph here
  var adjlist = new Array(n);
  for (var i = 0; i < n; i++) {
    adjlist[i] = new Array(n);
    for (var j = 0; j < n; j++) {
      let sample = Math.random();
      if (sample <= p) {
        adjlist[i][j] = 1;
      } else {
        adjlist[i][j] = 0;
      }
    }
  }
  //i could use a preset library here but what's the fun in that
  var canvas = document.getElementById("graphenv");
  canvas.innerText = adjlist.map(row => row.join(', ')).join('\n');

}



button.addEventListener("click", () => {
  if (!isOnCooldown) {
    //now i just need to write a function for it and add environment
    alert("generating your graph (n=" + n + ", p=" + p + ")"); 
    generateGraph(n, p);
    isOnCooldown = true;
    button.disabled = true;
    setTimeout(() => {
      isOnCooldown = false;
      button.disabled = false;
    }, cooldownTime);
  }
});

function NRangeSlider() {
  let [value, setValue] = useState(1); 
  const MAX = 99; 
  const getBackgroundSize = () => { 
  return { backgroundSize: `${((value-1) * 100) / MAX}% 100%` }; }; 
  const getValue = () => {
    n = value;
    return value;
  }
  //weird centering thing causing elements to move around (unsolved)
  return (
    <div>
    <span>n: </span>
    <input type="range" 
    id="nslider"
    min="1" 
    max={MAX} 
    onChange={(e) => setValue(e.target.value)} 
    style={getBackgroundSize()} value={value} 
    />
    <span>{getValue()}</span>
    
    </div>
  );
}

function PRangeSlider() {
  let [value, setValue] = useState(0.00); 
  const MAX = 1; 
  const getBackgroundSize = () => { 
  return { backgroundSize: `${(value * 100) / MAX}% 100%` }; }; 
  const getValue = () => {
    p = value;
    return value;
  }
  
  return (
    <div>
    <span>p: </span>
    <input type="range" 
    id="pslider"
    min="0.00" 
    max={MAX} 
    onChange={(e) => setValue(e.target.value)} 
    style={getBackgroundSize()} value={value}
    step="0.01" 
    />
    <span>{getValue()}</span>
    
    
    </div>
  );
}



export default function MyApp() {
  return (
      <div>
        <NRangeSlider />
        
        <PRangeSlider />
        <br></br>
        
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
