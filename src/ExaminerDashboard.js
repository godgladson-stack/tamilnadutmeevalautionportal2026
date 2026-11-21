import React, { useState } from 'react';

const initialAssignedPapers = [
  {
    id: 'PAP-1001',
    dummyNumber: '408921',
    subject: 'Typewriting English Senior',
    category: 'Speed',
    paragraphs: 3,
    scannedCopyUrl: 'https://images.unsplash.com/photo-1584433144151-508548c7c9c0?auto=format&fit=crop&w=800&q=80',
    status: 'Pending Evaluation',
    score: null
  },
  {
    id: 'PAP-1002',
    dummyNumber: '512345',
    subject: 'Typewriting Tamil Junior',
    category: 'Statement & Letter',
    paragraphs: 2,
    scannedCopyUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    status: 'Pending Evaluation',
    score: null
  },
  {
    id: 'PAP-1003',
    dummyNumber: '609812',
    subject: 'Typewriting English Junior',
    category: 'Speed',
    paragraphs: 2,
    scannedCopyUrl: 'https://images.unsplash.com/photo-1584433144151-508548c7c9c0?auto=format&fit=crop&w=800&q=80',
    status: 'Evaluated',
    score: 94.60
  }
];

export default function ExaminerDashboard({ onStartEvaluation }) {
  const [papers] = useState(initialAssignedPapers);

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
    badgeCompleted: { background: '#c6f6d5', color: '#22543d', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    btnStart: { background: '#3182ce', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' },
    btnDone: { background: '#cbd5e0', color: '#4a5568', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'not-allowed' }
  };

  const pendingCount = papers.filter(p => p.status === 'Pending Evaluation').length;
  const completedCount = papers.filter(p => p.status === 'Evaluated').length;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Examiner Dashboard - Assigned Answer Scripts</h2>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{papers.length}</p>
          <p style={styles.statLabel}>Total Assigned</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{pendingCount}</p>
          <p style={styles.statLabel}>Pending Evaluation</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{completedCount}</p>
          <p style={styles.statLabel}>Completed</p>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Paper ID</th>
              <th style={styles.th}>Dummy Number</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Paper Type</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {papers.map(paper => (
              <tr key={paper.id}>
                <td style={styles.tdBold}>{paper.id}</td>
                <td style={styles.tdBold}>{paper.dummyNumber}</td>
                <td style={styles.tdMedium}>{paper.subject}</td>
                <td style={styles.td}>{paper.category}</td>
                <td style={styles.td}>
                  <span style={paper.status === 'Evaluated' ? styles.badgeCompleted : styles.badgePending}>
                    {paper.status === 'Evaluated' ? `Evaluated (${paper.score})` : paper.status}
                  </span>
                </td>
                <td style={styles.td}>
                  {paper.status === 'Pending Evaluation' ? (
                    <button
                      style={styles.btnStart}
                      onClick={() => onStartEvaluation && onStartEvaluation(paper)}
                    >
                      Start Evaluation
                    </button>
                  ) : (
                    <button style={styles.btnDone} disabled>
                      Completed
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
