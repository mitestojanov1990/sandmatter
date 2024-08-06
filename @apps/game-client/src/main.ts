import { Particle } from './classes/Particle';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles: Particle[] = [];

export function initializeParticles(data: any[]) {
  data.forEach((p) => {
    particles.push(new Particle(p.x, p.y, p.radius, p.color));
  });

  animate();
}

export function updateParticles(data: any[]) {
  data.forEach((p) => {
    particles.push(new Particle(p.x, p.y, p.radius, p.color));
  });
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
  });
}

import './websocket';
