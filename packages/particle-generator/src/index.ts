export interface Velocity {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: Velocity;
  draw(ctx: CanvasRenderingContext2D): void;
  update(ctx: HTMLCanvasElement): void;
}

export function generateParticles(
  width: number,
  height: number,
  density: number,
): Particle[] {
  const particles: Particle[] = [];
  const numParticles = Math.floor(width * height * density);
  const radius = 5;

  for (let i = 0; i < numParticles; i++) {
    let x: number = 0;
    let y: number = 0;
    let validPosition = false;

    // Try to find a valid position for the new particle
    while (!validPosition) {
      // Start with a random position
      x = Math.random() * (width - radius * 2) + radius;
      y = Math.random() * (height - radius * 2) + radius;

      validPosition = particles.every((particle) => {
        const dx = x - particle.x;
        const dy = y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance >= radius * 2;
      });

      // If no particles yet, position is valid
      if (particles.length === 0) {
        validPosition = true;
      }
    }

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
    } as Particle);
  }
  return particles;
}
export function rotate(velocity: Velocity, angle: number): Velocity {
  return {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };
}
export function getCellKey(x: number, y: number, cellSize: number): string {
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);
  return `${cellX},${cellY}`;
}

export function resolveCollision(particle: Particle, otherParticle: Particle) {
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
