import React, { useState } from 'react';
import users from '/users';
import ChiefExaminerDashboard from './ChiefExaminerDashboard';
import ExaminerDashboard from './ExaminerDashboard';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === username && u.password === password && u.role === selectedRole);
    if (foundUser) {
      setCurrentUser(foundUser);
    } else {
      alert('Invalid credentials for this role');
    }
  };

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'ERB Inspector':
        return <div><h3>ERB Inspector Dashboard</h3><p>Inspecting Active Papers...</p></div>;
      case 'Chief Examiner':
        return <ChiefExaminerDashboard users={users} />;
      case 'Scrutiny Officer':
        return <div><h3>Scrutiny Officer Dashboard</h3><p>Recheck & Forward Papers...</p></div>;
      case 'Examiner':
        return <ExaminerDashboard currentUser={currentUser} />;
      default:
        return null;
    }
  };

  const styles = {
    body: { margin: 0, padding: 0, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#f4f6f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    headerPanel: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'white', borderBottom: '1px solid #e0e0e0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    profileBadge: { display: 'flex', alignItems: 'center', gap: '15px' },
    avatar: { width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4a90e2' },
    userInfo: { margin: 0 },
    userName: { margin: '0 0 3px 0', color: '#333', fontSize: '16px', fontWeight: '600' },
    userRole: { margin: 0, color: '#666', fontSize: '13px' },
    logoutButton: { background: '#ff5b5b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' },
    dashboardContainer: { padding: '40px' },
    
    // Portal Layout Styles
    portalHeader: { background: '#ffffff', padding: '15px 25px', display: 'flex', alignItems: 'center', borderBottom: '3px solid #005a9c', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    logo: { width: '60px', height: '60px', marginRight: '20px' },
    headerText: { display: 'flex', flexDirection: 'column' },
    titleTamil: { fontSize: '18px', fontWeight: 'bold', color: '#005a9c', margin: 0 },
    titleEnglish: { fontSize: '14px', color: '#555', margin: 0 },
    
    mainLayout: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' },
    sidebar: { background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: 'fit-content' },
    sidebarTitle: { fontSize: '15px', color: '#d9534f', fontWeight: 'bold', borderBottom: '2px solid #fee1dd', paddingBottom: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center' },
    marqueeBox: { background: '#fdf7f7', border: '1px solid #f5c6cb', color: '#721c24', padding: '12px', borderRadius: '5px', fontSize: '13px', marginBottom: '12px' },
    
    centerPanel: { background: '#ffffff', padding: '40px', borderRadius: '8px', border: '1px solid #e0e0e0', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    portalTitle: { color: '#005a9c', marginBottom: '30px', fontSize: '24px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' },
    
    buttonGroup: { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' },
    button: { background: '#007bff', color: 'white', border: 'none', padding: '16px 25px', fontSize: '16px', borderRadius: '25px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 6px rgba(0,123,255,0.2)', width: '100%', fontWeight: '600' },
    secondaryButton: { background: '#e2e8f0', color: '#4a5568', marginTop: '15px', borderRadius: '25px', boxShadow: 'none' },
    
    loginContainer: {
      background: '#ffffff',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      width: '100%',
      maxWidth: '450px',
      margin: '0 auto',
      textAlign: 'left'
    },
    loginHeading: {
      color: '#2d3748',
      textAlign: 'center',
      marginBottom: '25px',
      fontSize: '22px',
      fontWeight: '600',
      borderBottom: '2px solid #edf2f7',
      paddingBottom: '15px'
    },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', color: '#4a5568', fontSize: '14px', fontWeight: '500' },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #cbd5e0',
      borderRadius: '4px',
      boxSizing: 'border-box',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#f7fafc'
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '15px',
      transition: 'background 0.2s'
    },
    forgotLinkContainer: { textAlign: 'center', marginBottom: '25px' },
    forgotLink: { color: '#3182ce', fontSize: '14px', textDecoration: 'none' },
    noticeBox: {
      backgroundColor: '#feebc8',
      border: '1px solid #f6e05e',
      color: '#744210',
      padding: '15px',
      borderRadius: '4px',
      fontSize: '13px',
      lineHeight: '1.4',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.body}>
      {currentUser && (
        <div style={styles.headerPanel}>
          <div style={styles.profileBadge}>
            <img src={currentUser.photo} alt={currentUser.name} style={styles.avatar} />
            <div style={styles.userInfo}>
              <h4 style={styles.userName}>{currentUser.name}</h4>
              <p style={styles.userRole}>{currentUser.role}</p>
            </div>
          </div>
          <button style={styles.logoutButton} onClick={() => { setCurrentUser(null); setSelectedRole(null); setUsername(''); setPassword(''); }}>Log Out</button>
        </div>
      )}

      {currentUser ? (
        <div style={styles.dashboardContainer}>
          {renderDashboard()}
        </div>
      ) : (
        <>
          <header style={styles.portalHeader}>
            <img 
              src="<>" 
              style={styles.logo} 
            />
            <div style={styles.headerText}>
              <h1 style={styles.titleTamil}>தமிழ்நாடு அரசு</h1>
              <h2 style={styles.titleEnglish}>Directorate of Technical Education</h2>
            </div>
          </header>

          <div style={styles.mainLayout}>
            <aside style={styles.sidebar}>
              <div style={styles.sidebarTitle}>
                <span style={{ marginRight: '8px' }}>⚠️</span> Important Announcements
              </div>
              <div style={styles.marqueeBox}>
                <p style={{ margin: '0 0 6px 0', fontWeight: '600' }}>Enquiry Committee Notice</p>
                <p style={{ margin: 0, fontSize: '12px' }}>Avoid Duplicates. Instructions are available on the portal.</p>
              </div>
              <div style={styles.marqueeBox}>
                <p style={{ margin: '0 0 6px 0', fontWeight: '600' }}>Valuation Update</p>
                <p style={{ margin: 0, fontSize: '12px' }}>OSDEE valuation guidelines updated for all active subjects.</p>
              </div>
            </aside>

            <main style={styles.centerPanel}>
              {!selectedRole ? (
                <div>
                  <h1 style={styles.portalTitle}>Tamil Nadu TME Evaluation Portal 2026 OSDEE VALUATION</h1>
                  <div style={styles.buttonGroup}>
                    <button style={styles.button} onClick={() => setSelectedRole('ERB Inspector')}>ERB Inspector</button>
                    <button style={styles.button} onClick={() => setSelectedRole('Chief Examiner')}>Chief Examiner</button>
                    <button style={styles.button} onClick={() => setSelectedRole('Scrutiny Officer')}>Scrutiny Officer</button>
                    <button style={styles.button} onClick={() => setSelectedRole('Examiner')}>Examiner</button>
                  </div>
                </div>
              ) : (
                <div style={styles.loginContainer}>
                  <h2 style={styles.loginHeading}>{selectedRole} Login</h2>
                  <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Username</label>
                      <input style={styles.input} type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Password</label>
                      <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button style={styles.submitButton} type="submit">Login</button>
                    <div style={styles.forgotLinkContainer}>
                      <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Reset link sent'); }} style={styles.forgotLink}>
                        Forgot / Reset password?
                      </a>
                    </div>
                  </form>
                  <div style={styles.noticeBox}>
                    Please ensure that all pages load properly before using OSDEE Web Application.
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button style={{...styles.button, ...styles.secondaryButton, maxWidth: '200px', margin: '0 auto'}} type="button" onClick={() => setSelectedRole(null)}>Back</button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
