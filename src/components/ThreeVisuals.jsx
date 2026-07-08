import { useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                     CAD BLUEPRINT VISUALIZATION SYSTEM                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const C = {
  cyan:  0x4F8CFF, // primary electric blue
  teal:  0x2FBF71, // success green
  blue:  0x4F8CFF, // primary blue
  green: 0x2FBF71, // success green
  amber: 0xF5A524, // warning orange
  red:   0xE5484D, // danger red
  white: 0xF8FAFC, // text primary
  dark:  0x141A22, // surface dark
  dim:   0x202938, // boundary slate
};

const C_CSS = {
  cyan:  "#4F8CFF",
  teal:  "#2FBF71",
  blue:  "#4F8CFF",
  green: "#2FBF71",
  amber: "#F5A524",
  red:   "#E5484D",
};

// Clean engineering materials (normal blending, solid surfaces, no neon additives)
function holoMat(color = C.cyan, opacity = 0.12, wire = false) {
  return new THREE.MeshBasicMaterial({
    color,
    wireframe: wire,
    transparent: true,
    opacity,
    blending: THREE.NormalBlending,
    depthWrite: true,
    side: THREE.DoubleSide,
  });
}

function edgeMat(color = C.cyan, opacity = 0.5) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.NormalBlending,
    depthWrite: true,
  });
}

function addEdges(geo, mat, parent) {
  const edges = new THREE.EdgesGeometry(geo);
  const line  = new THREE.LineSegments(edges, mat);
  parent.add(line);
  return line;
}

const sharedStyles = {
  panelWrap: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    background: "var(--bg-surface)",
    border: "1px solid var(--bg-border)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)"
  },
  mountDiv: { width: "100%", height: "100%", cursor: "grab" },
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                        VEHICLE CAD MODEL BUILDER                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

function buildSedan() {
  const car = new THREE.Group();

  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-1.95, 0.22);
  bodyShape.lineTo(-2.10, 0.30);
  bodyShape.lineTo(-2.15, 0.55);
  bodyShape.lineTo(-2.00, 0.60);
  bodyShape.lineTo(-1.60, 0.70);
  bodyShape.lineTo(-1.20, 0.75);
  bodyShape.lineTo(-0.90, 0.80);
  bodyShape.bezierCurveTo(-0.70, 1.05, -0.50, 1.15, -0.20, 1.20);
  bodyShape.lineTo( 0.55, 1.20);
  bodyShape.bezierCurveTo( 0.80, 1.18,  1.00, 1.10,  1.20, 0.95);
  bodyShape.lineTo( 1.60, 0.80);
  bodyShape.lineTo( 1.85, 0.72);
  bodyShape.lineTo( 2.05, 0.60);
  bodyShape.lineTo( 2.15, 0.55);
  bodyShape.lineTo( 2.10, 0.30);
  bodyShape.lineTo( 1.95, 0.22);
  bodyShape.lineTo( 1.70, 0.18);
  bodyShape.lineTo(-1.70, 0.18);
  bodyShape.lineTo(-1.95, 0.22);

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: 0.85, bevelEnabled: true,
    bevelThickness: 0.04, bevelSize: 0.06, bevelSegments: 3,
  });
  bodyGeo.center();
  car.add(new THREE.Mesh(bodyGeo, holoMat(C.cyan, 0.05)));
  addEdges(bodyGeo, edgeMat(C.cyan, 0.4), car);
  car.add(new THREE.Mesh(bodyGeo, holoMat(C.dim, 0.03, true)));

  const glassShape = new THREE.Shape();
  glassShape.moveTo(-0.85, 0.82);
  glassShape.bezierCurveTo(-0.65, 1.07, -0.45, 1.17, -0.18, 1.22);
  glassShape.lineTo( 0.52, 1.22);
  glassShape.bezierCurveTo( 0.78, 1.20,  0.98, 1.12,  1.18, 0.97);
  glassShape.lineTo( 1.55, 0.82);
  glassShape.lineTo( 1.55, 0.80);
  glassShape.lineTo(-0.85, 0.80);
  glassShape.lineTo(-0.85, 0.82);
  const glassGeo = new THREE.ExtrudeGeometry(glassShape, { depth: 0.74, bevelEnabled: false });
  glassGeo.center();
  car.add(new THREE.Mesh(glassGeo, holoMat(C.blue, 0.08)));
  addEdges(glassGeo, edgeMat(C.cyan, 0.35), car);

  const WHEEL_Y =  -0.19;
  const WHEEL_Z =   0.54;
  const FRONT_X =  -1.35;
  const REAR_X  =   1.35;

  const wheelPositions = [
    { x: FRONT_X, z:  WHEEL_Z },
    { x: FRONT_X, z: -WHEEL_Z },
    { x: REAR_X,  z:  WHEEL_Z },
    { x: REAR_X,  z: -WHEEL_Z },
  ];

  wheelPositions.forEach(({ x, z }) => {
    const y = WHEEL_Y;

    const tireGeo = new THREE.TorusGeometry(0.32, 0.09, 12, 32);
    const tire = new THREE.Mesh(tireGeo, holoMat(C.dim, 0.4));
    tire.position.set(x, y, z);
    car.add(tire);
    addEdges(tireGeo, edgeMat(C.dim, 0.3), tire);

    const rimGeo = new THREE.TorusGeometry(0.26, 0.04, 8, 24);
    const rim = new THREE.Mesh(rimGeo, holoMat(C.cyan, 0.6));
    rim.position.set(x, y, z);
    car.add(rim);
    addEdges(rimGeo, edgeMat(C.cyan, 0.4), rim);

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const spokeGeo = new THREE.BoxGeometry(0.26, 0.02, 0.02);
      const spoke = new THREE.Mesh(spokeGeo, holoMat(C.cyan, 0.5));
      spoke.position.set(x, y, z);
      spoke.rotation.z = angle;
      car.add(spoke);
    }

    const hubGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 8);
    const hub = new THREE.Mesh(hubGeo, holoMat(C.white, 0.6));
    hub.rotation.x = Math.PI / 2;
    hub.position.set(x, y, z);
    car.add(hub);
  });

  // Wheel arches
  wheelPositions.forEach(({x, z}) => {
    const archGeo = new THREE.TorusGeometry(0.36, 0.012, 6, 20, Math.PI);
    const arch = new THREE.Mesh(archGeo, holoMat(C.cyan, 0.4));
    arch.rotation.z = -Math.PI / 2;
    arch.position.set(x, WHEEL_Y + 0.02, z);
    car.add(arch);
  });

  // Chassis base
  const chassisGeo = new THREE.BoxGeometry(3.80, 0.06, 1.08);
  const chassis = new THREE.Mesh(chassisGeo, holoMat(C.dim, 0.2));
  chassis.position.set(0, -0.54, 0);
  addEdges(chassisGeo, edgeMat(C.cyan, 0.3), chassis);
  car.add(chassis);

  // Front/Rear Lights
  [[-2.10, 0.05, 0.32], [-2.10, 0.05, -0.32]].forEach(([x,y,z]) => {
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.06,8,8), holoMat(C.white, 0.8));
    l.position.set(x,y,z); car.add(l);
  });
  [[2.10, 0.05, 0.30], [2.10, 0.05, -0.30]].forEach(([x,y,z]) => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.04,0.10,0.20), holoMat(C.red, 0.8));
    l.position.set(x,y,z); car.add(l);
  });

  return car;
}

function buildEVInternals() {
  const ev = new THREE.Group();
  const battGroup = new THREE.Group();
  for (let col = -3; col <= 3; col++) {
    for (let row = -2; row <= 2; row++) {
      const cGeo = new THREE.BoxGeometry(0.40,0.07,0.32);
      const cell = new THREE.Mesh(cGeo, holoMat(C.teal, 0.15));
      cell.position.set(col*0.44,-0.25,row*0.36);
      addEdges(cGeo, edgeMat(C.teal, 0.3), cell);
      battGroup.add(cell);
    }
  }
  ev.add(battGroup);
  const battBorder = new THREE.Mesh(new THREE.BoxGeometry(3.20,0.09,1.45), holoMat(C.teal, 0.05));
  battBorder.position.set(0,-0.25,0);
  addEdges(new THREE.BoxGeometry(3.20,0.09,1.45), edgeMat(C.teal, 0.4), battBorder);
  ev.add(battBorder);

  const motorGeo = new THREE.CylinderGeometry(0.18,0.18,0.42,12);
  [-1.50, 1.50].forEach(x => {
    const m = new THREE.Mesh(motorGeo, holoMat(C.blue, 0.2));
    m.rotation.z = Math.PI/2; m.position.set(x,0.05,0);
    addEdges(motorGeo, edgeMat(C.blue, 0.4), m); ev.add(m);
  });

  const invBox = new THREE.Mesh(new THREE.BoxGeometry(0.50,0.12,0.38), holoMat(C.blue, 0.2));
  invBox.position.set(-0.60,0.18,0);
  addEdges(new THREE.BoxGeometry(0.50,0.12,0.38), edgeMat(C.blue, 0.4), invBox);
  ev.add(invBox);

  return ev;
}

function buildVehicleEnergyLines(parent) {
  const paths = [
    [new THREE.Vector3(-0.80,-0.22,0), new THREE.Vector3(-1.50,0.05,0)],
    [new THREE.Vector3( 0.80,-0.22,0), new THREE.Vector3( 1.50,0.05,0)],
    [new THREE.Vector3(-0.30,-0.22,0), new THREE.Vector3(-0.60,0.18,0)],
  ];
  return paths.map(([start, end]) => {
    const pts = []; for (let t=0;t<=1;t+=0.1) pts.push(start.clone().lerp(end,t));
    const mat = new THREE.LineBasicMaterial({ color: C.teal, transparent: true, opacity: 0.3 });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    parent.add(line);
    return { mat, phase: Math.random()*Math.PI*2 };
  });
}

const VEHICLE_HOTSPOTS = [
  { id:"battery",    label:"BATTERY PACK",  pos:new THREE.Vector3( 0.00,-0.22, 0.95), color:C_CSS.teal  },
  { id:"motor",      label:"DRIVE UNIT",    pos:new THREE.Vector3(-1.55, 0.20, 0.90), color:C_CSS.cyan  },
  { id:"wheels",     label:"WHEEL AXLE",    pos:new THREE.Vector3(-1.40,-0.62, 0.98), color:C_CSS.cyan  },
  { id:"controller", label:"POWER INVERTER",pos:new THREE.Vector3(-0.55, 0.30,-0.90), color:C_CSS.blue  },
];

export function VehicleOverview3D({ onSelectModule }) {
  const mountRef  = useRef(null);
  const labelRefs = useRef([]);
  const stateRef  = useRef({});
  const handleHotspot = useCallback((id) => { if (onSelectModule) onSelectModule(id); }, [onSelectModule]);

  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    const W = el.clientWidth||560, H = el.clientHeight||230;
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(40, W/H, 0.1, 100);
    camera.position.set(0, 0.9, 5.2); camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(C.white, 0.5));
    const dLight = new THREE.DirectionalLight(C.white, 0.6);
    dLight.position.set(5, 10, 7); scene.add(dLight);

    // Muted technical blueprint grid floor
    const gridFloor = new THREE.GridHelper(6.0, 20, C.dim, C.dim);
    gridFloor.position.set(0, -0.55, 0);
    gridFloor.material.transparent = true;
    gridFloor.material.opacity = 0.2;
    scene.add(gridFloor);

    const carGroup = new THREE.Group();
    const sedan = buildSedan();
    sedan.position.y = 0.05;
    carGroup.add(sedan);
    const ev = buildEVInternals();
    ev.position.y = 0.05;
    carGroup.add(ev);
    scene.add(carGroup);
    const energyLines = buildVehicleEnergyLines(carGroup);

    const raycaster = new THREE.Raycaster(), hotMeshes = [];
    VEHICLE_HOTSPOTS.forEach(({id, pos}) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.24,8,8), new THREE.MeshBasicMaterial({visible: false}));
      m.position.copy(pos); m.userData.id=id; carGroup.add(m); hotMeshes.push(m);
    });

    stateRef.current = {
      scene, camera, renderer, carGroup, energyLines,
      isDragging: false, prevMouse: {x: 0, y: 0}, autoRotate: true,
      phi: 0, theta: 0.18, radius: 5.2, targetPhi: 0, targetTheta: 0.18,
      animId: null, clock: new THREE.Clock(), W, H,
    };

    const onMouseDown = e => {
      const s = stateRef.current; s.isDragging = true; s.autoRotate = false; s.prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = e => {
      const s = stateRef.current; if(!s.isDragging) return;
      s.targetPhi  += (e.clientX-s.prevMouse.x)*0.006;
      s.targetTheta = Math.max(-0.1, Math.min(0.6, s.targetTheta + (e.clientY-s.prevMouse.y)*0.004));
      s.prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = e => {
      const s = stateRef.current; s.isDragging = false;
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera({
        x: ((e.clientX-rect.left)/rect.width)*2-1,
        y: -((e.clientY-rect.top)/rect.height)*2+1
      }, camera);
      const hits = raycaster.intersectObjects(hotMeshes);
      if(hits.length) handleHotspot(hits[0].object.userData.id);
    };
    const onWheel = e => {
      const s = stateRef.current; s.radius = Math.max(3, Math.min(8, s.radius + e.deltaY*0.008));
    };

    renderer.domElement.addEventListener("mousedown",  onMouseDown);
    renderer.domElement.addEventListener("mousemove",  onMouseMove);
    renderer.domElement.addEventListener("mouseup",    onMouseUp);
    renderer.domElement.addEventListener("wheel",      onWheel);

    const animate = () => {
      const s = stateRef.current; s.animId = requestAnimationFrame(animate);
      const t = s.clock.getElapsedTime();
      if(s.autoRotate) s.targetPhi += 0.002;
      s.phi  += (s.targetPhi - s.phi)*0.05;
      s.theta += (s.targetTheta - s.theta)*0.05;
      camera.position.set(
        s.radius * Math.sin(s.phi) * Math.cos(s.theta),
        s.radius * Math.sin(s.theta) + 0.2,
        s.radius * Math.cos(s.phi) * Math.cos(s.theta)
      );
      camera.lookAt(0, 0.1, 0);

      energyLines.forEach(({mat, phase}) => {
        mat.opacity = 0.2 + 0.3 * Math.abs(Math.sin(t * 1.5 + phase));
      });

      renderer.render(scene, camera);

      const cW = el.clientWidth||W, cH = el.clientHeight||H;
      VEHICLE_HOTSPOTS.forEach(({pos}, i) => {
        const wp = pos.clone(); carGroup.localToWorld(wp);
        const p = wp.clone().project(camera);
        const lEl = labelRefs.current[i]; if(!lEl) return;
        lEl.style.left = (( p.x*0.5 + 0.5)*cW)+"px";
        lEl.style.top  = ((-p.y*0.5 + 0.5)*cH)+"px";
        lEl.style.display = p.z < 1 ? "flex" : "none";
      });
    };
    animate();

    const ro = new ResizeObserver(() => {
      const W2 = el.clientWidth||560, H2 = el.clientHeight||230;
      camera.aspect = W2/H2; camera.updateProjectionMatrix(); renderer.setSize(W2, H2);
    });
    ro.observe(el);

    return () => {
      const s = stateRef.current; cancelAnimationFrame(s.animId); ro.disconnect();
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup",   onMouseUp);
      renderer.domElement.removeEventListener("wheel",     onWheel);
      renderer.dispose();
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [handleHotspot]);

  return (
    <div style={sharedStyles.panelWrap}>
      <div ref={mountRef} style={sharedStyles.mountDiv} />

      {/* Clean operational HUD */}
      <div style={{
        position: "absolute", top: 12, left: 16, pointerEvents: "none",
        fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.05em",
        color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8,
        fontWeight: 600
      }}>
        <span style={{ width: 6, height: 6, background: C_CSS.cyan, borderRadius: "50%" }} />
        <span>VEHICLE CHASSIS CONFIG</span>
        <span style={{
          background: "var(--bg-elevated)", border: "1px solid var(--bg-border)",
          borderRadius: 4, padding: "2px 6px", fontSize: 9, color: "var(--text-secondary)",
          fontWeight: 400
        }}>CAD SYSTEM</span>
      </div>

      <div style={{
        position: "absolute", bottom: 12, left: 16, pointerEvents: "none",
        color: "var(--text-muted)", fontSize: 9, fontFamily: "var(--font-mono)"
      }}>
        DRAG TO ROTATE · SCROLL TO ZOOM
      </div>

      {VEHICLE_HOTSPOTS.map(({id, label, color}, i) => (
        <button key={id} ref={el => (labelRefs.current[i] = el)} onClick={() => handleHotspot(id)}
          style={{
            position: "absolute", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 6,
            fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 500,
            background: "var(--bg-surface)", border: "1px solid var(--bg-border)", color: "var(--text-primary)", borderRadius: 4,
            padding: "3px 8px", cursor: "pointer", outline: "none", whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)", zIndex: 10, transition: "border-color 0.15s, color 0.15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bg-border)"; e.currentTarget.style.color = "var(--text-primary)"; }}
        >
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: color }} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                     BATTERY PACK CAD VISUALIZATION                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const BATT_HOTSPOTS = [
  { id: "cells",     label: "CELL MATRIX",      pos: new THREE.Vector3( 0.00, 0.10, 0.85), color: C_CSS.teal  },
  { id: "bms",       label: "BMS CONTROLLER",   pos: new THREE.Vector3(-1.35, 0.50, 0.40), color: C_CSS.cyan  },
  { id: "cooling",   label: "COOLING SYSTEM",   pos: new THREE.Vector3( 1.35, 0.50, 0.40), color: C_CSS.blue  },
  { id: "terminals", label: "HV TERMINAL",      pos: new THREE.Vector3( 0.00,-0.45, 0.40), color: C_CSS.amber },
];

function buildBatteryPack() {
  const g = new THREE.Group();

  const encGeo = new THREE.BoxGeometry(3.6, 0.55, 1.6);
  g.add(new THREE.Mesh(encGeo, holoMat(C.cyan, 0.03)));
  addEdges(encGeo, edgeMat(C.cyan, 0.35), g);

  for (let stack = 0; stack < 2; stack++) {
    for (let col = -3; col <= 3; col++) {
      for (let row = -1; row <= 1; row++) {
        const cGeo = new THREE.BoxGeometry(0.36, 0.18, 0.30);
        const cell = new THREE.Mesh(cGeo, holoMat(C.teal, 0.15));
        cell.position.set(col*0.44, stack*0.22-0.11, row*0.36);
        addEdges(cGeo, edgeMat(C.teal, 0.25), cell);
        g.add(cell);
      }
    }
  }

  const bmsGeo = new THREE.BoxGeometry(0.60, 0.06, 0.55);
  const bms = new THREE.Mesh(bmsGeo, holoMat(C.cyan, 0.25));
  bms.position.set(-1.35, 0.32, 0);
  addEdges(bmsGeo, edgeMat(C.cyan, 0.4), bms);
  g.add(bms);

  const coolGeo = new THREE.BoxGeometry(0.60, 0.04, 0.55);
  const cool = new THREE.Mesh(coolGeo, holoMat(C.blue, 0.2));
  cool.position.set(1.35, 0.32, 0);
  addEdges(coolGeo, edgeMat(C.blue, 0.4), cool);
  g.add(cool);

  [[-0.22,-0.32],[ 0.22,-0.32]].forEach(([x,y], i) => {
    const tGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.14, 12);
    const term = new THREE.Mesh(tGeo, holoMat(i===0 ? C.amber : C.red, 0.6));
    term.position.set(x, y, 0);
    addEdges(tGeo, edgeMat(i===0 ? C.amber : C.red, 0.5), term);
    g.add(term);
  });

  return g;
}

export function BatteryPackVisualization3D({ onSelectModule }) {
  const mountRef  = useRef(null);
  const labelRefs = useRef([]);
  const stateRef  = useRef({});
  const [activeId, setActiveId] = useState(null);
  const handleHotspot = useCallback((id) => { setActiveId(id); if(onSelectModule) onSelectModule(id); }, [onSelectModule]);

  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    const W = el.clientWidth||560, H = el.clientHeight||230;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W/H, 0.1, 100);
    camera.position.set(0, 1.2, 4.8); camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0, 0); el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(C.white, 0.5));
    const dLight = new THREE.DirectionalLight(C.white, 0.5);
    dLight.position.set(3, 8, 5); scene.add(dLight);

    const platG = new THREE.Group(); platG.position.y = -0.42;
    platG.add(new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.015, 6, 60), holoMat(C.dim, 0.3)));
    const grid2 = new THREE.GridHelper(4.0, 16, C.dim, C.dim);
    grid2.material.transparent = true; grid2.material.opacity = 0.15;
    platG.add(grid2); scene.add(platG);

    const packGroup = new THREE.Group();
    packGroup.add(buildBatteryPack());
    scene.add(packGroup);

    const raycaster = new THREE.Raycaster(), hotMeshes = [];
    BATT_HOTSPOTS.forEach(({id, pos}) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.26,8,8), new THREE.MeshBasicMaterial({visible: false}));
      m.position.copy(pos); m.userData.id=id; packGroup.add(m); hotMeshes.push(m);
    });

    stateRef.current = {
      scene, camera, renderer, packGroup, platG,
      isDragging: false, prevMouse: {x: 0, y: 0}, autoRotate: true,
      phi: 0.3, theta: 0.22, radius: 4.8, targetPhi: 0.3, targetTheta: 0.22,
      animId: null, clock: new THREE.Clock()
    };

    const onMD=e=>{ const s=stateRef.current; s.isDragging=true; s.autoRotate=false; s.prevMouse={x:e.clientX,y:e.clientY}; };
    const onMM=e=>{
      const s=stateRef.current; if(!s.isDragging) return;
      s.targetPhi  += (e.clientX-s.prevMouse.x)*0.006;
      s.targetTheta = Math.max(0.05, Math.min(0.7, s.targetTheta + (e.clientY-s.prevMouse.y)*0.004));
      s.prevMouse = { x:e.clientX, y:e.clientY };
    };
    const onMU=e=>{
      const s=stateRef.current; s.isDragging=false;
      const rect=renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera({
        x: ((e.clientX-rect.left)/rect.width)*2-1,
        y: -((e.clientY-rect.top)/rect.height)*2+1
      }, camera);
      const hits=raycaster.intersectObjects(hotMeshes);
      if(hits.length) handleHotspot(hits[0].object.userData.id);
    };
    const onWh=e=>{ const s=stateRef.current; s.radius = Math.max(2.5, Math.min(7, s.radius + e.deltaY*0.006)); };

    renderer.domElement.addEventListener("mousedown", onMD);
    renderer.domElement.addEventListener("mousemove", onMM);
    renderer.domElement.addEventListener("mouseup",   onMU);
    renderer.domElement.addEventListener("wheel",     onWh);

    const animate = () => {
      const s = stateRef.current; s.animId = requestAnimationFrame(animate);
      if(s.autoRotate) s.targetPhi += 0.0015;
      s.phi   += (s.targetPhi - s.phi)*0.05;
      s.theta += (s.targetTheta - s.theta)*0.05;
      camera.position.set(
        s.radius * Math.sin(s.phi) * Math.cos(s.theta),
        s.radius * Math.sin(s.theta),
        s.radius * Math.cos(s.phi) * Math.cos(s.theta)
      );
      camera.lookAt(0, 0, 0);
      platG.rotation.y += 0.002;

      renderer.render(scene, camera);

      const cW = el.clientWidth||W, cH = el.clientHeight||H;
      BATT_HOTSPOTS.forEach(({pos}, i) => {
        const wp = pos.clone(); packGroup.localToWorld(wp);
        const p = wp.clone().project(camera);
        const lEl = labelRefs.current[i]; if(!lEl) return;
        lEl.style.left = ((p.x*0.5 + 0.5)*cW)+"px";
        lEl.style.top  = ((-p.y*0.5 + 0.5)*cH)+"px";
        lEl.style.display = p.z < 1 ? "flex" : "none";
      });
    };
    animate();

    const ro = new ResizeObserver(() => {
      const W2 = el.clientWidth||560, H2 = el.clientHeight||230;
      camera.aspect = W2/H2; camera.updateProjectionMatrix(); renderer.setSize(W2, H2);
    });
    ro.observe(el);

    return () => {
      const s = stateRef.current; cancelAnimationFrame(s.animId); ro.disconnect();
      renderer.domElement.removeEventListener("mousedown", onMD);
      renderer.domElement.removeEventListener("mousemove", onMM);
      renderer.domElement.removeEventListener("mouseup",   onMU);
      renderer.domElement.removeEventListener("wheel",     onWh);
      renderer.dispose();
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [handleHotspot]);

  return (
    <div style={sharedStyles.panelWrap}>
      <div ref={mountRef} style={sharedStyles.mountDiv} />

      <div style={{
        position: "absolute", top: 12, left: 16, pointerEvents: "none",
        fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.05em",
        color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8,
        fontWeight: 600
      }}>
        <span style={{ width: 6, height: 6, background: C_CSS.teal, borderRadius: "50%" }} />
        <span>BATTERY CELL PACK ARRAY</span>
        <span style={{
          background: "var(--bg-elevated)", border: "1px solid var(--bg-border)",
          borderRadius: 4, padding: "2px 6px", fontSize: 9, color: "var(--text-secondary)",
          fontWeight: 400
        }}>94.0 kWh</span>
      </div>

      {BATT_HOTSPOTS.map(({id, label, color}, i) => (
        <button key={id} ref={el => (labelRefs.current[i] = el)} onClick={() => handleHotspot(id)}
          style={{
            position: "absolute", transform: "translate(-50%,-50%)", display: "flex",
            alignItems: "center", gap: 6, fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 500,
            background: "var(--bg-surface)", border: "1px solid var(--bg-border)", color: "var(--text-primary)",
            borderRadius: 4, padding: "3px 8px", cursor: "pointer", outline: "none",
            whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", zIndex: 10,
            transition: "border-color 0.15s, color 0.15s",
            ...(activeId === id ? { borderColor: color, color: color } : {})
          }}
          onMouseEnter={e => {
            if (activeId !== id) {
              e.currentTarget.style.borderColor = color;
              e.currentTarget.style.color = color;
            }
          }}
          onMouseLeave={e => {
            if (activeId !== id) {
              e.currentTarget.style.borderColor = "var(--bg-border)";
              e.currentTarget.style.color = "var(--text-primary)";
            }
          }}
        >
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: color }} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                           FLEET GLOBE 3D                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const FLEET_VEHICLES = [
  { id:"EV-001", city:"New York",    lat:40.71, lon:-74.01, status:"active",  charge:87 },
  { id:"EV-002", city:"London",      lat:51.51, lon: -0.13, status:"active",  charge:62 },
  { id:"EV-003", city:"Tokyo",       lat:35.68, lon:139.69, status:"charging",charge:45 },
  { id:"EV-004", city:"Dubai",       lat:25.20, lon: 55.27, status:"active",  charge:91 },
  { id:"EV-005", city:"Sydney",      lat:-33.87,lon:151.21, status:"idle",    charge:78 },
  { id:"EV-006", city:"São Paulo",   lat:-23.55,lon:-46.63, status:"active",  charge:55 },
  { id:"EV-007", city:"Berlin",      lat:52.52, lon: 13.40, status:"charging",charge:33 },
  { id:"EV-008", city:"Mumbai",      lat:19.08, lon: 72.88, status:"active",  charge:70 },
  { id:"EV-009", city:"Toronto",     lat:43.65, lon:-79.38, status:"idle",    charge:95 },
  { id:"EV-010", city:"Singapore",   lat: 1.35, lon:103.82, status:"active",  charge:81 },
  { id:"EV-011", city:"Cairo",       lat:30.04, lon: 31.24, status:"active",  charge:67 },
  { id:"EV-012", city:"Mexico City", lat:19.43, lon:-99.13, status:"charging",charge:29 },
];

function latLonToVec3(lat, lon, r=1.0) {
  const phi   = (90 - lat) * (Math.PI/180);
  const theta = (lon + 180) * (Math.PI/180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

function buildGlobe() {
  const g = new THREE.Group();
  const R = 1.0;

  const sGeo = new THREE.SphereGeometry(R, 24, 18);
  g.add(new THREE.Mesh(sGeo, holoMat(C.cyan, 0.02)));

  // Grid wires mapping latitude/longitude
  for (let lat = -75; lat <= 75; lat += 15) {
    const r2 = R * Math.cos(lat*Math.PI/180);
    const y  = R * Math.sin(lat*Math.PI/180);
    const pts = [];
    for(let a=0; a<=Math.PI*2; a+=0.1) pts.push(new THREE.Vector3(Math.cos(a)*r2, y, Math.sin(a)*r2));
    pts.push(pts[0].clone());
    const lGeo = new THREE.BufferGeometry().setFromPoints(pts);
    g.add(new THREE.Line(lGeo, edgeMat(C.dim, 0.15)));
  }

  for (let lon = 0; lon < 360; lon += 30) {
    const pts = [];
    for(let a=-Math.PI/2; a<=Math.PI/2; a+=0.1){
      const t = lon*Math.PI/180;
      pts.push(new THREE.Vector3(Math.cos(a)*Math.cos(t)*R, Math.sin(a)*R, Math.cos(a)*Math.sin(t)*R));
    }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), edgeMat(C.dim, 0.15)));
  }

  return g;
}

function buildVehicleMarkers() {
  const group = new THREE.Group();
  const markers = [];

  FLEET_VEHICLES.forEach(v => {
    const pos = latLonToVec3(v.lat, v.lon, 1.02);
    const color = v.status==="active" ? C.teal : v.status==="charging" ? C.amber : C.cyan;

    const markerGeo = new THREE.SphereGeometry(0.015, 6, 6);
    const dot = new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color }));
    dot.position.copy(pos);
    group.add(dot);

    const ringGeo = new THREE.TorusGeometry(0.03, 0.004, 4, 16);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 }));
    ring.position.copy(pos);
    ring.lookAt(pos.clone().multiplyScalar(2));
    group.add(ring);

    markers.push({ ring, dot, v, color, pos, phase: Math.random()*Math.PI*2 });
  });

  return { group, markers };
}

function buildArcConnections(globe) {
  const arcs = [];
  const routes = [[0,1],[2,3],[4,5],[6,7],[8,9],[1,6],[0,5]];
  routes.forEach(([a,b]) => {
    const vA = FLEET_VEHICLES[a], vB = FLEET_VEHICLES[b];
    const pA = latLonToVec3(vA.lat,vA.lon,1.02);
    const pB = latLonToVec3(vB.lat,vB.lon,1.02);
    const mid = pA.clone().add(pB).multiplyScalar(0.5).normalize().multiplyScalar(1.22);
    const pts = [];
    for(let t=0; t<=1; t+=0.05){
      const p = new THREE.Vector3();
      p.x = (1-t)*(1-t)*pA.x + 2*(1-t)*t*mid.x + t*t*pB.x;
      p.y = (1-t)*(1-t)*pA.y + 2*(1-t)*t*mid.y + t*t*pB.y;
      p.z = (1-t)*(1-t)*pA.z + 2*(1-t)*t*mid.z + t*t*pB.z;
      pts.push(p);
    }
    const mat = new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.25 });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    globe.add(line);
    arcs.push({ mat, phase: Math.random()*Math.PI*2 });
  });
  return arcs;
}

export function FleetGlobe3D({ onSelectVehicle }) {
  const mountRef   = useRef(null);
  const labelRefs  = useRef([]);
  const stateRef   = useRef({});
  const [activeV,  setActiveV]  = useState(null);

  const handleSelect = useCallback((v) => {
    setActiveV(v);
    if(onSelectVehicle) onSelectVehicle(v);
  },[onSelectVehicle]);

  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    const W = el.clientWidth||560, H = el.clientHeight||230;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W/H, 0.1, 100);
    camera.position.set(0, 0, 3.0); camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0, 0); el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(C.white, 0.4));
    const dL = new THREE.DirectionalLight(C.white, 0.5);
    dL.position.set(2, 5, 3); scene.add(dL);

    const globeGroup = new THREE.Group();
    globeGroup.add(buildGlobe());
    scene.add(globeGroup);

    const { group: markerGroup, markers } = buildVehicleMarkers();
    globeGroup.add(markerGroup);
    const arcs = buildArcConnections(globeGroup);

    const raycaster = new THREE.Raycaster();
    const hotMeshes = markers.map(m => m.ring);

    stateRef.current = {
      scene, camera, renderer, globeGroup, markers, arcs,
      isDragging: false, prevMouse: {x: 0, y: 0}, autoRotate: true,
      phi: 0, theta: 0, radius: 3.0, targetPhi: 0, targetTheta: 0,
      animId: null, clock: new THREE.Clock()
    };

    const onMD = e => { const s=stateRef.current; s.isDragging=true; s.autoRotate=false; s.prevMouse={x:e.clientX,y:e.clientY}; };
    const onMM = e => {
      const s = stateRef.current; if(!s.isDragging) return;
      s.targetPhi   += (e.clientX-s.prevMouse.x)*0.005;
      s.targetTheta  = Math.max(-0.6, Math.min(0.6, s.targetTheta + (e.clientY-s.prevMouse.y)*0.003));
      s.prevMouse = { x:e.clientX, y:e.clientY };
    };
    const onMU = e => {
      const s = stateRef.current; s.isDragging = false;
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera({
        x: ((e.clientX-rect.left)/rect.width)*2-1,
        y: -((e.clientY-rect.top)/rect.height)*2+1
      }, camera);
      const hits = raycaster.intersectObjects(hotMeshes);
      if(hits.length){
        const m = markers.find(mk => mk.ring === hits[0].object);
        if(m) handleSelect(m.v);
      }
    };
    const onWh = e => { const s=stateRef.current; s.radius = Math.max(1.8, Math.min(5, s.radius + e.deltaY*0.006)); };

    renderer.domElement.addEventListener("mousedown", onMD);
    renderer.domElement.addEventListener("mousemove", onMM);
    renderer.domElement.addEventListener("mouseup",   onMU);
    renderer.domElement.addEventListener("wheel",     onWh);

    const animate = () => {
      const s = stateRef.current; s.animId = requestAnimationFrame(animate);
      const t = s.clock.getElapsedTime();
      if(s.autoRotate) s.targetPhi += 0.001;
      s.phi   += (s.targetPhi - s.phi)*0.05;
      s.theta += (s.targetTheta - s.theta)*0.05;
      camera.position.set(
        s.radius * Math.sin(s.phi) * Math.cos(s.theta),
        s.radius * Math.sin(s.theta),
        s.radius * Math.cos(s.phi) * Math.cos(s.theta)
      );
      camera.lookAt(0, 0, 0);

      markers.forEach(({ ring, phase }) => {
        ring.scale.setScalar(0.9 + 0.15 * Math.sin(t * 1.8 + phase));
      });

      arcs.forEach(({ mat, phase }) => {
        mat.opacity = 0.1 + 0.2 * Math.abs(Math.sin(t * 1.2 + phase));
      });

      renderer.render(scene, camera);

      const cW = el.clientWidth||W, cH = el.clientHeight||H;
      markers.forEach(({ pos }, i) => {
        const wp = pos.clone(); globeGroup.localToWorld(wp);
        const p = wp.clone().project(camera);
        const lEl = labelRefs.current[i]; if(!lEl) return;
        lEl.style.left = ((p.x*0.5 + 0.5)*cW)+"px";
        lEl.style.top  = ((-p.y*0.5 + 0.5)*cH)+"px";
        lEl.style.display = p.z < 1 ? "block" : "none";
      });
    };
    animate();

    const ro = new ResizeObserver(() => {
      const W2 = el.clientWidth||560, H2 = el.clientHeight||230;
      camera.aspect = W2/H2; camera.updateProjectionMatrix(); renderer.setSize(W2, H2);
    });
    ro.observe(el);

    return () => {
      const s = stateRef.current; cancelAnimationFrame(s.animId); ro.disconnect();
      renderer.domElement.removeEventListener("mousedown", onMD);
      renderer.domElement.removeEventListener("mousemove", onMM);
      renderer.domElement.removeEventListener("mouseup",   onMU);
      renderer.domElement.removeEventListener("wheel",     onWh);
      renderer.dispose();
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [handleSelect]);

  const statusColor = s => s==="active" ? C_CSS.teal : s==="charging" ? C_CSS.amber : C_CSS.cyan;

  return (
    <div style={sharedStyles.panelWrap}>
      <div ref={mountRef} style={sharedStyles.mountDiv} />

      <div style={{
        position: "absolute", top: 12, left: 16, pointerEvents: "none",
        fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.05em",
        color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8,
        fontWeight: 600
      }}>
        <span style={{ width: 6, height: 6, background: C_CSS.cyan, borderRadius: "50%" }} />
        <span>GLOBAL TELEMETRY MAP</span>
        <span style={{
          background: "var(--bg-elevated)", border: "1px solid var(--bg-border)",
          borderRadius: 4, padding: "2px 6px", fontSize: 9, color: "var(--text-secondary)",
          fontWeight: 400
        }}>{FLEET_VEHICLES.length} DEVICES</span>
      </div>

      <div style={{
        position: "absolute", top: 12, right: 16, display: "flex", flexDirection: "column", gap: 4,
        fontFamily: "var(--font-mono)", pointerEvents: "none"
      }}>
        {[["active", C_CSS.teal], ["charging", C_CSS.amber], ["idle", C_CSS.cyan]].map(([s,c]) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 8, color: c, fontWeight: 500 }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: c }} />
            {s.toUpperCase()}
          </div>
        ))}
      </div>

      {FLEET_VEHICLES.map((v, i) => (
        <div key={v.id} ref={el => (labelRefs.current[i] = el)}
          onClick={() => handleSelect(v)}
          style={{
            position: "absolute", transform: "translate(-50%,-130%)",
            fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 500,
            color: "var(--text-primary)", background: "var(--bg-surface)",
            border: `1px solid var(--bg-border)`, borderRadius: 4,
            padding: "2px 6px", cursor: "pointer", whiteSpace: "nowrap",
            pointerEvents: "all", zIndex: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            transition: "border-color 0.15s, color 0.15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = statusColor(v.status); }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bg-border)"; }}
        >
          {v.city}
        </div>
      ))}

      {activeV && (
        <div style={{
          position: "absolute", bottom: 12, left: 12,
          background: "var(--bg-surface)", border: `1px solid var(--bg-border)`,
          borderTop: `2px solid ${statusColor(activeV.status)}`,
          borderRadius: 8, padding: "12px 14px", fontFamily: "var(--font-sans)",
          fontSize: 11, color: "var(--text-primary)",
          boxShadow: `0 8px 24px rgba(0,0,0,0.4)`, minWidth: 170
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, color: "var(--text-primary)" }}>{activeV.id}</div>
          <div style={{ color: "var(--text-muted)", marginBottom: 8, fontSize: 10, fontFamily: "var(--font-mono)" }}>{activeV.city}</div>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>STATUS</span>
            <span style={{ color: statusColor(activeV.status), fontWeight: 600, fontSize: 10 }}>{activeV.status.toUpperCase()}</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>CHARGE</span>
            <span style={{ color: activeV.charge > 50 ? C_CSS.teal : activeV.charge > 30 ? C_CSS.amber : C_CSS.red, fontWeight: 600, fontSize: 10, fontFamily: "var(--font-mono)" }}>
              {activeV.charge}%
            </span>
          </div>

          <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              height: "100%", width: `${activeV.charge}%`,
              background: activeV.charge > 50 ? C_CSS.teal : activeV.charge > 30 ? C_CSS.amber : C_CSS.red,
              transition: "width 0.3s"
            }}/>
          </div>

          <button className='cy-btn' onClick={() => handleSelect(null)}
            style={{ padding: '4px 8px', fontSize: 9, width: '100%', border: '1px solid var(--bg-border)', background: 'var(--bg-elevated)' }}
          >
            DISMISS
          </button>
        </div>
      )}

      <div style={{
        position: "absolute", bottom: 12, right: 16, fontFamily: "var(--font-mono)",
        fontSize: 9, letterSpacing: "0.02em", textAlign: "right", pointerEvents: "none",
        color: "var(--text-secondary)", display: "flex", gap: 12
      }}>
        <span style={{ color: C_CSS.teal }}>{FLEET_VEHICLES.filter(v=>v.status==="active").length} ACT</span>
        <span style={{ color: C_CSS.amber }}>{FLEET_VEHICLES.filter(v=>v.status==="charging").length} CHG</span>
        <span style={{ color: C_CSS.cyan }}>{FLEET_VEHICLES.filter(v=>v.status==="idle").length} IDL</span>
      </div>
    </div>
  );
}
