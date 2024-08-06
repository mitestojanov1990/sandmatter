// packages/particle-generator/src/generateParticles.test.ts
import { generateParticles, Particle } from './index';

describe('generateParticles', () => {
  it('should not create particles beyond the borders of the given width and height', () => {
    const width = 20;
    const height = 20;
    const density = 0.1;

    // Generate particles
    const particles: Particle[] = generateParticles(width, height, density);

    // Check that no particle is outside the boundaries
    particles.forEach((particle) => {
      expect(particle.x).toBeGreaterThanOrEqual(particle.radius);
      expect(particle.x).toBeLessThanOrEqual(width - particle.radius);
      expect(particle.y).toBeGreaterThanOrEqual(particle.radius);
      expect(particle.y).toBeLessThanOrEqual(height - particle.radius);
    });

    // Check that no particles overlap
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        expect(distance).toBeGreaterThanOrEqual(particles[i].radius * 2);
      }
    }
  });
});
