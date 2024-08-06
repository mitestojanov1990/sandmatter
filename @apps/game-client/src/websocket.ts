import { initializeParticles, updateParticles } from './particles';

let ws: WebSocket;

export function connectWebSocket() {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('Connected to server');
    ws.send(
      JSON.stringify({ width: window.innerWidth, height: window.innerHeight }),
    );
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.particles) {
      if (data.isInitial) {
        initializeParticles(data.particles);
      } else {
        updateParticles(data.particles);
      }
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
