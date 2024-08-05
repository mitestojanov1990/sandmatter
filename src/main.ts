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

// create two boxes and a ground
const boxA: Matter.Body = Matter.Bodies.rectangle(400, 200, 80, 80, {
  render: {
    fillStyle: 'red',
    strokeStyle: 'black',
    lineWidth: 1,
  },
});
const boxB: Matter.Body = Matter.Bodies.rectangle(450, 50, 80, 80);
const ground: Matter.Body = Matter.Bodies.rectangle(400, 610, 810, 60, {
  isStatic: true,
});
const circle: Matter.Body = Matter.Bodies.circle(300, 40, 25);

// add all of the bodies to the world
Matter.Composite.add(engine.world, [circle, boxA, boxB, ground]);

document.addEventListener('keydown', (event: KeyboardEvent) => {
  let keyCode = event.keyCode;
  let position: Matter.Vector = boxA.position;
  let speed = 5; // set the speed of movement

  // move the body based on the key pressed
  if (keyCode === 37) {
    // move left
    Matter.Body.translate(boxA, { x: -speed, y: 0 });
  } else if (keyCode === 38) {
    // move up
    Matter.Body.translate(boxA, { x: 0, y: -speed });
  } else if (keyCode === 39) {
    // move right
    Matter.Body.translate(boxA, { x: speed, y: 0 });
  } else if (keyCode === 40) {
    // move down
    Matter.Body.translate(boxA, { x: 0, y: speed });
  }
});

document.body.addEventListener('mousedown', (event: MouseEvent) => {
  const { x, y } = event;
  const newBody: Matter.Body = Matter.Bodies.rectangle(x, y, 50, 50);
  Matter.World.add(engine.world, newBody);
});

// Check for collisions
Matter.Events.on(
  engine,
  'collisionStart',
  (event: Matter.IEventCollision<Matter.Engine>) => {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];

      if (pair.bodyA === boxA && pair.bodyB === circle) {
        // Game over
        alert('Game over!');
        window.location.reload();
      }
    }
  }
);

// run the renderer
Matter.Render.run(render);

// create runner
const runner: Matter.Runner = Matter.Runner.create();

// run the engine
Matter.Runner.run(runner, engine);
