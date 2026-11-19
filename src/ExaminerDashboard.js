import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, X, Slash, Eraser } from 'lucide-react';

export default function EvaluationDashboard({
  initialDummyNumber = '',
  initialSubject = '',
  initialExaminerId = '',
  scriptImageUrl = '/placeholder-script.jpg',
  detectedParagraphs = 2,
  onSubmit
}) {
  const [dummyNumber, setDummyNumber] = useState(initialDummyNumber);
  const [subject, setSubject] = useState(initialSubject);
  const [examinerId, setExaminerId] = useState(initialExaminerId);
  const [dateEvaluated] = useState(() =>
    new Date().toLocaleDateString('en-GB')
  );

  const [activePaperType, setActivePaperType] = useState('Speed'); // 'Speed' | 'StatementLetter'
  const [paragraphCount, setParagraphCount] = useState(detectedParagraphs);
  const detectedGrade = paragraphCount >= 3 ? 'Senior' : 'Junior';

  const [activeTool, setActiveTool] = useState('cross');
  const [zoom, setZoom] = useState(1);
  const [marks, setMarks] = useState([]);
  const viewerRef = useRef(null);

  const getMaxMarks = () => {
    if (activePaperType === 'Speed') return 100;
    return detectedGrade === 'Junior' ? 100 : 100; // Statement 60 + Letter 40
  };

  const maxMarks = getMaxMarks();

  const getDeductionRates = () => {
    if (activePaperType === 'StatementLetter') {
      return { full: 1.5, half: 0, label: '1.50 (Full only)' };
    }
    // Speed Typing
    if (detectedGrade === 'Junior') {
      return { full: 1.8, half: 0.9, label: '1.80 / 0.90' };
    }
    // Senior Speed
    return { full: 1.25, half: 1.4, label: '1.25 / 1.40' };
  };

  const rates = getDeductionRates();

  const fullMistakeCount = marks.filter((m) => m.type === 'cross').length;
  const halfMistakeCount = marks.filter((m) => m.type === 'slash').length;
  const totalMistakes = fullMistakeCount + halfMistakeCount;

  const totalDeducted =
    fullMistakeCount * rates.full + halfMistakeCount * rates.half;
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
      {
        id: Date.now() + Math.random(),
        x,
        y,
        type: activeTool,
      },
    ]);
  };

  const handleMarkClick = (e, id) => {
    if (activeTool === 'eraser') {
      e.stopPropagation();
      setMarks((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleSubmit = () => {
    const payload = {
      dummyNumber,
      subject,
      dateEvaluated,
      examinerId,
      paperCategory: activePaperType,
      grade: detectedGrade,
      maxMarks,
      fullMistakeCount,
      halfMistakeCount,
      totalDeducted: Number(totalDeducted.toFixed(2)),
      finalScore: Number(finalScore.toFixed(2)),
      annotations: marks,
    };
    if (onSubmit) {
      onSubmit(payload);
    } else {
      console.log('Submitted Evaluation:', payload);
      alert(`Script Submitted! Final Score: ${finalScore.toFixed(2)}`);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-200 font-sans select-none">
      {/* Left Side: Script Viewer */}
      <div className="flex-1 overflow-auto bg-neutral-700 flex items-center justify-center p-6">
        <div
          ref={viewerRef}
          onClick={handleCanvasClick}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
          className={`relative bg-white shadow-2xl transition-transform duration-150 ${
            activeTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
          }`}
        >
          <img
            src={scriptImageUrl}
            alt="Answer Script"
            className="max-w-[750px] w-full h-auto block pointer-events-none"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-[700px] h-[950px] bg-white p-12 flex-col justify-start border border-gray-300 text-gray-800 font-mono text-lg leading-10">
            <p className="mb-4 font-bold text-xl text-center">DUMMY SCRIPT VIEWER</p>
            <p className="mb-4">
              Auto-detected Category: {activePaperType} | Grade: {detectedGrade}
            </p>
            <p>Click to mark errors using active tool.</p>
          </div>

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
      <div className="w-[420px] bg-gray-100 border-l border-gray-300 flex flex-col justify-between p-4 shadow-lg">
        <div>
          {/* Toolbar */}
          <div className="grid grid-cols-5 gap-1 bg-white p-2 rounded-lg border border-gray-300 shadow-sm mb-4">
            <button
              onClick={handleZoomIn}
              className="flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 text-gray-800"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Zoom In</span>
            </button>

            <button
              onClick={handleZoomOut}
              className="flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 text-gray-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Zoom Out</span>
            </button>

            <button
              onClick={() => setActiveTool('cross')}
              className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${
                activeTool === 'cross'
                  ? 'bg-red-100 ring-2 ring-red-500 text-red-600'
                  : 'hover:bg-gray-100 text-red-600'
              }`}
              title="Red Cross (Full Mistake)"
            >
              <X className="w-5 h-5 mb-1 stroke-[2.5]" />
              <span className="text-[11px] font-semibold">Red Cross</span>
            </button>

            <button
              onClick={() => setActiveTool('slash')}
              className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${
                activeTool === 'slash'
                  ? 'bg-red-100 ring-2 ring-red-500 text-red-600'
                  : 'hover:bg-gray-100 text-red-600'
              }`}
              title="Red Slash (Half Mistake)"
            >
              <Slash className="w-5 h-5 mb-1 stroke-[2.5]" />
              <span className="text-[11px] font-semibold">Red Slash</span>
            </button>

            <button
              onClick={() => setActiveTool('eraser')}
              className={`flex flex-col items-center justify-center p-2 rounded transition-colors ${
                activeTool === 'eraser'
                  ? 'bg-blue-100 ring-2 ring-blue-500 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
              title="Eraser"
            >
              <Eraser className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Eraser</span>
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

            {/* Editable Metadata */}
            <div className="space-y-2.5 text-sm mb-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-600 font-medium">Dummy Number:</label>
                <input
                  type="text"
                  value={dummyNumber}
                  onChange={(e) => setDummyNumber(e.target.value)}
                  placeholder="Enter Dummy No"
                  className="w-48 text-right font-semibold text-gray-900 border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none px-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 font-medium">Subject:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter Subject"
                  className="w-48 text-right font-semibold text-gray-900 border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none px-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Date Evaluated:</span>
                <span className="font-semibold text-gray-900">{dateEvaluated}</span>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-600 font-medium">Examiner ID:</label>
                <input
                  type="text"
                  value={examinerId}
                  onChange={(e) => setExaminerId(e.target.value)}
                  placeholder="Enter Examiner ID"
                  className="w-48 text-right font-semibold text-gray-900 border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none px-1"
                />
              </div>
            </div>

            {/* Auto-Detection Overrides */}
            <div className="bg-gray-50 p-2.5 rounded border border-gray-200 mb-4 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Paper Category:</span>
                <select
                  value={activePaperType}
                  onChange={(e) => setActivePaperType(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-2 py-0.5 font-semibold text-gray-800"
                >
                  <option value="Speed">Paper 1 (Speed Typing)</option>
                  <option value="StatementLetter">Paper 2 (Statement & Letter)</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Paragraphs / Grade:</span>
                <select
                  value={paragraphCount}
                  onChange={(e) => setParagraphCount(Number(e.target.value))}
                  className="bg-white border border-gray-300 rounded px-2 py-0.5 font-semibold text-gray-800"
                >
                  <option value={2}>2 Paragraphs (Junior)</option>
                  <option value={3}>3 Paragraphs (Senior)</option>
                </select>
              </div>
            </div>

            {/* Calculations */}
            <div className="border-t border-gray-200 pt-3 space-y-2 text-base">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Mistake Count:</span>
                <span className="font-bold text-gray-900 text-lg">
                  {totalMistakes}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Deduction Rate (Full / Half):</span>
                <span className="font-bold text-gray-900">{rates.label}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Deducted:</span>
                <span className="font-bold text-red-600 text-lg">
                  {totalDeducted.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Final Score Box */}
            <div className="mt-4 border-2 border-gray-900 rounded-md py-3 px-4 bg-gray-50 text-center">
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Final Score: {finalScore.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Script Button Only */}
        <div className="flex justify-end pt-3">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-2.5 px-6 rounded shadow transition-colors"
          >
            Submit Script
          </button>
        </div>
      </div>
    </div>
  );
}
