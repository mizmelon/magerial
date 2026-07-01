/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Achievement {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string; // 例：「Water + Electricity」などの反応式やヒント
  description: string; // 科学的背景
  iconEmoji: string;
  x: number; // ツリー位置 X (相対px)
  y: number; // ツリー位置 Y (相対px)
  parentIds: string[]; // 親（上流）ノードのID（ツリーの接続線用）
  requiredSubstanceIds?: string[]; // 必要な物質（すべて発見で解除）
  requiredReactionIds?: string[]; // 必要なリアクション
  illustrationType: 
    | 'universe' 
    | 'star' 
    | 'planet' 
    | 'blackhole' 
    | 'electrolysis' 
    | 'primordial' 
    | 'chips' 
    | 'lava' 
    | 'metal' 
    | 'ferment' 
    | 'plastic' 
    | 'ai' 
    | 'ufo' 
    | 'dynamite' 
    | 'glass' 
    | 'fusion'
    | 'source';
}

export const ACHIEVEMENTS: Achievement[] = [
  // --- LEVEL 0 (THE ULTIMATE GOAL) ---
  {
    id: 'ach_universe',
    title: '宇宙の創世',
    titleEn: 'Cosmic Genesis',
    subtitle: 'Black Hole + Star / Planet + Life',
    description: '時空、エネルギー、すべての物質が調和し、自己認識する究極のシステム。ビッグバンの再誕によって新宇宙が誕生しました。',
    iconEmoji: '🌌',
    x: 450,
    y: 60,
    parentIds: [],
    requiredSubstanceIds: ['universe'],
    illustrationType: 'universe',
  },

  // --- LEVEL 1 (COSMIC PILLARS) ---
  {
    id: 'ach_star',
    title: '恒星の点火',
    titleEn: 'Stellar Ignition',
    subtitle: 'Hydrogen + Life',
    description: '自らの巨大な重力で水素を圧縮し、超高圧の熱核融合を開始。暗黒の宇宙に最初の光と、全ての重元素を創り出す炉が灯りました。',
    iconEmoji: '⭐',
    x: 200,
    y: 200,
    parentIds: ['ach_universe'],
    requiredSubstanceIds: ['star'],
    illustrationType: 'star',
  },
  {
    id: 'ach_planet',
    title: '惑星の形成',
    titleEn: 'Planetary Accretion',
    subtitle: 'Soil + Star',
    description: '恒星の周囲に漂う岩石や塵が衝突し、引力によって一体化。美しい陸地、海、そして生命を育みうる大気を持つ惑星が形成されました。',
    iconEmoji: '🪐',
    x: 450,
    y: 200,
    parentIds: ['ach_universe'],
    requiredSubstanceIds: ['planet'],
    illustrationType: 'planet',
  },
  {
    id: 'ach_life',
    title: '生命の覚醒',
    titleEn: 'Awakening of Life',
    subtitle: 'Bacteria + Protein',
    description: '単細胞の深淵から進化し、遺伝情報を自律的に複製、周囲のエネルギーを代謝する奇跡的な動的秩序「生命（Life）」が覚醒しました。',
    iconEmoji: '🌱',
    x: 700,
    y: 200,
    parentIds: ['ach_universe'],
    requiredSubstanceIds: ['life'],
    illustrationType: 'primordial',
  },

  // --- LEVEL 2 (ADVANCED PATHWAYS) ---
  {
    id: 'ach_black_hole',
    title: '超重力特異点',
    titleEn: 'Gravitational Singularity',
    subtitle: 'Star + Obsidian',
    description: '恒星の死によって時空が無限に歪み、光さえも脱出できないブラックホールが誕生。宇宙の終着点であり、物理法則が崩壊する特異点です。',
    iconEmoji: '🕳️',
    x: 100,
    y: 350,
    parentIds: ['ach_star'],
    requiredSubstanceIds: ['black_hole'],
    illustrationType: 'blackhole',
  },
  {
    id: 'ach_energy',
    title: '無限プラズマ',
    titleEn: 'Infinite Plasma',
    subtitle: 'Pure Energy',
    description: '物理的な質量を極限の電磁場または核融合により凝縮し、物質の根源となる純粋な超エネルギーを取り出すことに成功しました。',
    iconEmoji: '⚡',
    x: 300,
    y: 350,
    parentIds: ['ach_star'],
    requiredSubstanceIds: ['energy'],
    illustrationType: 'fusion',
  },
  {
    id: 'ach_lava',
    title: '深淵の溶岩流',
    titleEn: 'Deep Volcanism',
    subtitle: 'Stone + Fire',
    description: 'マントル深くの超高温により岩石が完全に融解し、灼熱の溶岩（マグマ）が噴出。ダイナミックな地殻変動と大地の再生をもたらします。',
    iconEmoji: '🌋',
    x: 400,
    y: 350,
    parentIds: ['ach_planet'],
    requiredSubstanceIds: ['lava'],
    illustrationType: 'lava',
  },
  {
    id: 'ach_metal',
    title: '金属の精錬',
    titleEn: 'Metallurgical Smelting',
    subtitle: 'Stone + Electricity / Clay + Fire',
    description: '岩石鉱物（石）を電気または高温窯で熱し、酸素を取り除いて純粋な金属（Metal）を抽出。道具と重工業を始動させる文明の礎です。',
    iconEmoji: '🛠️',
    x: 520,
    y: 350,
    parentIds: ['ach_planet'],
    requiredSubstanceIds: ['metal'],
    illustrationType: 'metal',
  },
  {
    id: 'ach_semiconductor',
    title: '半導体革命',
    titleEn: 'Silicon Revolution',
    subtitle: 'Silicon + Electricity',
    description: '高純度に精製されたケイ素に、微細な電気経路を構築。電気をせき止めたり通したりする制御力を得て、現代のデジタル演算能力の核となりました。',
    iconEmoji: '💾',
    x: 650,
    y: 350,
    parentIds: ['ach_life'],
    requiredSubstanceIds: ['semiconductor'],
    illustrationType: 'chips',
  },
  {
    id: 'ach_yeast',
    title: '大いなる発酵',
    titleEn: 'Great Fermentation',
    subtitle: 'Plant + Soil -> Yeast',
    description: '大地の酵母（Yeast）が糖分を分解し、文明最古の化学プロセス「発酵」によって揮発性アルコールや生命有機物を生み出しました。',
    iconEmoji: '🍺',
    x: 800,
    y: 350,
    parentIds: ['ach_life'],
    requiredSubstanceIds: ['yeast'],
    illustrationType: 'ferment',
  },

  // --- LEVEL 3 (SCIENCE REACTIONS) ---
  {
    id: 'ach_electrolysis',
    title: '水の電気分解',
    titleEn: 'Electrolysis of Water',
    subtitle: 'Water + Electricity',
    description: '水分子（H₂O）に電流を流すことで強制的に結合を遮断し、高純度の酸素（Oxygen）と最軽量の燃料である水素（Hydrogen）を分離・抽出しました。',
    iconEmoji: '🧪',
    x: 180,
    y: 500,
    parentIds: ['ach_black_hole', 'ach_energy'],
    requiredReactionIds: ['water_electricity'],
    illustrationType: 'electrolysis',
  },
  {
    id: 'ach_glass',
    title: '砂土からのガラス',
    titleEn: 'Vitreous Fusing',
    subtitle: 'Soil + Fire',
    description: '大地の土や砂に含まれる二酸化ケイ素を熱し、分子構造を非晶質へと急冷硬化。光を完全に透過する透き通ったガラスを創り出しました。',
    iconEmoji: '🔍',
    x: 320,
    y: 500,
    parentIds: ['ach_semiconductor'],
    requiredSubstanceIds: ['glass'],
    illustrationType: 'glass',
  },
  {
    id: 'ach_plastic',
    title: 'プラスチック合成',
    titleEn: 'Plastic Polymerization',
    subtitle: 'Hydrocarbon + Acid',
    description: '原油由来の炭化水素を、酸などの触媒により強力に分子重合。軽量かつ極めて頑丈で、自然分解されない不滅の人工新素材を生み出しました。',
    iconEmoji: '📦',
    x: 580,
    y: 500,
    parentIds: ['ach_semiconductor'],
    requiredSubstanceIds: ['plastic'],
    illustrationType: 'plastic',
  },
  {
    id: 'ach_dynamite',
    title: 'ニトロ爆薬の安定',
    titleEn: 'Stabilizing Dynamite',
    subtitle: 'Hydrocarbon + Acid -> Nitroglycerin/Clay',
    description: '極めて不安定で危険な爆発性炭化水素を粘土に吸着させ、安全に制御可能で強烈な岩石破砕力を備えた近代爆薬「ダイナマイト」を完成させました。',
    iconEmoji: '🧨',
    x: 450,
    y: 500,
    parentIds: ['ach_metal'],
    requiredSubstanceIds: ['dynamite'],
    illustrationType: 'dynamite',
  },
  {
    id: 'ach_ai',
    title: '人工知能の覚醒',
    titleEn: 'Artificial Mind',
    subtitle: 'Semiconductor + Electricity',
    description: '微細なトランジスタ（半導体）を無数に組み合わせ、電気的論理ゲートによる自動演算、学習、推論を行えるデジタル精神「AI」を覚醒させました。',
    iconEmoji: '🧠',
    x: 720,
    y: 500,
    parentIds: ['ach_semiconductor'],
    requiredSubstanceIds: ['ai'],
    illustrationType: 'ai',
  },
  {
    id: 'ach_ufo',
    title: '異星文明の来訪',
    titleEn: 'Alien Visitation',
    subtitle: 'Planet + Pure Energy',
    description: '別の惑星の高度な知的生命体が、高次元の物質・反物質プラズマを制御して銀河を渡る超技術飛行円盤「UFO」を出現させました。',
    iconEmoji: '🛸',
    x: 850,
    y: 500,
    parentIds: ['ach_energy', 'ach_planet'],
    requiredSubstanceIds: ['ufo'],
    illustrationType: 'ufo',
  },

  // --- LEVEL 4 (ROOT SOURCES) ---
  {
    id: 'ach_source_water',
    title: '四大元素: 水',
    titleEn: 'Source of Water',
    subtitle: 'H₂O Primitive Liquid',
    description: '宇宙で最も普遍的で優れた溶媒であり、生命細胞の水分循環、および全ての化学代謝のプラットフォームとなる最も美しい液体。',
    iconEmoji: '💧',
    x: 220,
    y: 650,
    parentIds: ['ach_electrolysis'],
    requiredSubstanceIds: ['water'],
    illustrationType: 'source',
  },
  {
    id: 'ach_source_fire',
    title: '四大元素: 火',
    titleEn: 'Source of Fire',
    subtitle: 'Oxidation Energy',
    description: '激しい熱と光を放つ酸化反応。物質の状態を強制的に相転移させ（氷から水、水から蒸気、石から溶岩）、化学反応を加速させる物理力。',
    iconEmoji: '🔥',
    x: 370,
    y: 650,
    parentIds: ['ach_glass'],
    requiredSubstanceIds: ['fire'],
    illustrationType: 'source',
  },
  {
    id: 'ach_source_soil',
    title: '四大元素: 土',
    titleEn: 'Source of Soil',
    subtitle: 'Organic Ground',
    description: '風化した無機鉱物と分解された生命の有機物が絶妙に堆積した、生命を物質的に育み、地球規模の物質循環を支える豊穣の大地。',
    iconEmoji: '🟫',
    x: 520,
    y: 650,
    parentIds: ['ach_glass'],
    requiredSubstanceIds: ['soil'],
    illustrationType: 'source',
  },
  {
    id: 'ach_source_stone',
    title: '四大元素: 石',
    titleEn: 'Source of Stone',
    subtitle: 'Mineral Crust',
    description: '強固なイオン結合や共有結合で結ばれた硬質な地球地殻のコア。古代の道具から溶鉱炉の耐火材まで、文明の剛性パーツとなるもの。',
    iconEmoji: '🪨',
    x: 670,
    y: 650,
    parentIds: ['ach_glass'],
    requiredSubstanceIds: ['stone'],
    illustrationType: 'source',
  },
  {
    id: 'ach_source_electricity',
    title: '未来を拓く稲妻',
    titleEn: 'Raging Lightning',
    subtitle: 'Electron Flow',
    description: '電子の空間移動によって発生する最も使いやすく強力な物理エネルギー。結合の電解分解や、現代シリコン脳の微弱信号の搬送波となります。',
    iconEmoji: '⚡',
    x: 820,
    y: 650,
    parentIds: ['ach_electrolysis'],
    requiredSubstanceIds: ['electricity'],
    illustrationType: 'source',
  }
];
