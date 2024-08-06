import {
  Velocity,
  Particle as ParticleType,
} from '@dimitrycode/particle-generator/src';
const friction = 0.9;

export class Particle implements ParticleType {
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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update(canvas: HTMLCanvasElement) {
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

    this.draw(canvas.getContext('2d') as CanvasRenderingContext2D);
  }
}
