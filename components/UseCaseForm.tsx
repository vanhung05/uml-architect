import React, { ChangeEvent } from 'react';
import { UseCaseData, DiagramType } from '../types';

interface UseCaseFormProps {
  data: UseCaseData;
  onChange: (field: keyof UseCaseData, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  selectedDiagrams: DiagramType[];
  onToggleDiagram: (type: DiagramType) => void;
}

const InputField = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm placeholder-slate-400 shadow-sm"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 3 }: { label: string, value: string, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string, rows?: number }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm resize-y placeholder-slate-400 shadow-sm"
    />
  </div>
);

const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-3 mt-6 pb-1 border-b border-slate-200">
        <span className="text-purple-600">{icon}</span>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
)

const UseCaseForm: React.FC<UseCaseFormProps> = ({ data, onChange, onSubmit, isLoading, selectedDiagrams, onToggleDiagram }) => {
  
  const handleChange = (field: keyof UseCaseData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field, e.target.value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-1">
        
        {/* Identity Section */}
        <SectionHeader 
            title="1. Thông tin định danh" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
        />
        <InputField label="Tên Use Case" value={data.name} onChange={handleChange('name')} placeholder="Ví dụ: Đặt sân..." />
        <InputField label="Tác nhân (Actor)" value={data.actor} onChange={handleChange('actor')} placeholder="Ví dụ: Khách hàng, Admin..." />
        <TextAreaField label="Trigger (Sự kiện kích hoạt)" value={data.trigger} onChange={handleChange('trigger')} rows={2} placeholder="Sự kiện bắt đầu..." />

        {/* Conditions Section */}
        <SectionHeader 
            title="2. Điều kiện & Bối cảnh" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
        />
        <TextAreaField label="Điều kiện trước (Pre-conditions)" value={data.preConditions} onChange={handleChange('preConditions')} placeholder="- Đã đăng nhập..." />
        <TextAreaField label="Điều kiện sau (Post-conditions)" value={data.postConditions} onChange={handleChange('postConditions')} placeholder="- Trạng thái được cập nhật..." />

        {/* Flow of Events Section */}
        <SectionHeader 
            title="3. Luồng sự kiện" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
        />
        <TextAreaField label="Luồng chính (Basic Flow)" value={data.basicFlow} onChange={handleChange('basicFlow')} rows={8} placeholder="1. Bước một...&#10;2. Bước hai..." />
        <TextAreaField label="Luồng thay thế (Alternative Flow)" value={data.alternativeFlow} onChange={handleChange('alternativeFlow')} rows={4} placeholder="A1. Nếu..." />
        <TextAreaField label="Luồng ngoại lệ (Exception Flow)" value={data.exceptionFlow} onChange={handleChange('exceptionFlow')} rows={4} placeholder="E1. Lỗi kết nối..." />
      </div>

      {/* Footer Actions */}
      <div className="pt-4 mt-4 border-t border-slate-200 bg-white sticky bottom-0 z-10">
        <div className="flex flex-col gap-3">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={selectedDiagrams.includes(DiagramType.ACTIVITY)}
                    onChange={() => onToggleDiagram(DiagramType.ACTIVITY)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                />
                <span className="text-sm font-medium text-slate-700">Activity Diagram</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={selectedDiagrams.includes(DiagramType.SEQUENCE)}
                    onChange={() => onToggleDiagram(DiagramType.SEQUENCE)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                />
                <span className="text-sm font-medium text-slate-700">Sequence Diagram</span>
            </label>
          </div>
          
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg shadow-md transition-all transform active:scale-95 flex justify-center items-center gap-2
              ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-200'}
            `}
          >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang Phân Tích...
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                    Phân tích & Vẽ
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UseCaseForm;