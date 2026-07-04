import React from 'react';
import { useStudioStore } from '../../../store/useStudioStore';
import { ColorControl } from '../atoms/ColorControl';

export const BackgroundSection = () => {
  const { bgType, bgColor1, bgColor2, updateStyle } = useStudioStore();

  return (
    <div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '10px', letterSpacing: '0.5px' }}>
        Background
      </span>
      <ColorControl 
        typeVal={bgType} color1={bgColor1} color2={bgColor2}
        onTypeChange={(v) => updateStyle('bgType', v)}
        onC1Change={(v) => updateStyle('bgColor1', v)}
        onC2Change={(v) => updateStyle('bgColor2', v)}
      />
    </div>
  );
};