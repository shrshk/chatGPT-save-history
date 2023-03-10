import React from 'react';
import ReactDOM from 'react-dom';

// Import the component that you want to render
import { FabComp } from './FabComp';

// Create the container element
const container = document.createElement("div");

// Set the ID of the container element
container.id = "my-container";

// Append the container element to the body
document.body.appendChild(container);

if (window.location.hostname === 'chat.openai.com') {
  ReactDOM.render(<FabComp />, container);
}

