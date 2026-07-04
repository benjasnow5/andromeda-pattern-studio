# Contexto del Proyecto: Andromeda Pattern Studio

## 1. Descripción General
Generador paramétrico de patrones SVG interactivo renderizado en 3D (WebGL). Este proyecto forma parte del ecosistema de herramientas para App Andromeda (una plataforma digital transversal para todo tipo de negocios).

## 2. Directrices de Diseño UI/UX
* **Estética:** Minimalista, tecnológica, de alto contraste. Inspirada en la distribución de paneles de control de Figma.
* **Tipografía:** Host Grotesk / Clash Grotesk.
* **Regla de Color Estricta:** EXCLUIR por completo el color rojo de los componentes y estados de la interfaz. Utilizar fondos oscuros (ej. `#111114`, `#1E1E24`) con acentos vibrantes (cyan `#00F0FF`, púrpura `#7C3AED`).

## 3. Stack Tecnológico
* **Framework:** Vite + React (Desarrollo asistido y Vibe Coding).
* **Estado Global:** Zustand.
* **Motor Gráfico:** Three.js + React Three Fiber (@react-three/drei).

## 4. Estructura del Proyecto (Core Modularizado)
* `src/components/ui/atoms/`: Componentes visuales puros y reutilizables (`Toggle.jsx`, `ColorControl.jsx`).
* `src/components/ui/sections/`: Bloques de control lógico conectados al store (`LayoutSection.jsx`, `BackgroundSection.jsx`, `SvgStyleSection.jsx`).
* `src/components/ui/Sidebar.jsx`: Contenedor principal que orquesta las secciones de la interfaz y gestiona la exportación del lienzo.
* `src/components/canvas/Scene.jsx`: Lienzo WebGL, luces, generador de fondo dinámico mediante texturas de canvas y cámara orbital.
* `src/components/canvas/PatternGrid.jsx`: Matriz 3D que mapea la textura procesada usando `renderOrder` secuencial.
* `src/store/useStudioStore.js`: Manejo centralizado del estado con Zustand (soporta flujos complejos de degradados y visibilidad independientes).
* `src/utils/svgProcessor.js`: Motor analítico XML que inyecta degradados dinámicos, colores y gestiona el empaquetado geométrico del vector. Pre-renderiza a una resolución de 2048px.

## 5. Decisiones Técnicas y Soluciones Críticas (¡No Modificar!)
* **Z-Fighting (Glitch visual al compactar):** Resuelto asignando un `renderOrder` secuencial por elemento en la cuadrícula y estableciendo `depthWrite={false}` en el `meshBasicMaterial`.
* **Halo / Contorno Oscuro en transparencias (Alpha Fringe):** Resuelto desactivando la generación de mipmaps (`generateMipmaps = false`) y forzando la premultiplicación del canal alfa tanto en el `TextureLoader` (`premultiplyAlpha = true`) como en el material de Three.js (`premultipliedAlpha={true}`).
* **Corte de Contornos (Stroke Clipping):** Resuelto mediante la expansión analítica de las coordenadas y límites del `viewBox` (añadiendo un margen de protección proporcional a `strokeWidth * 1.5`) dentro de `svgProcessor.js`. Esto garantiza que la mitad exterior del trazado no se recorte en los bordes del lienzo original.
* **Artefactos y Doble Trazado (Stroke Artifacts):** Resuelto aplicando los estilos de color y contorno estrictamente a etiquetas de formas primitivas válidas (`path`, `rect`, `circle`, etc.), eliminando de forma explícita los atributos heredados de las etiquetas de agrupación (`<g>`) para evitar duplicaciones visuales.