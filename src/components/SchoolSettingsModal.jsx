import React, { useState } from 'react';
import { Settings, X, Save } from 'lucide-react';

const SchoolSettingsModal = ({ settings, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        school_name: settings?.school_name || '',
        school_level: settings?.school_level || '고등학교',
        region: settings?.region || '',
        student_id_len: settings?.student_id_len || '5',
        department: settings?.department || '',
        manager_email: settings?.manager_email || '',
        kakao_id: settings?.kakao_id || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="glass-card modal-content fade-in">
                <div className="modal-header">
                    <div className="modal-title">
                        <Settings size={20} className="icon-pulse" />
                        <h2>학교 설정</h2>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <label>학교 이름</label>
                            <input
                                type="text"
                                name="school_name"
                                value={formData.school_name}
                                onChange={handleChange}
                                placeholder="예: 부산정보기술고등학교"
                            />
                        </div>
                        <div className="input-group">
                            <label>학교급</label>
                            <select name="school_level" value={formData.school_level} onChange={handleChange}>
                                <option value="초등학교">초등학교</option>
                                <option value="중학교">중학교</option>
                                <option value="고등학교">고등학교</option>
                                <option value="대학교">대학교</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>지역</label>
                            <input
                                type="text"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                placeholder="예: 부산"
                            />
                        </div>
                        <div className="input-group">
                            <label>학번 글자 수</label>
                            <input
                                type="number"
                                name="student_id_len"
                                value={formData.student_id_len}
                                onChange={handleChange}
                                min="1"
                                max="10"
                            />
                        </div>
                        <div className="input-group">
                            <label>과 정보</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="예: 인공지능과"
                            />
                        </div>
                        <div className="input-group">
                            <label>담당자 이메일</label>
                            <input
                                type="email"
                                name="manager_email"
                                value={formData.manager_email}
                                onChange={handleChange}
                                placeholder="teacher@school.net"
                            />
                        </div>
                        <div className="input-group">
                            <label>카톡 아이디</label>
                            <input
                                type="text"
                                name="kakao_id"
                                value={formData.kakao_id}
                                onChange={handleChange}
                                placeholder="kakao_id"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            취소
                        </button>
                        <button type="submit" className="save-button premium-gradient">
                            <Save size={18} /> 설정 저장
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20000;
        }

        .modal-content {
          width: 90%;
          max-width: 600px;
          padding: 2rem;
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .modal-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-title h2 {
          font-size: 1.5rem;
          color: white;
          margin: 0;
        }

        .close-button {
          background: transparent;
          color: var(--text-secondary);
        }

        .close-button:hover {
          color: white;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 480px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .input-group label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .input-group input, 
        .input-group select {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 0.5rem;
          padding: 0.75rem;
          color: white;
        }

        .input-group input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-button {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          color: var(--text-secondary);
        }

        .save-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .icon-pulse {
            color: var(--primary);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
        </div>
    );
};

export default SchoolSettingsModal;
