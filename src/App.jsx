import React, { useState, useEffect } from 'react';
import StudentLogin from './components/StudentLogin';
import LearningEngine from './components/LearningEngine';
import TeacherDashboard from './pages/TeacherDashboard';
import SchoolSettingsModal from './components/SchoolSettingsModal';
import { mockSchoolInfo, mockCurriculum } from './lib/mockData';
import { Settings as SettingsIcon } from 'lucide-react';
import './styles/index.css';

function App() {
  const [user, setUser] = useState(null);
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [schoolSettings, setSchoolSettings] = useState(() => {
    const saved = localStorage.getItem('oncampus_school_settings');
    return saved ? JSON.parse(saved) : {
      ...mockSchoolInfo,
      school_level: '고등학교',
      student_id_len: '5',
      department: '인공지능과',
      manager_email: 'teacher@school.net',
      kakao_id: 'oncampus_help'
    };
  });

  useEffect(() => {
    localStorage.setItem('oncampus_school_settings', JSON.stringify(schoolSettings));
  }, [schoolSettings]);

  const handleStudentLogin = (data) => {
    setUser({ ...data, type: 'student', temperature: 0 });
  };

  const handleLearningComplete = (stats) => {
    alert('학습을 성공적으로 마쳤습니다! 온도와 점수가 저장되었습니다.');
    console.log('Final Stats:', stats);
  };

  const toggleMode = () => {
    setIsTeacherMode(!isTeacherMode);
    setUser(null);
  };

  const handleSaveSettings = (newSettings) => {
    setSchoolSettings(newSettings);
  };

  const renderContent = () => {
    if (isTeacherMode) {
      return (
        <TeacherDashboard
          schoolData={schoolSettings}
          initialCurriculum={mockCurriculum}
          apiKey={import.meta.env.VITE_GEMINI_API_KEY}
        />
      );
    }

    if (!user) {
      return <StudentLogin onLogin={handleStudentLogin} schoolInfo={schoolSettings} />;
    }

    return (
      <LearningEngine
        studentData={user}
        curriculum={mockCurriculum[0]}
        questions={mockCurriculum[0].questions}
        onComplete={handleLearningComplete}
      />
    );
  };

  return (
    <div className="app">
      {renderContent()}

      <div className="app-controls">
        <button
          className="settings-toggle"
          onClick={() => setShowSettings(true)}
          title="학교 설정"
        >
          <SettingsIcon size={20} />
          <span className="school-name-badge">{schoolSettings.school_name}</span>
        </button>

        <button className="mode-toggle" onClick={toggleMode}>
          {isTeacherMode ? '학생 모드로 전환' : '교사 모드로 전환'}
        </button>
      </div>

      {showSettings && (
        <SchoolSettingsModal
          settings={schoolSettings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      <style>{`
        .app-controls {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
          z-index: 10000;
        }

        .settings-toggle, .mode-toggle {
          pointer-events: auto;
        }

        .settings-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: var(--surface);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          border-radius: 2rem;
          font-size: 0.875rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .settings-toggle:hover {
          background: var(--surface-hover);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .school-name-badge {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .school-name-badge {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
