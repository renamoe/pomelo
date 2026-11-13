export interface Pose {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
}

export const tetrahedronVertices = new Float32Array([
  1, 1, 1,
  -1, -1, 1,
  -1, 1, -1,
  1, -1, -1,
]);

export const tetrahedronFaces = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];
