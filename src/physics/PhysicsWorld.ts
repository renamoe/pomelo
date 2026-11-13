import RAPIER from '@dimforge/rapier3d-compat';
import { tetrahedronVertices } from '../scene';
import type { Pose } from '../scene';

export class PhysicsWorld {
  private readonly world: RAPIER.World;
  private readonly body: RAPIER.RigidBody;

  static async create(): Promise<PhysicsWorld> {
    await RAPIER.init();
    return new PhysicsWorld();
  }

  private constructor() {
    // 零重力保留静止展示，后续模拟只修改物理层。
    this.world = new RAPIER.World({ x: 0, y: 0, z: 0 });
    this.world.timestep = 1 / 60;
    this.body = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic());
    const collider = RAPIER.ColliderDesc.convexHull(tetrahedronVertices);
    if (!collider) {
      this.world.free();
      throw new Error('无法创建四面体碰撞体');
    }
    this.world.createCollider(collider, this.body);
  }

  step(): void {
    this.world.step();
  }

  readPose(target: Pose): void {
    const position = this.body.translation();
    const rotation = this.body.rotation();
    Object.assign(target.position, position);
    Object.assign(target.rotation, rotation);
  }

  dispose(): void {
    this.world.free();
  }
}
