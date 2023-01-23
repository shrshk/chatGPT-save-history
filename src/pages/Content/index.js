import { printLine } from './modules/print';
import React from 'react';
import ReactDOM from 'react-dom';
import Turndown from 'turndown';

// Import the component that you want to render
import FabComp from './FabComp';

// Create the container element
const container = document.createElement("div");

// Set the ID of the container element
container.id = "my-container";

// Append the container element to the body
document.body.appendChild(container);

if (window.location.hostname === 'chat.openai.com') {
  ReactDOM.render(<FabComp />, container);
}


console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

console.log(window.location.hostname + ' hostName is');

    // var button = document.createElement('button');
    // console.log('button comes now');
    // button.innerHTML = 'Click me Shirish';
    // document.body.appendChild(button);

// // Create the iframe element
// var iframe = document.createElement("iframe");
//
// // Set the src attribute to the URL of the page you want to display in the iframe
// iframe.src = "https://example.com";
//
// // Set the width and height of the iframe
// iframe.width = "800";
// iframe.height = "600";
//
// // Append the iframe to the body of the page
// document.body.appendChild(iframe);


// if (window.location.hostname === 'chat.openai.com') {

// }

