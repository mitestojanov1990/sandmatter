export function generateParticles(screenWidth: number, screenHeight: number, density: number) {
  const particles = [];
  const numParticles = screenWidth * screenHeight * density;

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * screenWidth,
      y: Math.random() * screenHeight,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
    });
  }

  return particles;
}
