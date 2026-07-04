import React from 'react';
import { useStudioStore } from '../../../store/useStudioStore';

export const LayoutSection = () => {
  const { cols, rows, spaceX, spaceY, elementRotation, updateLayout } = useStudioStore();

  const groupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
  const labelStyle = { fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
        Layout
      </span>
      
      <div style={groupStyle}>
        <label style={labelStyle}>Columnas <span>{cols}</span></label>
        <input type="range" min="1" max="30" value={cols} onChange={(e) => updateLayout('cols', parseInt(e.target.value))} />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Filas <span>{rows}</span></label>
        <input type="range" min="1" max="30" value={rows} onChange={(e) => updateLayout('rows', parseInt(e.target.value))} />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ ...groupStyle, flex: 1 }}>
          <label style={labelStyle}>Espacio X</label>
          <input type="range" min="-100" max="100" value={spaceX} onChange={(e) => updateLayout('spaceX', parseInt(e.target.value))} />
        </div>
        <div style={{ ...groupStyle, flex: 1 }}>
          <label style={labelStyle}>Espacio Y</label>
          <input type="range" min="-100" max="100" value={spaceY} onChange={(e) => updateLayout('spaceY', parseInt(e.target.value))} />
        </div>
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Rotación <span>{elementRotation}°</span></label>
        <input type="range" min="0" max="360" value={elementRotation} onChange={(e) => updateLayout('elementRotation', parseInt(e.target.value))} />
      </div>
    </div>
  );
};