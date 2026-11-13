import RAPIER from '@dimforge/rapier3d-compat';
import { CUBE_COUNT, CUBE_SIZE, GROUND } from '../scene';
import type { Pose } from '../scene';

export class PhysicsWorld {
  private readonly world: RAPIER.World;
  private readonly bodies: RAPIER.RigidBody[] = [];
  private readonly spawnPosition = { x: 0, y: 0, z: 0 };
  private readonly zero = { x: 0, y: 0, z: 0 };
  private readonly spawnRotation = { x: 0, y: 0, z: 0, w: 1 };

  static async create(): Promise<PhysicsWorld> {
    await RAPIER.init();
    return new PhysicsWorld();
  }

  private constructor() {
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.world.timestep = 1 / 60;
    const ground = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setRotation(GROUND.rotation),
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(GROUND.width / 2, GROUND.height / 2, GROUND.depth / 2)
        .setFriction(0.1),
      ground,
    );
    const half = CUBE_SIZE / 2;
    const collider = RAPIER.ColliderDesc.cuboid(half, half, half)
      .setFriction(0.1).setRestitution(0.1);
    for (let i = 0; i < CUBE_COUNT; i++) {
      this.setSpawnTransform(i);
      const { x, y, z } = this.spawnPosition;
      const body = this.world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z)
          .setRotation(this.spawnRotation).setCcdEnabled(true),
      );
      this.world.createCollider(collider, body);
      this.bodies.push(body);
    }
  }

  private setSpawnTransform(index: number): void {
    // 最小槽位间距1.1，大于旋转方块的包围球直径，避免初始相交。
    this.spawnPosition.x = (index % 10 - 4.5) * 1.4 + (Math.random() - 0.5) * 0.3;
    this.spawnPosition.y = 8 + Math.floor(index / 50) * 3 + (Math.random() - 0.5);
    this.spawnPosition.z = (Math.floor(index / 10) % 5 - 2) * 2 + (Math.random() - 0.5) * 0.6;
    // 均匀采样单位四元数，避免欧拉角采样造成方向偏置。
    const u = Math.random();
    const a = Math.random() * Math.PI * 2;
    const b = Math.random() * Math.PI * 2;
    const r = Math.sqrt(1 - u);
    const s = Math.sqrt(u);
    this.spawnRotation.x = r * Math.sin(a);
    this.spawnRotation.y = r * Math.cos(a);
    this.spawnRotation.z = s * Math.sin(b);
    this.spawnRotation.w = s * Math.cos(b);
  }

  step(): void {
    this.world.step();
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i];
      if (body.translation().y >= -12) continue;
      this.setSpawnTransform(i);
      body.setTranslation(this.spawnPosition, true);
      body.setRotation(this.spawnRotation, true);
      body.setLinvel(this.zero, true);
      body.setAngvel(this.zero, true);
      body.resetForces(true);
      body.resetTorques(true);
    }
  }

  readPoses(target: Pose[]): void {
    for (let i = 0; i < this.bodies.length; i++) {
      Object.assign(target[i].position, this.bodies[i].translation());
      Object.assign(target[i].rotation, this.bodies[i].rotation());
    }
  }

  dispose(): void {
    this.world.free();
  }
}
