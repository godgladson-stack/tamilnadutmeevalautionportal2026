import React, { useState } from 'react';

// Mock assigned papers
const mockAssignedPapers = [
  { id: 'PAP-1002', studentRollNo: '2026TME002', studentName: 'Deepa S', subject: 'Fluid Mechanics', scannedCopyUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Assigned', remarks: '', markings: [] },
  { id: 'PAP-1003', studentRollNo: '2026TME003', studentName: 'Vijay V', subject: 'Structural Analysis', scannedCopyUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Assigned', remarks: '', markings: [] }
];

export default function ExaminerDashboard({ currentUser }) {
  const [papers, setPapers] = useState(mockAssignedPapers);
  const [activePaper, setActivePaper] = useState(null);
  const [selectedTool, setSelectedTool] = useState('X'); // Default tool
  const [currentRemarks, setCurrentRemarks] = useState('');

  const handleStartEvaluation = (paper) => {
    setActivePaper({ ...paper, markings: paper.markings || [] });
    setCurrentRemarks(paper.remarks || '');
  };

  const handlePaperClick = (e) => {
    if (!activePaper || activePaper.status === 'Evaluated') return;

    // Get click position relative to the paper container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newMarking = {
      id: Date.now(),
      type: selectedTool,
      x: x,
      y: y
    };

    setActivePaper(prev => ({
      ...prev,
      markings: [...prev.markings, newMarking]
    }));
  };

  const handleSubmitEvaluation = () => {
    if (!activePaper) return;

    setPapers(prev => prev.map(p => {
      if (p.id === activePaper.id) {
        return {
          ...p,
          status: 'Evaluated',
          remarks: currentRemarks || 'Evaluated and Sent to Chief Examiner',
          markings: activePaper.markings
        };
      }
      return p;
    }));

    setActivePaper(null);
  };

  const styles = {
    container: { padding: '30px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#f8fafc', minHeight: '100vh' },
    header: { color: '#1a365d', marginBottom: '30px', fontWeight: '700' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' },
    statCard: { background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textAlign: 'center', border: '1px solid #e2e8f0' },
    statNumber: { fontSize: '28px', fontWeight: 'bold', color: '#2b6cb0', margin: '0 0 5px 0' },
    statLabel: { margin: 0, color: '#718096', fontSize: '14px', fontWeight: '500' },
    tableContainer: { background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { background: '#ebf8ff', color: '#2b6cb0', padding: '16px 20px', fontSize: '14px', fontWeight: '600', borderBottom: '2px solid #bee3f8' },
    td: { padding: '16px 20px', borderBottom: '1px solid #edf2f7', color: '#2d3748', verticalAlign: 'middle' },
    textarea: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '100%', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' },
    btn: { background: '#48bb78', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' },
    btnPrimary: { background: '#3182ce', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
    btnSecondary: { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
    badgeAssigned: { background: '#ebf8ff', color: '#2b6cb0', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    badgeEvaluated: { background: '#c6f6d5', color: '#22543d', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    
    // Evaluation Screen Styles
    evalContainer: { display: 'flex', gap: '20px', background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' },
    paperViewer: { flex: 1, position: 'relative', border: '2px dashed #cbd5e0', borderRadius: '8px', minHeight: '500px', background: '#fafafa', cursor: 'crosshair', padding: '20px', overflow: 'hidden' },
    toolBar: { position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '8px', background: '#ffffff', padding: '6px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10 },
    toolBtn: (active) => ({
      color: '#e53e3e',
      border: active ? '2px solid #e53e3e' : '1px solid #cbd5e0',
      background: active ? '#fff5f5' : '#ffffff',
      padding: '2px 8px',
      fontSize: '14px',
      fontWeight: 'bold',
      borderRadius: '4px',
      cursor: 'pointer'
    }),
    sidePanel: { width: '320px', display: 'flex', flexDirection: 'column', gap: '15px' }
  };

  const assignedCount = papers.filter(p => p.status === 'Assigned').length;
  const evaluatedCount = papers.filter(p => p.status === 'Evaluated').length;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Examiner Dashboard - Evaluation Papers</h2>

      {!activePaper ? (
        <>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statNumber}>{assignedCount}</p>
              <p style={styles.statLabel}>Pending Evaluation</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statNumber}>{evaluatedCount}</p>
              <p style={styles.statLabel}>Evaluated Papers</p>
            </div>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Paper ID</th>
                  <th style={styles.th}>Student Roll No</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Remarks</th>
                  <th style={{...styles.th, textAlign: 'center'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {papers.map(paper => (
                  <tr key={paper.id}>
                    <td style={{...styles.td, fontWeight: '600'}}>{paper.id}</td>
                    <td style={styles.td}>{paper.studentRollNo}</td>
                    <td style={{...styles.td, fontWeight: '500'}}>{paper.studentName}</td>
                    <td style={styles.td}>{paper.subject}</td>
                    <td style={styles.td}>
                      <span style={paper.status === 'Evaluated' ? styles.badgeEvaluated : styles.badgeAssigned}>
                        {paper.status}
                      </span>
                    </td>
                    <td style={styles.td}>{paper.remarks || '-'}</td>
                    <td style={{...styles.td, textAlign: 'center'}}>
                      <button 
                        style={styles.btnPrimary} 
                        onClick={() => handleStartEvaluation(paper)}
                      >
                        {paper.status === 'Evaluated' ? 'View Evaluation' : 'Start Evaluation'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div style={styles.evalContainer}>
          {/* Paper Canvas Area */}
          <div style={styles.paperViewer} onClick={handlePaperClick}>
            {activePaper.status !== 'Evaluated' && (
              <div style={styles.toolBar} onClick={(e) => e.stopPropagation()}>
                <button 
                  style={styles.toolBtn(selectedTool === 'X')} 
                  onClick={() => setSelectedTool('X')}
                >
                  X
                </button>
                <button 
                  style={styles.toolBtn(selectedTool === '/')} 
                  onClick={() => setSelectedTool('/')}
                >
                  /
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '40px', color: '#a0aec0' }}>
              <h4 style={{ color: '#2d3748', margin: '0 0 10px 0' }}>{activePaper.subject} ({activePaper.id})</h4>
              <p style={{ fontSize: '13px' }}>Click anywhere on this document area to add evaluation marks.</p>
            </div>

            {/* Render markings placed on paper */}
            {activePaper.markings.map(m => (
              <span 
                key={m.id} 
                style={{
                  position: 'absolute',
                  left: `${m.x}px`,
                  top: `${m.y}px`,
                  color: '#e53e3e',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {m.type}
              </span>
            ))}
          </div>

          {/* Side Panel for Remarks & Actions */}
          <div style={styles.sidePanel}>
            <h3 style={{ color: '#1a365d', margin: 0, fontSize: '18px' }}>Evaluation Controls</h3>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#4a5568', fontWeight: '600' }}>Student Details:</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#2d3748' }}>{activePaper.studentName} ({activePaper.studentRollNo})</p>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: '#4a5568', fontWeight: '600' }}>Remarks:</label>
              {activePaper.status === 'Evaluated' ? (
                <div style={{ padding: '10px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#2d3748' }}>
                  {activePaper.remarks}
                </div>
              ) : (
                <textarea 
                  rows="6" 
                  placeholder="Enter evaluation feedback..."
                  style={styles.textarea}
                  value={currentRemarks}
                  onChange={(e) => setCurrentRemarks(e.target.value)}
                />
              )}
            </div>

            {activePaper.status !== 'Evaluated' && (
              <button style={styles.btn} onClick={handleSubmitEvaluation}>
                Submit Evaluation
              </button>
            )}

            <button style={styles.btnSecondary} onClick={() => setActivePaper(null)}>
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
}