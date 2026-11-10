import React, { useState } from 'react';

// Mock assigned papers
const mockAssignedPapers = [
  { id: 'PAP-1002', studentRollNo: '2026TME002', studentName: 'Deepa S', subject: 'Fluid Mechanics', scannedCopyUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Assigned', marks: '', remarks: '' },
  { id: 'PAP-1003', studentRollNo: '2026TME003', studentName: 'Vijay V', subject: 'Structural Analysis', scannedCopyUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: 'Assigned', marks: '', remarks: '' }
];

export default function ExaminerDashboard({ currentUser }) {
  const [papers, setPapers] = useState(mockAssignedPapers);
  const [evaluations, setEvaluations] = useState({});

  const handleInputChange = (paperId, field, value) => {
    setEvaluations(prev => ({
      ...prev,
      [paperId]: {
        ...prev[paperId],
        [field]: value
      }
    }));
  };

  const handleSubmitEvaluation = (paperId) => {
    const evalData = evaluations[paperId];
    if (!evalData || !evalData.marks) {
      alert('Please enter marks before submitting.');
      return;
    }

    setPapers(prev => prev.map(p => {
      if (p.id === paperId) {
        return {
          ...p,
          status: 'Evaluated',
          marks: evalData.marks,
          remarks: evalData.remarks || 'No remarks'
        };
      }
      return p;
    }));
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
    input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '80px', fontSize: '14px', outline: 'none' },
    textarea: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', width: '100%', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' },
    btn: { background: '#48bb78', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' },
    badgeAssigned: { background: '#ebf8ff', color: '#2b6cb0', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    badgeEvaluated: { background: '#c6f6d5', color: '#22543d', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    link: { color: '#3182ce', textDecoration: 'none', fontWeight: '500' }
  };

  const assignedCount = papers.filter(p => p.status === 'Assigned').length;
  const evaluatedCount = papers.filter(p => p.status === 'Evaluated').length;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Examiner Dashboard - Evaluation Panel</h2>

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
              <th style={styles.th}>View Paper</th>
              <th style={styles.th}>Award Marks</th>
              <th style={styles.th}>Remarks</th>
              <th style={styles.th}>Action</th>
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
                <td style={styles.td}>
                  <a href={paper.scannedCopyUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    Open PDF 📄
                  </a>
                </td>
                <td style={styles.td}>
                  {paper.status === 'Evaluated' ? (
                    <strong>{paper.marks}</strong>
                  ) : (
                    <input 
                      type="number" 
                      placeholder="Max 100" 
                      style={styles.input}
                      value={evaluations[paper.id]?.marks || ''}
                      onChange={(e) => handleInputChange(paper.id, 'marks', e.target.value)}
                    />
                  )}
                </td>
                <td style={styles.td}>
                  {paper.status === 'Evaluated' ? (
                    paper.remarks
                  ) : (
                    <textarea 
                      rows="2" 
                      placeholder="Optional feedback..."
                      style={styles.textarea}
                      value={evaluations[paper.id]?.remarks || ''}
                      onChange={(e) => handleInputChange(paper.id, 'remarks', e.target.value)}
                    />
                  )}
                </td>
                <td style={styles.td}>
                  {paper.status === 'Assigned' && (
                    <button style={styles.btn} onClick={() => handleSubmitEvaluation(paper.id)}>
                      Submit Evaluation
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}