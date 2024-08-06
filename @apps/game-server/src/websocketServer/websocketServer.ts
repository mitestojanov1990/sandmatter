import { Server } from 'http';
import { WebSocket, WebSocketServer as WSServer } from 'ws';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: { x: number; y: number };
}

interface Config {
  canBounce: boolean;
  canConnect: boolean;
}

const particles: Particle[] = [];
const canvasWidth = 800;
const canvasHeight = 600;
const friction = 0.9;
const updateInterval = 60000 / 60; // Update at 60 FPS
const chunkSize = 100; // Number of particles per chunk

const config: Config = {
  canBounce: true,
  canConnect: false,
};

function generateParticles(width: number, height: number, density: number) {
  const numParticles = Math.floor(width * height * density);
  for (let i = 0; i < numParticles; i++) {
    const radius = 5;
    const x = Math.random() * (width - radius * 2) + radius;
    const y = Math.random() * (height - radius * 2) + radius;
    const color = 'red';
    particles.push({
      x,
      y,
      radius,
      color,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
    });
  }
}

function resolveCollision(particle: Particle, otherParticle: Particle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x,
    );

    const m1 = particle.radius;
    const m2 = otherParticle.radius;

    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

function rotate(velocity: { x: number; y: number }, angle: number) {
  return {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };
}

function updateParticles() {
  particles.forEach((particle) => {
    if (
      particle.y + particle.radius + particle.velocity.y > canvasHeight ||
      particle.y - particle.radius <= 0
    ) {
      particle.velocity.y = -particle.velocity.y * friction;
    }

    if (
      particle.x + particle.radius + particle.velocity.x > canvasWidth ||
      particle.x - particle.radius <= 0
    ) {
      particle.velocity.x = -particle.velocity.x * friction;
    }

    particle.x += particle.velocity.x;
    particle.y += particle.velocity.y;
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dist = Math.hypot(
        particles[i].x - particles[j].x,
        particles[i].y - particles[j].y,
      );
      if (dist - particles[i].radius * 2 < 0) {
        resolveCollision(particles[i], particles[j]);
      }
    }
  }
}

function sendParticlesInChunks(ws: WebSocket) {
  let chunkIndex = 0;

  const sendChunk = () => {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, particles.length);
    const chunk = particles.slice(start, end);

    if (chunk.length > 0) {
      ws.send(JSON.stringify(chunk));
      chunkIndex++;
      setTimeout(sendChunk, 50); // Send next chunk after a short delay
    }
  };

  sendChunk();
}

class WebSocketServer {
  private wss: WSServer;

  constructor(server: Server) {
    this.wss = new WSServer({ server });

    // Generate particles at startup
    generateParticles(canvasWidth, canvasHeight, 0.8);

    this.wss.on('connection', (ws) => {
      console.log('Client connected');
      sendParticlesInChunks(ws);

      // const updateIntervalId = setInterval(() => {
      //   updateParticles();
      //   sendParticlesInChunks(ws);
      // }, updateInterval);

      ws.on('close', () => {
        console.log('Client disconnected');
        //clearInterval(updateIntervalId);
      });
    });
  }
}

export default WebSocketServer;
