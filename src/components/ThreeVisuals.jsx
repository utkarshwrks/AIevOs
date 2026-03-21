import { useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                     SHARED HOLOGRAM UTILITIES                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const C = {
  cyan:  0x00d4ff,
  teal:  0x00ffcc,
  blue:  0x0088ff,
  green: 0x00ff88,
  amber: 0xffaa00,
  red:   0xff3355,
  white: 0xffffff,
  dark:  0x001a2e,
  dim:   0x003344,
};

const C_CSS = {
  cyan:  "#00d4ff",
  teal:  "#00ffcc",
  blue:  "#0088ff",
  green: "#00ff88",
  amber: "#ffaa00",
  red:   "#ff3355",
};

function holoMat(color = C.cyan, opacity = 0.55, wire = false) {
  return new THREE.MeshBasicMaterial({
    color, wireframe: wire, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
}

function edgeMat(color = C.cyan, opacity = 0.9) {
  return new THREE.LineBasicMaterial({
    color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
}

function addEdges(geo, mat, parent) {
  const edges = new THREE.EdgesGeometry(geo);
  const line  = new THREE.LineSegments(edges, mat);
  parent.add(line);
  return line;
}

const cornerBase = { position: "absolute", width: 14, height: 14, pointerEvents: "none" };
const sharedStyles = {
  cornerTL: { ...cornerBase, top: 6, left: 6,   borderTop: `1.5px solid ${C_CSS.cyan}`, borderLeft: `1.5px solid ${C_CSS.cyan}` },
  cornerTR: { ...cornerBase, top: 6, right: 6,  borderTop: `1.5px solid ${C_CSS.cyan}`, borderRight: `1.5px solid ${C_CSS.cyan}` },
  cornerBL: { ...cornerBase, bottom: 6, left: 6, borderBottom: `1.5px solid ${C_CSS.teal}`, borderLeft: `1.5px solid ${C_CSS.teal}` },
  cornerBR: { ...cornerBase, bottom: 6, right: 6,borderBottom: `1.5px solid ${C_CSS.teal}`, borderRight: `1.5px solid ${C_CSS.teal}` },
  scanOverlay: {
    position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen",
    background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,212,255,0.018) 4px)",
  },
  panelWrap: { position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "transparent" },
  mountDiv:  { width: "100%", height: "100%", cursor: "grab" },
};

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                        VEHICLE OVERVIEW 3D                             ║
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
  car.add(new THREE.Mesh(bodyGeo, holoMat(C.cyan, 0.08)));
  addEdges(bodyGeo, edgeMat(C.cyan, 0.85), car);
  car.add(new THREE.Mesh(bodyGeo, holoMat(C.teal, 0.06, true)));

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
  car.add(new THREE.Mesh(glassGeo, holoMat(C.blue, 0.18)));
  addEdges(glassGeo, edgeMat(C.teal, 0.6), car);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COORDINATE MATH (after bodyGeo.center()):
  //   X: car length  →  front=-2.15, rear=+2.15
  //   Z: car width   →  left=+0.425, right=-0.425  (body depth=0.85, half=0.425)
  //   Y: car height  →  bottom=-0.51, top=+0.51    (shape range 0.18→1.20 = 1.02, half=0.51)
  //
  // Wheel axle runs along Z-axis
  // → TorusGeometry default: ring lies in XY plane (faces Z already? NO — faces Z means
  //   the ring is perpendicular to Z, i.e., in XY plane = rotation.y = 0 faces Z)
  //
  // WAIT — TorusGeometry lies in XY plane by default.
  // "Faces Z" means the hole of the torus points along Z → that IS the default! (rotation = 0)
  // BUT we want wheel to face outward (Z direction) so axle = Z → rotation.y = 0 is correct?
  //
  // NO — think again:
  // Torus in XY plane → the FLAT FACE of the wheel faces the Z axis viewer.
  // Car width is along Z. Wheels are on the sides (±Z).
  // A wheel on the +Z side should have its FACE visible when you look from +Z.
  // Torus in XY plane → face IS visible from Z → rotation = 0 ✅
  //
  // But then why do we need rotation at all?
  // Because car LENGTH is X, and front/rear wheels are at x=±1.35.
  // Looking from the front (+X direction) you should see wheel faces.
  // Torus in XY plane → from front (+X) you see the EDGE, not the face. ❌
  // So we need to rotate 90° around Y → face points along X... still wrong.
  //
  // FINAL ANSWER:
  // Car travels along X. Width along Z. Wheel axle along Z.
  // Torus default: hole points along Z (torus in XY plane).
  // We WANT: hole points along Z (axle = Z direction).
  // So rotation = 0 for the torus makes wheel faces point toward ±Z sides. ✅
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Body Z range after center(): -0.425 to +0.425
  // Wheels outside body: ±(0.425 + 0.09 tire_halfwidth + 0.02 gap) = ±0.535
  // Wheel Y: body bottom = -0.51, tire radius = 0.32 → center at -0.51 + 0.32 = -0.19
  // But body bottom Y in shape coords = 0.18, centered = 0.18 - 0.51 = -0.33
  // Actually: shape Y min=0.18, max=1.20, range=1.02, center=0.69
  // After center(): Y min = 0.18-0.69 = -0.51, Y max = 1.20-0.69 = +0.51 ✅
  // Wheel center Y = -0.51 + 0.32 = -0.19 ✅

  const WHEEL_Y =  -0.19;
  const WHEEL_Z =   0.54;  // outside body sides (0.425 + 0.09 + 0.025)
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

    // ✅ NO ROTATION — torus default (XY plane) = hole faces Z = axle along Z = correct!
    const tireGeo = new THREE.TorusGeometry(0.32, 0.09, 16, 48);
    const tire = new THREE.Mesh(tireGeo, holoMat(C.dim, 0.65));
    // rotation = 0 (default) ✅
    tire.position.set(x, y, z);
    car.add(tire);

    const rimGeo = new THREE.TorusGeometry(0.26, 0.04, 12, 40);
    const rim = new THREE.Mesh(rimGeo, holoMat(C.cyan, 0.9));
    rim.position.set(x, y, z);
    car.add(rim);

    // SPOKES — fan in XY plane (which is the wheel face plane)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const spokeGeo = new THREE.BoxGeometry(0.26, 0.022, 0.022);
      const spoke = new THREE.Mesh(spokeGeo, holoMat(C.teal, 0.9));
      spoke.position.set(x, y, z);
      spoke.rotation.z = angle;  // fan spokes in XY plane ✅
      car.add(spoke);
    }

    // HUB CAP — cylinder, default Y-axis, rotate so axis = Z
    const hubGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12);
    const hub = new THREE.Mesh(hubGeo, holoMat(C.white, 0.9));
    hub.rotation.x = Math.PI / 2;  // cylinder Y→Z ✅
    hub.position.set(x, y, z);
    car.add(hub);

    const glowGeo = new THREE.TorusGeometry(0.18, 0.01, 8, 32);
    const glowRing = new THREE.Mesh(glowGeo, holoMat(C.cyan, 0.7));
    glowRing.position.set(x, y, z);  // no rotation needed ✅
    car.add(glowRing);
  });

  // ARCHES — half-torus over each wheel, same plane
  [{x: FRONT_X, z:  WHEEL_Z}, {x: FRONT_X, z: -WHEEL_Z},
   {x: REAR_X,  z:  WHEEL_Z}, {x: REAR_X,  z: -WHEEL_Z}].forEach(({x, z}) => {
    const archGeo = new THREE.TorusGeometry(0.36, 0.016, 8, 32,
      Math.PI);  // half torus = arch shape
    const arch = new THREE.Mesh(archGeo, holoMat(C.cyan, 0.6));
    // no rotation — faces Z same as wheel ✅
    // rotate so arch opens downward (flat side at bottom)
    arch.rotation.z = -Math.PI / 2;
    arch.position.set(x, WHEEL_Y + 0.02, z);
    car.add(arch);
  });

  // CHASSIS
  const chassisGeo = new THREE.BoxGeometry(3.80, 0.06, 1.08);  // spans wheel width
  const chassis = new THREE.Mesh(chassisGeo, holoMat(C.teal, 0.15));
  chassis.position.set(0, -0.54, 0);
  addEdges(chassisGeo, edgeMat(C.teal, 0.7), chassis);
  car.add(chassis);

  // HEADLIGHTS
  [[-2.10, 0.05, 0.32], [-2.10, 0.05, -0.32]].forEach(([x,y,z]) => {
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.07,8,8), holoMat(C.white,0.9));
    l.position.set(x,y,z); car.add(l);
  });

  // TAILLIGHTS
  [[2.10, 0.05, 0.30], [2.10, 0.05, -0.30]].forEach(([x,y,z]) => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.04,0.12,0.22), holoMat(C.teal,0.9));
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
      const cell = new THREE.Mesh(cGeo, holoMat(C.teal,0.35));
      cell.position.set(col*0.44,-0.25,row*0.36);
      addEdges(cGeo, edgeMat(C.teal,0.6), cell);
      battGroup.add(cell);
    }
  }
  ev.add(battGroup);
  const battBorder = new THREE.Mesh(new THREE.BoxGeometry(3.20,0.09,1.45), holoMat(C.cyan,0.12));
  battBorder.position.set(0,-0.25,0);
  addEdges(new THREE.BoxGeometry(3.20,0.09,1.45), edgeMat(C.cyan,0.9), battBorder);
  ev.add(battBorder);

  const motorGeo = new THREE.CylinderGeometry(0.18,0.18,0.42,20);
  [-1.50, 1.50].forEach(x => {
    const m = new THREE.Mesh(motorGeo, holoMat(C.blue,0.55));
    m.rotation.z = Math.PI/2; m.position.set(x,0.05,0);
    addEdges(motorGeo, edgeMat(C.blue,0.9), m); ev.add(m);
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13,0.025,8,20), holoMat(C.cyan,0.7));
      ring.rotation.y = Math.PI/2; ring.position.set(x+(i-1.5)*0.11,0.05,0); ev.add(ring);
    }
  });

  const invBox = new THREE.Mesh(new THREE.BoxGeometry(0.50,0.12,0.38), holoMat(C.blue,0.45));
  invBox.position.set(-0.60,0.18,0);
  addEdges(new THREE.BoxGeometry(0.50,0.12,0.38), edgeMat(C.blue,0.9), invBox);
  ev.add(invBox);
  for (let i = 0; i < 5; i++) {
    const trace = new THREE.Mesh(new THREE.BoxGeometry(0.42,0.005,0.02), holoMat(C.teal,0.8));
    trace.position.set(-0.60,0.245,-0.12+i*0.06); ev.add(trace);
  }
  return ev;
}

function buildVehicleEnergyLines(parent) {
  const paths = [
    [new THREE.Vector3(-0.80,-0.22,0), new THREE.Vector3(-1.50,0.05,0)],
    [new THREE.Vector3( 0.80,-0.22,0), new THREE.Vector3( 1.50,0.05,0)],
    [new THREE.Vector3(-0.30,-0.22,0), new THREE.Vector3(-0.60,0.18,0)],
    [new THREE.Vector3(-0.85, 0.18,0), new THREE.Vector3(-1.32,0.10,0)],
    [new THREE.Vector3(-1.20,-0.24,0.50), new THREE.Vector3(1.20,-0.24,0.50)],
    [new THREE.Vector3(-1.20,-0.24,-0.50),new THREE.Vector3(1.20,-0.24,-0.50)],
  ];
  return paths.map(([start, end]) => {
    const pts = []; for (let t=0;t<=1;t+=0.05) pts.push(start.clone().lerp(end,t));
    const mat = new THREE.LineBasicMaterial({ color:C.teal, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    parent.add(line);
    return { mat, phase: Math.random()*Math.PI*2 };
  });
}

const VEHICLE_HOTSPOTS = [
  { id:"battery",    label:"BATTERY",  pos:new THREE.Vector3( 0.00,-0.22, 0.95), color:C_CSS.teal },
  { id:"motor",      label:"MOTOR ×2", pos:new THREE.Vector3(-1.55, 0.20, 0.90), color:C_CSS.cyan },
  { id:"wheels",     label:"WHEELS",   pos:new THREE.Vector3(-1.40,-0.62, 0.98), color:C_CSS.cyan },
  { id:"chassis",    label:"CHASSIS",  pos:new THREE.Vector3( 0.00,-0.42,-0.95), color:C_CSS.teal },
  { id:"controller", label:"INVERTER", pos:new THREE.Vector3(-0.55, 0.30,-0.90), color:C_CSS.blue },
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
    scene.fog      = new THREE.FogExp2(0x000d1a,0.12);
    const camera   = new THREE.PerspectiveCamera(42,W/H,0.1,100);
    camera.position.set(0,0.8,5.5); camera.lookAt(0,0.2,0);
    const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setClearColor(0x000000,0); el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(C.cyan,0.3));
    const pLight = new THREE.PointLight(C.cyan,0.8,12);
    pLight.position.set(0,3,2); scene.add(pLight);

    // HORIZONTAL RAMP
    const rampGroup = new THREE.Group();
    rampGroup.position.y = -0.55;
    
    const rampPlane = new THREE.Mesh(
      new THREE.BoxGeometry(6.0, 0.05, 3.2),
      holoMat(C.cyan, 0.12)
    );
    rampPlane.position.set(0, 0, 0);
    addEdges(new THREE.BoxGeometry(6.0, 0.05, 3.2), edgeMat(C.cyan, 0.6), rampPlane);
    rampGroup.add(rampPlane);
    
    const gridFloor = new THREE.GridHelper(5.8, 24, C.cyan, C.dim);
    gridFloor.position.set(0, 0.03, 0);
    gridFloor.material.transparent = true;
    gridFloor.material.opacity = 0.25;
    gridFloor.material.blending = THREE.AdditiveBlending;
    rampGroup.add(gridFloor);
    
    const edgeLightMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.6 });
    const leftStrip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 3.1), edgeLightMat);
    leftStrip.position.set(-2.95, 0.04, 0);
    rampGroup.add(leftStrip);
    
    const rightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 3.1), edgeLightMat);
    rightStrip.position.set(2.95, 0.04, 0);
    rampGroup.add(rightStrip);
    
    for (let x = -2; x <= 2; x += 1) {
      const arrowCone = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 8), holoMat(C.teal, 0.7));
      arrowCone.position.set(x, 0.08, 1.2);
      arrowCone.rotation.x = Math.PI / 2;
      rampGroup.add(arrowCone);
    }
    
    scene.add(rampGroup);

    const carGroup = new THREE.Group();
    const sedan = buildSedan(); 
    sedan.position.y = 0.05; 
    carGroup.add(sedan);
    const ev = buildEVInternals(); 
    ev.position.y = 0.05; 
    carGroup.add(ev);
    scene.add(carGroup);
    const energyLines = buildVehicleEnergyLines(carGroup);

    const scanPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5,2.6),
      new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,opacity:0.04,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})
    );
    scanPlane.rotation.y=Math.PI/2; carGroup.add(scanPlane);

    const raycaster = new THREE.Raycaster(), hotMeshes = [];
    VEHICLE_HOTSPOTS.forEach(({id,pos}) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.22,8,8),new THREE.MeshBasicMaterial({visible:false}));
      m.position.copy(pos); m.userData.id=id; carGroup.add(m); hotMeshes.push(m);
    });

    stateRef.current = {
      scene,camera,renderer,rampGroup,carGroup,energyLines,scanPlane,
      isDragging:false,prevMouse:{x:0,y:0},autoRotate:true,
      phi:0,theta:0.18,radius:5.5,targetPhi:0,targetTheta:0.18,
      animId:null,clock:new THREE.Clock(),W,H,
    };

    const onMouseDown = e => { const s=stateRef.current; s.isDragging=true; s.autoRotate=false; s.prevMouse={x:e.clientX,y:e.clientY}; };
    const onMouseMove = e => {
      const s=stateRef.current; if(!s.isDragging) return;
      s.targetPhi  += (e.clientX-s.prevMouse.x)*0.008;
      s.targetTheta = Math.max(0,Math.min(0.65,s.targetTheta+(e.clientY-s.prevMouse.y)*0.005));
      s.prevMouse={x:e.clientX,y:e.clientY};
    };
    const onMouseUp = e => {
      const s=stateRef.current; s.isDragging=false;
      const rect=renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera({x:((e.clientX-rect.left)/rect.width)*2-1,y:-((e.clientY-rect.top)/rect.height)*2+1},camera);
      const hits=raycaster.intersectObjects(hotMeshes);
      if(hits.length) handleHotspot(hits[0].object.userData.id);
    };
    const onWheel = e => { const s=stateRef.current; s.radius=Math.max(3,Math.min(9,s.radius+e.deltaY*0.01)); };

    renderer.domElement.addEventListener("mousedown",  onMouseDown);
    renderer.domElement.addEventListener("mousemove",  onMouseMove);
    renderer.domElement.addEventListener("mouseup",    onMouseUp);
    renderer.domElement.addEventListener("wheel",      onWheel);

    const animate = () => {
      const s=stateRef.current; s.animId=requestAnimationFrame(animate);
      const t=s.clock.getElapsedTime();
      if(s.autoRotate) s.targetPhi+=0.004;
      s.phi  +=(s.targetPhi  -s.phi  )*0.06;
      s.theta+=(s.targetTheta-s.theta)*0.06;
      camera.position.set(
        s.radius*Math.sin(s.phi)*Math.cos(s.theta),
        s.radius*Math.sin(s.theta)+0.3,
        s.radius*Math.cos(s.phi)*Math.cos(s.theta)
      );
      camera.lookAt(0,0.2,0);
      
      rampGroup.children.forEach(child => {
        if (child.material && (child.position.x === -2.95 || child.position.x === 2.95)) {
          const intensity = 0.4 + 0.3 * Math.sin(t * 3);
          child.material.opacity = intensity;
        }
      });
      
      scanPlane.position.x=Math.sin(t*0.7)*2.1;
      scanPlane.material.opacity=0.025+0.018*Math.abs(Math.sin(t*0.7));
      energyLines.forEach(({mat,phase},i)=>{
        mat.opacity=(0.5+0.5*Math.sin(t*3+phase))*0.9;
        mat.color.setHex(i%2===0?C.teal:C.cyan);
      });
      pLight.intensity=0.55+0.3*Math.sin(t*1.5);
      renderer.render(scene,camera);
      const cW=el.clientWidth||W, cH=el.clientHeight||H;
      VEHICLE_HOTSPOTS.forEach(({pos},i)=>{
        const wp=pos.clone(); carGroup.localToWorld(wp);
        const p=wp.clone().project(camera);
        const lEl=labelRefs.current[i]; if(!lEl) return;
        lEl.style.left=(( p.x*0.5+0.5)*cW)+"px";
        lEl.style.top =((-p.y*0.5+0.5)*cH)+"px";
        lEl.style.display=p.z<1?"flex":"none";
      });
    };
    animate();

    const ro=new ResizeObserver(()=>{
      const W2=el.clientWidth||560,H2=el.clientHeight||230;
      camera.aspect=W2/H2; camera.updateProjectionMatrix(); renderer.setSize(W2,H2);
    });
    ro.observe(el);

    return () => {
      const s=stateRef.current; cancelAnimationFrame(s.animId); ro.disconnect();
      renderer.domElement.removeEventListener("mousedown",onMouseDown);
      renderer.domElement.removeEventListener("mousemove",onMouseMove);
      renderer.domElement.removeEventListener("mouseup",  onMouseUp);
      renderer.domElement.removeEventListener("wheel",    onWheel);
      renderer.dispose();
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [handleHotspot]);

  return (
    <div className="cy-panel" style={sharedStyles.panelWrap}>
      <div className="hud-scan" style={sharedStyles.scanOverlay} />
      <div ref={mountRef} style={sharedStyles.mountDiv} />
      <div style={sharedStyles.cornerTL}/><div style={sharedStyles.cornerTR}/>
      <div style={sharedStyles.cornerBL}/><div style={sharedStyles.cornerBR}/>
      
      <div style={{position:"absolute",top:10,left:0,right:0,textAlign:"center",fontSize:10,letterSpacing:3,
        color:C_CSS.cyan,fontFamily:"'Courier New',monospace",fontWeight:700,
        display:"flex",alignItems:"center",justifyContent:"center",gap:8,pointerEvents:"none",
        textShadow:`0 0 10px ${C_CSS.cyan}`}}>
        <span style={{width:5,height:5,background:C_CSS.teal,borderRadius:"50%",display:"inline-block",boxShadow:`0 0 6px ${C_CSS.teal}`}}/>
        EV VEHICLE OVERVIEW
        <span style={{background:`${C_CSS.cyan}22`,border:`1px solid ${C_CSS.cyan}55`,borderRadius:3,
          padding:"1px 5px",fontSize:8,letterSpacing:2,color:C_CSS.teal}}>3D HOLO</span>
      </div>
      
      <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",
        display:"flex",alignItems:"center",gap:4,pointerEvents:"none"}}>
        <span style={{width:5,height:5,background:C_CSS.teal,borderRadius:"50%",boxShadow:`0 0 6px ${C_CSS.teal}`}}/>
        <span style={{color:C_CSS.teal,fontSize:9,letterSpacing:2}}>LIVE</span>
        <span style={{color:`${C_CSS.cyan}88`,fontSize:9,marginLeft:8}}>DRAG · SCROLL TO ZOOM</span>
      </div>
      
      {VEHICLE_HOTSPOTS.map(({id,label,color},i)=>(
        <button key={id} ref={el=>(labelRefs.current[i]=el)} onClick={()=>handleHotspot(id)}
          style={{position:"absolute",transform:"translate(-50%,-50%)",display:"flex",alignItems:"center",gap:4,
            fontSize:8,letterSpacing:2,fontFamily:"'Courier New',monospace",fontWeight:700,
            background:"rgba(0,13,26,0.75)",border:"1px solid",borderColor:color,color,borderRadius:2,
            padding:"2px 6px",cursor:"pointer",outline:"none",whiteSpace:"nowrap",
            textShadow:"0 0 8px currentColor",boxShadow:"0 0 8px rgba(0,212,255,0.2)",zIndex:10}}>
          <span style={{width:4,height:4,borderRadius:"50%",background:color,flexShrink:0,boxShadow:"0 0 5px currentColor"}}/>
          {label}
        </button>
      ))}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                     BATTERY PACK VISUALIZATION 3D                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const MODULES = [
  { id:"cells",      label:"CELL ARRAY",   color:C_CSS.teal,  hex:C.teal,  pos:[ 0.00, 0.00, 0], desc:"288 prismatic cells · 400V" },
  { id:"bms",        label:"BMS",          color:C_CSS.cyan,  hex:C.cyan,  pos:[-1.20, 0.55, 0], desc:"Battery Management System" },
  { id:"cooling",    label:"COOLING",      color:C_CSS.blue,  hex:C.blue,  pos:[ 1.20, 0.55, 0], desc:"Liquid thermal management" },
  { id:"terminals",  label:"TERMINALS",    color:C_CSS.amber, hex:C.amber, pos:[ 0.00,-0.55, 0], desc:"HV +/- output connectors" },
];

function buildBatteryPack() {
  const g = new THREE.Group();

  const encGeo = new THREE.BoxGeometry(3.6, 0.55, 1.6);
  g.add(new THREE.Mesh(encGeo, holoMat(C.cyan, 0.06)));
  addEdges(encGeo, edgeMat(C.cyan, 0.9), g);
  g.add(new THREE.Mesh(encGeo, holoMat(C.teal, 0.04, true)));

  for (let stack = 0; stack < 2; stack++) {
    for (let col = -3; col <= 3; col++) {
      for (let row = -1; row <= 1; row++) {
        const cGeo = new THREE.BoxGeometry(0.36, 0.18, 0.30);
        const cell = new THREE.Mesh(cGeo, holoMat(C.teal, 0.40));
        cell.position.set(col*0.44, stack*0.22-0.11, row*0.36);
        addEdges(cGeo, edgeMat(C.teal, 0.55), cell);
        g.add(cell);
      }
    }
  }

  const bmsGeo = new THREE.BoxGeometry(0.60, 0.06, 0.55);
  const bms = new THREE.Mesh(bmsGeo, holoMat(C.cyan, 0.5));
  bms.position.set(-1.35, 0.32, 0);
  addEdges(bmsGeo, edgeMat(C.cyan, 0.9), bms);
  g.add(bms);
  for (let i = 0; i < 4; i++) {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.04,0.06), holoMat(C.white,0.6));
    chip.position.set(-1.35+i*0.14-0.21, 0.36, 0); g.add(chip);
  }

  const coolGeo = new THREE.BoxGeometry(0.60, 0.04, 0.55);
  const cool = new THREE.Mesh(coolGeo, holoMat(C.blue, 0.4));
  cool.position.set(1.35, 0.32, 0);
  addEdges(coolGeo, edgeMat(C.blue, 0.9), cool);
  g.add(cool);
  for (let i = 0; i < 5; i++) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.55,8), holoMat(C.blue,0.6));
    pipe.rotation.x=Math.PI/2; pipe.position.set(1.10+i*0.12, 0.34, 0); g.add(pipe);
  }

  [[-0.22,-0.32],[ 0.22,-0.32]].forEach(([x,y],i) => {
    const tGeo = new THREE.CylinderGeometry(0.05,0.05,0.14,12);
    const term = new THREE.Mesh(tGeo, holoMat(i===0?C.amber:C.red,0.85));
    term.position.set(x,y,0); addEdges(tGeo,edgeMat(i===0?C.amber:C.red,0.9),term); g.add(term);
    const label = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.02,0.08), holoMat(i===0?C.amber:C.red,0.6));
    label.position.set(x,y+0.10,0); g.add(label);
  });

  for (let col = -3; col <= 2; col++) {
    for (let row = -1; row <= 1; row++) {
      const barGeo = new THREE.BoxGeometry(0.10, 0.02, 0.04);
      const bar = new THREE.Mesh(barGeo, holoMat(C.cyan,0.5));
      bar.position.set(col*0.44+0.22, 0.14, row*0.36); g.add(bar);
    }
  }

  return g;
}

function buildBatteryEnergyLines(parent) {
  const paths = [
    [new THREE.Vector3(-1.35,0.04,0), new THREE.Vector3(-0.80,0.04,0)],
    [new THREE.Vector3( 1.35,0.04,0), new THREE.Vector3( 0.80,0.04,0)],
    [new THREE.Vector3(-0.22,-0.25,0),new THREE.Vector3(-0.22,-0.05,0)],
    [new THREE.Vector3( 0.22,-0.25,0),new THREE.Vector3( 0.22,-0.05,0)],
    [new THREE.Vector3(-1.60,0.04,0.70),new THREE.Vector3(1.60,0.04,0.70)],
  ];
  return paths.map(([s,e])=>{
    const pts=[]; for(let t=0;t<=1;t+=0.05) pts.push(s.clone().lerp(e,t));
    const mat=new THREE.LineBasicMaterial({color:C.teal,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat);
    parent.add(line);
    return {mat,phase:Math.random()*Math.PI*2};
  });
}

const BATT_HOTSPOTS = [
  {id:"cells",    label:"CELLS",    pos:new THREE.Vector3( 0.00, 0.10, 0.85), color:C_CSS.teal},
  {id:"bms",      label:"BMS",      pos:new THREE.Vector3(-1.35, 0.50, 0.40), color:C_CSS.cyan},
  {id:"cooling",  label:"COOLING",  pos:new THREE.Vector3( 1.35, 0.50, 0.40), color:C_CSS.blue},
  {id:"terminals",label:"HV TERM",  pos:new THREE.Vector3( 0.00,-0.45, 0.40), color:C_CSS.amber},
];

export function BatteryPackVisualization3D({ onSelectModule }) {
  const mountRef  = useRef(null);
  const labelRefs = useRef([]);
  const stateRef  = useRef({});
  const [activeId, setActiveId] = useState(null);
  const handleHotspot = useCallback((id) => { setActiveId(id); if(onSelectModule) onSelectModule(id); }, [onSelectModule]);

  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    const W=el.clientWidth||560, H=el.clientHeight||230;
    const scene = new THREE.Scene();
    scene.fog   = new THREE.FogExp2(0x000d1a,0.10);
    const camera = new THREE.PerspectiveCamera(44,W/H,0.1,100);
    camera.position.set(0,1.2,5.0); camera.lookAt(0,0,0);
    const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setClearColor(0,0); el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(C.teal,0.3));
    const pLight=new THREE.PointLight(C.teal,0.9,14); pLight.position.set(0,3,3); scene.add(pLight);
    const pLight2=new THREE.PointLight(C.cyan,0.5,10); pLight2.position.set(-3,1,-2); scene.add(pLight2);

    const platG = new THREE.Group(); platG.position.y=-0.42;
    platG.add(new THREE.Mesh(new THREE.TorusGeometry(2.3,0.025,6,80),holoMat(C.teal,0.5)));
    platG.add(new THREE.Mesh(new THREE.TorusGeometry(2.0,0.012,6,80),holoMat(C.cyan,0.3)));
    const grid2=new THREE.GridHelper(4.4,18,C.teal,C.dim);
    grid2.material.transparent=true; grid2.material.opacity=0.15; grid2.material.blending=THREE.AdditiveBlending;
    platG.add(grid2); scene.add(platG);

    const packGroup = new THREE.Group();
    packGroup.add(buildBatteryPack());
    scene.add(packGroup);
    const energyLines = buildBatteryEnergyLines(packGroup);

    const scanP = new THREE.Mesh(
      new THREE.PlaneGeometry(4.0,2.0),
      new THREE.MeshBasicMaterial({color:C.teal,transparent:true,opacity:0.04,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})
    );
    scanP.rotation.y=Math.PI/2; packGroup.add(scanP);

    const raycaster=new THREE.Raycaster(), hotMeshes=[];
    BATT_HOTSPOTS.forEach(({id,pos})=>{
      const m=new THREE.Mesh(new THREE.SphereGeometry(0.28,8,8),new THREE.MeshBasicMaterial({visible:false}));
      m.position.copy(pos); m.userData.id=id; packGroup.add(m); hotMeshes.push(m);
    });

    stateRef.current={scene,camera,renderer,packGroup,platG,energyLines,scanP,
      isDragging:false,prevMouse:{x:0,y:0},autoRotate:true,
      phi:0.3,theta:0.22,radius:5.0,targetPhi:0.3,targetTheta:0.22,
      animId:null,clock:new THREE.Clock()};

    const onMD=e=>{const s=stateRef.current;s.isDragging=true;s.autoRotate=false;s.prevMouse={x:e.clientX,y:e.clientY};};
    const onMM=e=>{const s=stateRef.current;if(!s.isDragging)return;
      s.targetPhi+=(e.clientX-s.prevMouse.x)*0.008;
      s.targetTheta=Math.max(0,Math.min(0.7,s.targetTheta+(e.clientY-s.prevMouse.y)*0.005));
      s.prevMouse={x:e.clientX,y:e.clientY};};
    const onMU=e=>{const s=stateRef.current;s.isDragging=false;
      const rect=renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera({x:((e.clientX-rect.left)/rect.width)*2-1,y:-((e.clientY-rect.top)/rect.height)*2+1},camera);
      const hits=raycaster.intersectObjects(hotMeshes);
      if(hits.length) handleHotspot(hits[0].object.userData.id);};
    const onWh=e=>{const s=stateRef.current;s.radius=Math.max(2.5,Math.min(9,s.radius+e.deltaY*0.01));};
    renderer.domElement.addEventListener("mousedown",onMD);
    renderer.domElement.addEventListener("mousemove",onMM);
    renderer.domElement.addEventListener("mouseup",  onMU);
    renderer.domElement.addEventListener("wheel",    onWh);

    const animate=()=>{
      const s=stateRef.current; s.animId=requestAnimationFrame(animate);
      const t=s.clock.getElapsedTime();
      if(s.autoRotate) s.targetPhi+=0.003;
      s.phi  +=(s.targetPhi  -s.phi  )*0.06;
      s.theta+=(s.targetTheta-s.theta)*0.06;
      camera.position.set(s.radius*Math.sin(s.phi)*Math.cos(s.theta),s.radius*Math.sin(s.theta),s.radius*Math.cos(s.phi)*Math.cos(s.theta));
      camera.lookAt(0,0,0);
      platG.rotation.y+=0.004;
      scanP.position.x=Math.sin(t*0.8)*1.8;
      scanP.material.opacity=0.02+0.02*Math.abs(Math.sin(t*0.8));
      energyLines.forEach(({mat,phase},i)=>{
        mat.opacity=(0.5+0.5*Math.sin(t*2.5+phase))*0.85;
        mat.color.setHex(i%2===0?C.teal:C.cyan);
      });
      pLight.intensity=0.6+0.35*Math.sin(t*1.8);
      renderer.render(scene,camera);
      const cW=el.clientWidth||W,cH=el.clientHeight||H;
      BATT_HOTSPOTS.forEach(({pos},i)=>{
        const wp=pos.clone(); packGroup.localToWorld(wp);
        const p=wp.clone().project(camera);
        const lEl=labelRefs.current[i]; if(!lEl) return;
        lEl.style.left=((p.x*0.5+0.5)*cW)+"px";
        lEl.style.top =((-p.y*0.5+0.5)*cH)+"px";
        lEl.style.display=p.z<1?"flex":"none";
      });
    };
    animate();

    const ro=new ResizeObserver(()=>{
      const W2=el.clientWidth||560,H2=el.clientHeight||230;
      camera.aspect=W2/H2;camera.updateProjectionMatrix();renderer.setSize(W2,H2);
    });
    ro.observe(el);

    return ()=>{
      const s=stateRef.current; cancelAnimationFrame(s.animId); ro.disconnect();
      renderer.domElement.removeEventListener("mousedown",onMD);
      renderer.domElement.removeEventListener("mousemove",onMM);
      renderer.domElement.removeEventListener("mouseup",  onMU);
      renderer.domElement.removeEventListener("wheel",    onWh);
      renderer.dispose();
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  },[handleHotspot]);

  return (
    <div className="cy-panel" style={sharedStyles.panelWrap}>
      <div className="hud-scan" style={sharedStyles.scanOverlay} />
      <div ref={mountRef} style={sharedStyles.mountDiv}/>
      <div style={sharedStyles.cornerTL}/><div style={sharedStyles.cornerTR}/>
      <div style={sharedStyles.cornerBL}/><div style={sharedStyles.cornerBR}/>
      
      <div style={{position:"absolute",top:10,left:0,right:0,display:"flex",alignItems:"center",
        justifyContent:"center",gap:8,pointerEvents:"none",fontFamily:"'Courier New',monospace"}}>
        <span style={{width:5,height:5,background:C_CSS.teal,borderRadius:"50%",boxShadow:`0 0 6px ${C_CSS.teal}`}}/>
        <span style={{fontSize:10,letterSpacing:3,color:C_CSS.teal,fontWeight:700,textShadow:`0 0 10px ${C_CSS.teal}`}}>
          BATTERY PACK
        </span>
        <span style={{background:`${C_CSS.teal}22`,border:`1px solid ${C_CSS.teal}55`,
          borderRadius:3,padding:"1px 5px",fontSize:8,letterSpacing:2,color:C_CSS.cyan}}>94.0 kWh</span>
      </div>
      
      {activeId && (
        <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",
          background:"rgba(0,13,26,0.85)",border:`1px solid ${C_CSS.teal}`,borderRadius:3,
          padding:"3px 12px",fontFamily:"'Courier New',monospace",fontSize:9,letterSpacing:2,
          color:C_CSS.teal,whiteSpace:"nowrap",pointerEvents:"none",
          textShadow:`0 0 8px ${C_CSS.teal}`}}>
          {MODULES.find(m=>m.id===activeId)?.desc}
        </div>
      )}
      
      {BATT_HOTSPOTS.map(({id,label,color},i)=>(
        <button key={id} ref={el=>(labelRefs.current[i]=el)} onClick={()=>handleHotspot(id)}
          style={{position:"absolute",transform:"translate(-50%,-50%)",display:"flex",
            alignItems:"center",gap:4,fontSize:8,letterSpacing:2,
            fontFamily:"'Courier New',monospace",fontWeight:700,
            background:"rgba(0,13,26,0.78)",border:"1px solid",borderColor:color,color,
            borderRadius:2,padding:"2px 6px",cursor:"pointer",outline:"none",
            whiteSpace:"nowrap",textShadow:"0 0 8px currentColor",
            boxShadow:`0 0 8px ${color}44`,zIndex:10,
            ...(activeId===id?{background:`${color}22`,boxShadow:`0 0 14px ${color}`}:{})}}>
          <span style={{width:4,height:4,borderRadius:"50%",background:color,flexShrink:0}}/>
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
  { id:"v001", city:"New York",    lat:40.71, lon:-74.01, status:"active",  charge:87 },
  { id:"v002", city:"London",      lat:51.51, lon: -0.13, status:"active",  charge:62 },
  { id:"v003", city:"Tokyo",       lat:35.68, lon:139.69, status:"charging",charge:45 },
  { id:"v004", city:"Dubai",       lat:25.20, lon: 55.27, status:"active",  charge:91 },
  { id:"v005", city:"Sydney",      lat:-33.87,lon:151.21, status:"idle",    charge:78 },
  { id:"v006", city:"São Paulo",   lat:-23.55,lon:-46.63, status:"active",  charge:55 },
  { id:"v007", city:"Berlin",      lat:52.52, lon: 13.40, status:"charging",charge:33 },
  { id:"v008", city:"Mumbai",      lat:19.08, lon: 72.88, status:"active",  charge:70 },
  { id:"v009", city:"Toronto",     lat:43.65, lon:-79.38, status:"idle",    charge:95 },
  { id:"v010", city:"Singapore",   lat: 1.35, lon:103.82, status:"active",  charge:81 },
  { id:"v011", city:"Cairo",       lat:30.04, lon: 31.24, status:"active",  charge:67 },
  { id:"v012", city:"Mexico City", lat:19.43, lon:-99.13, status:"charging",charge:29 },
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

  const sGeo = new THREE.SphereGeometry(R, 32, 24);
  g.add(new THREE.Mesh(sGeo, holoMat(C.cyan, 0.04)));
  g.add(new THREE.Mesh(sGeo, holoMat(C.cyan, 0.05, true)));

  for (let lat = -75; lat <= 75; lat += 15) {
    const r2 = R * Math.cos(lat*Math.PI/180);
    const y  = R * Math.sin(lat*Math.PI/180);
    const pts=[];
    for(let a=0;a<=Math.PI*2;a+=0.06) pts.push(new THREE.Vector3(Math.cos(a)*r2,y,Math.sin(a)*r2));
    pts.push(pts[0].clone());
    const lGeo=new THREE.BufferGeometry().setFromPoints(pts);
    g.add(new THREE.Line(lGeo, edgeMat(C.cyan, lat===0?0.55:0.18)));
  }
  
  for (let lon = 0; lon < 360; lon += 20) {
    const pts=[];
    for(let a=-Math.PI/2;a<=Math.PI/2;a+=0.06){
      const t=lon*Math.PI/180;
      pts.push(new THREE.Vector3(Math.cos(a)*Math.cos(t)*R,Math.sin(a)*R,Math.cos(a)*Math.sin(t)*R));
    }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), edgeMat(C.cyan,0.18)));
  }

  const atmGeo = new THREE.SphereGeometry(R*1.04,32,24);
  g.add(new THREE.Mesh(atmGeo, holoMat(C.cyan, 0.03)));

  return g;
}

function buildVehicleMarkers(onSelect) {
  const group = new THREE.Group();
  const markers = [];

  FLEET_VEHICLES.forEach(v => {
    const pos = latLonToVec3(v.lat, v.lon, 1.04);
    const color = v.status==="active"?C.teal : v.status==="charging"?C.amber : C.blue;

    const ringGeo = new THREE.TorusGeometry(0.038, 0.008, 6, 24);
    const ring = new THREE.Mesh(ringGeo, holoMat(color, 0.8));
    ring.position.copy(pos);
    ring.lookAt(pos.clone().multiplyScalar(2));
    ring.userData = { v, color };
    group.add(ring);

    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.018,8,8), holoMat(color,1.0));
    dot.position.copy(pos);
    group.add(dot);

    const surfPt = latLonToVec3(v.lat,v.lon,1.0);
    const lGeo=new THREE.BufferGeometry().setFromPoints([surfPt,pos]);
    group.add(new THREE.Line(lGeo, edgeMat(color,0.5)));

    markers.push({ ring, dot, v, color, pos, phase: Math.random()*Math.PI*2 });
  });

  return { group, markers };
}

function buildArcConnections(globe) {
  const arcs = [];
  const routes = [[0,1],[2,3],[4,5],[6,7],[8,9],[1,6],[0,5],[3,9]];
  routes.forEach(([a,b]) => {
    const vA = FLEET_VEHICLES[a], vB = FLEET_VEHICLES[b];
    const pA = latLonToVec3(vA.lat,vA.lon,1.04);
    const pB = latLonToVec3(vB.lat,vB.lon,1.04);
    const mid = pA.clone().add(pB).multiplyScalar(0.5).normalize().multiplyScalar(1.35);
    const pts=[];
    for(let t=0;t<=1;t+=0.03){
      const p = new THREE.Vector3();
      p.x = (1-t)*(1-t)*pA.x + 2*(1-t)*t*mid.x + t*t*pB.x;
      p.y = (1-t)*(1-t)*pA.y + 2*(1-t)*t*mid.y + t*t*pB.y;
      p.z = (1-t)*(1-t)*pA.z + 2*(1-t)*t*mid.z + t*t*pB.z;
      pts.push(p);
    }
    const mat=new THREE.LineBasicMaterial({color:C.cyan,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat);
    globe.add(line);
    arcs.push({mat,phase:Math.random()*Math.PI*2});
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
    const el=mountRef.current; if(!el) return;
    const W=el.clientWidth||560,H=el.clientHeight||230;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(50,W/H,0.1,100);
    camera.position.set(0,0,3.2); camera.lookAt(0,0,0);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setClearColor(0,0); el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(C.cyan,0.4));
    const pL=new THREE.PointLight(C.cyan,0.7,12); pL.position.set(3,3,3); scene.add(pL);
    const pL2=new THREE.PointLight(C.teal,0.4,10); pL2.position.set(-3,-2,-3); scene.add(pL2);

    const globeGroup=new THREE.Group();
    globeGroup.add(buildGlobe());
    scene.add(globeGroup);

    const {group:markerGroup, markers}=buildVehicleMarkers(handleSelect);
    globeGroup.add(markerGroup);
    const arcs=buildArcConnections(globeGroup);

    const starPts=[];
    for(let i=0;i<400;i++) {
      const v=new THREE.Vector3((Math.random()-0.5)*40,(Math.random()-0.5)*40,(Math.random()-0.5)*40);
      if(v.length()>3) starPts.push(v);
    }
    const starGeo=new THREE.BufferGeometry().setFromPoints(starPts);
    const starMat=new THREE.PointsMaterial({color:C.cyan,size:0.04,transparent:true,opacity:0.35,blending:THREE.AdditiveBlending});
    scene.add(new THREE.Points(starGeo,starMat));

    const raycaster=new THREE.Raycaster();
    const hotMeshes=markers.map(m=>m.ring);

    stateRef.current={scene,camera,renderer,globeGroup,markers,arcs,
      isDragging:false,prevMouse:{x:0,y:0},autoRotate:true,
      phi:0,theta:0,radius:3.2,targetPhi:0,targetTheta:0,
      animId:null,clock:new THREE.Clock()};

    const onMD=e=>{const s=stateRef.current;s.isDragging=true;s.autoRotate=false;s.prevMouse={x:e.clientX,y:e.clientY};};
    const onMM=e=>{const s=stateRef.current;if(!s.isDragging)return;
      s.targetPhi+=(e.clientX-s.prevMouse.x)*0.006;
      s.targetTheta=Math.max(-0.5,Math.min(0.5,s.targetTheta+(e.clientY-s.prevMouse.y)*0.004));
      s.prevMouse={x:e.clientX,y:e.clientY};};
    const onMU=e=>{const s=stateRef.current;s.isDragging=false;
      const rect=renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera({x:((e.clientX-rect.left)/rect.width)*2-1,y:-((e.clientY-rect.top)/rect.height)*2+1},camera);
      const hits=raycaster.intersectObjects(hotMeshes);
      if(hits.length){const m=markers.find(mk=>mk.ring===hits[0].object);if(m)handleSelect(m.v);}};
    const onWh=e=>{const s=stateRef.current;s.radius=Math.max(1.8,Math.min(6,s.radius+e.deltaY*0.008));};
    renderer.domElement.addEventListener("mousedown",onMD);
    renderer.domElement.addEventListener("mousemove",onMM);
    renderer.domElement.addEventListener("mouseup",  onMU);
    renderer.domElement.addEventListener("wheel",    onWh);

    const animate=()=>{
      const s=stateRef.current; s.animId=requestAnimationFrame(animate);
      const t=s.clock.getElapsedTime();
      if(s.autoRotate) s.targetPhi+=0.002;
      s.phi  +=(s.targetPhi  -s.phi  )*0.05;
      s.theta+=(s.targetTheta-s.theta)*0.05;
      camera.position.set(
        s.radius*Math.sin(s.phi)*Math.cos(s.theta),
        s.radius*Math.sin(s.theta),
        s.radius*Math.cos(s.phi)*Math.cos(s.theta)
      );
      camera.lookAt(0,0,0);
      pL.intensity=0.5+0.25*Math.sin(t*1.2);

      markers.forEach(({ring,phase,color})=>{
        const pulse=0.7+0.3*Math.sin(t*2.5+phase);
        ring.material.opacity=pulse*0.9;
        ring.scale.setScalar(0.85+0.3*Math.sin(t*2+phase));
      });

      arcs.forEach(({mat,phase})=>{
        mat.opacity=(0.4+0.4*Math.sin(t*1.8+phase))*0.7;
      });

      renderer.render(scene,camera);

      const cW=el.clientWidth||W,cH=el.clientHeight||H;
      markers.forEach(({pos,v},i)=>{
        const wp=pos.clone(); globeGroup.localToWorld(wp);
        const p=wp.clone().project(camera);
        const lEl=labelRefs.current[i]; if(!lEl) return;
        const sx=(p.x*0.5+0.5)*cW;
        const sy=(-p.y*0.5+0.5)*cH;
        lEl.style.left=sx+"px"; lEl.style.top=sy+"px";
        lEl.style.display=p.z<1?"block":"none";
        lEl.style.opacity=p.z<1?"1":"0";
      });
    };
    animate();

    const ro=new ResizeObserver(()=>{
      const W2=el.clientWidth||560,H2=el.clientHeight||230;
      camera.aspect=W2/H2;camera.updateProjectionMatrix();renderer.setSize(W2,H2);
    });
    ro.observe(el);

    return ()=>{
      const s=stateRef.current; cancelAnimationFrame(s.animId); ro.disconnect();
      renderer.domElement.removeEventListener("mousedown",onMD);
      renderer.domElement.removeEventListener("mousemove",onMM);
      renderer.domElement.removeEventListener("mouseup",  onMU);
      renderer.domElement.removeEventListener("wheel",    onWh);
      renderer.dispose();
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  },[handleSelect]);

  const statusColor = s => s==="active"?C_CSS.teal:s==="charging"?C_CSS.amber:C_CSS.blue;

  return (
    <div className="cy-panel" style={sharedStyles.panelWrap}>
      <div className="hud-scan" style={sharedStyles.scanOverlay} />
      <div ref={mountRef} style={sharedStyles.mountDiv}/>
      <div style={sharedStyles.cornerTL}/><div style={sharedStyles.cornerTR}/>
      <div style={sharedStyles.cornerBL}/><div style={sharedStyles.cornerBR}/>

      <div style={{position:"absolute",top:10,left:0,right:0,display:"flex",alignItems:"center",
        justifyContent:"center",gap:8,pointerEvents:"none",fontFamily:"'Courier New',monospace"}}>
        <span style={{width:5,height:5,background:C_CSS.cyan,borderRadius:"50%",boxShadow:`0 0 6px ${C_CSS.cyan}`}}/>
        <span style={{fontSize:10,letterSpacing:3,color:C_CSS.cyan,fontWeight:700,textShadow:`0 0 10px ${C_CSS.cyan}`}}>
          FLEET OVERVIEW
        </span>
        <span style={{background:`${C_CSS.cyan}22`,border:`1px solid ${C_CSS.cyan}55`,
          borderRadius:3,padding:"1px 5px",fontSize:8,letterSpacing:2,color:C_CSS.teal}}>
          {FLEET_VEHICLES.length} VEHICLES
        </span>
      </div>

      <div style={{position:"absolute",top:32,right:10,display:"flex",flexDirection:"column",gap:3,
        fontFamily:"'Courier New',monospace",pointerEvents:"none"}}>
        {[["active",C_CSS.teal],["charging",C_CSS.amber],["idle",C_CSS.blue]].map(([s,c])=>(
          <div key={s} style={{display:"flex",alignItems:"center",gap:4,fontSize:7,letterSpacing:1,color:c}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:c,boxShadow:`0 0 4px ${c}`}}/>
            {s.toUpperCase()}
          </div>
        ))}
      </div>

      {FLEET_VEHICLES.map((v,i)=>(
        <div key={v.id} ref={el=>(labelRefs.current[i]=el)}
          onClick={()=>handleSelect(v)}
          style={{position:"absolute",transform:"translate(-50%,-130%)",
            fontFamily:"'Courier New',monospace",fontSize:7,letterSpacing:1,
            color:statusColor(v.status),background:"rgba(0,13,26,0.7)",
            border:`1px solid ${statusColor(v.status)}`,borderRadius:2,
            padding:"1px 4px",cursor:"pointer",whiteSpace:"nowrap",
            pointerEvents:"all",zIndex:10,
            textShadow:`0 0 6px ${statusColor(v.status)}`,
            boxShadow:`0 0 6px ${statusColor(v.status)}44`}}>
          {v.city}
        </div>
      ))}

      {activeV && (
        <div style={{position:"absolute",bottom:10,left:10,
          background:"rgba(0,13,26,0.88)",border:`1px solid ${statusColor(activeV.status)}`,
          borderRadius:4,padding:"6px 12px",fontFamily:"'Courier New',monospace",
          fontSize:8,letterSpacing:1,color:statusColor(activeV.status),
          boxShadow:`0 0 12px ${statusColor(activeV.status)}44`,minWidth:140}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:2,marginBottom:3}}>{activeV.id}</div>
          <div style={{color:C_CSS.cyan,marginBottom:2}}>{activeV.city}</div>
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
            <span>STATUS</span>
            <span style={{color:statusColor(activeV.status)}}>{activeV.status.toUpperCase()}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",gap:12,marginTop:2}}>
            <span>CHARGE</span>
            <span style={{color:activeV.charge>60?C_CSS.teal:activeV.charge>30?C_CSS.amber:C_CSS.red}}>
              {activeV.charge}%
            </span>
          </div>
          <div style={{marginTop:4,height:3,background:"#001a2e",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${activeV.charge}%`,
              background:activeV.charge>60?C_CSS.teal:activeV.charge>30?C_CSS.amber:C_CSS.red,
              boxShadow:"0 0 6px currentColor",transition:"width 0.3s"}}/>
          </div>
          <button onClick={()=>setActiveV(null)}
            style={{marginTop:5,background:"none",border:`1px solid ${C_CSS.cyan}44`,
              color:`${C_CSS.cyan}88`,fontSize:7,letterSpacing:1,cursor:"pointer",
              borderRadius:2,padding:"1px 6px",width:"100%"}}>
            CLOSE
          </button>
        </div>
      )}

      <div style={{position:"absolute",bottom:10,right:10,fontFamily:"'Courier New',monospace",
        fontSize:8,letterSpacing:1,textAlign:"right",pointerEvents:"none"}}>
        <div style={{color:C_CSS.teal}}>{FLEET_VEHICLES.filter(v=>v.status==="active").length} ACTIVE</div>
        <div style={{color:C_CSS.amber}}>{FLEET_VEHICLES.filter(v=>v.status==="charging").length} CHARGING</div>
        <div style={{color:C_CSS.blue}}>{FLEET_VEHICLES.filter(v=>v.status==="idle").length} IDLE</div>
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                           EXPORTS                                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

