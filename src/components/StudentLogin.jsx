import React, { useState } from 'react';
import { LogIn, GraduationCap, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCurriculum } from '../lib/mockData';
import '../styles/index.css';

const StudentLogin = ({ onLogin, schoolInfo, existingInfo, onLogout }) => {
  const [step, setStep] = useState('subject'); // 'subject', 'chapter', 'login'
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [combinedInput, setCombinedInput] = useState(
    existingInfo ? `${existingInfo.studentId}${existingInfo.name}` : ''
  );
  const [error, setError] = useState('');
  const inputRef = React.useRef(null);

  const subjects = [
    { id: 'bigdata', name: '빅데이터 엑셀', active: true },
    { id: 'ai_basic', name: '인공지능 기초', active: false },
    { id: 'python', name: '파이썬 프로그래밍', active: false },
  ];

  React.useEffect(() => {
    if (step === 'login') {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSubjectSelect = (sub) => {
    if (!sub.active) return alert('준비 중인 과목입니다.');
    setSelectedSubject(sub.name);
    setStep('chapter');
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    if (existingInfo && combinedInput) {
      onLogin({ ...existingInfo, subject: selectedSubject, chapter });
    } else {
      setStep('login');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanInput = combinedInput.replace(/\s+/g, '');
    const idLen = parseInt(schoolInfo?.student_id_len || '5', 10);

    if (cleanInput.length <= idLen) {
      setError(`학번(${idLen}자리)과 이름을 함께 입력해주세요.`);
      return;
    }

    const studentId = cleanInput.substring(0, idLen);
    const name = cleanInput.substring(idLen);

    if (!/^\d+$/.test(studentId)) {
      setError(`학번 앞 ${idLen}자리는 숫자여야 합니다.`);
      return;
    }

    onLogin({ studentId, name, subject: selectedSubject, chapter: selectedChapter });
  };

  return (
    <div className="login-container">
      <div className="glass-card login-card">
        <AnimatePresence mode="wait">
          {step === 'subject' && (
            <motion.div key="subject" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="login-step">
              <div className="login-header">
                <div className="logo-icon premium-gradient"><BookOpen size={32} color="white" /></div>
                <h1>과목 선택</h1>
                {existingInfo ? (
                  <div className="welcome-banner">
                    <p className="welcome-msg">반가워요, <strong>{existingInfo.name}</strong> 학생! 👋</p>
                    <button className="change-user-btn" onClick={onLogout}>정보 수정 (로그아웃)</button>
                  </div>
                ) : <p className="subtitle">학습할 과목을 먼저 선택해 주세요.</p>}
              </div>
              <div className="subject-list">
                {subjects.map((sub) => (
                  <button key={sub.id} className={`subject-btn ${!sub.active ? 'locked' : 'premium-hover'}`} onClick={() => handleSubjectSelect(sub)}>
                    <span className="sub-name">{sub.name}</span>
                    {sub.active ? <ChevronRight size={18} /> : <span className="lock-tag">준비중</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'chapter' && (
            <motion.div key="chapter" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="login-step">
              <button className="back-link" onClick={() => setStep('subject')}>← 과목 다시 선택</button>
              <div className="login-header">
                <div className="logo-icon premium-gradient"><Layers size={32} color="white" /></div>
                <h1>단원 선택</h1>
                <p className="subtitle">{selectedSubject}</p>
              </div>
              <div className="chapter-grid">
                {mockCurriculum.map((ch) => (
                  <button key={ch.id} className="chapter-select-card premium-hover" onClick={() => handleChapterSelect(ch)}>
                    <div className="ch-cat">{ch.category}</div>
                    <div className="ch-title">{ch.title}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="login-step">
              <button className="back-link" onClick={() => setStep('chapter')}>← 단원 다시 선택</button>
              <div className="login-header">
                <div className="logo-icon premium-gradient"><GraduationCap size={32} color="white" /></div>
                <h1>{selectedChapter?.title}</h1>
                <p className="subtitle">{schoolInfo?.school_name}</p>
              </div>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <label>학번 및 성명</label>
                  <input ref={inputRef} type="text" placeholder={`${schoolInfo?.student_id_len || '5'}자리 학번 + 이름`} value={combinedInput} onChange={(e) => setCombinedInput(e.target.value)} />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button premium-gradient">입장하기 <LogIn size={18} /></button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="contact-info">
          {schoolInfo?.manager_email && <p>문의: {schoolInfo.manager_email}</p>}
        </div>
      </div>

      <style>{`
        .login-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at top right, #1e1b4b, #030712); overflow: hidden; }
        .login-card { width: 100%; max-width: 420px; padding: 3rem 2rem; min-height: 520px; display: flex; flex-direction: column; }
        .login-step { width: 100%; flex: 1; }
        .login-header { text-align: center; margin-bottom: 2rem; }
        .login-header h1 { font-size: 2.25rem; margin-top: 1rem; background: linear-gradient(to bottom, #fff, #9ca3af); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .logo-icon { width: 64px; height: 64px; border-radius: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 0 30px rgba(79, 70, 229, 0.3); }
        .subtitle { color: var(--text-secondary); margin-top: 0.5rem; font-size: 0.95rem; }
        
        .subject-list { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .subject-btn { width: 100%; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--glass-border); border-radius: 1rem; color: white; font-size: 1.125rem; font-weight: 500; transition: all 0.3s; }
        .subject-btn.premium-hover:hover { background: rgba(79, 70, 229, 0.15); border-color: var(--primary); transform: translateX(5px); }
        .subject-btn.locked { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
        .lock-tag { font-size: 0.7rem; padding: 0.2rem 0.5rem; background: rgba(255, 255, 255, 0.1); border-radius: 0.5rem; color: var(--text-muted); }

        .chapter-grid { display: grid; gap: 0.75rem; margin-top: 1.5rem; max-height: 400px; overflow-y: auto; padding-right: 0.5rem; }
        .chapter-select-card { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 1rem; padding: 1.25rem; text-align: left; transition: all 0.2s; cursor: pointer; }
        .chapter-select-card:hover { transform: translateY(-3px); background: rgba(79, 70, 229, 0.15); border-color: var(--primary); }
        .ch-cat { font-size: 0.85rem; color: var(--primary); font-weight: 700; margin-bottom: 0.35rem; opacity: 0.9; }
        .ch-title { font-size: 1rem; color: white; font-weight: 600; line-height: 1.4; }
        
        .back-link { background: none; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem; transition: color 0.2s; }
        .back-link:hover { color: var(--primary); }

        .login-form { margin-top: 2rem; text-align: left; }
        .input-group { margin-bottom: 2rem; }
        .input-group label { display: block; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
        .input-group input { width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 1rem; color: white; font-size: 1.125rem; }
        .login-button { width: 100%; padding: 1rem; border-radius: 0.75rem; color: white; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .error-message { color: var(--error); font-size: 0.875rem; margin-bottom: 1.5rem; background: rgba(239, 68, 68, 0.1); padding: 0.75rem; border-radius: 0.5rem; }

        .welcome-banner { margin-top: 1rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border-radius: 1rem; }
        .welcome-msg { color: white; font-size: 1.1rem; margin-bottom: 0.5rem; }
        .welcome-msg strong { color: var(--primary); }
        .change-user-btn { font-size: 0.8rem; color: var(--text-muted); text-decoration: underline; background: none; }
        .change-user-btn:hover { color: var(--error); }

        .chapter-grid::-webkit-scrollbar { width: 6px; }
        .chapter-grid::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .chapter-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .contact-info { margin-top: auto; padding-top: 2rem; font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; text-align: center; }
      `}</style>
    </div>
  );
};

export default StudentLogin;
