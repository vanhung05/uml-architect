import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
  type: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code, type }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'sans-serif',
      suppressErrorRendering: true, // Prevents the global error overlay
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code || !containerRef.current) return;

      try {
        setError(null);
        // Create a unique ID for the rendering to avoid collisions
        const id = `mermaid-${type}-${Date.now()}`;
        
        // Attempt to render
        const { svg } = await mermaid.render(id, code);
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid Render Error:", err);
        setError("Không thể vẽ biểu đồ. Cú pháp Mermaid do AI tạo có thể bị lỗi. Vui lòng thử lại.");
        setSvgContent('');
      }
    };

    renderDiagram();
  }, [code, type]);

  if (error) {
    return (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            <p className="font-bold mb-1">Lỗi hiển thị:</p>
            {error}
            <details className="mt-2 cursor-pointer group">
                <summary className="text-xs text-red-400 group-hover:text-red-600 transition-colors">Xem mã nguồn</summary>
                <pre className="text-xs mt-2 bg-white p-2 border border-red-100 rounded overflow-auto whitespace-pre-wrap font-mono text-slate-600">
                    {code}
                </pre>
            </details>
        </div>
    )
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-100">
      <div className="flex items-center justify-between p-2 border-b border-slate-100 bg-slate-50">
        <span className="text-xs text-slate-500 font-medium">Zoom: {Math.round(zoom * 100)}%</span>
        <div className="flex gap-1">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="px-3 py-1 text-sm bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-1 text-sm bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            title="Reset Zoom"
          >
            100%
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="px-3 py-1 text-sm bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom In"
          >
            +
          </button>
        </div>
      </div>
      <div className="w-full overflow-auto p-4">
        <div 
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="mermaid-container inline-block"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: 'transform 0.2s ease-out'
          }}
        />
      </div>
    </div>
  );
};

export default MermaidDiagram;