import React from 'react';
import { useStudioStore } from '../../../store/useStudioStore';
import { Toggle } from '../atoms/Toggle';
import { ColorControl } from '../atoms/ColorControl';

export const SvgStyleSection = () => {
  const store = useStudioStore();

  return (
    <div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px', letterSpacing: '0.5px' }}>
        SVG Shape Style
      </span>
      
      {/* CONTROL DE RELLENO (FILL) */}
      <div style={{ marginBottom: '18px' }}>
        <Toggle label="Fill" checked={store.enableFill} onChange={(v) => store.updateStyle('enableFill', v)} />
        {store.enableFill && (
          <ColorControl 
            typeVal={store.fillType} color1={store.fillColor1} color2={store.fillColor2}
            onTypeChange={(v) => store.updateStyle('fillType', v)}
            onC1Change={(v) => store.updateStyle('fillColor1', v)}
            onC2Change={(v) => store.updateStyle('fillColor2', v)}
          />
        )}
      </div>

      {/* CONTROL DE CONTORNO (STROKE) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Toggle label="Stroke" checked={store.enableStroke} onChange={(v) => store.updateStyle('enableStroke', v)} />
          {store.enableStroke && (
            <input 
              type="number" min="1" max="20" value={store.strokeWidth} 
              onChange={(e) => store.updateStyle('strokeWidth', parseInt(e.target.value) || 0)} 
              style={{ width: '44px', background: '#111114', border: '1px solid #383742', color: '#fff', borderRadius: '4px', padding: '4px', fontSize: '0.8rem', textAlign: 'center', outline: 'none' }} 
            />
          )}
        </div>
        {store.enableStroke && (
          <ColorControl 
            typeVal={store.strokeType} color1={store.strokeColor1} color2={store.strokeColor2}
            onTypeChange={(v) => store.updateStyle('strokeType', v)}
            onC1Change={(v) => store.updateStyle('strokeColor1', v)}
            onC2Change={(v) => store.updateStyle('strokeColor2', v)}
          />
        )}
      </div>
    </div>
  );
};