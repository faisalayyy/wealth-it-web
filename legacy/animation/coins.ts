import Matter from 'matter-js';

/**
 * The currency coins. When the section reaches the top of the screen, a few dozen coins — the
 * eight currencies a Wealth-it wallet can hold — drop in from above, bounce off the converter and
 * pile up along the bottom. They can be picked up and thrown with the mouse, and a fast scroll past
 * the middle of the section knocks them into the air. Physics only runs while the section is on
 * screen.
 */
export const CURRENCIES = [
  { code: 'AED', sym: 'dirham', fill: '#C8F24E', ink: '#0B0D0C' },
  { code: 'USD', sym: '$', fill: '#5BC98C', ink: '#0B0D0C' },
  { code: 'EUR', sym: '€', fill: '#8E9BC4', ink: '#0B0D0C' },
  { code: 'GBP', sym: '£', fill: '#B889B0', ink: '#0B0D0C' },
  { code: 'SAR', sym: 'SR', fill: '#6FBFA0', ink: '#0B0D0C' },
  { code: 'INR', sym: '₹', fill: '#D9A066', ink: '#0B0D0C' },
  { code: 'PKR', sym: 'Rs', fill: '#9BB86A', ink: '#0B0D0C' },
  { code: 'EGP', sym: 'E£', fill: '#C98A8A', ink: '#0B0D0C' },
];

const DIRHAM = new Path2D('M7 2.5v19M7 2.5h5a9.5 9.5 0 0 1 0 19H7M1.5 9.5h14M1.5 14.5h14');

export function coins({
  section,
  canvas,
  obstacles,
  font,
}: {
  section: HTMLElement;
  canvas: HTMLCanvasElement;
  obstacles: HTMLElement[];
  font: string;
}) {
  const { Engine, Runner, Bodies, Composite, Body, Mouse, MouseConstraint, Events } = Matter;
  const engine = Engine.create({ gravity: { x: 0, y: 1.1 } });
  const runner = Runner.create();
  const ctx = canvas.getContext('2d')!;
  const dpr = Math.min(window.devicePixelRatio, 2);

  let W = 0;
  let H = 0;
  let walls: Matter.Body[] = [];
  let bodies: Array<{ body: Matter.Body; c: (typeof CURRENCIES)[number]; r: number }> = [];

  const radius = () => Math.max(22, Math.min(40, section.offsetWidth * 0.024));

  const build = () => {
    W = section.offsetWidth;
    H = section.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    Composite.remove(engine.world, walls);
    const t = 200;
    const sectionTop = section.getBoundingClientRect().top;
    walls = [
      Bodies.rectangle(W / 2, H + t / 2, W * 2, t, { isStatic: true }),
      Bodies.rectangle(-t / 2, H / 2, t, H * 4, { isStatic: true }),
      Bodies.rectangle(W + t / 2, H / 2, t, H * 4, { isStatic: true }),
      ...obstacles.map(o => {
        const r = o.getBoundingClientRect();
        return Bodies.rectangle(r.left + r.width / 2, r.top - sectionTop + r.height / 2, r.width, r.height, { isStatic: true, chamfer: { radius: 16 } });
      }),
    ];
    Composite.add(engine.world, walls);
  };

  const spawn = () => {
    const n = W < 744 ? 26 : 46;
    const r = radius();
    bodies = Array.from({ length: n }, (_, i) => {
      const c = CURRENCIES[i % CURRENCIES.length];
      const size = r * (0.85 + Math.random() * 0.3);
      const body = Bodies.circle(size + Math.random() * (W - size * 2), -size - Math.random() * H * 1.2, size, {
        restitution: 0.45,
        friction: 0.08,
        frictionAir: 0.005,
        density: 0.002,
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
      return { body, c, r: size };
    });
    Composite.add(engine.world, bodies.map(b => b.body));
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (const { body, c, r } of bodies) {
      const { x, y } = body.position;
      if (y < -r * 2) continue;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(body.angle);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = c.fill;
      ctx.fill();
      ctx.lineWidth = r * 0.07;
      ctx.strokeStyle = 'rgba(11,13,12,0.12)';
      ctx.stroke();
      ctx.fillStyle = c.ink;
      ctx.strokeStyle = c.ink;
      if (c.sym === 'dirham') {
        const k = (r * 0.9) / 24;
        ctx.save();
        ctx.scale(k, k);
        ctx.translate(-8.5, -12);
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.stroke(DIRHAM);
        ctx.restore();
      } else {
        const fs = c.sym.length > 1 ? r * 0.72 : r * 1.0;
        ctx.font = `600 ${fs}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.sym, 0, r * 0.04);
      }
      ctx.restore();
    }
  };
  Events.on(engine, 'afterUpdate', draw);

  // picking coins up
  let mouseConstraint: Matter.MouseConstraint | null = null;
  if (!('ontouchstart' in window)) {
    const mouse = Mouse.create(canvas);
    Mouse.setScale(mouse, { x: 1, y: 1 });
    mouseConstraint = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
    Composite.add(engine.world, mouseConstraint);
    // let the page scroll over the canvas
    const m = mouse as unknown as { element: HTMLElement; mousewheel: EventListener };
    m.element.removeEventListener('wheel', m.mousewheel);
    m.element.removeEventListener('mousewheel', m.mousewheel);
    m.element.removeEventListener('DOMMouseScroll', m.mousewheel);
  }

  build();
  spawn();
  draw();

  let started = false;
  let running = false;
  const run = () => {
    if (running) return;
    running = true;
    Runner.run(runner, engine);
  };
  const stop = () => {
    running = false;
    Runner.stop(runner);
  };

  return {
    start() {
      started = true;
      run();
    },
    visible(on: boolean) {
      if (!started) return;
      if (on) run();
      else stop();
    },
    bump(velocity: number) {
      const v = Math.max(-1, Math.min(1, velocity / 3000));
      for (const { body } of bodies) Body.setVelocity(body, { x: body.velocity.x + (Math.random() - 0.5) * 4, y: body.velocity.y - Math.abs(v) * (8 + Math.random() * 8) });
    },
    resize() {
      build();
    },
    destroy() {
      stop();
      Events.off(engine, 'afterUpdate', draw);
      if (mouseConstraint) Composite.remove(engine.world, mouseConstraint);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    },
  };
}
