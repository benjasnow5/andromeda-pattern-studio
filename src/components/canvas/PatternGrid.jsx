import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useStudioStore } from '../../store/useStudioStore';
import { processSVG } from '../../utils/svgProcessor';

export const PatternGrid = () => {
  const store = useStudioStore();
  const [textureData, setTextureData] = useState({ texture: null, aspectRatio: 1 });
  const { gl } = useThree();
  
  // Referencia directa a la malla instanciada en la GPU
  const meshRef = useRef();

  // 1. Procesamiento de Textura (Se mantiene intacto)
  useEffect(() => {
    if (!store.svgContent) return;
    
    const { url, aspectRatio } = processSVG(store.svgContent, store);
    
    const loader = new THREE.TextureLoader();
    loader.load(url, (loadedTexture) => {
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.generateMipmaps = false;
      loadedTexture.minFilter = THREE.LinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      loadedTexture.premultiplyAlpha = true;
      
      setTextureData({ texture: loadedTexture, aspectRatio });
    });
  }, [store, gl]);

  // 2. Cálculo Matemático del Búfer de Instancias
  useEffect(() => {
    // Solo ejecutamos si la malla está lista y tenemos una textura
    if (!meshRef.current || !textureData.texture) return;

    const dummy = new THREE.Object3D();
    const unitScale = 0.02; 
    const baseHeight = 2;
    const elementWidth = baseHeight * textureData.aspectRatio;
    const elementHeight = baseHeight;

    const totalWidth = (store.cols * elementWidth) + ((store.cols - 1) * (store.spaceX * unitScale));
    const totalHeight = (store.rows * elementHeight) + ((store.rows - 1) * (store.spaceY * unitScale));
    
    const startX = -totalWidth / 2 + (elementWidth / 2);
    const startY = totalHeight / 2 - (elementHeight / 2);

    let index = 0;

    for (let r = 0; r < store.rows; r++) {
      for (let c = 0; c < store.cols; c++) {
        const x = startX + (c * (elementWidth + store.spaceX * unitScale));
        const y = startY - (r * (elementHeight + store.spaceY * unitScale));
        
        // Colocamos el objeto invisible en la posición y rotación correctas
        dummy.position.set(x, y, 0);
        dummy.rotation.set(0, 0, THREE.MathUtils.degToRad(store.elementRotation));
        dummy.updateMatrix(); // Calculamos la matriz 3D
        
        // Inyectamos la matriz en la posición correspondiente del búfer
        meshRef.current.setMatrixAt(index++, dummy.matrix);
      }
    }
    
    // Bandera crítica: Le avisa a la GPU que las posiciones cambiaron y debe redibujar
    meshRef.current.instanceMatrix.needsUpdate = true;

  }, [store.cols, store.rows, store.spaceX, store.spaceY, store.elementRotation, textureData]);

  if (!textureData.texture) return null;

  const totalElements = store.cols * store.rows;
  const baseHeight = 2;
  const elementWidth = baseHeight * textureData.aspectRatio;

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[null, null, totalElements]}
    >
      <planeGeometry args={[elementWidth, baseHeight]} />
      <meshBasicMaterial 
        map={textureData.texture} 
        transparent={true} 
        depthWrite={false} 
        side={THREE.DoubleSide} 
        premultipliedAlpha={true}
        blending={THREE.NormalBlending}
      />
    </instancedMesh>
  );
};