import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { LayoutSection } from './sections/LayoutSection';
import { BackgroundSection } from './sections/BackgroundSection';
import { SvgStyleSection } from './sections/SvgStyleSection';

export const Sidebar = () => {
  const { setSvgContent } = useStudioStore();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setSvgContent(event.target.result);
    reader.readAsText(file);
  };

  const handleExportPNG = () => {
    const canvas = document.getElementById('andromeda-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `andromeda-pattern-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <aside style={{
      width: '320px', minWidth: '320px', backgroundColor: 'var(--panel-bg)', padding: '20px',
      borderRight: '1px solid var(--border-color)', zIndex: 10, overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: '22px',
      fontFamily: "'Host Grotesk', 'Clash Grotesk', system-ui, sans-serif"
    }}>
      <h2 style={{ 
        margin: 0, fontSize: '1.25rem', fontWeight: 700, 
        background: 'linear-gradient(135deg, #7C3AED 0%, #00F0FF 100%)', 
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' 
      }}>
        Andromeda Studio
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Subir SVG base</label>
        <input type="file" accept=".svg" onChange={handleFileUpload} style={{ fontSize: '0.8rem' }} />
      </div>

      <hr style={{ border: 'none', height: '1px', background: 'var(--border-color)', margin: '0' }} />

      <LayoutSection />

      <hr style={{ border: 'none', height: '1px', background: 'var(--border-color)', margin: '0' }} />

      <BackgroundSection />

      <hr style={{ border: 'none', height: '1px', background: 'var(--border-color)', margin: '0' }} />

      <SvgStyleSection />

      <button 
        onClick={handleExportPNG} 
        style={{ 
          marginTop: 'auto', background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', 
          color: 'white', border: 'none', padding: '14px', borderRadius: '8px', 
          fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', 
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)', transition: 'transform 0.2s' 
        }}
      >
        Exportar Arte (PNG)
      </button>
    </aside>
  );
};