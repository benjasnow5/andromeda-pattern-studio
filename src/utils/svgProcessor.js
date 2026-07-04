export const processSVG = (svgStr, options) => {
  if (!svgStr) return { url: null, aspectRatio: 1 };

  const { 
    enableFill, fillType, fillColor1, fillColor2, 
    enableStroke, strokeType, strokeColor1, strokeColor2, strokeWidth 
  } = options;

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgStr, "image/svg+xml");
  const svgElement = doc.documentElement;

  svgElement.setAttribute('shape-rendering', 'geometricPrecision');

  // 1. OBTENER DIMENSIONES ORIGINALES
  let vx = 0, vy = 0, vw = 512, vh = 512;
  const viewBox = svgElement.getAttribute('viewBox');
  
  if (viewBox) {
    const parts = viewBox.split(/[ ,]+/).map(parseFloat);
    if (parts.length === 4) {
      vx = parts[0]; vy = parts[1]; vw = parts[2]; vh = parts[3];
    }
  } else {
    vw = parseFloat(svgElement.getAttribute('width')) || 512;
    vh = parseFloat(svgElement.getAttribute('height')) || 512;
  }

  // 2. SOLUCIÓN AL CORTE DE CONTORNO (CLIPPING)
  // Expandimos la caja del viewBox para hacerle espacio a la mitad exterior del stroke.
  // Usamos strokeWidth * 1.5 para dar un margen de seguridad extra a las uniones redondeadas.
  const padding = (enableStroke && strokeWidth > 0) ? (strokeWidth * 1.5) : 0;
  
  vx -= padding;
  vy -= padding;
  vw += (padding * 2);
  vh += (padding * 2);
  
  svgElement.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`);

  // Calculamos el Aspect Ratio con la caja ya expandida para que el 3D no se distorsione
  const aspectRatio = vw / vh;
  const targetResolution = 2048; 
  const renderWidth = aspectRatio > 1 ? targetResolution : targetResolution * aspectRatio;
  const renderHeight = aspectRatio > 1 ? targetResolution / aspectRatio : targetResolution;

  svgElement.setAttribute('width', renderWidth.toString());
  svgElement.setAttribute('height', renderHeight.toString());

  // 3. GESTIÓN DE DEGRADADOS DINÁMICOS
  let defs = svgElement.querySelector('defs');
  if (!defs) {
    defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svgElement.insertBefore(defs, svgElement.firstChild);
  } else {
    const oldGrads = defs.querySelectorAll('.andromeda-dynamic-grad');
    oldGrads.forEach(g => g.remove());
  }

  const injectGradient = (id, type, c1, c2) => {
    if (type === 'solid') return;
    const isLinear = type === 'linear';
    const tag = isLinear ? 'linearGradient' : 'radialGradient';
    const xProps = isLinear ? 'x1="0%" y1="0%" x2="100%" y2="100%"' : '';
    
    const gradHtml = `<${tag} id="${id}" class="andromeda-dynamic-grad" ${xProps}>
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </${tag}>`;
    
    defs.insertAdjacentHTML('beforeend', gradHtml);
  };

  const fillGradId = 'andromeda-fill-grad';
  const strokeGradId = 'andromeda-stroke-grad';
  
  injectGradient(fillGradId, fillType, fillColor1, fillColor2);
  injectGradient(strokeGradId, strokeType, strokeColor1, strokeColor2);

  const finalFill = !enableFill ? 'none' : (fillType === 'solid' ? fillColor1 : `url(#${fillGradId})`);
  const finalStroke = !enableStroke ? 'none' : (strokeType === 'solid' ? strokeColor1 : `url(#${strokeGradId})`);

  // 4. SOLUCIÓN A LOS ARTEFACTOS
  // Aplicamos el estilo ÚNICAMENTE a las etiquetas de forma pura, ignorando contenedores como <g>
  const validShapes = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line'];

  svgElement.querySelectorAll('*').forEach(el => {
    const tag = el.tagName.toLowerCase();
    
    if (validShapes.includes(tag)) {
      el.setAttribute('fill', finalFill);
      
      if (enableStroke && strokeWidth > 0) {
        el.setAttribute('stroke', finalStroke);
        el.setAttribute('stroke-width', strokeWidth.toString());
        el.setAttribute('stroke-linejoin', 'round');
        el.setAttribute('stroke-linecap', 'round');
      } else {
        el.removeAttribute('stroke');
        el.removeAttribute('stroke-width');
      }
    } else if (tag === 'g') {
      // Limpiamos estilos residuales en grupos para evitar conflictos de herencia
      el.removeAttribute('fill');
      el.removeAttribute('stroke');
      el.removeAttribute('stroke-width');
    }
  });

  const serializer = new XMLSerializer();
  const base64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(serializer.serializeToString(svgElement))));
  
  return { url: base64, aspectRatio };
};