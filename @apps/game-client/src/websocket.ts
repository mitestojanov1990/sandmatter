import { initializeParticles, updateParticles } from './main';

let particles = [];
let ws;

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('Connected to server');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (particles.length === 0) {
      initializeParticles(data);
    } else {
      updateParticles(data);
    }
  };

  ws.onclose = () => {
    console.log('Disconnected from server');
    setTimeout(connectWebSocket, 1000); // Try to reconnect after 1 second
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

connectWebSocket();
