import * as Matter from 'matter-js';

// module aliases
const engine: Matter.Engine = Matter.Engine.create();

// create a renderer
const render: Matter.Render = Matter.Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
  },
});

// create ground
const ground: Matter.Body = Matter.Bodies.rectangle(400, 610, 810, 60, {
  isStatic: true,
});

// add ground to the world
Matter.Composite.add(engine.world, [ground]);

// Create sand particles
const createSand = (x: number, y: number, width: number, height: number) => {
  const particles: Matter.Body[] = [];
  const cols = Math.floor(width / 10);
  const rows = Math.floor(height / 10);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const particle = Matter.Bodies.circle(x + i * 10, y + j * 10, 2, {
        friction: 0.1,
        restitution: 0.6,
      });
      particles.push(particle);
    }
  }

  Matter.World.add(engine.world, particles);
};

// Add sand particles to the world
createSand(200, 100, 200, 200);

// run the renderer
Matter.Render.run(render);

// create runner
const runner: Matter.Runner = Matter.Runner.create();

// run the engine
Matter.Runner.run(runner, engine);
