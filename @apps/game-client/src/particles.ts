import { Particle } from './classes/Particle';

const particles: Particle[] = [];

export function initializeParticles(data: any[]) {
  data.forEach((p) => {
    particles.push(new Particle(p.x, p.y, p.radius, p.color));
  });
}

export function updateParticles(data: any[]) {
  data.forEach((p) => {
    const existingParticle = particles.find(
      (particle) => particle.x === p.x && particle.y === p.y,
    );
    if (existingParticle) {
      existingParticle.x = p.x;
      existingParticle.y = p.y;
      existingParticle.velocity = p.velocity;
    } else {
      particles.push(new Particle(p.x, p.y, p.radius, p.color));
    }
  });
}

export function getParticles() {
  return particles;
}
