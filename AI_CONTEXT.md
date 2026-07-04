# Contexto del Proyecto: Andromeda Pattern Studio

## 1. Descripción General
Generador paramétrico de patrones SVG interactivo renderizado en 3D (WebGL). Este proyecto forma parte del ecosistema de herramientas avanzadas para App Andromeda (una plataforma digital transversal diseñada para todo tipo de negocios).

## 2. Directrices de Diseño UI/UX (Ecosistema Andromeda)
* **Estética:** Minimalista, tecnológica, de alto contraste. Estructura y distribución de controles inspirada fielmente en los paneles de estilos de Figma.
* **Tipografía:** Host Grotesk / Clash Grotesk de forma preferente para mantener consistencia de marca.
* **Regla de Color Estricta:** EXCLUIR por completo el color rojo de cualquier componente, estado o indicador visual de la interfaz. La paleta base se compone de fondos oscuros profundos (ej. `#111114`, `#1E1E24`) combinados con acentos vibrantes en tonos cyan (`#00F0FF`) y púrpura (`#7C3AED`).

## 3. Stack Tecnológico
* **Framework:** Vite + React (Estructurado para desarrollo asistido y flujos de Vibe Coding).
* **Estado Global:** Zustand (Manejo centralizado, reactivo y de alto rendimiento).
* **Motor Gráfico:** Three.js + React Three Fiber (@react-three/drei).

## 4. Estructura del Proyecto (Arquitectura Modular)
* `src/components/ui/atoms/`: Componentes visuales puros, atómicos y altamente reutilizables (`Toggle.jsx`, `ColorControl.jsx`).
* `src/components/ui/sections/`: Bloques funcionales conectados directamente al store centralizado (`LayoutSection.jsx`, `BackgroundSection.jsx`, `SvgStyleSection.jsx`).
* `src/components/ui/Sidebar.jsx`: Panel contenedor que coordina las secciones de la interfaz, la carga de archivos base y los disparadores de exportación.
* `src/components/canvas/Scene.jsx`: Lienzo principal WebGL, configuración de iluminación, controles orbitales de cámara y el generador dinámico de fondos en tiempo de ejecución (CanvasTexture).
* `src/components/canvas/PatternGrid.jsx`: Núcleo gráfico optimizado. Mapea la matriz de elementos en un solo paso hacia la GPU utilizando la API de instancias 3D.
* `src/store/useStudioStore.js`: Almacén global que gestiona de manera unificada los estados de layout, opacidades, visibilidad cruzada de relleno/contorno y configuraciones de degradados complejos.
* `src/utils/svgProcessor.js`: Motor analítico que interpreta el XML del SVG cargado. Inyecta degradados lineales o radiales bajo demanda, gestiona el espacio geométrico y exporta el búfer en alta resolución (2048px).

## 5. Soluciones Técnicas Críticas y Blindaje Visual (¡No Modificar!)
* **Rendimiento Máximo y Solución Z-Fighting:** La generación de la cuadrícula se realiza exclusivamente mediante `<instancedMesh>`. Esto reduce las llamadas de dibujo (Draw Calls) de N a 1, permitiendo renderizar miles de elementos a 60 FPS estables. Al apilar los elementos secuencialmente en el búfer de la instancia y establecer `depthWrite={false}` en el material básico, se elimina por completo el parpadeo de texturas (*Z-fighting*).
* **Eliminación de Halo/Contorno Oscuro (Alpha Fringe):** Resuelto desactivando la generación automática de mipmaps (`generateMipmaps = false`) para impedir que los bordes semitransparentes se contaminen con tonos grises o negros. Se fuerza la premultiplicación del canal alfa en el cargador de texturas (`premultiplyAlpha = true`) y se activa `premultipliedAlpha={true}` junto con `THREE.NormalBlending` en el material de Three.js.
* **Prevención de Corte de Contornos (Stroke Clipping):** El procesador XML analiza dinámicamente los límites del `viewBox` del vector y expande sus márgenes de seguridad en un radio proporcional a `strokeWidth * 1.5`. Esto asegura espacio físico suficiente para que la mitad exterior del contorno no sufra recortes en los límites del lienzo.
* **Limpieza de Artefactos de Vectorización:** Los estilos de relleno y contorno se inyectan únicamente en etiquetas de geometría primitiva pura (`path`, `rect`, `circle`, etc.). Se eliminan explícitamente los atributos heredados de los contenedores de grupo (`<g>`) para evitar duplicaciones visuales o deformaciones en el grosor del borde.

## 6. Flujo de Trabajo e Integración Continua
* **Control de Versiones (Git):** El repositorio centralizado vive de forma segura en la rama `main` de GitHub. Protege la sincronización entre múltiples terminales de trabajo locales y remotas.
* **Desarrollo Defensivo (Vibe Coding / Antigravity):** Antes de solicitar refactorizaciones masivas o nuevas funciones a los agentes automáticos de código en Visual Studio, se debe realizar un commit local estable. El archivo `AI_CONTEXT.md` debe estar expuesto para que la IA entienda los límites del sistema de diseño y las optimizaciones de la GPU antes de tocar el código.
* **Despliegue y Distribución (Vercel):** La aplicación está configurada para producción en Vercel. Cada actualización exitosa (`git push origin main`) compila automáticamente el pipeline de Vite y actualiza la URL pública global en tiempo real para visualización multidispositivo.