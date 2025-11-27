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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    if (!svgContent) return;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}-diagram-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    alert('Đã copy mã Mermaid vào clipboard!');
  };

  const diagramContent = (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'w-full'} bg-white rounded-lg shadow-sm border border-slate-100`}>
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
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button
            onClick={handleFullscreen}
            className="px-3 py-1 text-sm bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            title={isFullscreen ? "Thoát toàn màn hình" : "Xem toàn màn hình"}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-sm bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            title="Tải xuống SVG"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1 text-sm bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            title="Copy mã Mermaid"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className={`w-full overflow-auto ${isFullscreen ? 'h-[calc(100vh-48px)]' : ''} p-4`}>
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

  return diagramContent;
};

export default MermaidDiagram;