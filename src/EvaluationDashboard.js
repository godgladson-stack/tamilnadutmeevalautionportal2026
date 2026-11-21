import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, X, Slash, Eraser, ArrowLeft } from 'lucide-react';

export default function EvaluationDashboard({ assignment, onBack, onSubmit }) {
  const [dummyNumber] = useState(assignment?.dummyNumber || '408921');
  const [subject] = useState(assignment?.subject || 'Typewriting English Senior');
  const [examinerId] = useState('E99887');
  const [dateEvaluated] = useState(() => new Date().toLocaleDateString('en-GB'));

  const [activePaperType] = useState(assignment?.category || 'Speed');
  const [paragraphCount] = useState(assignment?.paragraphs || 3);
  const detectedGrade = paragraphCount >= 3 ? 'Senior' : 'Junior';

  const [activeTool, setActiveTool] = useState('cross');
  const [zoom, setZoom] = useState(1);
  const [marks, setMarks] = useState([]);
  const viewerRef = useRef(null);

  const getMaxMarks = () => 100;
  const maxMarks = getMaxMarks();

  const getDeductionRates = () => {
    if (activePaperType === 'Statement & Letter') {
      return { full: 1.5, half: 0, label: '1.50 (Full only)' };
    }
    if (detectedGrade === 'Junior') {
      return { full: 1.8, half: 0.9, label: '1.80 / 0.90' };
    }
    return { full: 1.25, half: 1.4, label: '1.25 / 1.40' };
  };

  const rates = getDeductionRates();

  const fullMistakeCount = marks.filter((m) => m.type === 'cross').length;
  const halfMistakeCount = marks.filter((m) => m.type === 'slash').length;
  const totalMistakes = fullMistakeCount + halfMistakeCount;

  const totalDeducted = fullMistakeCount * rates.full + halfMistakeCount * rates.half;
  const finalScore = Math.max(0, maxMarks - totalDeducted);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  const handleCanvasClick = (e) => {
    if (activeTool === 'eraser') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMarks((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), x, y, type: activeTool },
    ]);
  };

  const handleMarkClick = (e, id) => {
    if (activeTool === 'eraser') {
      e.stopPropagation();
      setMarks((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-200 font-sans select-none">
      {/* Left Side: Script Viewer */}
      <div className="flex-1 overflow-auto bg-neutral-700 flex items-center justify-center p-6 relative">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full shadow-lg flex items-center gap-2 z-10 text-sm font-semibold transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div
          ref={viewerRef}
          onClick={handleCanvasClick}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className={`relative bg-white shadow-2xl transition-transform duration-150 ${
            activeTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
          }`}
        >
          <img
            src={assignment?.scriptUrl || 'https://images.unsplash.com/photo-1584433144151-508548c7c9c0?auto=format&fit=crop&w=800&q=80'}
            alt="Answer Script"
            className="max-w-[800px] w-full h-auto block pointer-events-none"
          />
          {marks.map((mark) => (
            <div
              key={mark.id}
              onClick={(e) => handleMarkClick(e, mark.id)}
              style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 text-red-600 font-bold transition-transform ${
                activeTool === 'eraser'
                  ? 'hover:scale-125 hover:bg-red-100 rounded-full p-1 cursor-pointer'
                  : 'pointer-events-none'
              }`}
            >
              {mark.type === 'cross' ? (
                <X className="w-8 h-8 stroke-[3]" />
              ) : (
                <Slash className="w-8 h-8 stroke-[3]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Tools & Score Board */}
      <div className="w-[420px] bg-gray-100 border-l border-gray-300 flex flex-col justify-between p-4 shadow-lg z-10">
        <div>
          {/* Toolbar */}
          <div className="grid grid-cols-5 gap-1 bg-white p-2 rounded-lg border border-gray-300 shadow-sm mb-4">
            <button onClick={handleZoomIn} className="flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 text-gray-800">
              <ZoomIn className="w-5 h-5 mb-1" /><span className="text-[11px]">Zoom In</span>
            </button>
            <button onClick={handleZoomOut} className="flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 text-gray-800">
              <ZoomOut className="w-5 h-5 mb-1" /><span className="text-[11px]">Zoom Out</span>
            </button>
            <button onClick={() => setActiveTool('cross')} className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${activeTool === 'cross' ? 'bg-red-100 ring-2 ring-red-500 text-red-600' : 'text-red-00'}`}>
              <X className="w-5 h-5 mb-1 stroke-[2.5]" /><span className="text-[11px] font-semibold">Red Cross</span>
            </button>
            <button onClick={() => setActiveTool('slash')} className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${activeTool === 'slash' ? 'bg-red-100 ring-2 ring-red-500 text-red-600' : 'text-red-600'}`}>
              <Slash className="w-5 h-5 mb-1 stroke-[2.5]" /><span className="text-[11px] font-semibold">Red Slash</span>
            </button>
            <button onClick={() => setActiveTool('eraser')} className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${activeTool === 'eraser' ? 'bg-blue-100 ring-2 ring-blue-500 text-blue-700' : 'text-gray-800'}`}>
              <Eraser className="w-5 h-5 mb-1" /><span className="text-[11px]">Eraser</span>
            </button>
          </div>

          {/* Score Board */}
          <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
              <h2 className="text-lg font-bold text-gray-800">Score Board</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {activePaperType} • {detectedGrade}
              </span>
            </div>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex items-center justify-between font-medium">
                <span className="text-gray-500">Dummy Number:</span>
                <span className="font-bold text-gray-900">{dummyNumber}</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span className="text-gray-500">Subject:</span>
                <span className="font-bold text-gray-900">{subject}</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span className="text-gray-500">Date Evaluated:</span>
                <span className="font-bold text-gray-900">{dateEvaluated}</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span className="text-gray-500">Examiner ID:</span>
                <span className="font-bold text-gray-900">{examinerId}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-3 text-base">
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600">Mistake Count:</span>
                <span className="font-bold text-gray-900 text-lg">{totalMistakes}</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600">Deduction Rate:</span>
                <span className="font-bold text-gray-900">{rates.label}</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600">Total Deducted:</span>
                <span className="font-bold text-red-600 text-lg">{totalDeducted.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 border-2 border-gray-900 rounded-md py-3 px-4 bg-gray-50 text-center shadow-inner">
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Final Score: {finalScore.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            onClick={() => onSubmit && onSubmit({ dummyNumber, finalScore: finalScore.toFixed(2) })}
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-6 rounded shadow-md transition-colors"
          >
            Submit Script
          </button>
        </div>
      </div>
    </div>
  );
}