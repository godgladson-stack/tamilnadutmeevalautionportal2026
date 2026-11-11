import React, { useState } from 'react';
import users from './users';
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
    body: { margin: 0, padding: 0, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    headerPanel: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'white', borderBottom: '1px solid #e0e0e0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    profileBadge: { display: 'flex', alignItems: 'center', gap: '15px' },
    avatar: { width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4a90e2' },
    userInfo: { margin: 0 },
    userName: { margin: '0 0 3px 0', color: '#333', fontSize: '16px', fontWeight: '600' },
    userRole: { margin: 0, color: '#666', fontSize: '13px' },
    logoutButton: { background: '#ff5b5b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' },
    dashboardContainer: { padding: '40px' },
    mainContainer: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
    card: { background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px', textAlign: 'center', boxSizing: 'border-box' },
    portalTitle: { color: '#1a365d', marginBottom: '40px', fontSize: '28px', fontWeight: '700', letterSpacing: '0.5px' },
    loginTitle: { color: '#2d3748', marginBottom: '30px', fontSize: '24px', fontWeight: '600' },
    buttonGroup: { display: 'flex', flexDirection: 'column', gap: '20px' },
    button: { background: '#3182ce', color: 'white', border: 'none', padding: '18px 25px', fontSize: '18px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(49,130,206,0.3)', width: '100%', fontWeight: '500' },
    secondaryButton: { background: '#e2e8f0', color: '#4a5568', marginTop: '15px' },
    inputGroup: { marginBottom: '25px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '10px', color: '#4a5568', fontSize: '16px', fontWeight: '500' },
    input: { width: '100%', padding: '15px', border: '2px solid #cbd5e0', borderRadius: '12px', boxSizing: 'border-box', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }
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
        <div style={styles.mainContainer}>
          <div style={styles.card}>
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
              <div>
                <h2 style={styles.loginTitle}>Login as {selectedRole}</h2>
                <form onSubmit={handleLogin}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Username</label>
                    <input style={styles.input} type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div style={styles.buttonGroup}>
                    <button style={styles.button} type="submit">Login</button>
                    <center>Need help? Please contact your system Adminisrtor</center>
                    <button style={{...styles.button, ...styles.secondaryButton}} type="button" onClick={() => setSelectedRole(null)}>Back</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
