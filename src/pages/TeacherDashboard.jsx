import React, { useState, useEffect } from 'react';
import { Settings, Users, BookOpen, Sparkles, Plus, Save, Trash2, ArrowBigRight } from 'lucide-react';
import { generateExplanation } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import '../styles/index.css';

const TeacherDashboard = ({ schoolData, initialCurriculum, apiKey }) => {
    const [activeTab, setActiveTab] = useState('curriculum');
    const [curriculum, setCurriculum] = useState(initialCurriculum || []);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeStudents, setActiveStudents] = useState([]);

    // --- Real-time Student Monitoring ---
    useEffect(() => {
        if (activeTab === 'students') {
            const fetchStudents = async () => {
                const { data } = await supabase
                    .from('active_sessions')
                    .select('*')
                    .order('last_active', { ascending: false });
                if (data) setActiveStudents(data);
            };

            fetchStudents();

            const subscription = supabase
                .channel('monitor_students')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'active_sessions' }, (payload) => {
                    fetchStudents();
                })
                .subscribe();

            return () => supabase.removeChannel(subscription);
        }
    }, [activeTab]);

    const handleForceNext = async (studentId) => {
        const { error } = await supabase
            .from('active_sessions')
            .update({ force_next_signal: true })
            .eq('student_id', studentId);

        if (error) alert('신호 전송 실패!');
    };

    const handleAddQuestion = (chapterId) => {
        const newChapter = curriculum.map(ch => {
            if (ch.id === chapterId) {
                return {
                    ...ch,
                    questions: [...ch.questions, { id: Date.now(), question_text: '', answer: '', explanation: '', type: 'subjective' }]
                };
            }
            return ch;
        });
        setCurriculum(newChapter);
    };

    const handleGenerateAI = async (chapterId, questionId) => {
        setIsGenerating(true);
        const chapter = curriculum.find(ch => ch.id === chapterId);
        const question = chapter.questions.find(q => q.id === questionId);

        if (!question.question_text || !question.answer) {
            alert("문제와 정답을 입력해야 해설을 생성할 수 있습니다.");
            setIsGenerating(false);
            return;
        }

        const explanation = await generateExplanation(question.question_text, question.answer, apiKey);

        const updatedCurriculum = curriculum.map(ch => {
            if (ch.id === chapterId) {
                return {
                    ...ch,
                    questions: ch.questions.map(q => q.id === questionId ? { ...q, explanation } : q)
                };
            }
            return ch;
        });
        setCurriculum(updatedCurriculum);
        setIsGenerating(false);
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar glass-card">
                <div className="sidebar-header">
                    <h2>On<span className="accent">Campus</span></h2>
                    <p>Teacher Console</p>
                </div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'curriculum' ? 'active' : ''} onClick={() => setActiveTab('curriculum')}>
                        <BookOpen size={20} /> 교육과정 관리
                    </button>
                    <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
                        <Users size={20} /> 학생 모니터링
                    </button>
                    <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                        <Settings size={20} /> 설정
                    </button>
                </nav>
            </aside>

            <main className="dashboard-main">
                <header className="main-header">
                    <h1>{activeTab === 'curriculum' ? '교육과정 설정' : activeTab === 'students' ? '학생 실시간 모니터링' : '환경 설정'}</h1>
                    <button className="save-btn premium-gradient"><Save size={18} /> 전체 저장</button>
                </header>

                <section className="dashboard-content fade-in">
                    {activeTab === 'curriculum' && (
                        <div className="curriculum-list">
                            {curriculum.map(chapter => (
                                <div key={chapter.id} className="chapter-card glass-card">
                                    <div className="chapter-header">
                                        <input
                                            className="chapter-title"
                                            value={chapter.title}
                                            onChange={(e) => {/* update logic */ }}
                                        />
                                        <div className="chapter-meta">
                                            <span>필기 반복: <input type="number" value={chapter.typing_repetitions} style={{ width: 40 }} />회</span>
                                        </div>
                                    </div>

                                    <div className="question-list">
                                        {chapter.questions.map(q => (
                                            <div key={q.id} className="question-item">
                                                <div className="q-inputs">
                                                    <input placeholder="문제 내용" value={q.question_text} />
                                                    <input placeholder="정답" value={q.answer} />
                                                </div>
                                                <div className="ai-explanation">
                                                    <textarea
                                                        placeholder="AI 해설 (자동 생성을 클릭하세요)"
                                                        value={q.explanation}
                                                        maxLength={50}
                                                    />
                                                    <button
                                                        className="ai-btn"
                                                        onClick={() => handleGenerateAI(chapter.id, q.id)}
                                                        disabled={isGenerating}
                                                    >
                                                        <Sparkles size={14} /> AI 생성
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="add-q-btn" onClick={() => handleAddQuestion(chapter.id)}>
                                        <Plus size={16} /> 문제 추가
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'students' && (
                        <div className="monitoring-list glass-card">
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>상태</th>
                                        <th>학번</th>
                                        <th>이름</th>
                                        <th>진행 단계</th>
                                        <th>정확도</th>
                                        <th>제어</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeStudents.map(student => (
                                        <tr key={student.student_id}>
                                            <td><span className="dot online"></span></td>
                                            <td>{student.student_id}</td>
                                            <td>{student.student_name}</td>
                                            <td>
                                                {student.current_step === 'typing' ? `따라쓰기 (${student.current_round}회차)` : '문제 풀이'}
                                            </td>
                                            <td>
                                                <div className="progress-bar-small">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${(student.accuracy * 100).toFixed(0)}%` }}
                                                    />
                                                    <span className="p-text">{(student.accuracy * 100).toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="skip-btn"
                                                    onClick={() => handleForceNext(student.student_id)}
                                                    title="다음 단계로 강제 이동"
                                                >
                                                    <ArrowBigRight size={16} /> 단계 넘기기
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {activeStudents.length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                                현재 접속 중인 학생이 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>


            <style>{`
        .dashboard-layout { display: grid; grid-template-columns: 280px 1fr; height: 100vh; background: #030712; }
        .sidebar { margin: 1.5rem; padding: 2rem 1.5rem; display: flex; flex-direction: column; }
        .sidebar-header h2 { font-size: 1.75rem; margin-bottom: 0.25rem; }
        .sidebar-header .accent { color: var(--primary); }
        .sidebar-header p { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 2.5rem; }
        .sidebar-nav { display: grid; gap: 0.5rem; }
        .sidebar-nav button {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem;
          color: var(--text-secondary); border-radius: 0.75rem; text-align: left; background: transparent;
        }
        .sidebar-nav button.active { background: var(--surface-hover); color: white; }
        
        .dashboard-main { padding: 3rem; overflow-y: auto; }
        .main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .save-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 0.5rem; color: white; font-weight: 600; }

        .chapter-card { padding: 2rem; margin-bottom: 2rem; }
        .chapter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--glass-border); }
        .chapter-title { background: transparent; border: none; font-size: 1.25rem; font-weight: 600; color: white; }
        
        .question-item { background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 1rem; border: 1px solid var(--glass-border); }
        .q-inputs { display: grid; grid-template-columns: 1fr 200px; gap: 1rem; margin-bottom: 1rem; }
        .q-inputs input { background: #030712; border: 1px solid var(--glass-border); padding: 0.75rem; border-radius: 0.5rem; color: white; }
        
        .ai-explanation { display: grid; grid-template-columns: 1fr 100px; gap: 1rem; align-items: flex-end; }
        .ai-explanation textarea { background: #030712; border: 1px solid var(--glass-border); padding: 0.75rem; border-radius: 0.5rem; color: var(--text-secondary); resize: none; height: 60px; font-size: 0.875rem; }
        .ai-btn { background: #1e1b4b; color: var(--accent); padding: 0.5rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; font-weight: 600; border: 1px solid var(--accent); }
        .ai-btn:hover { background: var(--accent); color: white; }
        
        .add-q-btn { width: 100%; padding: 1rem; border: 1px dashed var(--text-muted); border-radius: 0.75rem; background: transparent; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .add-q-btn:hover { border-color: var(--primary); color: var(--primary); }
        .monitoring-list { padding: 0; overflow: hidden; }
        .student-table { width: 100%; border-collapse: collapse; text-align: left; }
        .student-table th { padding: 1.25rem 1.5rem; background: rgba(255,255,255,0.05); color: var(--text-secondary); font-size: 0.875rem; font-weight: 600; }
        .student-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--glass-border); color: white; vertical-align: middle; }
        
        .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
        .dot.online { background: var(--success); box-shadow: 0 0 10px var(--success); }
        
        .progress-bar-small { width: 120px; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative; display: flex; align-items: center; }
        .progress-fill { height: 100%; background: var(--primary); border-radius: 4px; transition: width 0.3s ease; }
        .p-text { position: absolute; right: -45px; font-size: 0.75rem; color: var(--text-secondary); }

        .skip-btn {
          display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;
          background: rgba(79, 70, 229, 0.1); border: 1px solid rgba(79, 70, 229, 0.3);
          border-radius: 0.5rem; color: var(--primary); font-size: 0.825rem; font-weight: 600;
          transition: all 0.2s;
        }
        .skip-btn:hover { background: var(--primary); color: white; }
      `}</style>
        </div>
    );
};

export default TeacherDashboard;
