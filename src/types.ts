export type BuildId = 'build-01' | 'build-02' | 'build-03' | 'build-04' | 'build-05';

export type Language = 'en' | 'ko' | 'ja';

export interface BuildManualContent {
  objective: string;
  action: string;
  aiKey: string;
}

export interface BuildInfo {
  id: BuildId;
  title: string;
  description: string;
  color: string;
  manual: Record<Language, BuildManualContent>;
}

export const ATOMS = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC04',
  green: '#34A853',
  white: '#FFFFFF',
  gray: '#F8F9FA',
  dark: '#202124',
};

export const BUILDS: BuildInfo[] = [
  { 
    id: 'build-01', 
    title: 'Number Golf', 
    description: 'Physics & Gravity', 
    color: ATOMS.blue,
    manual: {
      en: {
        objective: "Physics Engine Experiment: Experience mass and gravity.",
        action: "Drag the black ball with your mouse to hit the blue number '7'. Each hit decreases the number. Reach 0 to continue.",
        aiKey: "Try adjusting gravity or ball restitution to change difficulty."
      },
      ko: {
        objective: "물리 엔진 실험: 숫자의 질량과 중력을 체험하세요.",
        action: "검은색 공을 마우스로 드래그하여 중앙의 파란색 숫자 '7'을 맞추세요. 충돌할 때마다 숫자가 줄어들며 0이 되면 다음 단계로 이동합니다.",
        aiKey: "중력 값이나 공의 탄성(Bounce)을 조절하여 난이도를 바꿔보세요."
      },
      ja: {
        objective: "物理エンジン実験：数字の質量と重力を体験してください。",
        action: "マウスで黒いボールをドラッグし、中央の青い数字「7」に当ててください。当たるたびに数字が減り、0になると次のステージへ進みます。",
        aiKey: "重力値やボールの弾力性を調整して難易度を変えてみてください。"
      }
    }
  },
  { 
    id: 'build-02', 
    title: 'Number Grid', 
    description: 'Logic & Sequences', 
    color: ATOMS.red,
    manual: {
      en: {
        objective: "Summation Logic Experiment: Find relationships between random numbers.",
        action: "The red number at the top is the target sum. Click numbers on the grid so their sum equals the target. Succeed 3 times.",
        aiKey: "Expand the grid size (3x3 -> 5x5) to create more complex puzzles."
      },
      ko: {
        objective: "합산 논리 실험: 무작위 숫자들 사이의 관계를 찾으세요.",
        action: "상단의 빨간색 숫자가 목표 합계입니다. 그리드에서 숫자를 클릭하여 합이 목표값과 정확히 일치하도록 만드세요. 총 3번 성공해야 합니다.",
        aiKey: "그리드의 크기(3x3 -> 5x5)를 키워 더 복잡한 퍼즐을 만들어보세요."
      },
      ja: {
        objective: "合算ロジック実験：ランダムな数字の間の関係を見つけてください。",
        action: "上部の赤い数字が目標の合計値です。グリッドの数字をクリックして、合計が目標値と一致するようにしてください。合計3回成功する必要があります。",
        aiKey: "グリッドサイズを大きくして、より複雑なパズルを作成してみてください。"
      }
    }
  },
  { 
    id: 'build-03', 
    title: 'Number Wheel', 
    description: 'Patterns & Cycles', 
    color: ATOMS.yellow,
    manual: {
      en: {
        objective: "Pattern Sync Experiment: Match the timing of rotating systems.",
        action: "Follow the 3-number sequence shown at the top. Click 'LOCK NUMBER' to stop the wheel at the correct number.",
        aiKey: "Increase rotation speed or make the sequence longer."
      },
      ko: {
        objective: "패턴 동기화 실험: 회전하는 시스템의 타이밍을 맞추세요.",
        action: "상단에 표시된 3개의 숫자 시퀀스를 순서대로 맞춰야 합니다. 휠이 돌아갈 때 'LOCK NUMBER' 버튼을 눌러 정확한 숫자에 멈추세요.",
        aiKey: "휠의 회전 속도를 올리거나 비밀번호 숫자를 더 길게 설정해보세요."
      },
      ja: {
        objective: "パターン同期実験：回転するシステムのタイミングを合わせてください。",
        action: "上部に表示された3つの数字のシーケンスを順番に合わせてください。ホイールが回転している時に「LOCK NUMBER」ボタンを押し、正確な数字で止めてください。",
        aiKey: "ホイールの回転速度を上げたり、パスワードを長く設定してみてください。"
      }
    }
  },
  { 
    id: 'build-04', 
    title: 'Voice Number', 
    description: 'Audio & Resonance', 
    color: ATOMS.green,
    manual: {
      en: {
        objective: "Voice Energy Experiment: Convert sound volume into data.",
        action: "Allow microphone access and make some noise! The central number grows based on your volume. Charge it to 100%.",
        aiKey: "Modify the sensor to respond only to specific frequencies (High/Low pitch)."
      },
      ko: {
        objective: "음성 에너지 실험: 소리의 크기를 데이터로 변환합니다.",
        action: "마이크 권한을 허용하고 소리를 내보세요. 당신의 목소리 크기(Volume)에 따라 중앙의 숫자가 충전됩니다. 100%까지 에너지를 채우세요.",
        aiKey: "특정 주파수(고음/저음)에만 반응하도록 센서를 개조해볼 수 있습니다."
      },
      ja: {
        objective: "音声エネルギー実験：音の大きさをデータに変換します。",
        action: "マイクの許可を与えて、音を出してください。あなたの声の大きさに応じて中央の数字がチャージされます。100%までエネルギーを満たしてください。",
        aiKey: "特定の周波奏（高音・低音）にのみ反応するようにセンサーを改造できます。"
      }
    }
  },
  { 
    id: 'build-05', 
    title: 'Stretch Number', 
    description: 'Fluidity & Form', 
    color: ATOMS.blue,
    manual: {
      en: {
        objective: "Fluid Interaction Experiment: Break and reconstruct fixed forms.",
        action: "Move your mouse to stretch and deform the number. Interact enough to generate the final lab report.",
        aiKey: "Ask AI to change colors or friction/stickiness level."
      },
      ko: {
        objective: "유체 상호작용 실험: 고정된 형태를 무너뜨리고 재구성하세요.",
        action: "마우스를 움직여 숫자의 형태를 자유롭게 늘리고 변형시키세요. 일정 시간 동안 충분히 상호작용하면 최종 리포트가 생성됩니다.",
        aiKey: "숫자의 색상이나 유체의 끈적임(Friction) 정도를 AI에게 요청해 바꿔보세요."
      },
      ja: {
        objective: "流体相互作用実験：固定された形を壊して再構成してください。",
        action: "マウスを動かして、数字の形を自由に伸ばしたり変形させたりしてください。一定時間相互作用すると、最終レポートが生成されます。",
        aiKey: "数字の色や流体の摩擦（粘り気）の程度をAIに変えてもらうよう頼んでみてください。"
      }
    }
  },
];
