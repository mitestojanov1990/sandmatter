declare module 'matter-wrap' {
    import Matter from 'matter-js';

    export interface WrapOptions {
      min: Matter.Vector;
      max: Matter.Vector;
    }

    export interface Body extends Matter.Body {
      plugin: {
        wrap: WrapOptions;
      };
    }

    export interface Composite extends Matter.Composite {
      plugin: {
        wrap: WrapOptions;
      };
    }

    export const MatterWrap: {
      name: string;
      version: string;
      for: string;

      install(base: typeof Matter): void;

      Engine: {
        update(engine: Matter.Engine): void;
      };

      Bounds: {
        wrap(objectBounds: Matter.Bounds, bounds: Matter.Bounds): Matter.Vector | undefined;
      };

      Body: {
        wrap(body: Body, bounds: Matter.Bounds): Matter.Vector | undefined;
      };

      Composite: {
        bounds(composite: Composite): Matter.Bounds;
        wrap(composite: Composite, bounds: Matter.Bounds): Matter.Vector | undefined;
      };
    };

    export default MatterWrap;
  }
