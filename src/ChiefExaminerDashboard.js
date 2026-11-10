import React, { useState } from 'react';

const initialPapers = [
  { id: 'PAP-1001', studentRollNo: '2026TME001', studentName: 'Arun Kumar M', subject: 'Thermodynamics', scannedCopyUrl: null, assignedExaminerId: null, assignedExaminerName: 'Unassigned', status: 'Pending Allocation' },
  { id: 'PAP-1002', studentRollNo: '2026TME002', studentName: 'Deepa S', subject: 'Fluid Mechanics', scannedCopyUrl: null, assignedExaminerId: null, assignedExaminerName: 'Unassigned', status: 'Pending Allocation' },
  { id: 'PAP-1003', studentRollNo: '2026TME003', studentName: 'Vijay V', subject: 'Structural Analysis', scannedCopyUrl: null, assignedExaminerId: null, assignedExaminerName: 'Unassigned', status: 'Pending Allocation' },
];

export default function ChiefExaminerDashboard({ users }) {
  const examiners = users ? users.filter(u => u.role === 'Examiner') : [
    { id: 'EXM-01', name: 'Dr. K. Aruldoss' },
    { id: 'EXM-02', name: 'Prof. R. Geetha' }
  ];

  const [papers, setPapers] = useState(initialPapers);
  const [selectedExaminers, setSelectedExaminers] = useState({});
  const [uploadingPaperId, setUploadingPaperId] = useState(null);

  const handleSelectExaminer = (paperId, examinerId) => {
    setSelectedExaminers(prev => ({ ...prev, [paperId]: examinerId }));
  };

  const handleFileUpload = (paperId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingPaperId(paperId);
    
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file);
      setPapers(prev => prev.map(paper => {
        if (paper.id === paperId) {
          return { ...paper, scannedCopyUrl: fakeUrl };
        }
        return paper;
      }));
      setUploadingPaperId(null);
    }, 1000);
  };

  const handleAssign = (paperId) => {
    const paper = papers.find(p => p.id === paperId);
    if (!paper.scannedCopyUrl) {
      alert('Please upload the scanned copy of the answer paper before assigning.');
      return;
    }

    const examinerId = selectedExaminers[paperId];
    if (!examinerId) return alert('Select an examiner first');

    const examinerObj = examiners.find(e => e.id === examinerId || e.name === examinerId);
    const examinerName = examinerObj ? (examinerObj.name || examinerObj.username) : examinerId;

    setPapers(prev => prev.map(p => {
      if (p.id === paperId) {
        return {
          ...p,
          assignedExaminerId: examinerId,
          assignedExaminerName: examinerName,
          status: 'Assigned'
        };
      }
      return p;
    }));
  };

  const styles = {
    container: { padding: '30px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#f8fafc', minHeight: '100vh' },
    header: { color: '#1a365d', marginBottom: '30px', fontWeight: '700' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
    statCard: { background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textAlign: 'center', border: '1px solid #e2e8f0' },
    statNumber: { fontSize: '28px', fontWeight: 'bold', color: '#2b6cb0', margin: '0 0 5px 0' },
    statLabel: { margin: 0, color: '#718096', fontSize: '14px', fontWeight: '500' },
    tableContainer: { background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { background: '#ebf8ff', color: '#2b6cb0', padding: '16px 20px', fontSize: '14px', fontWeight: '600', borderBottom: '2px solid #bee3f8' },
    td: { padding: '16px 20px', borderBottom: '1px solid #edf2f7', color: '#2d3748', verticalAlign: 'middle' },
    tdBold: { padding: '16px 20px', borderBottom: '1px solid #edf2f7', color: '#2d3748', verticalAlign: 'middle', fontWeight: '600' },
    tdMedium: { padding: '16px 20px', borderBottom: '1px solid #edf2f7', color: '#2d3748', verticalAlign: 'middle', fontWeight: '500' },
    badgePending: { background: '#feebc8', color: '#975a16', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    badgeAssigned: { background: '#c6f6d5', color: '#22543d', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    select: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e0', marginRight: '12px', fontSize: '14px', outline: 'none', background: '#fff' },
    btn: { background: '#3182ce', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' },
    fileInputLabel: { display: 'inline-flex', alignItems: 'center', background: '#edf2f7', color: '#4a5568', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', border: '1px dashed #cbd5e0', marginRight: '10px' },
    fileInput: { display: 'none' },
    link: { color: '#3182ce', textDecoration: 'none', fontWeight: '500' }
  };

  const pendingCount = papers.filter(p => p.status === 'Pending Allocation').length;
  const assignedCount = papers.filter(p => p.status === 'Assigned').length;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Chief Examiner Dashboard - Paper Management</h2>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{papers.length}</p>
          <p style={styles.statLabel}>Total Papers</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{pendingCount}</p>
          <p style={styles.statLabel}>Pending Allocation</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{assignedCount}</p>
          <p style={styles.statLabel}>Assigned Papers</p>
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
              <th style={styles.th}>Scanned Copy</th>
              <th style={styles.th}>Assign Examiner</th>
            </tr>
          </thead>
          <tbody>
            {papers.map(paper => (
              <tr key={paper.id}>
                <td style={styles.tdBold}>{paper.id}</td>
                <td style={styles.td}>{paper.studentRollNo}</td>
                <td style={styles.tdMedium}>{paper.studentName}</td>
                <td style={styles.td}>{paper.subject}</td>
                <td style={styles.td}>
                  <span style={paper.status === 'Assigned' ? styles.badgeAssigned : styles.badgePending}>
                    {paper.status}
                  </span>
                </td>
                <td style={styles.td}>
                  {paper.scannedCopyUrl ? (
                    <a href={paper.scannedCopyUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      View Paper 📄
                    </a>
                  ) : (
                    <label style={styles.fileInputLabel}>
                      {uploadingPaperId === paper.id ? 'Uploading...' : 'Upload PDF'}
                      <input 
                        type="file" 
                        accept="application/pdf" 
                        style={styles.fileInput} 
                        onChange={(e) => handleFileUpload(paper.id, e)}
                      />
                    </label>
                  )}
                </td>
                <td style={styles.td}>
                  <select
                    style={styles.select}
                    value={selectedExaminers[paper.id] || ''}
                    onChange={(e) => handleSelectExaminer(paper.id, e.target.value)}
                    disabled={!paper.scannedCopyUrl}
                  >
                    <option value="">-- Select Examiner --</option>
                    {examiners.map((ex, idx) => (
                      <option key={ex.id || idx} value={ex.id || ex.name || ex.username}>
                        {ex.name || ex.username}
                      </option>
                    ))}
                  </select>
                  <button 
                    style={{...styles.btn, opacity: !paper.scannedCopyUrl ? 0.6 : 1}} 
                    onClick={() => handleAssign(paper.id)}
                    disabled={!paper.scannedCopyUrl}
                  >
                    {paper.status === 'Assigned' ? 'Reassign' : 'Assign'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}