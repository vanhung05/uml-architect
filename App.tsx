import React, { useState } from 'react';
import UseCaseForm from './components/UseCaseForm';
import MermaidDiagram from './components/MermaidDiagram';
import { DEFAULT_USE_CASE } from './constants';
import { UseCaseData, GeneratedDiagrams, DiagramType } from './types';
import { generateUML } from './services/geminiService';

const App: React.FC = () => {
  const [formData, setFormData] = useState<UseCaseData>(DEFAULT_USE_CASE);
  const [diagrams, setDiagrams] = useState<GeneratedDiagrams | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDiagrams, setSelectedDiagrams] = useState<DiagramType[]>([DiagramType.ACTIVITY, DiagramType.SEQUENCE]);

  const handleFormChange = (field: keyof UseCaseData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleDiagram = (type: DiagramType) => {
    setSelectedDiagrams(prev => 
        prev.includes(type) 
            ? prev.filter(t => t !== type)
            : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    if (selectedDiagrams.length === 0) {
        setError("Vui lòng chọn ít nhất một loại biểu đồ để vẽ.");
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateUML(formData);
      setDiagrams(result);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi kết nối với AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center shadow-sm z-20 sticky top-0">
        <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg text-white mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        </div>
        <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Hùng UML Architect
            </h1>
            <p className="text-xs text-slate-500">Chuyển đổi Use Case thành sơ đồ tự động</p>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-73px)]">
        
        {/* Left Column: Form */}
        <section className="w-full lg:w-5/12 bg-white border-r border-slate-200 p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-full overflow-hidden flex flex-col z-10">
            <h2 className="text-sm uppercase tracking-wide text-slate-400 font-bold mb-4">Nhập liệu đặc tả</h2>
            <UseCaseForm 
                data={formData} 
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                selectedDiagrams={selectedDiagrams}
                onToggleDiagram={handleToggleDiagram}
            />
        </section>

        {/* Right Column: Visualization */}
        <section className="w-full lg:w-7/12 bg-slate-50 p-8 overflow-y-auto custom-scrollbar h-full relative">
            <h2 className="text-sm uppercase tracking-wide text-slate-400 font-bold mb-4 sticky top-0 bg-slate-50 z-10 py-2">Kết quả trực quan</h2>
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
                    <p className="font-bold">Lỗi</p>
                    <p>{error}</p>
                </div>
            )}

            {!diagrams && !isLoading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 mt-[-50px]">
                     <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    <p className="text-lg">Nhấn "Phân tích & Vẽ" để tạo sơ đồ</p>
                </div>
            )}

            {isLoading && !diagrams && (
                 <div className="h-full flex flex-col items-center justify-center text-purple-500 mt-[-50px]">
                    <div className="animate-bounce mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                    </div>
                    <p className="text-sm font-medium animate-pulse">AI đang phân tích luồng nghiệp vụ...</p>
                 </div>
            )}

            <div className="flex flex-col gap-8 pb-10">
                {diagrams && selectedDiagrams.includes(DiagramType.ACTIVITY) && (
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                         <div className="bg-slate-50 px-4 py-2 rounded-t-lg border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">Activity Diagram</h3>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Flowchart</span>
                         </div>
                        <MermaidDiagram code={diagrams.activityDiagram} type="activity" />
                    </div>
                )}

                {diagrams && selectedDiagrams.includes(DiagramType.SEQUENCE) && (
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <div className="bg-slate-50 px-4 py-2 rounded-t-lg border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">Sequence Diagram</h3>
                             <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Interaction</span>
                        </div>
                        <MermaidDiagram code={diagrams.sequenceDiagram} type="sequence" />
                    </div>
                )}
            </div>
        </section>
      </main>
    </div>
  );
};

export default App;