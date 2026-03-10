import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, Award, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAntiCheat } from '../hooks/useAntiCheat';

const LearningEngine = ({ studentData, curriculum, questions, onComplete }) => {
    const [currentStep, setCurrentStep] = useState('typing'); // 'typing' or 'quiz'
    const [typingRound, setTypingRound] = useState(1);
    const [inputText, setInputText] = useState('');
    const [temperature, setTemperature] = useState(studentData.temperature || 0);
    const [streak, setStreak] = useState(0);
    const [results, setResults] = useState([]); // Quiz results
    const [typingStats, setTypingStats] = useState([]); // Accuracy per round

    const { isViolation, violationType, isBlackout, requestFullscreen } = useAntiCheat(true);
    const theoryRef = useRef(null);
    const textareaRef = useRef(null);

    // Constants from curriculum
    const targetRepetitions = curriculum.typing_repetitions || 2;
    const targetAccuracy = curriculum.min_similarity || 0.93;

    // Intelligent similarity calculation (Levenshtein Distance)
    const calculateAccuracy = (input, target) => {
        if (!target) return 0;

        const normalize = (str) => str.replace(/\s+/g, '').toLowerCase();
        const s1 = normalize(input);
        const s2 = normalize(target);

        if (s1.length === 0) return 0;
        if (s2.length === 0) return 0;

        // Optimized Levenshtein distance
        const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
        for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
        for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

        for (let j = 1; j <= s2.length; j += 1) {
            for (let i = 1; i <= s1.length; i += 1) {
                const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1, // insertion
                    track[j - 1][i] + 1, // deletion
                    track[j - 1][i - 1] + indicator // substitution
                );
            }
        }

        const distance = track[s2.length][s1.length];
        const maxLength = Math.max(s1.length, s2.length);
        return (maxLength - distance) / maxLength;
    };

    const currentAccuracy = calculateAccuracy(inputText, curriculum.typing_text);

    // Sync scroll of both panels (Line-by-line)
    useEffect(() => {
        if (theoryRef.current && textareaRef.current && currentStep === 'typing') {
            const currentIndex = inputText.length;
            const targetSpan = theoryRef.current.children[currentIndex];

            if (targetSpan) {
                const theoryBox = theoryRef.current;
                const style = getComputedStyle(theoryBox);
                const lineHeight = parseFloat(style.lineHeight);
                const paddingTop = parseFloat(style.paddingTop);

                // Position the current line as the 3rd line in the view
                // We want: targetSpan.offsetTop - scrollTop = paddingTop + (2 * lineHeight)
                // So: scrollTop = targetSpan.offsetTop - (paddingTop + (2 * lineHeight))
                const scrollTarget = targetSpan.offsetTop - (paddingTop + (2 * lineHeight));

                const finalScroll = Math.max(0, scrollTarget);

                // Synchronize both panels
                const scrollOptions = {
                    top: finalScroll,
                    behavior: 'smooth'
                };

                theoryBox.scrollTo(scrollOptions);
                textareaRef.current.scrollTo(scrollOptions);
            }
        }
    }, [inputText, currentStep]);


    const handleTypingNext = () => {
        if (currentAccuracy < targetAccuracy) {
            alert(`일치율이 ${(targetAccuracy * 100).toFixed(0)}% 미만입니다. 공백을 제외한 실제 글자를 더 정확하게 입력해주세요!`);
            return;
        }

        setTypingStats([...typingStats, currentAccuracy]);

        if (typingRound < targetRepetitions) {
            setTypingRound(typingRound + 1);
            setInputText('');
            setCurrentStep('quiz');
        } else {
            onComplete({ temperature, typingStats, results });
        }
    };

    const handleQuizComplete = (quizResults) => {
        setResults(quizResults);
        const score = quizResults.filter(r => r.correct).length / quizResults.length;

        if (typingRound === 1 && score >= 0.9) {
            setTemperature(prev => prev + 50);
            alert("천재 보너스! 단답형 고득점으로 2회 필기를 면제받았습니다.");
            onComplete({ temperature: temperature + 50, typingStats, results: quizResults });
        } else if (typingRound < targetRepetitions) {
            setCurrentStep('typing');
        } else {
            onComplete({ temperature, typingStats, results: quizResults });
        }
    };

    return (
        <div className="engine-layout">
            {/* Blackout Overlay */}
            {isBlackout && (
                <div className="blackout">
                    <AlertTriangle size={48} />
                    <h2>중복 접속 감지</h2>
                    <p>다른 탭에서 이미 학습이 진행 중입니다.</p>
                </div>
            )}

            {/* Violation Overlay */}
            {isViolation && !isBlackout && (
                <div className="violation-overlay">
                    <div className="violation-card glass-card">
                        <ShieldCheck size={48} color="var(--error)" />
                        <h2>경고: 학습 이탈 감지</h2>
                        <p>
                            {violationType === 'fullscreen' ? '전체 화면 모드를 유지해야 합니다.' : '다른 창으로 이동하면 안 됩니다.'}
                        </p>
                        <button onClick={requestFullscreen} className="premium-gradient">복귀하기</button>
                    </div>
                </div>
            )}

            <nav className="engine-nav glass-card">
                <div className="nav-left">
                    <span className="badge">{curriculum.title}</span>
                </div>
                <div className="nav-center">
                    <div className="temp-container">
                        <Thermometer size={18} color={temperature > 500 ? 'var(--temp-hot)' : 'var(--temp-cool)'} />
                        <span className="temp-text">{temperature}°C</span>
                        <div className="temp-gauge">
                            <div className="temp-fill" style={{ width: `${Math.min(100, (temperature / 1000) * 100)}%` }} />
                        </div>
                    </div>
                </div>
                <div className="nav-right">
                    <span className="student-name">{studentData.name} ({studentData.studentId})</span>
                </div>
            </nav>

            <main className="engine-content">
                <AnimatePresence mode="wait">
                    {currentStep === 'typing' ? (
                        <motion.div
                            key="typing"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="step-container typing"
                        >
                            <div className="step-header">
                                <h2><Award /> 따라쓰기 ({typingRound}/{targetRepetitions})</h2>
                                <p>제시된 문장을 정확하게 따라 써보세요. (공백 제외 일치율 목표: {(targetAccuracy * 100).toFixed(0)}%)</p>
                            </div>

                            <div className="typing-area glass-card">
                                <div className="target-text" ref={theoryRef}>
                                    {curriculum.typing_text.split('').map((char, i) => (
                                        <span key={i} className={inputText[i] ? (inputText[i] === char ? 'correct' : 'incorrect') : ''}>
                                            {char}
                                        </span>
                                    ))}
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="위 내용을 그대로 입력하세요..."
                                    autoFocus
                                />
                            </div>


                            <div className="step-footer">
                                <div className="accuracy-badge">
                                    현재 일치율: <span className={currentAccuracy >= targetAccuracy ? 'success' : ''}>
                                        {(currentAccuracy * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <button
                                    onClick={handleTypingNext}
                                    className={`next-button ${currentAccuracy >= targetAccuracy ? 'premium-gradient' : 'disabled'}`}
                                    disabled={currentAccuracy < targetAccuracy}
                                >
                                    제출하기 <ArrowRight size={18} />
                                </button>

                            </div>
                        </motion.div>
                    ) : (
                        <QuizComponent
                            questions={questions}
                            onComplete={handleQuizComplete}
                            temperature={temperature}
                            setTemperature={setTemperature}
                        />
                    )}
                </AnimatePresence>
            </main>

            <style>{`
        .engine-layout {
          min-height: 100vh;
          background: #030712;
          padding: 2rem;
          color: white;
        }

        .engine-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          margin-bottom: 2rem;
        }

        .temp-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 300px;
        }

        .temp-text {
          font-weight: 700;
          min-width: 60px;
        }

        .step-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .step-container.typing {
          max-width: 1400px;
        }

        .step-header h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .step-header p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .typing-area {
          display: flex;
          gap: 2rem;
          padding: 2rem;
          margin-bottom: 2rem;
          align-items: stretch;
          min-height: 500px;
        }

        .target-text {
          flex: 1;
          position: relative;
          font-size: 1.25rem;
          font-weight: 500;
          line-height: 1.8;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 0.75rem;
          letter-spacing: 0.05em;
          white-space: pre-wrap;
          text-align: left;
          overflow-y: auto;
          max-height: 600px;
        }

        .target-text span.correct { color: var(--success); }
        .target-text span.incorrect { color: var(--error); background: rgba(239, 68, 68, 0.2); }

        textarea {
          flex: 1;
          height: 600px; /* Match max-height of target-text */
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--glass-border);
          border-radius: 0.75rem;
          padding: 2rem;
          color: white;
          font-family: inherit;
          font-size: 1.25rem;
          font-weight: 500;
          letter-spacing: 0.05em; /* Critical for sync */
          resize: none;
          transition: border-color 0.2s;
          white-space: pre-wrap;
          line-height: 1.8;
          overflow-y: auto;
        }



        textarea:focus {
          outline: none;
          border-color: var(--primary);
        }

        .step-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .next-button {
          padding: 1rem 2.5rem;
          border-radius: 0.75rem;
          color: white;
          font-weight: 600;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .next-button.disabled {
          background: #1f2937;
          cursor: not-allowed;
          opacity: 0.5;
        }

        .blackout, .violation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: black;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .violation-card {
          padding: 3rem;
          max-width: 400px;
        }

        .violation-card h2 { margin: 1.5rem 0 1rem; color: var(--error); }
        .violation-card p { color: var(--text-secondary); margin-bottom: 2rem; }
        .violation-card button { padding: 0.75rem 2rem; border-radius: 0.5rem; color: white; }
      `}</style>
        </div>
    );
};

// Internal Quiz Component
const QuizComponent = ({ questions, onComplete, temperature, setTemperature }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showExplanation, setShowExplanation] = useState(false);

    const currentQ = questions[currentIndex];

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowExplanation(false);
        } else {
            const results = questions.map((q, i) => ({
                questionId: q.id,
                correct: answers[i] === q.answer
            }));
            onComplete(results);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="step-container"
        >
            <div className="step-header">
                <h2><CheckCircle2 /> 문제 풀이 ({currentIndex + 1}/{questions.length})</h2>
            </div>

            <div className="quiz-card glass-card">
                <div className="question-content">
                    {currentQ.image_url && <img src={currentQ.image_url} alt="Problem" className="q-image" />}
                    <p className="q-text">{currentQ.question_text}</p>
                </div>

                <div className="options">
                    {currentQ.type === 'multiple_choice' ? (
                        currentQ.options.map((opt, i) => (
                            <button
                                key={i}
                                className={`opt-btn ${answers[currentIndex] === opt ? 'selected' : ''}`}
                                onClick={() => setAnswers({ ...answers, [currentIndex]: opt })}
                            >
                                {i + 1}. {opt}
                            </button>
                        ))
                    ) : (
                        <input
                            className="subjective-input"
                            placeholder="답변을 입력하세요..."
                            value={answers[currentIndex] || ''}
                            onChange={(e) => setAnswers({ ...answers, [currentIndex]: e.target.value })}
                        />
                    )}
                </div>
            </div>

            {showExplanation && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="explanation-card glass-card"
                >
                    <div className="explanation-header">
                        {answers[currentIndex] === currentQ.answer ? (
                            <span className="success-text"><CheckCircle2 size={18} /> 정답입니다!</span>
                        ) : (
                            <span className="error-text"><AlertTriangle size={18} /> 오답입니다.</span>
                        )}
                    </div>
                    <p className="explanation-text">{currentQ.explanation}</p>
                </motion.div>
            )}

            <div className="step-footer">
                {!showExplanation ? (
                    <button
                        className={`next-button ${answers[currentIndex] ? 'premium-gradient' : 'disabled'}`}
                        disabled={!answers[currentIndex]}
                        onClick={() => setShowExplanation(true)}
                    >
                        정답 확인 <ArrowRight size={18} />
                    </button>
                ) : (
                    <button className="next-button premium-gradient" onClick={handleNext}>
                        {currentIndex < questions.length - 1 ? '다음 문제' : '결과 제출'} <ArrowRight size={18} />
                    </button>
                )}
            </div>

            <style>{`
        .quiz-card { padding: 3rem; }
        .q-image { max-width: 100%; border-radius: 0.75rem; margin-bottom: 1.5rem; }
        .q-text { font-size: 1.25rem; margin-bottom: 2rem; line-height: 1.6; }
        .options { display: grid; gap: 1rem; }
        .opt-btn {
          text-align: left;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 0.75rem;
          color: white;
          font-size: 1.125rem;
        }
        .opt-btn.selected {
          border-color: var(--primary);
          background: rgba(79, 70, 229, 0.2);
        }
        .subjective-input {
          width: 100%;
          padding: 1.25rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--glass-border);
          border-radius: 0.75rem;
          color: white;
          font-size: 1.25rem;
        }

        .explanation-card {
          margin-top: 1.5rem;
          padding: 1.5rem;
          border-left: 4px solid var(--primary);
        }

        .explanation-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .success-text { color: var(--success); display: flex; align-items: center; gap: 0.5rem; }
        .error-text { color: var(--error); display: flex; align-items: center; gap: 0.5rem; }
        .explanation-text { color: var(--text-secondary); line-height: 1.5; }
      `}</style>
        </motion.div>
    );
};

export default LearningEngine;
