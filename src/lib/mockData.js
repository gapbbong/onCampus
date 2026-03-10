export const mockSchoolInfo = {
    school_name: '부산정보기술고등학교',
    student_id_format: '5',
    subject: '빅데이터 엑셀',
    region: 'Busan'
};

export const mockCurriculum = [
    {
        id: 'bigdata_1',
        title: '1. 빅데이터: 이해, 역할과 실제, 분석',
        category: 'Ⅰ. 빅데이터와 4차 산업혁명',
        typing_repetitions: 2,
        min_similarity: 0.93,
        material_url: 'https://notebooklm.google.com/notebook/32e06827-78d6-495d-8531-d6778716d7a7?artifactId=36770b87-a59a-46fc-bd63-1cb209c707ba',
        typing_text: `빅데이터는 단순히 양이 많은 데이터가 아니라 기존 방식으로 처리하기 힘든 거대한 데이터 집합을 의미합니다. 5V 특징인 방대한 규모(Volume), 빠른 속도(Velocity), 다양한 형태(Variety), 정확성(Veracity), 가치(Value)가 조화를 이룰 때 비로소 강력한 힘을 발휘합니다.
        
데이터 분석 기술로는 회귀 분석, 텍스트 마이닝, 오피니언 마이닝, 소셜 네트워크 분석 등이 있으며, 이를 활용해 서울시 상권 분석이나 우버의 실시간 배차 관리 등 우리 실생활에 유용한 가치를 만들어냅니다.`,
        questions: [
            { id: 'q1', type: 'multiple_choice', question_text: '빅데이터의 특징 5V 중 "데이터의 정확성과 신뢰도"를 의미하는 것은?', options: ['Volume', 'Velocity', 'Variety', 'Veracity', 'Value'], answer: 'Veracity', explanation: 'Veracity는 데이터의 품질과 신뢰도를 의미합니다.' }
        ]
    },
    {
        id: 'bigdata_2',
        title: '2. 4차 산업혁명: 이해, 미래 사회',
        category: 'Ⅰ. 빅데이터와 4차 산업혁명',
        typing_repetitions: 2,
        min_similarity: 0.93,
        material_url: 'https://notebooklm.google.com/notebook/32e06827-78d6-495d-8531-d6778716d7a7?artifactId=9a44755c-1b44-467c-b5e8-36fa0fc9d25b',
        typing_text: `4차 산업혁명은 인공지능, 빅데이터, 사물인터넷(IoT) 등 첨단 정보통신기술이 경제, 사회 전반에 융합되어 혁신적인 변화를 일으키는 차세대 산업혁명입니다. 초연결, 초지능, 초융합을 주요 특징으로 합니다.`,
        questions: [{ id: 'q1', type: 'multiple_choice', question_text: '4차 산업혁명의 주요 특징 3초(超)가 아닌 것은?', options: ['초연결', '초지능', '초속도', '초융합'], answer: '초속도', explanation: '3초는 초연결, 초지능, 초융합입니다.' }]
    },
    {
        id: 'excel_1',
        title: '1. 데이터 입력과 편집',
        category: 'Ⅱ. 엑셀의 기초',
        typing_repetitions: 2,
        min_similarity: 0.93,
        typing_text: `엑셀에서 데이터는 문자, 숫자, 날짜, 시간 등 다양한 형식으로 입력할 수 있습니다. 셀 포인터를 이동하며 데이터를 입력하고, 채우기 핸들을 사용하여 연속된 데이터를 쉽고 빠르게 입력할 수 있습니다.`,
        questions: [{ id: 'q1', type: 'multiple_choice', question_text: '엑셀에서 연속된 데이터를 자동으로 입력할 때 사용하는 기능은?', options: ['자동 필터', '채우기 핸들', '셀 병합', '피벗 테이블'], answer: '채우기 핸들', explanation: '채우기 핸들은 연속 데이터 입력에 매우 편리합니다.' }]
    },
    {
        id: 'excel_2',
        title: '2. 수식과 함수',
        category: 'Ⅱ. 엑셀의 기초',
        typing_repetitions: 2,
        min_similarity: 0.93,
        typing_text: `수식은 언제나 등호(=)로 시작하며 기본 사칙연산과 함수를 포함할 수 있습니다. 합계(SUM), 평균(AVERAGE), 조건부 합계(SUMIF) 등 다양한 함수를 통해 많은 양의 데이터를 효율적으로 계산하고 분석할 수 있습니다.`,
        questions: [{ id: 'q1', type: 'multiple_choice', question_text: '엑셀 수식을 입력할 때 가장 먼저 입력해야 하는 기호는?', options: ['+', '#', '=', '@'], answer: '=', explanation: '모든 수식은 등호(=)로 시작합니다.' }]
    },
    {
        id: 'excel_3',
        title: '3. 셀 서식과 차트',
        category: 'Ⅱ. 엑셀의 기초',
        typing_repetitions: 2,
        min_similarity: 0.93,
        typing_text: `셀 서식 기능을 이용하면 서체, 색상, 테두리 등을 설정해 문서를 보기 좋게 꾸밀 수 있습니다. 또한 차트를 활용하면 복잡한 데이터 사이의 관계나 변화의 흐름을 시각적으로 한눈에 알아보기 쉽게 표현할 수 있습니다.`,
        questions: []
    },
    {
        id: 'excel_4',
        title: '4. 데이터 수집 및 분석',
        category: 'Ⅱ. 엑셀의 기초',
        typing_repetitions: 2,
        min_similarity: 0.93,
        typing_text: `피벗 테이블은 방대한 양의 데이터를 요약하고 분석하는 데 최적화된 도구입니다. 행, 열, 값 영역에 필드를 배치하여 데이터를 다양한 관점에서 분석할 수 있으며, 슬라이서를 이용해 손쉽게 필터링할 수 있습니다.`,
        questions: []
    },
    {
        id: 'excel_5',
        title: '5. 매크로와 양식 컨트롤',
        category: 'Ⅱ. 엑셀의 기초',
        typing_repetitions: 2,
        min_similarity: 0.93,
        typing_text: `매크로는 반복되는 복잡한 작업 과정을 기록해 두었다가 필요할 때 한 번에 실행하는 기능입니다. 여기에 버튼과 같은 양식 컨트롤을 연결하면 사용자가 더욱 편리하게 기능을 실행할 수 있는 자동화된 문서를 만들 수 있습니다.`,
        questions: []
    }
];
