import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CUBE_COUNT, CUBE_SIZE, GROUND } from '../scene';
import type { Pose } from '../scene';

export class SceneRenderer {
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true });
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  private readonly geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
  private readonly groundGeometry = new THREE.BoxGeometry(GROUND.width, GROUND.height, GROUND.depth);
  private readonly groundMaterial = new THREE.MeshStandardMaterial({ color: 0xd9bd82, roughness: 1 });
  private readonly transform = new THREE.Object3D();
  private readonly material = new THREE.MeshStandardMaterial({
    color: 0x9cdbb5,
    roughness: 0.55,
    metalness: 0.05,
    flatShading: true,
  });
  private readonly wireMaterial = new THREE.MeshBasicMaterial({ color: 0x9cdbb5, wireframe: true });
  private readonly mesh: THREE.InstancedMesh;
  private readonly controls: OrbitControls;
  private readonly resizeObserver: ResizeObserver;

  constructor(private readonly container: HTMLElement) {
    this.scene.background = new THREE.Color(0x111b26);
    this.camera.position.set(28, 24, 32);
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, CUBE_COUNT);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // 回收后的实例可以越过旧包围球；100 个实例统一提交，避免每帧重算包围体。
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
    const ground = new THREE.Mesh(this.groundGeometry, this.groundMaterial);
    ground.quaternion.copy(GROUND.rotation);
    this.scene.add(ground);
    this.scene.add(new THREE.HemisphereLight(0xe5f5ff, 0x35414f, 2));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(3, 5, 4);
    this.scene.add(light);
    this.renderer.domElement.setAttribute('aria-label', '水平沙滩与100个自由落体方块');
    this.container.append(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.target.set(0, 3, 0);
    this.controls.minDistance = 12;
    this.controls.maxDistance = 90;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
  }

  private resize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.fov = THREE.MathUtils.radToDeg(
      2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(42) / 2) / Math.min(this.camera.aspect, 1)),
    );
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
  }

  setWireframe(enabled: boolean): void {
    this.mesh.material = enabled ? this.wireMaterial : this.material;
  }

  render(poses: readonly Pose[]): void {
    for (let i = 0; i < CUBE_COUNT; i++) {
      this.transform.position.copy(poses[i].position);
      this.transform.quaternion.copy(poses[i].rotation);
      this.transform.updateMatrix();
      this.mesh.setMatrixAt(i, this.transform.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.geometry.dispose();
    this.mesh.dispose();
    this.groundGeometry.dispose();
    this.groundMaterial.dispose();
    this.material.dispose();
    this.wireMaterial.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
