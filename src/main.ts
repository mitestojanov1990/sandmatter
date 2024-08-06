import Matter from 'matter-js';
import MatterWrap from 'matter-wrap';

// Install the plugin
Matter.use(MatterWrap);

const {
  Engine,
  Render,
  Runner,
  Bodies,
  World,
  Body,
  Mouse,
  MouseConstraint,
  Events,
} = Matter;

// Create engine
const engine = Engine.create();
const world = engine.world;

// Set gravity to zero
engine.gravity.y = 0;

// Create renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: '#f0f0f0',
    hasBounds: true,
  },
});

Render.run(render);

// Create runner
const runner = Runner.create();
Runner.run(runner, engine);

// Add boundaries
const boundaries = [
  Bodies.rectangle(render.options.width / 2, -10, render.options.width, 20, {
    isStatic: true,
  }), // top
  Bodies.rectangle(
    render.options.width / 2,
    render.options.height + 10,
    render.options.width,
    20,
    { isStatic: true }
  ), // bottom
  Bodies.rectangle(
    render.options.width + 10,
    render.options.height / 2,
    20,
    render.options.height,
    { isStatic: true }
  ), // right
  Bodies.rectangle(-10, render.options.height / 2, 20, render.options.height, {
    isStatic: true,
  }), // left
];
World.add(world, boundaries);

// Create sand particles
const createSand = (x: number, y: number, width: number, height: number) => {
  const particles: Matter.Body[] = [];
  const cols = Math.floor(width / 5);
  const rows = Math.floor(height / 5);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const particle = Bodies.circle(x + i * 5, y + j * 5, 2, {
        friction: 0.8,
        frictionAir: 0.1,
        restitution: 0.1,
        render: {
          fillStyle: '#d4af37',
        },
        plugin: {
          wrap: {
            min: { x: 0, y: 0 },
            max: { x: render.canvas.width, y: render.canvas.height },
          },
        },
      }) as Matter.Body & { plugin: { wrap: MatterWrap.WrapOptions } };

      particles.push(particle);
    }
  }

  World.add(world, particles);
};

// Add sand particles to the world
createSand(100, 100, window.innerWidth - 200, window.innerHeight - 200);

// Add a rectangle body that will be controlled
const controllable = Bodies.rectangle(400, 300, 50, 50, {
  friction: 0.8,
  frictionAir: 0.1,
  restitution: 0.1,
  render: {
    fillStyle: 'blue',
  },
});
World.add(world, controllable);

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false,
    },
  },
});

World.add(world, mouseConstraint);

// Keep the mouse in sync with rendering
render.mouse = mouse;

// Handle window resize
window.addEventListener('resize', () => {
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;

  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;

  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: window.innerWidth, y: window.innerHeight },
  });
});

// Camera controls
document.addEventListener('keydown', (event) => {
  const cameraSpeed = 5;
  const bounds = render.bounds;

  switch (event.key) {
    case 'ArrowUp':
      Body.translate(controllable, { x: 0, y: -cameraSpeed });
      break;
    case 'ArrowDown':
      Body.translate(controllable, { x: 0, y: cameraSpeed });
      break;
    case 'ArrowLeft':
      Body.translate(controllable, { x: -cameraSpeed, y: 0 });
      break;
    case 'ArrowRight':
      Body.translate(controllable, { x: cameraSpeed, y: 0 });
      break;
    default:
      break;
  }

  // Keep the object within bounds
  if (controllable.position.y < 0) controllable.position.y = 0;
  if (controllable.position.y > render.canvas.height)
    controllable.position.y = render.canvas.height;
});

// Prevent the controlled object from moving along the y-axis
Events.on(engine, 'beforeUpdate', () => {
  controllable.position.y = render.canvas.height / 2;
  controllable.velocity.y = 0;
});
