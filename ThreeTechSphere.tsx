import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePortfolio } from './PortfolioContext';

export const ThreeTechSphere: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, data } = usePortfolio();
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 11;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const isDark = theme === 'dark';
    const mainColor = isDark ? 0xffffff : 0x18181b;
    const secondaryColor = isDark ? 0x71717a : 0xa1a1aa;

    // 2. Main 3D Tech Pivot Group
    const techGroup = new THREE.Group();
    scene.add(techGroup);

    // Inner wireframe sphere
    const sphereGeo = new THREE.SphereGeometry(3.2, 18, 18);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: mainColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.2 : 0.15,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    techGroup.add(sphereMesh);

    // Outer Dodecahedron cage
    const cageGeo = new THREE.DodecahedronGeometry(4.0, 0);
    const cageMat = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.22,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    techGroup.add(cageMesh);

    // Dynamic Tech Stack Node Points
    const techItems = [
      'React',
      'Next.js',
      'Tailwind',
      'TypeScript',
      'Node.js',
      'Express',
      'MySQL',
      'Prisma',
      'MongoDB',
      'REST API',
      'Baileys',
      'WebDev',
    ];

    const nodeMeshes: THREE.Mesh[] = [];
    const textSprites: THREE.Sprite[] = [];

    // Helper to generate text billboard sprites
    const createTextSprite = (text: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = isDark ? '#ffffff' : '#18181b';
        ctx.font = 'bold 26px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: isDark ? 0.85 : 0.75,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.4, 0.6, 1);
      return sprite;
    };

    // Position items around sphere surface using Fibonacci sphere distribution
    const count = techItems.length;
    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;
      const radius = 3.8;

      const x = Math.cos(phi) * r * radius;
      const z = Math.sin(phi) * r * radius;
      const py = y * radius;

      // Small glowing node dot
      const dotGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: mainColor });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.set(x, py, z);
      techGroup.add(dotMesh);
      nodeMeshes.push(dotMesh);

      // Label sprite slightly offset outwards
      const sprite = createTextSprite(techItems[i]);
      sprite.position.set(x * 1.18, py * 1.18, z * 1.18);
      techGroup.add(sprite);
      textSprites.push(sprite);
    }

    // Interactive Drag to Rotate logic
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.007;
      targetRotationX += deltaY * 0.007;

      rotationVelocityX = deltaY * 0.0008;
      rotationVelocityY = deltaX * 0.0008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    const domEl = renderer.domElement;
    domEl.style.cursor = 'grab';
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!isDragging) {
        // Idle continuous auto rotation
        targetRotationY += 0.35 * delta;
        targetRotationX += Math.sin(time * 0.4) * 0.08 * delta;
      }

      // Smooth exponential damping
      techGroup.rotation.y = THREE.MathUtils.damp(techGroup.rotation.y, targetRotationY, 6, delta);
      techGroup.rotation.x = THREE.MathUtils.damp(techGroup.rotation.x, targetRotationX, 6, delta);

      // Gentle floating breathing animation
      cageMesh.rotation.y = -time * 0.15;
      cageMesh.rotation.z = Math.sin(time * 0.2) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      sphereGeo.dispose();
      sphereMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      nodeMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      textSprites.forEach((s) => {
        s.material.map?.dispose();
        s.material.dispose();
      });
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div className="flex flex-col items-center justify-center relative w-full h-[360px] sm:h-[420px] rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 p-4 overflow-hidden group select-none">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full active:cursor-grabbing" />

      {/* Floating 3D Interaction Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-2 pointer-events-none transition-opacity">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white" />
        <span>Drag to rotate 3D tech cluster</span>
      </div>
    </div>
  );
};
