const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const friction = 0.9;
export type Velocity = {
  x: number;
  y: number;
};
export class Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: Velocity;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    };
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    if (
      this.y + this.radius + this.velocity.y > canvas.height ||
      this.y - this.radius <= 0
    ) {
      this.velocity.y = -this.velocity.y * friction;
    }

    if (
      this.x + this.radius + this.velocity.x > canvas.width ||
      this.x - this.radius <= 0
    ) {
      this.velocity.x = -this.velocity.x * friction;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.draw();
  }
}
