export interface Pose {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
}

export const CUBE_COUNT = 100;
export const CUBE_SIZE = 0.6;
export const GROUND = {
  width: 24,
  height: 1,
  depth: 16,
  rotation: { x: 0, y: 0, z: 0, w: 1 },
};
