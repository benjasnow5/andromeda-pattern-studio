import { create } from 'zustand';

export const useStudioStore = create((set) => ({
  // Archivo y Procesamiento
  svgContent: null,
  setSvgContent: (content) => set({ svgContent: content }),

  // Composición de Cuadrícula
  cols: 5,
  rows: 5,
  spaceX: 20,
  spaceY: 20,
  scale: 1,
  elementRotation: 0, //nueva variable para la rotación de los elementos
  
  // Fondo del lienzo (WebGL)
  bgType: 'solid', // 'solid' | 'linear' | 'radial'
  bgColor1: '#111114',
  bgColor2: '#1e1e24',

  // Estilo: Relleno SVG (Fill)
  enableFill: true,
  fillType: 'solid', // 'solid' | 'linear' | 'radial'
  fillColor1: '#7C3AED',
  fillColor2: '#4F46E5',
  
  // Estilo: Contorno SVG (Stroke)
  enableStroke: false,
  strokeType: 'solid', // 'solid' | 'linear' | 'radial'
  strokeColor1: '#ffffff',
  strokeColor2: '#ffffff',
  strokeWidth: 2,

  // Funciones de actualización dinámica
  updateLayout: (key, value) => set({ [key]: value }),
  updateStyle: (key, value) => set({ [key]: value }),
}));