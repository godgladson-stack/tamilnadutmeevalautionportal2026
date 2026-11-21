import React, { useState } from 'react';
import { ZoomIn, ZoomOut, X, Slash, Eraser, ArrowLeft, CheckCircle } from 'lucide-react';

// --- SUB-COMPONENT: Evaluation Dashboard ---
function EvaluationDashboard({ assignment, onBack, onSubmit }) {
  const [dummyNumber] = useState(assignment.dummyNumber);
  const [subject] = useState(assignment.subject);
  const [examinerId] = useState('E99887');
  const [dateEvaluated] = useState(() => new Date().toLocaleDateString('en-GB'));

  const [activePaperType] = useState(assignment.category); 
  const [paragraphCount] = useState(assignment.paragraphs || 2);
  const detectedGrade = paragraphCount >= 3 ? 'Senior' : 'Junior';

  const [activeTool, setActiveTool] = useState('cross');
  const [zoom, setZoom] = useState(1);
  const [marks, setMarks] = useState([]);

  const getMaxMarks = () => {
    return 100;
  };

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
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-full shadow-lg flex items-center gap-2 z-10 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div
          onClick={handleCanvasClick}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className={`relative bg-white shadow-2xl transition-transform duration-150 ${
            activeTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
          }`}
        >
          <img
            src={assignment.scriptUrl}
            alt="Answer Script"
            className="max-w-[7552px] h-auto block pointer-events-none"
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
      <div className="w-[420px] bg-gray-100 border-l border-gray-300 flex flex-col justify-between p-4 shadow-lg">
        <div>
          {/* Toolbar */}
          <div className="grid grid-cols-5 gap-1 bg-white p-2 rounded-lg border border-gray-300 shadow-sm mb-4">
            <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 2.5))} className="flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 text-gray-800">
              <ZoomIn className="w-5 h-5 mb-1" /><span className="text-[11px]">Zoom In</span>
            </button>
            <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} className="flex flex-col items-center justify-center p-2 rounded hover:bg-gray-100 text-gray-800">
              <ZoomOut className="w-5 h-5 mb-1" /><span className="text-[11px]">Zoom Out</span>
            </button>
            <button onClick={() => setActiveTool('cross')} className={`flex flex-col items-center justify-center p-2 rounded ${activeTool === 'cross' ? 'bg-red-100 ring-2 ring-red-500 text-red-600' : 'text-red-600'}`}>
              <X className="w-5 h-5 mb-1 stroke-[2.5]" /><span className="text-[11px] font-semibold">Red Cross</span>
            </button>
            <button onClick={() => setActiveTool('slash')} className={`flex flex-col items-center justify-center p-2 rounded ${activeTool === 'slash' ? 'bg-red-100 ring-2 ring-red-500 text-red-600' : 'text-red-600'}`}>
              <Slash className="w-5 h-5 mb-1 stroke-[2.5]" /><span className="text-[11px] font-semibold">Red Slash</span>
            </button>
            <button onClick={() => setActiveTool('eraser')} className={`flex flex-col items-center justify-center p-2 rounded ${activeTool === 'eraser' ? 'bg-blue-100 ring-2 ring-blue-500 text-blue-700' : 'text-gray-800'}`}>
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

            <div className="space-y-2.5 text-sm mb-4">
              <div className="flex items-center justify-between"><span className="text-gray-600">Dummy Number:</span><span className="font-semibold">{dummyNumber}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-600">Subject:</span><span className="font-semibold">{subject}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-600">Date Evaluated:</span><span className="font-semibold">{dateEvaluated}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-600">Examiner ID:</span><span className="font-semibold">{examinerId}</span></div>
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2 text-base">
              <div className="flex justify-between items-center"><span className="font-semibold text-gray-700">Mistake Count:</span><span className="font-bold text-gray-900 text-lg">{totalMistakes}</span></div>
              <div className="flex justify-between items-center"><span className="font-semibold text-gray-700">Deduction Rate:</span><span className="font-bold text-gray-900">{rates.label}</span></div>
              <div className="flex justify-between items-center"><span className="font-semibold text-gray-700">Total Deducted:</span><span className="font-bold text-red-600 text-lg">{totalDeducted.toFixed(2)}</span></div>
            </div>

            <div className="mt-4 border-2 border-gray-900 rounded-md py-3 px-4 bg-gray-50 text-center">
              <span className="text-2xl font-extrabold text-gray-900">Final Score: {finalScore.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button onClick={() => onSubmit({ dummyNumber, finalScore })} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded shadow">
            Submit Script
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT: Examiner Dashboard ---
export default function App() {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  // Sample assigned papers list
  const [assignments, setAssignments] = useState([
    { id: 1, dummyNumber: '408921', subject: 'Typewriting English Senior', category: 'Speed', status: 'Pending', scriptUrl: 'https://images.unsplash.com/photo-1584433144151-508548c7c9c0?auto=format&fit=crop&w=800&q=80', paragraphs: 3 },
    { id: 2, dummyNumber: '512345', subject: 'Typewriting Tamil Junior', category: 'Statement & Letter', status: 'Pending', scriptUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', paragraphs: 2 },
  ]);

  const handleEvaluationSubmit = (result) => {
    setAssignments(prev => prev.map(a => 
      a.dummyNumber === result.dummyNumber ? { ...a, status: 'Completed', score: result.finalScore } : a
    ));
    setSelectedAssignment(null);
  };

  if (selectedAssignment) {
    return (
      <EvaluationDashboard
        assignment={selectedAssignment}
        onBack={() => setSelectedAssignment(null)}
        onSubmit={handleEvaluationSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Examiner Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, Examiner</p>
          </div>
          <div className="bg-blue-550 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg font-semibold text-sm">
            Active Duty
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-700">
            Assigned Answer Scripts
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="p-4">Dummy Number</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-800">{assignment.dummyNumber}</td>
                  <td className="p-4 text-gray-600">{assignment.subject}</td>
                  <td className="p-4 text-gray-600">{assignment.category}</td>
                  <td className="p-4">
                    {assignment.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" /> Evaluated ({assignment.score})
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-1.5 px-4 rounded shadow transition-colors"
                    >
                      Start Evaluation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
