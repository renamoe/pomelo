import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { tetrahedronFaces, tetrahedronVertices } from '../scene';
import type { Pose } from '../scene';

export class SceneRenderer {
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true });
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  private readonly geometry = new THREE.BufferGeometry();
  private readonly material = new THREE.MeshStandardMaterial({
    color: 0x9cdbb5,
    roughness: 0.55,
    metalness: 0.05,
    flatShading: true,
  });
  private readonly wireMaterial = new THREE.MeshBasicMaterial({ color: 0x9cdbb5, wireframe: true });
  private readonly mesh: THREE.Mesh;
  private readonly controls: OrbitControls;
  private readonly resizeObserver: ResizeObserver;

  constructor(private readonly container: HTMLElement) {
    this.scene.background = new THREE.Color(0x111b26);
    this.camera.position.set(4, 3, 6);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(tetrahedronVertices, 3));
    this.geometry.setIndex(tetrahedronFaces);
    this.geometry.computeVertexNormals();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.scene.add(new THREE.HemisphereLight(0xe5f5ff, 0x35414f, 2));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(3, 5, 4);
    this.scene.add(light);
    this.renderer.domElement.setAttribute('aria-label', '可旋转的四面体');
    this.container.append(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 15;
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

  render(pose: Pose): void {
    this.mesh.position.copy(pose.position);
    this.mesh.quaternion.copy(pose.rotation);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.geometry.dispose();
    this.material.dispose();
    this.wireMaterial.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
