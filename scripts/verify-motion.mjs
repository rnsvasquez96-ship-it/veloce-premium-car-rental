import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import * as THREE from "three";

// Execute the production functions; DOM/clock doubles expose leaked listeners
// and scheduling without claiming browser rendering or GPU validation.
function compile(path, globals = {}) {
  const source = fs.readFileSync(path, "utf8");
  const context = { exports: {}, ...globals };
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText, context);
  return context.exports;
}

function cameraChecks() {
  const { sampleCamera } = compile("components/home/machine-experience/camera-path.ts");
  const glb = fs.readFileSync("public/models/sports-car.glb");
  const gltf = JSON.parse(glb.subarray(20, 20 + glb.readUInt32LE(12)).toString());
  const bounds = new THREE.Box3();
  function visit(index, parent) {
    const node = gltf.nodes[index];
    const matrix = node.matrix ? new THREE.Matrix4().fromArray(node.matrix) : new THREE.Matrix4().compose(
      new THREE.Vector3().fromArray(node.translation || [0, 0, 0]),
      new THREE.Quaternion().fromArray(node.rotation || [0, 0, 0, 1]),
      new THREE.Vector3().fromArray(node.scale || [1, 1, 1]),
    );
    const world = parent.clone().multiply(matrix);
    if (node.mesh !== undefined) for (const primitive of gltf.meshes[node.mesh].primitives) {
      const accessor = gltf.accessors[primitive.attributes.POSITION];
      bounds.union(new THREE.Box3(new THREE.Vector3().fromArray(accessor.min), new THREE.Vector3().fromArray(accessor.max)).applyMatrix4(world));
    }
    for (const child of node.children || []) visit(child, world);
  }
  for (const index of gltf.scenes[gltf.scene || 0].nodes) visit(index, new THREE.Matrix4());
  const size = bounds.getSize(new THREE.Vector3());
  size.multiplyScalar(5.2 / Math.max(size.x, size.y, size.z));
  const corners = [];
  for (const x of [-size.x / 2, size.x / 2]) for (const y of [0, size.y]) for (const z of [-size.z / 2, size.z / 2]) {
    corners.push(new THREE.Vector3(x, y, z).applyAxisAngle(new THREE.Vector3(0, 1, 0), 0));
  }
  assert.equal(Math.min(...corners.map((point) => point.y)), 0, "Vehicle stays grounded");
  let samples = 0, extent = 0;
  for (const aspect of [.5, 2 / 3, .75, 1, 4 / 3, 16 / 9, 21 / 9, 32 / 9]) {
    let previous;
    for (let i = 0; i <= 2000; i++) {
      const shot = sampleCamera(i / 2000, aspect, {});
      assert.ok(Object.values(shot).every(Number.isFinite));
      if (previous) {
        assert.ok(shot.angle >= previous.angle - 1e-9, "No camera reversals");
        assert.ok(Math.abs(shot.angle - previous.angle) < .01, "Continuous angle");
        assert.ok(Math.abs(shot.radius - previous.radius) < .1, "Continuous distance");
      }
      const camera = new THREE.PerspectiveCamera(shot.fov, aspect, .1, 80);
      camera.position.set(Math.sin(shot.angle) * shot.radius, shot.height, Math.cos(shot.angle) * shot.radius);
      camera.lookAt(0, shot.target, 0);
      camera.updateMatrixWorld();
      for (const corner of corners) {
        const point = corner.clone().project(camera);
        extent = Math.max(extent, Math.abs(point.x), Math.abs(point.y));
        assert.ok(Math.abs(point.x) < .94 && Math.abs(point.y) < .94 && Math.abs(point.z) < 1, `Clipping at ${aspect}, progress ${i / 2000}`);
      }
      previous = shot;
      samples++;
    }
  }
  assert.ok(sampleCamera(1, 16 / 9, {}).angle - sampleCamera(0, 16 / 9, {}).angle < Math.PI);
  for (const stop of [0, .15, .34, .54, .78, 1]) {
    const p = .04 + stop * .92;
    const a = sampleCamera(p - 1e-5, 16 / 9, {}), b = sampleCamera(p + 1e-5, 16 / 9, {});
    for (const key of Object.keys(a)) assert.ok(Math.abs(a[key] - b[key]) < 1e-6, "Smooth shot junction: " + key);
  }
  console.log(`Camera: ${samples} samples / actual GLB bounds / max screen extent ${extent.toFixed(3)} / smooth shot junctions passed.`);
}

class Events {
  listeners = new Map();
  addEventListener(name, fn) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name).add(fn);
  }
  removeEventListener(name, fn) { this.listeners.get(name)?.delete(fn); }
  emit(name, event = {}) { [...this.listeners.get(name) || []].forEach((fn) => fn(event)); }
  get count() { return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0); }
}

function runtimeFixture({ path = "/", allowed = true, fine = true, sheet = false, hidden = false } = {}) {
  const media = new Events(); media.matches = allowed;
  const pointer = new Events(); pointer.matches = fine;
  const doc = new Events(); doc.hidden = hidden; doc.body = {}; doc.sheet = sheet; doc.elements = [];
  doc.querySelector = () => doc.sheet ? {} : null;
  doc.querySelectorAll = () => doc.elements.filter((element) => element.isConnected);
  doc.getElementById = () => null;
  const win = new Events();
  win.matchMedia = (query) => query.includes("pointer") ? pointer : media;
  win.location = { href: "http://localhost/", origin: "http://localhost", pathname: "/", search: "" };
  win.history = { pushState() {} };
  const clocks = new Set(), instances = [], intersections = [], mutations = [], effects = [];
  let schedules = 0;
  class Observer {
    targets = new Set();
    disconnected = false;
    constructor(callback) { this.callback = callback; }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.disconnected = true; this.targets.clear(); }
  }
  class Intersection extends Observer { constructor(callback) { super(callback); intersections.push(this); } }
  class Mutation extends Observer { constructor(callback) { super(callback); mutations.push(this); } }
  class FakeLenis {
    stopped = false; destroyed = 0; frames = 0; scrolls = 0;
    constructor(options) { this.options = options; instances.push(this); }
    stop() { this.stopped = true; }
    start() { this.stopped = false; }
    raf() { this.frames++; }
    scrollTo() { this.scrolls++; }
    destroy() { this.destroyed++; }
  }
  const halo = { style: {}, dataset: {} };
  const imports = {
    react: { useEffect: (effect) => effects.push(effect), useRef: () => ({ current: halo }) },
    "react/jsx-runtime": { jsx: () => null, jsxs: () => null },
    "next/navigation": { usePathname: () => path },
    lenis: { default: FakeLenis },
    "motion/react": { frame: { update: (fn) => { schedules++; clocks.add(fn); } }, cancelFrame: (fn) => clocks.delete(fn) },
    "lenis/dist/lenis.css": {},
  };
  const { CampaignRuntime } = compile("components/motion/campaign-runtime.tsx", {
    require: (name) => { assert.ok(name in imports, name); return imports[name]; },
    window: win, document: doc, IntersectionObserver: Intersection, MutationObserver: Mutation, URL,
  });
  CampaignRuntime();
  const cleanup = effects[0]();
  return { media, pointer, doc, win, halo, clocks, instances, intersections, mutations, cleanup, get schedules() { return schedules; } };
}

function lifecycleChecks() {
  const f = runtimeFixture();
  assert.equal(f.clocks.size, 1);
  const lenis = f.instances[0], mutation = f.mutations[0], observer = f.intersections[0];
  mutation.callback();
  assert.equal(f.schedules, 1, "No duplicate clock registration");
  f.doc.sheet = true; mutation.callback();
  assert.ok(lenis.stopped); assert.equal(f.clocks.size, 0);
  f.doc.hidden = true; f.doc.emit("visibilitychange");
  f.doc.sheet = false; mutation.callback();
  assert.equal(f.clocks.size, 0, "Closing menu in hidden tab must not resume");
  f.doc.hidden = false; f.doc.sheet = true; f.doc.emit("visibilitychange");
  assert.equal(f.clocks.size, 0, "Returning to open menu must not resume");
  f.doc.sheet = false; mutation.callback();
  assert.equal(f.clocks.size, 1); assert.equal(lenis.stopped, false);
  const animation = { playState: "running", cancelled: 0, pause() { this.playState = "paused"; }, play() { this.playState = "running"; }, cancel() { this.cancelled++; } };
  let revealed = 0;
  const element = { isConnected: true, dataset: { reveal: "mask" }, animate() { revealed++; return animation; } };
  f.doc.elements.push(element); mutation.callback();
  assert.ok(observer.targets.has(element), "Streamed elements discovered");
  observer.callback([{ target: element, isIntersecting: true }]);
  mutation.callback(); observer.callback([{ target: element, isIntersecting: true }]);
  assert.equal(revealed, 1, "Reveal only once per node");
  f.doc.hidden = true; f.doc.emit("visibilitychange");
  assert.equal(animation.playState, "paused");
  f.doc.hidden = false; f.doc.emit("visibilitychange");
  assert.equal(animation.playState, "running");
  element.isConnected = false; mutation.callback();
  assert.equal(animation.cancelled, 1, "Detached animation cancelled");
  const pending = { isConnected: true, dataset: {} };
  f.doc.elements.push(pending); mutation.callback();
  pending.isConnected = false; mutation.callback();
  assert.equal(observer.targets.has(pending), false, "Detached pending reveal released");
  // Native anchor handling must not capture Next Link, modified clicks, or menus.
  let prevented = 0;
  const target = {};
  f.doc.getElementById = () => target;
  const event = { button: 0, target: { closest: () => ({ href: "http://localhost/#fleet", target: "", hasAttribute: () => false }) }, preventDefault() { prevented++; } };
  f.win.emit("click", { ...event, ctrlKey: true });
  f.win.emit("click", { ...event, defaultPrevented: true });
  f.doc.sheet = true; f.win.emit("click", event); f.doc.sheet = false;
  assert.equal(prevented, 0);
  f.win.emit("click", event); assert.equal(prevented, 1); assert.equal(lenis.scrolls, 1);
  f.media.matches = false; f.media.emit("change");
  assert.equal(lenis.destroyed, 1); assert.equal(f.clocks.size, 0);
  assert.equal(f.doc.count, 0); assert.equal(f.win.count, 0);
  observer.callback([{ target: element, isIntersecting: true }]); mutation.callback();
  assert.equal(revealed, 1, "Queued callbacks harmless after teardown");
  f.media.matches = true; f.media.emit("change");
  assert.equal(f.instances.length, 2); assert.equal(f.clocks.size, 1);
  f.pointer.matches = false; f.pointer.emit("change");
  assert.equal(f.instances[1].destroyed, 1); assert.equal(f.clocks.size, 0);
  f.pointer.matches = true; f.pointer.emit("change");
  assert.equal(f.instances.length, 3); assert.equal(f.clocks.size, 1);
  f.cleanup();
  assert.equal(f.instances[2].destroyed, 1);
  assert.equal(f.media.count + f.pointer.count + f.doc.count + f.win.count + f.clocks.size, 0);
  for (const options of [{ sheet: true }, { hidden: true }]) {
    const blocked = runtimeFixture(options);
    assert.equal(blocked.clocks.size, 0, "Initial locks checked before scheduling");
    assert.ok(blocked.instances[0].stopped);
    blocked.cleanup();
  }
  const mobile = runtimeFixture({ fine: false });
  assert.equal(mobile.instances.length, 0); assert.equal(mobile.intersections.length, 1);
  mobile.cleanup();
  for (const options of [{ allowed: false }, { path: "/reserve/porsche-911" }]) {
    const calm = runtimeFixture(options);
    assert.equal(calm.instances.length + calm.intersections.length + calm.clocks.size, 0);
    calm.cleanup();
    assert.equal(calm.media.count + calm.pointer.count, 0);
  }
  console.log("Lifecycle: sheet/visibility locks, route/reduced-motion teardown, mobile reveals, late content, stale callbacks, native anchors and clean remount passed.");
}

cameraChecks();
lifecycleChecks();
