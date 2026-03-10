import React, { useState, useEffect } from 'react';
import StudentLogin from './components/StudentLogin';
import LearningEngine from './components/LearningEngine';
import TeacherDashboard from './pages/TeacherDashboard';
import SchoolSettingsModal from './components/SchoolSettingsModal';
import { mockSchoolInfo, mockCurriculum } from './lib/mockData';
import { Settings as SettingsIcon } from 'lucide-react';
import './styles/index.css';

// ---------------------------------------------------------
// 구글 앱스 스크립트(GAS) 웹 앱 URL을 여기에 넣으세요!
// ---------------------------------------------------------
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbytv9B8DqxTf65K0NgggHhlnaAqJYshGvzhHvWu_Pm7QewRgUFRKnxtGyzNtnxqWb03/exec";
const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1w7eom3Uj6eHOV-F6bEQmHiFvloeW-2Qv5t7S5xj3ETU/edit?gid=0#gid=0";

function App() {
  const [studentInfo, setStudentInfo] = useState(() => {
    const saved = localStorage.getItem('oncampus_student_info');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeSession, setActiveSession] = useState(null);
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [showSettings, setShowSettings] = useState(() => {
    const saved = localStorage.getItem('oncampus_school_settings');
    return !saved; // 설정이 없으면 자동으로 학교 설정부터 시작
  });
  const [isIdle, setIsIdle] = useState(false);

  // --- Idle Detection (1 minute) ---
  useEffect(() => {
    let idleTimer;
    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), 60000); // 60 seconds
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    resetTimer(); // Start initial timer

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      clearTimeout(idleTimer);
    };
  }, []);


  const [schoolSettings, setSchoolSettings] = useState(() => {
    const saved = localStorage.getItem('oncampus_school_settings');
    return saved ? JSON.parse(saved) : {
      ...mockSchoolInfo,
      school_level: '고등학교',
      student_id_len: '5',
      department: '인공지능과',
      school_name: '온캠퍼스 고등학교'
    };
  });

  useEffect(() => {
    localStorage.setItem('oncampus_school_settings', JSON.stringify(schoolSettings));
  }, [schoolSettings]);

  const handleLogin = (data) => {
    const info = { studentId: data.studentId, name: data.name };
    setStudentInfo(info);
    localStorage.setItem('oncampus_student_info', JSON.stringify(info));
    setActiveSession({ ...info, subject: data.subject, chapter: data.chapter, temperature: 0 });
  };

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까? 저장된 정보가 삭제됩니다.')) {
      setStudentInfo(null);
      setActiveSession(null);
      localStorage.removeItem('oncampus_student_info');
    }
  };

  const handleLearningComplete = async (stats) => {
    // 저장할 데이터 패키지 (만능 시트이므로 필요한 항목을 마음껏 추가하세요)
    const payload = {
      "날짜": new Date().toLocaleString(),
      "학번": activeSession.studentId,
      "이름": activeSession.name,
      "과목": activeSession.subject,
      "최종온도": stats.temperature,
      "실기일치율": (stats.typingStats.reduce((a, b) => a + b, 0) / (stats.typingStats.length || 1) * 100).toFixed(1) + "%",
      "퀴즈점수": (stats.results.filter(r => r.correct).length / (stats.results.length || 1) * 100).toFixed(0) + "점",
      "학교": schoolSettings.school_name
    };

    try {
      // 구글 시트로 데이터 전송
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors", // 중요: CORS 오류 방지
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      alert('학습 데이터가 구글 스프레드시트에 안전하게 저장되었습니다! 🎓');
      setActiveSession(null);
    } catch (error) {
      console.error('Save Error:', error);
      alert('저장 중 오류가 발생했습니다. 네트워크를 확인해주세요.');
    }
  };

  const renderContent = () => {
    if (isTeacherMode) {
      return <TeacherDashboard schoolData={schoolSettings} initialCurriculum={mockCurriculum} />;
    }

    if (!activeSession) {
      return (
        <StudentLogin
          onLogin={handleLogin}
          schoolInfo={schoolSettings}
          existingInfo={studentInfo}
          onLogout={handleLogout}
        />
      );
    }

    return (
      <LearningEngine
        studentData={activeSession}
        curriculum={activeSession.chapter || mockCurriculum[0]}
        questions={activeSession.chapter?.questions || mockCurriculum[0].questions}
        onComplete={handleLearningComplete}
        onBack={() => setActiveSession(null)}
        onLogout={handleLogout}
        isTeacherMode={isTeacherMode}
        setIsTeacherMode={setIsTeacherMode}
        spreadsheetUrl={SPREADSHEET_URL}
      />
    );
  };

  return (
    <div className={`app ${isIdle ? 'idle-blink' : ''}`}>
      {renderContent()}


      {!activeSession && !isTeacherMode && (
        <div className="app-controls">
          <button className="settings-toggle" onClick={() => setShowSettings(true)}>
            <SettingsIcon size={20} />
            <span className="school-name-badge">{schoolSettings.school_name}</span>
          </button>
        </div>
      )}


      {showSettings && (
        <SchoolSettingsModal
          settings={schoolSettings}
          onSave={(s) => setSchoolSettings(s)}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
