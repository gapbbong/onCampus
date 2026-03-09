export const mockSchoolInfo = {
    school_name: '부산정보기술고등학교',
    student_id_format: '5',
    subject: '인공지능기초',
    region: 'Busan'
};

export const mockCurriculum = [
    {
        id: 'ch1',
        title: '1단원: 인공지능의 이해',
        typing_repetitions: 2,
        min_similarity: 0.93,
        typing_text: '인공지능은 컴퓨터 시스템이 인간의 지능적인 행동을 모방하도록 하는 컴퓨터 과학의 한 분야입니다.',
        questions: [
            {
                id: 'q1',
                type: 'multiple_choice',
                question_text: '다음 중 인공지능의 정의로 가장 적절한 것은?',
                options: ['컴퓨터의 연산 속도를 높이는 기술', '인간의 지능을 모방하는 시스템', '웹사이트를 디자인하는 도구', '메모리를 확장하는 방법'],
                answer: '인간의 지능을 모방하는 시스템',
                explanation: '인공지능은 인간의 학습, 추론, 지각 능력을 컴퓨터로 구현하는 기술입니다.'
            },
            {
                id: 'q2',
                type: 'subjective',
                question_text: '인공지능이 데이터를 통해 스스로 학습하는 기술을 무엇이라고 하나요?',
                answer: '머신러닝',
                explanation: '머신러닝은 데이터를 기반으로 패턴을 학습하는 인공지능의 핵심 분야입니다.'
            }
        ]
    }
];
