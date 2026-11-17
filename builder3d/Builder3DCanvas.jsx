import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { elementSpec } from "@/lib/elementVisuals";

const MAX_ATOMS = 26;
const UP = new THREE.Vector3(0, 1, 0);
const STICK_COLOR = 0x8fb4c9;

// Edytor 3D: kule to atomy, pałeczki to wiązania. Przeciąganie kuli myszką
// przesuwa ją w przestrzeni, tło obraca kamerę.
const Builder3DCanvas = forwardRef(function Builder3DCanvas(
  { mode, bondOrder, bondKind = "covalent", onStats, className = "" },
  ref
) {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const apiRef = useRef(null);
  const propsRef = useRef({ mode, bondOrder, bondKind, onStats });
  propsRef.current = { mode, bondOrder, bondKind, onStats };

  useImperativeHandle(
    ref,
    () => ({
      addAtom: (symbol) => apiRef.current?.addAtom(symbol),
      clear: () => apiRef.current?.clear(),
      undo: () => apiRef.current?.undo(),
      load: (model) => apiRef.current?.load(model),
      resetView: () => apiRef.current?.resetView(),
      getState: () => apiRef.current?.getState(),
    }),
    []
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const width = mount.clientWidth || 640;
    const height = mount.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    camera.position.set(0.6, 2.6, 7.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    canvasRef.current = canvas;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    keyLight.position.set(5, 8, 9);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x62ffd8, 1.4);
    fillLight.position.set(-7, -4, -6);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xa78bfa, 1);
    rimLight.position.set(-3, 6, -9);
    scene.add(rimLight);
    scene.add(new THREE.HemisphereLight(0x9ffbe8, 0x0a1120, 0.55));

    const grid = new THREE.GridHelper(18, 18, 0x1e6b72, 0x123039);
    grid.position.y = -2.8;
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
    scene.add(grid);

    const atomGroup = new THREE.Group();
    const bondGroup = new THREE.Group();
    const labelGroup = new THREE.Group();
    scene.add(atomGroup, bondGroup, labelGroup);

    const sphereGeo = new THREE.SphereGeometry(1, 36, 26);
    const stickGeo = new THREE.CylinderGeometry(1, 1, 1, 20, 1);
    const stickMaterial = new THREE.MeshStandardMaterial({
      color: STICK_COLOR,
      roughness: 0.35,
      metalness: 0.4,
    });
    // Wiązanie koordynacyjne (donor–akceptor) wyróżniamy kolorem.
    const coordinateMaterial = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      roughness: 0.3,
      metalness: 0.45,
      emissive: 0x3b2a6b,
      emissiveIntensity: 0.5,
    });

    const atoms = [];
    const bonds = [];
    const history = [];
    let selectedId = null;
    let atomSeq = 0;
    let bondSeq = 0;

    const labelTextures = new Map();
    const labelTexture = (symbol) => {
      if (labelTextures.has(symbol)) return labelTextures.get(symbol);
      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = 128;
      textureCanvas.height = 128;
      const ctx = textureCanvas.getContext("2d");
      ctx.font = "700 66px 'Space Grotesk', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 12;
      ctx.strokeStyle = "rgba(4,10,18,0.9)";
      ctx.strokeText(symbol, 64, 68);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(symbol, 64, 68);
      const texture = new THREE.CanvasTexture(textureCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      labelTextures.set(symbol, texture);
      return texture;
    };

    const notify = () => {
      const counts = {};
      atoms.forEach((atom) => {
        counts[atom.el] = (counts[atom.el] || 0) + 1;
      });
      propsRef.current.onStats?.({ atoms: atoms.length, bonds: bonds.length, counts });
    };

    const findAtom = (id) => atoms.find((atom) => atom.id === id);

    const createAtom = (symbol, position) => {
      const spec = elementSpec(symbol);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.color),
        roughness: 0.34,
        metalness: 0.08,
      });
      const mesh = new THREE.Mesh(sphereGeo, material);
      mesh.scale.setScalar(spec.radius);
      mesh.position.copy(position);

      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: labelTexture(spec.symbol),
          transparent: true,
          depthWrite: false,
        })
      );
      sprite.scale.setScalar(spec.radius * 0.95);

      const atom = { id: `a${(atomSeq += 1)}`, el: spec.symbol, spec, mesh, sprite };
      mesh.userData.atomId = atom.id;
      atomGroup.add(mesh);
      labelGroup.add(sprite);
      atoms.push(atom);
      return atom;
    };

    const disposeAtom = (atom) => {
      atomGroup.remove(atom.mesh);
      atom.mesh.material.dispose();
      labelGroup.remove(atom.sprite);
      atom.sprite.material.dispose();
    };

    const layoutBond = (bond) => {
      const from = findAtom(bond.a);
      const to = findAtom(bond.b);
      if (!from || !to) return;
      const start = from.mesh.position;
      const end = to.mesh.position;
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = Math.max(direction.length(), 0.001);
      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const axis = direction.clone().normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, axis);

      let perpendicular = new THREE.Vector3().crossVectors(axis, new THREE.Vector3(0, 0, 1));
      if (perpendicular.lengthSq() < 1e-6) {
        perpendicular = new THREE.Vector3().crossVectors(axis, UP);
      }
      perpendicular.normalize();

      const offsets =
        bond.order === 3 ? [0.16, 0, -0.16] : bond.order === 2 ? [0.13, -0.13] : [0];
      const thickness = bond.order === 3 ? 0.045 : bond.order === 2 ? 0.062 : 0.075;
      bond.group.children.forEach((stick, index) => {
        stick.position.copy(midpoint).addScaledVector(perpendicular, offsets[index] ?? 0);
        stick.quaternion.copy(quaternion);
        stick.scale.set(thickness, length, thickness);
      });
    };

    const createBond = (aId, bId, order = 1, kind = "covalent") => {
      if (aId === bId) return null;
      if (bonds.some((bond) => (bond.a === aId && bond.b === bId) || (bond.a === bId && bond.b === aId))) {
        return null;
      }
      const group = new THREE.Group();
      // Wiązanie jonowe nie ma pałeczki — jony leżą obok siebie w sieci.
      const sticks = kind === "ionic" ? 0 : Math.min(order, 3);
      const material = kind === "coordinate" ? coordinateMaterial : stickMaterial;
      const bond = { id: `b${(bondSeq += 1)}`, a: aId, b: bId, order, kind, group };
      for (let index = 0; index < sticks; index += 1) {
        const stick = new THREE.Mesh(stickGeo, material);
        stick.userData.bondId = bond.id;
        group.add(stick);
      }
      bondGroup.add(group);
      bonds.push(bond);
      layoutBond(bond);
      return bond;
    };

    const disposeBond = (bond) => {
      bondGroup.remove(bond.group);
    };

    const setSelected = (id) => {
      atoms.forEach((atom) => {
        atom.mesh.material.emissive.setHex(atom.id === id ? 0x00e6ac : 0x000000);
        atom.mesh.material.emissiveIntensity = atom.id === id ? 0.65 : 0;
      });
      selectedId = id;
    };

    const snapshot = () => ({
      atoms: atoms.map((atom) => ({ el: atom.el, pos: atom.mesh.position.toArray() })),
      bonds: bonds.map((bond) => ({
        a: atoms.findIndex((atom) => atom.id === bond.a),
        b: atoms.findIndex((atom) => atom.id === bond.b),
        order: bond.order,
        kind: bond.kind || "covalent",
      })),
    });

    const pushHistory = () => {
      history.push(snapshot());
      if (history.length > 25) history.shift();
    };

    const applyState = (state) => {
      setSelected(null);
      atoms.slice().forEach(disposeAtom);
      bonds.slice().forEach(disposeBond);
      atoms.length = 0;
      bonds.length = 0;
      state.atoms.forEach((entry) => createAtom(entry.el, new THREE.Vector3(...entry.pos)));
      state.bonds.forEach((entry) => {
        const from = atoms[entry.a];
        const to = atoms[entry.b];
        if (from && to) createBond(from.id, to.id, entry.order, entry.kind || "covalent");
      });
      notify();
    };

    const removeAtom = (id) => {
      const atom = findAtom(id);
      if (!atom) return;
      pushHistory();
      bonds.filter((bond) => bond.a === id || bond.b === id).forEach((bond) => {
        disposeBond(bond);
        bonds.splice(bonds.indexOf(bond), 1);
      });
      disposeAtom(atom);
      atoms.splice(atoms.indexOf(atom), 1);
      if (selectedId === id) setSelected(null);
      notify();
    };

    const removeBond = (id) => {
      const bond = bonds.find((entry) => entry.id === id);
      if (!bond) return;
      pushHistory();
      disposeBond(bond);
      bonds.splice(bonds.indexOf(bond), 1);
      notify();
    };

    const addAtom = (symbol) => {
      if (atoms.length >= MAX_ATOMS) return;
      pushHistory();
      const count = atoms.length;
      const angle = count * 2.399963;
      const radius = 1.15 + (count % 3) * 0.6;
      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.7) * 0.7,
        Math.sin(angle) * radius * 0.45
      );
      createAtom(symbol, position);
      notify();
    };

    const loadModel = (model) => {
      if (!model?.atoms?.length) return;
      pushHistory();
      applyState({
        atoms: model.atoms.map((atom) => ({ el: atom.el, pos: atom.pos })),
        bonds: model.bonds.map((bond) => ({ a: bond.a, b: bond.b, order: bond.order || 1 })),
      });
    };

    const clear = () => {
      pushHistory();
      applyState({ atoms: [], bonds: [] });
    };

    const undo = () => {
      const previous = history.pop();
      if (previous) applyState(previous);
    };

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.9;
    controls.zoomSpeed = 0.85;
    controls.minDistance = 3;
    controls.maxDistance = 18;
    controls.target.set(0, 0, 0);
    controls.update();

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let drag = null;

    const updatePointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
    };

    const pickAtom = (event) => {
      updatePointer(event);
      const hits = raycaster.intersectObjects(atomGroup.children, false);
      if (!hits.length) return null;
      return findAtom(hits[0].object.userData.atomId) || null;
    };

    const pickBond = (event) => {
      updatePointer(event);
      const hits = raycaster.intersectObjects(bondGroup.children, true);
      if (!hits.length) return null;
      return bonds.find((bond) => bond.id === hits[0].object.userData.bondId) || null;
    };

    const handleDown = (event) => {
      if (event.button !== 0) return;
      const activeMode = propsRef.current.mode;
      const atom = pickAtom(event);

      if (!atom) {
        if (activeMode === "erase") {
          const bond = pickBond(event);
          if (bond) {
            event.preventDefault();
            event.stopPropagation();
            removeBond(bond.id);
            return;
          }
        }
        if (activeMode === "bond") setSelected(null);
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (activeMode === "erase") {
        removeAtom(atom.id);
        return;
      }

      if (activeMode === "bond") {
        if (!selectedId) {
          setSelected(atom.id);
          return;
        }
        if (selectedId === atom.id) {
          setSelected(null);
          return;
        }
        pushHistory();
        createBond(
          selectedId,
          atom.id,
          propsRef.current.bondOrder || 1,
          propsRef.current.bondKind || "covalent"
        );
        setSelected(null);
        notify();
        return;
      }

      const viewDirection = camera.getWorldDirection(new THREE.Vector3());
      drag = {
        atom,
        plane: new THREE.Plane().setFromNormalAndCoplanarPoint(viewDirection, atom.mesh.position),
      };
      controls.enabled = false;
      canvas.style.cursor = "grabbing";
    };

    const handleMove = (event) => {
      if (!drag) return;
      updatePointer(event);
      const point = new THREE.Vector3();
      if (!raycaster.ray.intersectPlane(drag.plane, point)) return;
      drag.atom.mesh.position.copy(point);
      bonds
        .filter((bond) => bond.a === drag.atom.id || bond.b === drag.atom.id)
        .forEach(layoutBond);
    };

    const handleUp = () => {
      if (!drag) return;
      drag = null;
      controls.enabled = true;
      canvas.style.cursor = propsRef.current.mode === "erase" ? "crosshair" : "grab";
    };

    const handleContextLost = (event) => event.preventDefault();

    // Listener na rodzicu działa przed OrbitControls, więc przeciąganie kuli
    // nie obraca jednocześnie kamery.
    mount.addEventListener("pointerdown", handleDown, { capture: true });
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    canvas.addEventListener("webglcontextlost", handleContextLost);

    let frame = 0;
    const cameraDirection = new THREE.Vector3();
    const render = () => {
      frame = requestAnimationFrame(render);
      controls.update();
      atoms.forEach((atom) => {
        cameraDirection.copy(camera.position).sub(atom.mesh.position).normalize();
        atom.sprite.position
          .copy(atom.mesh.position)
          .addScaledVector(cameraDirection, atom.spec.radius * 1.12);
      });
      renderer.render(scene, camera);
    };
    render();

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = mount.clientWidth || width;
      const nextHeight = mount.clientHeight || height;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    });
    resizeObserver.observe(mount);

    apiRef.current = {
      addAtom,
      clear,
      undo,
      load: loadModel,
      getState: snapshot,
      resetView: () => {
        camera.position.set(0.6, 2.6, 7.6);
        controls.target.set(0, 0, 0);
        controls.update();
      },
    };

    notify();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mount.removeEventListener("pointerdown", handleDown, { capture: true });
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      controls.dispose();
      atoms.forEach((atom) => atom.sprite.material.dispose());
      atoms.forEach((atom) => atom.mesh.material.dispose());
      coordinateMaterial.dispose();
      bonds.forEach((bond) => bondGroup.remove(bond.group));
      labelTextures.forEach((texture) => texture.dispose());
      sphereGeo.dispose();
      stickGeo.dispose();
      stickMaterial.dispose();
      renderer.dispose();
      apiRef.current = null;
      canvasRef.current = null;
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = mode === "erase" ? "crosshair" : mode === "bond" ? "pointer" : "grab";
  }, [mode]);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-label="Interaktywny edytor cząsteczek 3D — przeciągaj atomy myszką"
    />
  );
});

export default Builder3DCanvas;