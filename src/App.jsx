import React from 'react';
import { Sidebar } from './components/ui/Sidebar';
import { Scene } from './components/canvas/Scene';
import './index.css';

function App() {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="canvas-container">
        <Scene />
      </main>
    </div>
  );
}

export default App;