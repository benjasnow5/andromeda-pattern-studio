import React from 'react';

export const ColorControl = ({ typeVal, color1, color2, onTypeChange, onC1Change, onC2Change }) => {
  const selectStyle = {
    width: '100%', background: '#2B2A33', border: 'none', color: '#fff',
    padding: '6px', borderRadius: '4px', fontSize: '0.8rem', outline: 'none'
  };

  const colorInputStyle = {
    flex: 1, height: '28px', border: 'none', cursor: 'pointer', 
    borderRadius: '4px', background: 'transparent'
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', gap: '8px', background: '#111114', 
      padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' 
    }}>
      <select value={typeVal} onChange={(e) => onTypeChange(e.target.value)} style={selectStyle}>
        <option value="solid">Sólido</option>
        <option value="linear">Degradado Lineal</option>
        <option value="radial">Degradado Radial</option>
      </select>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input type="color" value={color1} onChange={(e) => onC1Change(e.target.value)} style={colorInputStyle} />
        {typeVal !== 'solid' && (
          <input type="color" value={color2} onChange={(e) => onC2Change(e.target.value)} style={colorInputStyle} />
        )}
      </div>
    </div>
  );
};