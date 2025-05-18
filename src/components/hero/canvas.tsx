interface WaveProps {
  phase?: number;
  offset?: number;
  frequency?: number;
  amplitude?: number;
}

interface LineProps {
  spring: number;
}

interface EnvironmentConfig {
  debug: boolean;
  friction: number;
  trails: number;
  size: number;
  dampening: number;
  tension: number;
}

class Wave {
  private phase!: number;
  private offset!: number;
  private frequency!: number;
  private amplitude!: number;

  constructor(props: WaveProps = {}) {
    this.init(props);
  }

  init(props: WaveProps): void {
    this.phase = props.phase || 0;
    this.offset = props.offset || 0;
    this.frequency = props.frequency || 0.001;
    this.amplitude = props.amplitude || 1;
  }

  update(): number {
    this.phase += this.frequency;
    return this.offset + Math.sin(this.phase) * this.amplitude;
  }
}

class Node {
  x: number = 0;
  y: number = 0;
  vy: number = 0;
  vx: number = 0;
}

class Line {
  private spring!: number;
  private friction!: number;
  private nodes!: Node[];

  constructor(props: LineProps) {
    this.init(props);
  }

  init(props: LineProps): void {
    this.spring = props.spring + 0.1 * Math.random() - 0.05;
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    
    for (let i = 0; i < E.size; i++) {
      const node = new Node();
      node.x = pos.x;
      node.y = pos.y;
      this.nodes.push(node);
    }
  }

  update(): void {
    let spring = this.spring;
    let node = this.nodes[0];

    node.vx += (pos.x - node.x) * spring;
    node.vy += (pos.y - node.y) * spring;

    for (let i = 0; i < this.nodes.length; i++) {
      node = this.nodes[i];
      
      if (i > 0) {
        const prev = this.nodes[i - 1];
        node.vx += (prev.x - node.x) * spring;
        node.vy += (prev.y - node.y) * spring;
        node.vx += prev.vx * E.dampening;
        node.vy += prev.vy * E.dampening;
      }

      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      spring *= E.tension;
    }
  }

  draw(): void {
    let node: Node;
    let nextNode: Node;
    let x = this.nodes[0].x;
    let y = this.nodes[0].y;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 1; i < this.nodes.length - 2; i++) {
      node = this.nodes[i];
      nextNode = this.nodes[i + 1];
      x = 0.5 * (node.x + nextNode.x);
      y = 0.5 * (node.y + nextNode.y);
      ctx.quadraticCurveTo(node.x, node.y, x, y);
    }

    node = this.nodes[this.nodes.length - 2];
    nextNode = this.nodes[this.nodes.length - 1];
    ctx.quadraticCurveTo(node.x, node.y, nextNode.x, nextNode.y);
    ctx.stroke();
    ctx.closePath();
  }
}

let ctx: CanvasRenderingContext2D;
let wave: Wave;
const pos: { x: number; y: number } = { x: 0, y: 0 };
let lines: Line[] = [];

const E: EnvironmentConfig = {
  debug: true,
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

function initLines(): void {
  lines = [];
  for (let i = 0; i < E.trails; i++) {
    lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }));
  }
}

function handlePointerMove(e: MouseEvent | TouchEvent): void {
  if ('touches' in e) {
    pos.x = e.touches[0].pageX;
    pos.y = e.touches[0].pageY;
  } else {
    pos.x = e.clientX;
    pos.y = e.clientY;
  }
  e.preventDefault();
}

function handleTouchStart(e: TouchEvent): void {
  if (e.touches.length === 1) {
    pos.x = e.touches[0].pageX;
    pos.y = e.touches[0].pageY;
  }
}

function onMouseMove(e: MouseEvent | TouchEvent): void {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('touchstart', onMouseMove);
  document.addEventListener('mousemove', handlePointerMove);
  document.addEventListener('touchmove', handlePointerMove);
  document.addEventListener('touchstart', handleTouchStart);
  handlePointerMove(e);
  initLines();
  render();
}

function render(): void {
  if (!ctx.running) return;

  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = `hsla(${Math.round(wave.update())},100%,50%,0.025)`;
  ctx.lineWidth = 10;

  for (let i = 0; i < E.trails; i++) {
    const line = lines[i];
    line.update();
    line.draw();
  }

  ctx.frame++;
  window.requestAnimationFrame(render);
}

function resizeCanvas(): void {
  if (!ctx?.canvas) return;
  ctx.canvas.width = window.innerWidth - 20;
  ctx.canvas.height = window.innerHeight;
}

declare global {
  interface CanvasRenderingContext2D {
    running: boolean;
    frame: number;
  }
}

export const renderCanvas = (): void => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) return;
  
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.running = true;
  ctx.frame = 1;
  
  wave = new Wave({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('touchstart', onMouseMove);
  document.body.addEventListener('orientationchange', resizeCanvas);
  window.addEventListener('resize', resizeCanvas);
  
  window.addEventListener('focus', () => {
    if (!ctx.running) {
      ctx.running = true;
      render();
    }
  });

  window.addEventListener('blur', () => {
    ctx.running = true;
  });

  resizeCanvas();
};