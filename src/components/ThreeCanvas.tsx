import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  mode?: 'hero' | 'satellite' | 'globe';
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ mode = 'hero' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Group for Earth/Globe
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Digital Wireframe Globe
    const globeRadius = mode === 'satellite' ? 3.2 : 3.0;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 36, 36);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0A2618,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    worldGroup.add(globe);

    // 2. Inner Glow Atmosphere
    const atmoGeometry = new THREE.SphereGeometry(globeRadius * 0.98, 24, 24);
    const atmoMaterial = new THREE.MeshBasicMaterial({
      color: 0x030B07,
      transparent: true,
      opacity: 0.85,
    });
    const innerSphere = new THREE.Mesh(atmoGeometry, atmoMaterial);
    worldGroup.add(innerSphere);

    // 3. Indian Subcontinent & Agricultural Region Pins
    const pinCoords = [
      { lat: 25.9, lon: 81.9, label: 'Pratapgarh (UP)' }, // User farm
      { lat: 31.1, lon: 75.3, label: 'Punjab Green Belt' },
      { lat: 19.7, lon: 75.7, label: 'Maharashtra Agro-Zone' },
      { lat: 11.1, lon: 78.6, label: 'Tamil Nadu Delta' },
      { lat: 23.2, lon: 77.4, label: 'Madhya Pradesh Soya' },
      { lat: -15.7, lon: -47.9, label: 'Brazil Cerrado' },
      { lat: -28.4, lon: 24.6, label: 'South Africa Highveld' },
    ];

    const pinGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const pinMaterial = new THREE.MeshBasicMaterial({ color: 0x10B981 });
    const pulseGeometry = new THREE.RingGeometry(0.1, 0.22, 16);
    const pulseMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4ADE80, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.6 
    });

    const latLonToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    pinCoords.forEach(coord => {
      const pos = latLonToVector3(coord.lat, coord.lon, globeRadius);
      const pin = new THREE.Mesh(pinGeometry, pinMaterial);
      pin.position.copy(pos);
      worldGroup.add(pin);

      const pulseRing = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulseRing.position.copy(pos);
      pulseRing.lookAt(new THREE.Vector3(0, 0, 0));
      worldGroup.add(pulseRing);
    });

    // 4. Orbiting Sentinel-2 Satellite Model
    const satelliteGroup = new THREE.Group();
    const satBodyGeo = new THREE.BoxGeometry(0.3, 0.18, 0.2);
    const satBodyMat = new THREE.MeshBasicMaterial({ color: 0xECE8DD });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satelliteGroup.add(satBody);

    // Solar panels
    const panelGeo = new THREE.BoxGeometry(0.7, 0.02, 0.25);
    const panelMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
    const leftPanel = new THREE.Mesh(panelGeo, panelMat);
    leftPanel.position.set(-0.55, 0, 0);
    const rightPanel = new THREE.Mesh(panelGeo, panelMat);
    rightPanel.position.set(0.55, 0, 0);
    satelliteGroup.add(leftPanel, rightPanel);

    // Sensor scan cone beam
    const coneGeo = new THREE.ConeGeometry(0.6, 2.0, 16, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x10B981,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const scanBeam = new THREE.Mesh(coneGeo, coneMat);
    scanBeam.position.set(0, -1.0, 0);
    satelliteGroup.add(scanBeam);

    scene.add(satelliteGroup);

    // Orbit Ring
    const orbitCurve = new THREE.EllipseCurve(0, 0, 4.6, 4.2, 0, 2 * Math.PI, false, 0);
    const orbitPoints = orbitCurve.getPoints(64);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
      orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
    );
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x10B981,
      transparent: true,
      opacity: 0.25,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.rotation.x = Math.PI / 4;
    scene.add(orbitLine);

    // 5. Ambient Atmospheric Particles (Pollen / Bio-telemetry)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x4ADE80,
      size: 0.05,
      transparent: true,
      opacity: 0.45,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate Earth slowly
      worldGroup.rotation.y = elapsedTime * 0.08;
      worldGroup.rotation.x = 0.2;

      // Orbit satellite along path
      const satAngle = elapsedTime * 0.4;
      const orbitX = Math.cos(satAngle) * 4.6;
      const orbitZ = Math.sin(satAngle) * 4.2;
      
      satelliteGroup.position.set(
        orbitX * Math.cos(Math.PI / 4) - orbitZ * 0,
        orbitX * Math.sin(Math.PI / 4),
        orbitZ
      );
      satelliteGroup.lookAt(new THREE.Vector3(0, 0, 0));

      // Pulse scan beam
      scanBeam.scale.set(
        1 + Math.sin(elapsedTime * 4) * 0.1,
        1,
        1 + Math.sin(elapsedTime * 4) * 0.1
      );

      // Drift particles
      particleSystem.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
    };
  }, [mode]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true" 
    />
  );
};
