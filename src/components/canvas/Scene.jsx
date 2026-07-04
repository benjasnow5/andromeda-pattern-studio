import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PatternGrid } from './PatternGrid';
import { useStudioStore } from '../../store/useStudioStore';

const DynamicBackground = () => {
  const { bgType, bgColor1, bgColor2 } = useStudioStore();
  const { scene } = useThree();

  useEffect(() => {
    if (bgType === 'solid') {
      scene.background = new THREE.Color(bgColor1);
      return;
    }

    // Crear un canvas temporal para dibujar el degradado del fondo
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = bgType === 'linear' 
      ? ctx.createLinearGradient(0, 0, 512, 512)
      : ctx.createRadialGradient(256, 256, 0, 256, 256, 362);

    grad.addColorStop(0, bgColor1);
    grad.addColorStop(1, bgColor2);
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;

    return () => texture.dispose();
  }, [bgType, bgColor1, bgColor2, scene]);

  return null;
};

export const Scene = () => {
  return (
    <Canvas 
      id="andromeda-canvas" 
      camera={{ position: [0, 0, 15], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }} 
    >
      <DynamicBackground />
      <ambientLight intensity={1} />
      <PatternGrid />
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
    </Canvas>
  );
};