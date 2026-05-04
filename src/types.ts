export type BuildId = 
  | 'build-01' | 'build-02' | 'build-03' | 'build-04' | 'build-05'
  | 'build-06' | 'build-07' | 'build-08' | 'build-09' | 'build-10';

export type Language = 'en' | 'ko' | 'ja';

export interface BuildManualContent {
  objective: string;
  action: string;
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
  purple: '#A142F4',
  cyan: '#24C1E0',
  orange: '#E67C19',
  pink: '#F06292',
  white: '#FFFFFF',
  gray: '#F8F9FA',
  dark: '#202124',
};

export const BUILDS: BuildInfo[] = [
  { 
    id: 'build-01', 
    title: 'Reaction Velocity', 
    description: 'Reaction Speed Test', 
    color: ATOMS.blue,
    manual: {
      en: {
        objective: "Digital Reflex Experiment: Measure how fast you can respond to physical stimuli.",
        action: "Drag the black ball to hit the blue target '7' repeatedly. Reach 0 to complete.",
      },
      ko: {
        objective: "반사 신경 실험: 물리적 자극에 얼마나 빨리 반응하는지 측정합니다.",
        action: "검은색 공을 마우스로 드래그하여 중앙의 파란색 공을 7번 이상 충돌시키세요. 충돌할 때마다 숫자가 줄어들며 0이 되면 다음 단계로 이동합니다.",
      },
      ja: {
        objective: "デジタル反射神経実験：物理的刺激にどれだけ速く反応できるかを測定します。",
        action: "黒いボールをドラッグして、中央の青いターゲット「7」に繰り返し当ててください。0になると完了です。",
      }
    }
  },
  { 
    id: 'build-02', 
    title: 'Working Memory', 
    description: 'Information Processing Speed', 
    color: ATOMS.red,
    manual: {
      en: {
        objective: "Memory Load Experiment: Test your ability to store and process temporary information.",
        action: "Sum up grid numbers to match the target. Do this 3 times quickly.",
      },
      ko: {
        objective: "기억 부하 실험: 일시적인 정보를 저장하고 처리하는 능력을 테스트합니다.",
        action: "그리드의 숫자들을 2~3개 선택하여 합산된 숫자가 목표 숫자와 일치하게 만드세요. 총 3번 성공해야 완료됩니다.",
      },
      ja: {
        objective: "記憶負荷実験：一時的な情報を保存し、処理する能力をテストします。",
        action: "グリッドの数字を2〜3個合算して目標値と一致させてください。これを3回素早く繰り返してください。",
      }
    }
  },
  { 
    id: 'build-03', 
    title: 'Impulse Control', 
    description: 'Timing & Rhythm Sensitivity', 
    color: ATOMS.yellow,
    manual: {
      en: {
        objective: "Inhibition Experiment: Control your timing to match perfectly with rotating cycles.",
        action: "Match the 3-number sequence. Stop the wheel exactly on the target number.",
      },
      ko: {
        objective: "억제 제어 실험: 회전하는 주기에 맞춰 완벽하게 타이밍을 조절하세요.",
        action: "3자리 숫자 시퀀스를 맞추세요. 회전하는 휠을 정확히 해당 숫자에서 멈춰야 합니다.",
      },
      ja: {
        objective: "抑制制御実験：回転する周期に合わせて完璧にタイミングを調節してください。",
        action: "3桁の数字シーケンスを合わせてください。回転するホイールを正確に該当する数字で止める必要があります。",
      }
    }
  },
  { 
    id: 'build-04', 
    title: 'Breath Stability', 
    description: 'Vocal Energy Control', 
    color: ATOMS.green,
    manual: {
      en: {
        objective: "Energy Consistency Experiment: Maintain a steady vocal output to measure breath control.",
        action: "Keep making sound to charge the number to 100%. Stability is key.",
      },
      ko: {
        objective: "에너지 일관성 실험: 일정한 목소리 출력을 유지하여 호흡 조절 능력을 측정합니다.",
        action: "목소리를 계속 내어 숫자를 100%까지 충전하세요. 안정적인 일관성이 중요합니다.",
      },
      ja: {
        objective: "エネルギー一貫性実験：一定の音声出力を維持して呼吸調節能力を測定します。",
        action: "声を出し続けて数字を100%までチャージしてください。安定した一貫性が重要です。",
      }
    }
  },
  { 
    id: 'build-05', 
    title: 'Fine Motor Skills', 
    description: 'Precision Control & Flow', 
    color: ATOMS.cyan,
    manual: {
      en: {
        objective: "Precision Interaction Experiment: Measure the delicacy of your mouse movements.",
        action: "Trace the sequence of dots precisely without touching the edges. Steady hand is required.",
      },
      ko: {
        objective: "정밀 상호작용 실험: 마우스 움직임의 섬세함과 정교함을 측정합니다.",
        action: "표시되는 원들을 순서대로 정교하게 따라가세요. 선을 벗어나지 않는 것이 중요합니다.",
      },
      ja: {
        objective: "精密相互作用実験：マウスの動きの繊細さと精巧さを測定します。",
        action: "表示されるドットを順番に正確にたどってください。線を外れないことが重要です。",
      }
    }
  },
  {
    id: 'build-06',
    title: 'Visual Perception',
    description: 'Color Nuance Detection',
    color: ATOMS.purple,
    manual: {
      en: {
        objective: "Nuance Detection Experiment: Find the subtle difference in color shades.",
        action: "Find the one number with a slightly different color among identical ones.",
      },
      ko: {
        objective: "뉘앙스 감지 실험: 색상 그림자의 미세한 차이를 찾아내세요.",
        action: "수많은 숫자 중 미세하게 다른 색상을 띄고 있는 단 하나의 숫자를 클릭하세요.",
      },
      ja: {
        objective: "ニュアンス検知実験：色のわずかな違いを見つけ出してください。",
        action: "たくさんの数字の中から、わずかに色が異なる一つだけの数字をクリックしてください。",
      }
    }
  },
  {
    id: 'build-07',
    title: 'Peripheral Vision',
    description: 'Field of View Test',
    color: ATOMS.orange,
    manual: {
      en: {
        objective: "Peripheral Awareness Experiment: Detect changes in your side vision.",
        action: "Look at the center. Identify numbers appearing momentarily at the edges.",
      },
      ko: {
        objective: "주변 인식 실험: 시야의 가장자리에서 일어나는 변화를 감지합니다.",
        action: "중앙을 바라보는 상태에서, 가장자리에 잠깐 나타났다 사라지는 숫자를 인식하세요.",
      },
      ja: {
        objective: "周辺認識実験：視界の端で起こる変化を感知します。",
        action: "中央を見つめたまま、端に一瞬現れて消える数字を認識してください。",
      }
    }
  },
  {
    id: 'build-08',
    title: 'Cognitive Interference',
    description: 'Stroop Effect & Inhibition',
    color: ATOMS.red,
    manual: {
      en: {
        objective: "Conflict Resolution Experiment: Suppress your instinctual reaction to word meaning.",
        action: "Click the button matching the 'COLOR' of the text, not the text itself.",
      },
      ko: {
        objective: "갈등 해결 실험: 단어의 의미에 대한 본능적 반응을 억제하세요.",
        action: "글자의 의미가 아닌, 글자가 칠해진 '색상'에 해당하는 버튼을 누르세요.",
      },
      ja: {
        objective: "葛藤解決実験：単語の意味に対する本能的な反応を抑制してください。",
        action: "文字の意味ではなく、文字が塗られた「色」に該当するボタンを押してください。",
      }
    }
  },
  {
    id: 'build-09',
    title: 'Divided Attention',
    description: 'Multitasking Capacity',
    color: ATOMS.pink,
    manual: {
      en: {
        objective: "Resource Allocation Experiment: Manage two tasks simultaneously.",
        action: "Balance the number at the center while clicking targets appearing around.",
      },
      ko: {
        objective: "자원 배분 실험: 두 가지 작업을 동시에 관리하세요.",
        action: "중앙의 숫자가 떨어지지 않게 중심을 잡으면서 주변의 타겟을 클릭하세요.",
      },
      ja: {
        objective: "リソース配分実験：2つのタスクを同時に管理してください。",
        action: "中央の数字が落ちないようにバランスを取りながら、周りのターゲットをクリックしてください。",
      }
    }
  },
  {
    id: 'build-10',
    title: 'Spatial Memory',
    description: 'Sequence & Space Retrieval',
    color: ATOMS.green,
    manual: {
      en: {
        objective: "Spatial Retrieval Experiment: Remember and reverse geometric sequences.",
        action: "Observe the blinking sequence and click them in REVERSE order.",
      },
      ko: {
        objective: "공간 인출 실험: 기하학적 시퀀스를 기억하고 역순으로 되돌립니다.",
        action: "숫자들이 깜빡이는 순서를 기억한 후, 역순으로 클릭하세요.",
      },
      ja: {
        objective: "空間想起実験：幾何学的なシーケンスを記憶し、逆順に再現します。",
        action: "数字が点滅する順番を記憶した後、逆順にクリックしてください。",
      }
    }
  },
];
