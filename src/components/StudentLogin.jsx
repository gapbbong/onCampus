import React, { useState } from 'react';
import { LogIn, GraduationCap } from 'lucide-react';
import '../styles/index.css';

const StudentLogin = ({ onLogin, schoolInfo }) => {
  const [combinedInput, setCombinedInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Remove all spaces from input
    const cleanInput = combinedInput.replace(/\s+/g, '');

    const idLen = parseInt(schoolInfo?.student_id_len || '5', 10);

    if (cleanInput.length <= idLen) {
      setError(`학번(${idLen}자리)과 이름을 함께 입력해주세요. (예: ${idLen === 5 ? '30101' : '3101'}홍길동)`);
      return;
    }

    const studentId = cleanInput.substring(0, idLen);
    const name = cleanInput.substring(idLen);

    // Basic validation: studentId should be numeric (usually)
    if (!/^\d+$/.test(studentId)) {
      setError(`학번 앞 ${idLen}자리는 숫자여야 합니다.`);
      return;
    }

    onLogin({ studentId, name });
  };

  return (
    <div className="login-container fade-in">
      <div className="glass-card login-card">
        <div className="login-header">
          <div className="logo-icon premium-gradient">
            <GraduationCap size={32} color="white" />
          </div>
          <h1>OnCampus</h1>
          <p className="subtitle">
            {schoolInfo?.region} {schoolInfo?.school_name} {schoolInfo?.school_level}
          </p>
          <p className="department-tag">{schoolInfo?.department}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>학번 및 성명</label>
            <input
              type="text"
              placeholder={`${schoolInfo?.student_id_len || '5'}자리 학번 + 이름 (예: ${schoolInfo?.student_id_len === '5' ? '30101' : '3101'}홍길동)`}
              value={combinedInput}
              onChange={(e) => setCombinedInput(e.target.value)}
              autoFocus
            />
            <p className="input-help">띄어쓰기 없이 입력해도 괜찮습니다.</p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button premium-gradient">
            입장하기 <LogIn size={18} />
          </button>
        </form>

        <div className="contact-info">
          {schoolInfo?.manager_email && (
            <p>문의: {schoolInfo.manager_email}</p>
          )}
          {schoolInfo?.kakao_id && (
            <p>카카오톡: {schoolInfo.kakao_id}</p>
          )}
        </div>
      </div>

      <style>{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, #1e1b4b, #030712);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 3rem 2rem;
          text-align: center;
          position: relative;
        }

        .login-header h1 {
          font-size: 2.5rem;
          margin-top: 1rem;
          background: linear-gradient(to bottom, #fff, #9ca3af);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-icon {
          width: 64px;
          height: 64px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.4);
        }

        .subtitle {
          color: var(--text-secondary);
          margin-top: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .department-tag {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: rgba(79, 70, 229, 0.1);
          border: 1px solid rgba(79, 70, 229, 0.2);
          border-radius: 1rem;
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .login-form {
          margin-top: 2.5rem;
          text-align: left;
        }

        .input-group {
          margin-bottom: 2rem;
        }

        .input-group label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          margin-left: 0.25rem;
        }

        .input-group input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 0.75rem;
          padding: 1rem;
          color: white;
          font-size: 1.125rem;
          transition: all 0.2s;
        }

        .input-group input:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .input-help {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
          margin-left: 0.25rem;
        }

        .login-button {
          width: 100%;
          padding: 1rem;
          border-radius: 0.75rem;
          color: white;
          font-weight: 600;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .login-button:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .error-message {
          color: var(--error);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          text-align: center;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 0.5rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .contact-info {
          margin-top: 2rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default StudentLogin;
