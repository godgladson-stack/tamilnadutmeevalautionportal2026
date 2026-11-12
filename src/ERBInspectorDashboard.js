import React, { useState } from 'react';

function ERBInspectorDashboard({ users }) {
  const [selectedExaminer, setSelectedExaminer] = useState(null);

  // Filter out only the examiners
  const examiners = users.filter(u => u.role === 'Examiner');

  return (
    <div style={{ padding: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ color: '#005a9c', borderBottom: '2px solid #005a9c', paddingBottom: '10px' }}>
        ERB Inspector Live Monitoring
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ccc' }}>
          <h3 style={{ marginTop: 0 }}>Examiners List</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {examiners.map(examUser => (
              <li 
                key={examUser.username} 
                onClick={() => setSelectedExaminer(examUser)}
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  background: selectedExaminer?.username === examUser.username ? '#e2e8f0' : '#f7fafc',
                  border: '1px solid #cbd5e0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: selectedExaminer?.username === examUser.username ? 'bold' : 'normal'
                }}
              >
                {examUser.name}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
          <h3 style={{ marginTop: 0 }}>Live Evaluation Status</h3>
          {selectedExaminer ? (
            <div>
              <p><strong>Name:</strong> {selectedExaminer.name}</p>
              <p><strong>Username:</strong> {selectedExaminer.username}</p>
              <div style={{ marginTop: '20px', padding: '15px', background: '#edf2f7', borderRadius: '6px' }}>
                <h4>Current Progress</h4>
                <p>Status: Active evaluation in progress...</p>
                {/* Add dynamic paper tracking details here */}
              </div>
            </div>
          ) : (
            <p style={{ color: '#718096' }}>Select an examiner from the list to view their live paper status.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ERBInspectorDashboard;