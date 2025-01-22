import logo from './logo.svg';
import './App.scss';
import React, {useState} from 'react';
import $ from 'jquery';


var button = document.getElementById("generate");

var n = 1;
var p = 0.00;
var adjlist = [[0]];
var nodecoord = [[200,200]];
var selectednode = -1;

var canvas = document.getElementById("graphenv");
var context = canvas.getContext('2d');

var $canvas = $("#graphenv");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();

var startX;
var startY;
var mouseX;
var mouseY;

//drawing parameters
var lw = 1;
var alpha = 1;
var r = 10;
var nodestroke = 0.2*r;

function draw() {
  //i could use a preset library here but what's the fun in that
  //printing the adjacency list
  canvas = document.getElementById("graphenv");
  context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height); 
  //canvas.innerText = adjlist.map(row => row.join(', ')).join('\n');

  //assigning random coordinates to each point, ensuring no overlap or out of bounds errors
  //so it's gonna be nx2 array (and this will likely be very inefficient)

  if (n*p < 4) {
    lw = 1;
    alpha = 0.8;
  } else if (n*p < 8) {
    lw = 0.8;
    alpha = 0.6;
  } else if (n*p < 12) {
    lw = 0.6;
    alpha = 0.4;
  } else {
    lw = 0.4;
    alpha = 0.2;
  }

  if (n < 10) {
    r = 20;
  } else if (n < 20) {
    r = 12;
  } else if (n < 30) {
    r = 8;
  } else {
    r = 6;
  }

  //plot edges

  for (var i3 = 0; i3 < n; i3++) {
    for (var j3 = i3; j3 < n; j3++) {
      if (adjlist[i3][j3] === 1) {
        
        
        context.fillStyle = "rgb(80,80,80," + toString(alpha) + ")";
        context.lineWidth = lw;
        context.beginPath();
        context.moveTo(nodecoord[i3][0], nodecoord[i3][1]);
        context.lineTo(nodecoord[j3][0], nodecoord[j3][1]);
        context.closePath();
        context.stroke();
      }
    }
  }
  //plot each point (this may not be the most well-maintained code)

  for (var k = 0; k < n; k++) {
    //drawcircle
    context.strokeStyle = "#000000";
    context.lineWidth = nodestroke;
    context.fillStyle = "#a2bffe";
    context.beginPath();
    context.arc(nodecoord[k][0], nodecoord[k][1], r, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
  }
  //canvas.innerText = nodecoord.map(row => row.join(', ')).join('\n');
  //
}


draw(); //not updatable?

function nodehittest(x, y, nodeidx) {
  var node = nodecoord[nodeidx];
  return (x >= node[0] && x <= node[0] + r && y >= node[1] - r && y <= node[1]);
}

//add nodes draggable functionality
//code from https://jsfiddle.net/m1erickson/AGd6u/
function handleMouseDown(e) {
  e.preventDefault();
  startX = parseInt(e.clientX - offsetX);
  startY = parseInt(e.clientY - offsetY);

  for (var i = 0; i < nodecoord.length; i++) {
    if (nodehittest(startX, startY, i)) {
        selectednode = i;
    }
}
}

function handleMouseUp(e) {
  e.preventDefault();
  selectednode = -1;
}

function handleMouseOut(e) {
  e.preventDefault();
  selectednode = -1;
}

// handle mousemove events
// calc how far the mouse has been dragged since
// the last mousemove event and move the selected text
// by that distance
function handleMouseMove(e) {
  if (selectednode < 0) {
      return;
  }
  e.preventDefault();
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  // Put your mousemove stuff here
  var dx = mouseX - startX;
  var dy = mouseY - startY;
  startX = mouseX;
  startY = mouseY;

  var node = nodecoord[selectednode];
  node[0] += dx;
  node[1] += dy;
  draw();
}

// listen for mouse events

canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  handleMouseMove(e);
  //still bugged
  //context.clearRect(20,80,200,60);
  //context.fillText("MouseX: " + mouseX, 30, 100);
  //context.fillText("MouseY: " + mouseY, 30, 120);
 // document.getElementById('coordinates').textContent = `X: ${x}, Y: ${y}`;
});

canvas.addEventListener('mousedown', (e) => {handleMouseDown(e);});
canvas.addEventListener('mouseup', (e) => {handleMouseUp(e);});
canvas.addEventListener('mouseout', (e) => {handleMouseOut(e);});


function generateGraph(n, p) {
  //actually build the graph here
  canvas = document.getElementById("graphenv");
  context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height); 

  adjlist = new Array(n);
  for (var i1 = 0; i1 < n; i1++) {
    adjlist[i1] = new Array(n);
    for (var j1 = 0; j1 < n; j1++) {
      adjlist[i1][j1] = 0;
    }
  }
  for (var i2 = 0; i2 < n; i2++) {
    for (var j2 = i2; j2 < n; j2++) {
      let sample = Math.random();
      if (sample <= p) {
        adjlist[i2][j2] = 1;
        adjlist[j2][i2] = 1;
      } 
    }
  }
  //we should color nodes based on component or by degree

  const collisioncutoff = 3*r;
  const margin = 50;
  nodecoord = new Array(n);
  for (var i = 0; i < n; i++) {
    nodecoord[i] = new Array(2);
    var valid = false; // no overlap
    while (!valid) {
      valid = true;
      //generate coords, check overlap (euclidean distance < 40)
      let x = Math.random() * canvas.clientWidth;
      let y = Math.random() * canvas.clientHeight;
      if (x < margin || x > canvas.clientWidth - margin || y < margin || y > canvas.clientHeight - margin) {
        valid = false;
      }
      for (var j = 0; j < i; j++) {
        if (Math.sqrt((x - nodecoord[j][0])**2 + (y - nodecoord[j][1]) **2) < collisioncutoff) {
          valid = false;
        }
      }
      if (valid) {
        nodecoord[i][0] = x;
        nodecoord[i][1] = y;
      }
    }
  }
  draw();
  

}


var cooldownTime = 2000;
var isOnCooldown = false;

button.addEventListener("click", () => {
  
  if (!isOnCooldown) {
    //now i just need to write a function for it and add environment
    //alert("generating your graph (n=" + n + ", p=" + p + ")"); 
    generateGraph(n, p);
    isOnCooldown = true;
    button.disabled = true;
    setTimeout((cooldownTime) => {
      isOnCooldown = false;
      button.disabled = false;
    }, cooldownTime);
  }
});

function NRangeSlider() {
  let [value, setValue] = useState(1); 
  const MAX = 50; 
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
