import React from 'react';

export const Toggle = ({ label, checked, onChange }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
      <div 
        onClick={() => onChange(!checked)}
        style={{ 
          width: '36px', height: '20px', borderRadius: '10px', 
          background: checked ? '#7C3AED' : '#2B2A33', 
          position: 'relative', cursor: 'pointer', transition: 'background 0.2s' 
        }}
      >
        <div style={{ 
          width: '16px', height: '16px', borderRadius: '50%', background: '#fff', 
          position: 'absolute', top: '2px', left: checked ? '18px' : '2px', 
          transition: 'left 0.2s' 
        }} />
      </div>
    </div>
  );
};