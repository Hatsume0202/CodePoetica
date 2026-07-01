import { useEffect, useRef } from 'react';
import type { ControlSettings } from '../types';
import { useVisualization } from '../hooks/useVisualization';

interface VisualizationCanvasProps {
  code: string;
  settings: ControlSettings;
}

export default function VisualizationCanvas({ code, settings }: VisualizationCanvasProps) {
  const { canvasRef, isPlaying, togglePlay, reset } = useVisualization(code, settings);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = containerRef.current;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = Math.max(500, parent.clientHeight);
    };

    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [canvasRef]);

  useEffect(() => {
    reset();
  }, [code, reset]);

  return (
    <div className="visualization-container">
      <div className="viz-controls">
        <button
          className={`viz-btn ${isPlaying ? 'active' : ''}`}
          onClick={togglePlay}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="viz-btn" onClick={reset}>
          🔄 Reset
        </button>
        <span className="viz-info">
          {code ? `${code.split('\n').length} lines` : 'No code loaded'}
        </span>
      </div>
      <div ref={containerRef} className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="viz-canvas"
          style={{ display: 'block' }}
        />
      </div>
    </div>
  );
}
