import { connectWebSocket } from './websocket';
import { getParticles } from './particles';
import { config } from './config';
import { Particle } from './types';
import { resolveCollision, getCellKey } from './utils/collision';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cellSize = 50;

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const grid: { [key: string]: Particle[] } = {};

  const particles = getParticles();

  particles.forEach((particle) => {
    const cell = getCellKey(particle.x, particle.y, cellSize);

    if (!grid[cell]) {
      grid[cell] = [];
    }

    grid[cell].push(particle);
  });

  particles.forEach((particle) => {
    try {
      const cell = getCellKey(particle.x, particle.y, cellSize);
      const neighbors = [
        ...grid[cell],
        ...(grid[getCellKey(particle.x - cellSize, particle.y, cellSize)] ||
          []),
        ...(grid[getCellKey(particle.x + cellSize, particle.y, cellSize)] ||
          []),
        ...(grid[getCellKey(particle.x, particle.y - cellSize, cellSize)] ||
          []),
        ...(grid[getCellKey(particle.x, particle.y + cellSize, cellSize)] ||
          []),
        ...(grid[
          getCellKey(particle.x - cellSize, particle.y - cellSize, cellSize)
        ] || []),
        ...(grid[
          getCellKey(particle.x - cellSize, particle.y + cellSize, cellSize)
        ] || []),
        ...(grid[
          getCellKey(particle.x + cellSize, particle.y - cellSize, cellSize)
        ] || []),
        ...(grid[
          getCellKey(particle.x + cellSize, particle.y + cellSize, cellSize)
        ] || []),
      ];
    } catch (error) {
      console.log(error);
    }
    if (config.canBounce) {
      neighbors.forEach((neighbor) => {
        if (particle !== neighbor) {
          const dist = Math.hypot(
            particle.x - neighbor.x,
            particle.y - neighbor.y,
          );
          if (dist - particle.radius * 2 < 0) {
            resolveCollision(particle, neighbor);
          }
        }
      });
    }

    particle.update(canvas);
  });
}

connectWebSocket();
animate();
