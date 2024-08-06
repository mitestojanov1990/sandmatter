import Matter from 'matter-js';
import MatterWrap from 'matter-wrap';

// Install the plugin
Matter.use(MatterWrap);

const Example = {};

Example.basic = function() {
  // module aliases
  const { Engine, Runner, Render, World, Body, Mouse, Common, Bodies, Composites } = Matter;

  // create engine
  const engine = Engine.create();

  // create renderer
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: Math.min(document.body.clientWidth, 1024),
      height: Math.min(document.body.clientHeight, 1024),
      wireframes: false,
    },
  });

  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // create demo scene
  const world = engine.world;
  world.gravity.scale = 0;

  // add some random bodies
  for (let i = 0; i < 150; i += 1) {
    const body = Bodies.polygon(
      Common.random(0, render.options.width),
      Common.random(0, render.options.height),
      Common.random(1, 5),
      Common.random() > 0.9 ? Common.random(15, 25) : Common.random(5, 10),
      {
        friction: 0,
        frictionAir: 0,

        // set the body's wrapping bounds
        plugin: {
          wrap: {
            min: { x: 0, y: 0 },
            max: { x: render.canvas.width, y: render.canvas.height },
          },
        },
      }
    ) as Matter.Body & { plugin: { wrap: MatterWrap.WrapOptions } };

    Body.setVelocity(body, {
      x: Common.random(-3, 3) + 3,
      y: Common.random(-3, 3) + 3,
    });

    World.add(world, body);
  }

  // add a composite
  const car = Composites.car(150, 100, 100, 30, 20);

  // set the composite's wrapping bounds
  (car as Matter.Composite & { plugin: { wrap: MatterWrap.WrapOptions } }).plugin.wrap = {
    min: { x: 0, y: 0 },
    max: { x: render.canvas.width, y: render.canvas.height },
  };

  for (let i = 0; i < car.bodies.length; i += 1) {
    Body.setVelocity(car.bodies[i], {
      x: Common.random(-3, 3) + 3,
      y: Common.random(-3, 3) + 3,
    });
  }

  World.add(world, car);

  // add mouse control
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });

  World.add(world, mouseConstraint);

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function() {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
  };
};

// Initialize the example
Example.basic();
