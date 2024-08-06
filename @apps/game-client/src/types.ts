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
