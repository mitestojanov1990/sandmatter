// Module aliases
const { Engine, Render, Runner, Bodies, World } = Matter;

// Create an engine
const engine = Engine.create();
const { world } = engine;

// Create a renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: '#fafafa',
  },
});

Render.run(render);

// Create a runner
const runner = Runner.create();
Runner.run(runner, engine);

// Add bodies
const ground = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight,
  window.innerWidth,
  60,
  { isStatic: true }
);
const wallLeft = Bodies.rectangle(
  0,
  window.innerHeight / 2,
  60,
  window.innerHeight,
  { isStatic: true }
);
const wallRight = Bodies.rectangle(
  window.innerWidth,
  window.innerHeight / 2,
  60,
  window.innerHeight,
  { isStatic: true }
);

World.add(world, [ground, wallLeft, wallRight]);

// Add some random shapes
for (let i = 0; i < 10; i++) {
  const box = Bodies.rectangle(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight,
    80,
    80
  );
  World.add(world, box);
}

// Handle window resize
window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
  Matter.Body.setPosition(ground, {
    x: window.innerWidth / 2,
    y: window.innerHeight,
  });
  Matter.Body.setVertices(
    wallRight,
    Matter.Vertices.rectangle(
      window.innerWidth,
      window.innerHeight / 2,
      60,
      window.innerHeight
    )
  );
});
