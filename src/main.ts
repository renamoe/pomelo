import GUI from 'lil-gui';
import { PhysicsWorld } from './physics/PhysicsWorld';
import { SceneRenderer } from './rendering/SceneRenderer';
import { CUBE_COUNT } from './scene';
import type { Pose } from './scene';
import './style.css';

const container = document.querySelector<HTMLElement>('#viewport')!;
const status = document.querySelector<HTMLElement>('#status')!;
let disposed = false;
let frame = 0;
let physics: PhysicsWorld | undefined;
let rendering: SceneRenderer | undefined;
let gui: GUI | undefined;

function dispose(): void {
  disposed = true;
  cancelAnimationFrame(frame);
  gui?.destroy();
  rendering?.dispose();
  physics?.dispose();
  gui = undefined;
  rendering = undefined;
  physics = undefined;
}

async function start(): Promise<void> {
  const world = await PhysicsWorld.create();
  if (disposed) {
    world.dispose();
    return;
  }
  physics = world;
  const view = new SceneRenderer(container);
  rendering = view;
  gui = new GUI({ title: '显示设置' });
  gui.add({ wireframe: false }, 'wireframe').name('线框').onChange((value: boolean) => {
    view.setWireframe(value);
  });
  const poses: Pose[] = Array.from({ length: CUBE_COUNT }, () => ({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
  }));
  let previous = performance.now();
  let accumulator = 0;
  const timestep = 1 / 60;

  function animate(now: number): void {
    // 限制后台恢复后的追帧量，物理始终使用固定步长。
    accumulator += Math.min((now - previous) / 1000, 0.1);
    previous = now;
    while (accumulator >= timestep) {
      world.step();
      accumulator -= timestep;
    }
    world.readPoses(poses);
    view.render(poses);
    frame = requestAnimationFrame(animate);
  }

  status.textContent = '水平沙滩 · 100 个方块 · 随机自由落体';
  frame = requestAnimationFrame(animate);
}

void start().catch((error: unknown) => {
  dispose();
  status.textContent = '初始化失败，请确认浏览器支持 WebGL 2 并刷新页面。';
  console.error(error);
});

if (import.meta.hot) import.meta.hot.dispose(dispose);
