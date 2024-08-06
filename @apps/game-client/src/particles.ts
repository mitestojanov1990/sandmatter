import { Particle } from './types';
import { Particle as ParticleClass } from './classes/Particle';

const particles: Particle[] = [];

export function initializeParticles(data: Particle[]) {
  data.forEach((p) => {
    particles.push(new ParticleClass(p.x, p.y, p.radius, p.color));
  });
}

export function updateParticles(data: Particle[]) {
  data.forEach((p) => {
    const existingParticle = particles.find(
      (particle) => particle.x === p.x && particle.y === p.y,
    );
    if (existingParticle) {
      existingParticle.x = p.x;
      existingParticle.y = p.y;
      existingParticle.velocity = p.velocity;
    } else {
      particles.push(new ParticleClass(p.x, p.y, p.radius, p.color));
    }
  });
}

export function getParticles() {
  return particles;
}
