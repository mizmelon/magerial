/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Substance, Reaction } from '../types';

export const SUBSTANCES: Substance[] = [
  // --- INITIAL UNLOCKED SUBSTANCES ---
  {
    id: 'water',
    nameEn: 'Water',
    nameJa: '水',
    color: '#3b82f6', // bright blue
    state: 'liquid',
    description: '水素と酸素が結びついた、地球上の生命に最も不可欠な液体。化学式は H₂O。様々な物質を溶かす性質があります。',
    unlockedAtStart: true,
    era: 'primitive',
  },
  {
    id: 'fire',
    nameEn: 'Fire',
    nameJa: '火',
    color: '#ef4444', // vibrant red
    state: 'transient',
    description: '熱と光を放つ急激な酸化反応（燃焼）。周囲の温度を極限まで上昇させ、物質の状態変化や反応を加速させます。',
    unlockedAtStart: true,
    era: 'primitive',
  },
  {
    id: 'soil',
    nameEn: 'Soil',
    nameJa: '土',
    color: '#78350f', // rich brown
    state: 'solid',
    description: '岩石が風化してできた無機物と、生物の死骸が分解した有機物の混合物。植物の成長の基盤となり、生命を育みます。',
    unlockedAtStart: true,
    era: 'primitive',
  },
  {
    id: 'stone',
    nameEn: 'Stone',
    nameJa: '石',
    color: '#6b7280', // gray
    state: 'solid',
    description: '地殻を構成する固い鉱物の集合体。高い耐熱性と耐久性を持ち、古くから道具や建築、金属精錬の原料として使われました。',
    unlockedAtStart: true,
    era: 'primitive',
  },
  {
    id: 'gravel',
    nameEn: 'Gravel',
    nameJa: '砂利',
    color: '#8b8c8f', // textured gray-slate
    state: 'solid',
    description: '石を連打して細かく砕いた小さな岩石の破片。土木建築の基礎や舗装、ろ過材として幅広く使用されます。',
    unlockedAtStart: false,
    era: 'primitive',
  },
  {
    id: 'electricity',
    nameEn: 'Electricity',
    nameJa: '電気',
    color: '#fbbf24', // golden yellow
    state: 'transient',
    description: '電子の移動によって生じるエネルギーの形態。物質の化学結合を強制的に切断（電気分解）したり、電子回路を活性化します。',
    unlockedAtStart: false,
    era: 'industrial',
  },

  // --- SECOND GENERATION (DISCOVERED) ---
  {
    id: 'steam',
    nameEn: 'Steam',
    nameJa: '水蒸気',
    color: '#93c5fd', // soft light blue
    state: 'gas',
    description: '水が熱エネルギーを得て気化した状態。上昇して空気中を漂い、熱せられた状態では蒸気機関の原動力や熱エネルギーとして人類の機械化を呼び込みました。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'clay',
    nameEn: 'Clay',
    nameJa: '粘土',
    color: '#b45309', // light brown clay
    state: 'solid',
    description: '非常に細かい鉱物粒子が水を含んで粘り気を持った土。熱を加えると硬化する性質があり、土器やレンガ、溶鉱炉など初期工業の材料になります。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'glass',
    nameEn: 'Glass',
    nameJa: 'ガラス',
    color: '#a5f3fc', // cyan transparent
    state: 'solid',
    description: 'ケイ酸塩などを主成分とする非晶質の硬い物質。光を透過し、耐食性に優れ、理化学実験のフラスコやレンズ、光ファイバーなど科学革命の基盤となりました。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'lava',
    nameEn: 'Lava',
    nameJa: '溶岩',
    color: '#f97316', // glowing orange
    state: 'liquid',
    description: '岩石が地下深部の熱で融解し、液状になったマグマが地表に噴出したもの。超高温で、冷えると硬い岩石に戻ります。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'obsidian',
    nameEn: 'Obsidian',
    nameJa: '黒曜石',
    color: '#4b5563', // dark volcanic glass
    state: 'solid',
    description: '溶岩が急激に冷却されてできた、天然のガラス質の火山岩。鋭く割れる性質があり、古代文明において最高の刃物や道具として利用されました。',
    unlockedAtStart: false,
    era: 'ancient',
  },

  // --- SCIENTIFIC ELEMENTS ---
  {
    id: 'oxygen',
    nameEn: 'Oxygen',
    nameJa: '酸素',
    color: '#cbd5e1', // pale slate blue
    state: 'gas',
    description: '宇宙で3番目に豊富な元素。化学式は O₂。非常に酸化力が強く、呼吸による生命エネルギー生産や、石炭・燃料の激しい燃焼工業に不可欠です。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'hydrogen',
    nameEn: 'Hydrogen',
    nameJa: '水素',
    color: '#f472b6', // pink-purple light gas
    state: 'gas',
    description: '宇宙で最も軽くて、最も多く存在する元素。化学式は H₂。酸素と激しく反応（燃焼・爆発）して膨大なエネルギーを放出し、クリーンな工業燃料となります。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'carbon_dioxide',
    nameEn: 'Carbon Dioxide',
    nameJa: '二酸化炭素',
    color: '#94a3b8', // dark gray-blue gas
    state: 'gas',
    description: '炭素原子1個と酸素原子2個が結合した気体。化学式は CO₂。産業革命の蒸気機関や工場から大量に排出され、現代の気候変動問題にも深く関わります。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'metal',
    nameEn: 'Metal',
    nameJa: '金属',
    color: '#9ca3af', // metallic silver
    state: 'solid',
    description: '熱や電気を非常に良く通し、特有の光沢を持つ物質。高い機械的強度を持ち、製鉄や建築、機械の製造など重工業の屋台骨となります。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'silicon',
    nameEn: 'Silicon',
    nameJa: 'ケイ素',
    color: '#818cf8', // purplish blue metallic
    state: 'solid',
    description: '地殻中に極めて多く存在する金属元素。化学式は Si。高純度で精製されることで、半導体素子や集積回路などエレクトロニクス産業の土台となります。',
    unlockedAtStart: false,
    era: 'industrial',
  },

  // --- MODERN TECHNOLOGY ---
  {
    id: 'semiconductor',
    nameEn: 'Semiconductor',
    nameJa: '半導体',
    color: '#10b981', // green electronics
    state: 'solid',
    description: '電気を通す「導体」と通さない「絶縁体」の中間の性質を持つ、現代の知性の結晶。マイクロプロセッサやIT・AI産業の究極の核となる要素です。',
    unlockedAtStart: false,
    era: 'modern',
  },
  {
    id: 'magnet',
    nameEn: 'Magnet',
    nameJa: '磁石',
    color: '#ec4899', // bright pink-red
    state: 'solid',
    description: '周囲に磁場を作り、鉄などの強磁性体を引き寄せる物体。電気との相互作用により、発電機（タービン）や電気モーター、センサーなど電気・動力工業を爆発的に進化させました。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'carbon',
    nameEn: 'Carbon (Coal)',
    nameJa: '炭素・石炭',
    color: '#1e293b', // near black charcoal
    state: 'solid',
    description: '有機分子の骨格を成す元素であり、工業的には産業革命期に蒸気機関の燃料や、鉄を鋼にする「コークス（精錬炭）」として重工業社会を誕生させました。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'hydrocarbon',
    nameEn: 'Hydrocarbon',
    nameJa: '炭化水素・石油',
    color: '#b45309', // brownish amber oil
    state: 'liquid',
    description: '炭素と水素だけでできた化合物（石油など）。化学的エネルギー密度が極めて高く、現代の火力、内燃機関（自動車、航空機）、プラスチック合成工業を支えます。',
    unlockedAtStart: false,
    era: 'modern',
  },
  {
    id: 'yeast',
    nameEn: 'Yeast',
    nameJa: '酵母',
    color: '#fde047', // soft yellow powder
    state: 'solid',
    description: '糖を分解してアルコールと二酸化炭素を作る、単細胞の微小な真菌（生物）。発酵工学、バイオ産業の基礎となる微生物ツールです。',
    unlockedAtStart: false,
    era: 'modern',
  },

  // --- ORGANIC & LIFE ---
  {
    id: 'protein',
    nameEn: 'Protein',
    nameJa: 'タンパク質',
    color: '#fca5a5', // fleshy pink
    state: 'solid',
    description: '多数のアミノ酸が重合してできた、生体の細胞や組織を構成する最も重要な有機高分子。酵素として化学反応を触媒し、生命の自己組織化を可能にします。',
    unlockedAtStart: false,
    era: 'biotech',
  },
  {
    id: 'amino_acid',
    nameEn: 'Amino Acid',
    nameJa: 'アミノ酸',
    color: '#22d3ee', // bright cyan water-like
    state: 'liquid',
    description: 'タンパク質の基礎となる有機化合物。窒素、炭素、水素、酸素から構成され、このプールに電気が走ることで生命の最初の火花が散ります。',
    unlockedAtStart: false,
    era: 'biotech',
  },
  {
    id: 'cell',
    nameEn: 'Cell',
    nameJa: '細胞',
    color: '#4ade80', // bright neon green
    state: 'solid', // acts as living
    description: 'すべての生命体の構造的・機能的最小単位。周囲の物質やエネルギーを取り込んで代謝し、自己複製を繰り返す最初の生体構造。',
    unlockedAtStart: false,
    era: 'biotech',
  },
  {
    id: 'plant',
    nameEn: 'Plant',
    nameJa: '植物',
    color: '#15803d', // forest green
    state: 'solid',
    description: '太陽の光エネルギーと二酸化炭素から酸素と有機物（デンプン等）を創り出す、光合成を行う多細胞生物。地球に豊富な大気をもたらします。',
    unlockedAtStart: false,
    era: 'biotech',
  },
  {
    id: 'bacteria',
    nameEn: 'Bacteria',
    nameJa: '細菌',
    color: '#8b5cf6', // purple micro-organism
    state: 'solid',
    description: '地球上に最初に誕生したとされる、核を持たない極小の単細胞生物。物質循環の最終的な分解者であり、生命の多様性の基礎。',
    unlockedAtStart: false,
    era: 'biotech',
  },
  {
    id: 'life',
    nameEn: 'Life',
    nameJa: '生命',
    color: '#facc15', // shiny golden yellow
    state: 'solid',
    description: '自律的に動き、代謝し、環境に適応し、進化を遂げる驚異の現象。神のような知性を持ち、やがて地球の枠を超えて宇宙へ進出する可能性を秘めています。',
    unlockedAtStart: false,
    era: 'biotech',
  },

  // --- COSMIC & BEYOND ---
  {
    id: 'star',
    nameEn: 'Star',
    nameJa: '恒星',
    color: '#f97316', // intense orange star
    state: 'special',
    description: '自らの巨大な重力で水素を圧縮し、核融合反応によって輝く超巨大なガスの天体。宇宙に新しい重元素（炭素、酸素、鉄など）を供給します。',
    unlockedAtStart: false,
    era: 'cosmic',
  },
  {
    id: 'planet',
    nameEn: 'Planet',
    nameJa: '惑星',
    color: '#06b6d4', // cyan planet
    state: 'special',
    description: '恒星の周囲を公転する、自ら光らない巨大な天体。水、大気、大地が絶妙なバランスで配置されることで、生命を宿す母体となります。',
    unlockedAtStart: false,
    era: 'cosmic',
  },
  {
    id: 'black_hole',
    nameEn: 'Black Hole',
    nameJa: 'ブラックホール',
    color: '#030712', // deep dark near black
    state: 'special',
    description: '極限まで高密度になり、光さえも脱出できない強大な重力を持つ時空の領域。周囲の物質を吸い込み、強烈なエネルギーを放射します。',
    unlockedAtStart: false,
    era: 'cosmic',
  },
  {
    id: 'universe',
    nameEn: 'Universe',
    nameJa: '宇宙',
    color: '#a855f7', // cosmic purple animated
    state: 'special',
    description: '時間、空間、およびすべての物質とエネルギーを含む、究極 of 存在。生命の誕生を伴うことで、自らを認識する知性を得た大いなる調和の極み。',
    unlockedAtStart: false,
    era: 'cosmic',
  },

  // --- CIVILIZATION & ADVANCED SCIENCE (NEW) ---
  {
    id: 'sand',
    nameEn: 'Sand',
    nameJa: '砂',
    color: '#fef08a', // sandy yellow
    state: 'solid',
    description: '岩石や石が水や風の力で侵食され、極限まで細かくなった粒の集まり。ガラスの主原料や建築の骨材として重宝されます。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'bronze',
    nameEn: 'Bronze',
    nameJa: '青銅',
    color: '#ca8a04', // bronze gold/brown
    state: 'solid',
    description: '銅に錫を混ぜ合わせて作られた人類初の合金。強靭な道具や武器を可能にし、人類を青銅器時代へと導きました。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'acid',
    nameEn: 'Acid',
    nameJa: '酸',
    color: '#a3e635', // lime neon green
    state: 'liquid',
    description: '金属を腐食して水素を発生させたり、様々な化学反応を強力に活性化させる酸性液体。産業用化学品の代表格です。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'gunpowder',
    nameEn: 'Gunpowder',
    nameJa: '火薬',
    color: '#475569', // slate black charcoal
    state: 'solid',
    description: '炭素やその他の助燃物を調合して作られた、急激な火の勢いとガス圧を生み出す爆発性の黒色粉末。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'dynamite',
    nameEn: 'Dynamite',
    nameJa: 'ダイナマイト',
    color: '#ef4444', // dynamite red
    state: 'solid',
    description: 'ニトログリセリンなどを多孔質な粘土に吸着させた、安定かつ極めて破壊力の高い近代的な工業用爆薬。',
    unlockedAtStart: false,
    era: 'modern',
  },
  {
    id: 'computer',
    nameEn: 'Computer',
    nameJa: 'Computer',
    color: '#0284c7', // vibrant computer blue
    state: 'solid',
    description: '半導体素子と金属配線、電気信号を組み合わせ、文字通り毎秒億兆回もの演算を処理するデジタル情報機械。',
    unlockedAtStart: false,
    era: 'modern',
  },
  {
    id: 'laser',
    nameEn: 'Laser',
    nameJa: 'レーザー',
    color: '#f43f5e', // deep laser pink
    state: 'transient',
    description: '電気によって励起された光が、ガラスや半導体の中で増幅され、一直線に射出される超高エネルギー指向性ビーム。',
    unlockedAtStart: false,
    era: 'modern',
  },
  {
    id: 'virus',
    nameEn: 'Virus',
    nameJa: 'ウイルス',
    color: '#ec4899', // bright pink micro
    state: 'solid',
    description: '細胞とタンパク質のエンベロープだけで構成された極小の遺伝物質。宿主の細胞を利用してのみ自己複製が可能な境界線上の存在。',
    unlockedAtStart: false,
    era: 'biotech',
  },
  {
    id: 'algae',
    nameEn: 'Algae',
    nameJa: '藻類',
    color: '#10b981', // bright emerald green
    state: 'liquid',
    description: '水中で光合成を行う原始的な植物的生物群。酸素を放出し、食物連鎖とバイオマスの強固な土台となります。',
    unlockedAtStart: false,
    era: 'biotech',
  },
  {
    id: 'fossil',
    nameEn: 'Fossil',
    nameJa: '化石',
    color: '#78716c', // fossil stone gray
    state: 'solid',
    description: 'はるか数億年前に生きていた生命や植物の遺骸が土中で堆積し、鉱物質がしみ込んで硬い石へと変化した歴史の標本。',
    unlockedAtStart: false,
    era: 'biotech',
  },
  {
    id: 'ai',
    nameEn: 'AI',
    nameJa: '人工知能',
    color: '#8b5cf6', // electric cyber purple
    state: 'special',
    description: '半導体とプログラミングされた論理回路が統合され、自ら推論し学習を重ねることで人間をも凌駕しうるデジタルの精神。',
    unlockedAtStart: false,
    era: 'modern',
  },
  {
    id: 'gold',
    nameEn: 'Gold',
    nameJa: '金',
    color: '#eab308', // golden yellow glow
    state: 'solid',
    description: '超新星爆発や中性子星衝突という宇宙極限のエネルギーのみで錬成される、永遠に錆びることのない究極の気高い貴金属。',
    unlockedAtStart: false,
    era: 'cosmic',
  },
  {
    id: 'energy',
    nameEn: 'Energy',
    nameJa: '純粋エネルギー',
    color: '#38bdf8', // radiant plasma cyan
    state: 'transient',
    description: 'ブラックホールの巨大な重力や高電圧放電から凝縮される、すべての運動と物質存在の根源となる光り輝く物理エネルギー。',
    unlockedAtStart: false,
    era: 'cosmic',
  },
  {
    id: 'ufo',
    nameEn: 'UFO',
    nameJa: '未確認飛行物体',
    color: '#22d3ee', // high-tech cyan flying
    state: 'special',
    description: '他の惑星で覚醒した生命（宇宙人）が、恒星間航行のために物質と超エネルギーを制御して生み出した円盤型宇宙船。',
    unlockedAtStart: false,
    era: 'cosmic',
  },
  {
    id: 'diamond',
    nameEn: 'Diamond',
    nameJa: 'ダイヤモンド',
    color: '#f8fafc', // brilliant sparkling white
    state: 'solid',
    description: '純粋な炭素がマントルや宇宙空間の極限の熱と圧力により、強固な共有結合を成した、地球上で最高の硬度と光沢を誇る鉱物。',
    unlockedAtStart: false,
    era: 'cosmic',
  },
  {
    id: 'salt',
    nameEn: 'Salt',
    nameJa: '塩',
    color: '#e2e8f0', // clean white
    state: 'solid',
    description: '酸が岩石を溶解・中和する過程、あるいは海水の蒸発によって結晶化する無機塩類（塩化ナトリウム等）。調味料としてはもちろん、様々な化学合成プロセスの必須原材料です。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'ammonia',
    nameEn: 'Ammonia',
    nameJa: 'アンモニア',
    color: '#cbd5e1', // colorless pungent gas
    state: 'gas',
    description: '窒素原子1個と水素原子3個が結合した極めて刺激臭の強い気体。化学式は NH₃。土壌細菌の窒素固定から生み出され、近現代の化学肥料・化学工業の最重要コアとなります。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'fertilizer',
    nameEn: 'Fertilizer',
    nameJa: '化学肥料',
    color: '#f1f5f9', // gray-white powder
    state: 'solid',
    description: 'アンモニアの酸中和によって工業生産される無機肥料（窒素肥料など）。痩せた土地の肥沃度を劇的に引き上げ、農業生産を爆発させて何十億もの人類生命を維持します。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'alcohol',
    nameEn: 'Alcohol',
    nameJa: 'アルコール',
    color: '#cbd5e1', // volatile clear liquid
    state: 'liquid',
    description: '酵母による植物（糖分）の無酸素発酵によって生成される揮発性・可燃性の有機化合物（エタノール）。殺菌消毒剤や飲料、さらには各種有機化学合成の中間体となります。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'plastic',
    nameEn: 'Plastic',
    nameJa: 'プラスチック',
    color: '#e0f2fe', // translucent durable light blue
    state: 'solid',
    description: '石油精製から得られる炭化水素を酸などの触媒により重合・結合させた高分子物質。軽量で極めて耐久性が高く、任意の形状に加工可能で、現代文明の全インフラを覆いつくします。',
    unlockedAtStart: false,
    era: 'modern',
  },
  {
    id: 'ether',
    nameEn: 'Ether',
    nameJa: 'エーテル',
    color: '#bae6fd', // light volatile liquid
    state: 'liquid',
    description: 'アルコールと強酸の脱水反応によって得られる、極めて揮発性が高く可燃性の強い極性溶媒（ジエチルエーテル）。麻酔作用があり、近代の無痛手術の道を切り開きました。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'steel',
    nameEn: 'Steel',
    nameJa: '鋼鉄',
    color: '#475569', // dark strong metal slate
    state: 'solid',
    description: '鉄（金属）に適量の炭素を加えて強靭さを引き出した究極の合金。高い機械的強度と粘り強さを併せ持ち、超高層ビル、橋梁、鉄道、機械などあらゆる重工業の基石となります。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'rust',
    nameEn: 'Rust',
    nameJa: 'サビ',
    color: '#b45309', // brownish rust orange
    state: 'solid',
    description: '金属が酸素や水分と触れてゆっくりと酸化反応を起こし崩れていく酸化物（主に酸化鉄）。物性の劣化を招く一方で、化学の酸化プロセスを実証する代表的な自然現象です。',
    unlockedAtStart: false,
    era: 'primitive',
  },
  {
    id: 'helium',
    nameEn: 'Helium',
    nameJa: 'ヘリウム',
    color: '#fbcfe8', // soft pale pink glow
    state: 'gas',
    description: '恒星の核融合で生まれる宇宙で2番目に軽い希ガス。ヘリウム。極低温での冷却材や、風船に充填されて浮上する用途に使用されます。化学式は He。',
    unlockedAtStart: false,
    era: 'cosmic',
  },
  {
    id: 'lithium',
    nameEn: 'Lithium',
    nameJa: 'リチウム',
    color: '#e2e8f0', // light alkali metal
    state: 'solid',
    description: '最も密度の低いアルカリ金属元素。化学式は Li。高い電位を持ち、現代文明を支える高エネルギー密度二次電池（リチウムイオン電池）の主役です。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'beryllium',
    nameEn: 'Beryllium',
    nameJa: 'ベリリウム',
    color: '#94a3b8', // light grey-blue metal
    state: 'solid',
    description: '非常に硬く軽量で、融点が高いアルカリ土類金属。化学式は Be。毒性はあるものの、宇宙望遠鏡の主鏡や航空宇宙の極限耐熱構造部材に使用されます。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'boron',
    nameEn: 'Boron',
    nameJa: 'ホウ素',
    color: '#7c2d12', // dark brown metalloid
    state: 'solid',
    description: '金属と非金属の中間の性質を持つ半金属元素。化学式は B。非常に高強度で、特殊な耐熱ガラス（ホウケイ酸ガラス）や強力なホウ素中性子捕捉療法の医薬品原料として使用されます。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'nitrogen',
    nameEn: 'Nitrogen',
    nameJa: '窒素',
    color: '#a5f3fc', // inert gaseous light blue
    state: 'gas',
    description: '地球大気の約78%を占める最も身近な不活性ガス。化学式は N₂。アンモニア合成や急速冷却用の液体窒素、不活性雰囲気の維持に不可欠です。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'fluorine',
    nameEn: 'Fluorine',
    nameJa: 'フッ素',
    color: '#fef08a', // pale yellow-green gas
    state: 'gas',
    description: 'すべての元素の中で最も反応性と電気陰性度が高い、刺激臭のある淡黄色の有毒な気体。化学式は F₂。フッ素樹脂加工や半導体のウエハエッチングに用いられます。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'neon',
    nameEn: 'Neon',
    nameJa: 'ネオン',
    color: '#ff003c', // intense glowing red-neon
    state: 'gas',
    description: '高電圧による気体放電により、暗闇の中で極めて鮮やかな赤オレンジ色に自ら発光する不活性ガス。ネオン。化学式は Ne。広告灯（ネオンサイン）の起源です。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'sodium',
    nameEn: 'Sodium',
    nameJa: 'ナトリウム',
    color: '#64748b', // reactive grey metal
    state: 'solid',
    description: 'ナイフで切れるほど柔らかく、水と接触すると爆発的に反応して水素を放出するきわめて活性なアルカリ金属。化学式は Na。食塩や生体の神経伝達の主役です。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'chlorine',
    nameEn: 'Chlorine',
    nameJa: '塩素',
    color: '#bef264', // yellow-green toxic gas
    state: 'gas',
    description: '強力な酸化作用と毒性、特異な刺激臭を持つ黄緑色の気体元素。化学式は Cl₂。塩の構成要素であり、水道水の消毒、漂白剤、ポリ塩化ビニル樹脂の必須原料です。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'magnesium',
    nameEn: 'Magnesium',
    nameJa: 'マグネシウム',
    color: '#cbd5e1', // bright white metal
    state: 'solid',
    description: '空気中で加熱すると、強烈な白色の光を放って眩しく燃焼するアルカリ土類金属。化学式は Mg。実用金属の中で最軽量クラスで、スマホケースや航空機合金に使用されます。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'aluminum',
    nameEn: 'Aluminum',
    nameJa: 'アルミニウム',
    color: '#e2e8f0', // shiny lightweight silver
    state: 'solid',
    description: '地殻中に金属元素として最も豊富に存在する、軽くて耐食性に優れた金属。化学式は Al。一円硬貨から、ジュラルミンとして航空機やサッシなどの構造材まで社会を包みます。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'phosphorus',
    nameEn: 'Phosphorus',
    nameJa: 'リン',
    color: '#f97316', // orange-red powder
    state: 'solid',
    description: '暗所で淡い光を放ち、マッチの摩擦起火剤として利用される非金属元素。化学式は P。生物のDNA、エネルギー分子ATPの根幹を成し、農業用肥料としても極めて重要です。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'sulfur',
    nameEn: 'Sulfur',
    nameJa: '硫黄',
    color: '#eab308', // volcanic yellow
    state: 'solid',
    description: '火山地帯で結晶として産出する鮮やかな黄色の非金属元素。化学式は S。ゴムの加硫硬化や、最重要の工業酸である硫酸の主原料として近代産業の影の支配者です。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'argon',
    nameEn: 'Argon',
    nameJa: 'アルゴン',
    color: '#c084fc', // glow-violet argon gas
    state: 'gas',
    description: '地球大気中で窒素、酸素に次いで3番目に多く含まれる、無色無臭の不活性な希ガス。化学式は Ar。白熱電球の封入ガスや、酸化を防ぐアーク溶接のシールドガスに使われます。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'potassium',
    nameEn: 'Potassium',
    nameJa: 'カリウム',
    color: '#475569', // soft grey alkali metal
    state: 'solid',
    description: '水と瞬時に激しく発火反応する極めて活性なアルカリ金属元素。化学式は K。カリウム。灰から発見され、肥料の三要素の一つであり、生命の浸透圧調節を完全にコントロールします。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'calcium',
    nameEn: 'Calcium',
    nameJa: 'カルシウム',
    color: '#f1f5f9', // white-grey calcium metal
    state: 'solid',
    description: '骨や歯の主成分として生物の構造体を形成し、地殻中では石灰岩として巨大な山脈を成す重要な金属元素。化学式は Ca。生理作用のシグナル分子でもあります。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'titanium',
    nameEn: 'Titanium',
    nameJa: 'チタン',
    color: '#64748b', // steel-grey high strength metal
    state: 'solid',
    description: '鋼鉄と同等の強度を持ちながら質量は約半分、さらに海水にも酸にも全く侵されない最高の耐食性を誇る究極の実用金属。化学式は Ti。宇宙航空やインプラントの王。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'chromium',
    nameEn: 'Chromium',
    nameJa: 'クロム',
    color: '#cbd5e1', // mirror-like chrome silver
    state: 'solid',
    description: '非常に硬く、極めて美しい耐食性の銀色鏡面を持つ遷移金属。化学式は Cr。鉄と合金化することでステンレス鋼（錆びない鉄）を作り出し、あるいは装飾用の光沢メッキを成します。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'iron',
    nameEn: 'Iron',
    nameJa: '鉄',
    color: '#475569', // rust-grey iron
    state: 'solid',
    description: '地球の核および地殻を最も厚く構成し、人類の文明時代（鉄器時代）を物理的に切り開いた最重要の構造用重金属。化学式は Fe。磁性を持ち、溶鉱炉で大量生産されます。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'copper',
    nameEn: 'Copper',
    nameJa: '銅',
    color: '#ea580c', // copper red metal
    state: 'solid',
    description: '人類が歴史上最も古くから金属器（青銅など）として精錬し、現代では抜群の電気伝導度により、世界中の送電線や電子配線の血管となった赤金色の遷移金属。化学式は Cu。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'zinc',
    nameEn: 'Zinc',
    nameJa: '亜鉛',
    color: '#94a3b8', // bluish-grey zinc metal
    state: 'solid',
    description: '青銅器や真鍮（ブラス）の合金材、さらには鉄板の耐食メッキ（トタン）として幅広く活躍する青みを帯びた銀白色の金属。化学式は Zn。多くの酵素の活性中心を担います。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'silver',
    nameEn: 'Silver',
    nameJa: '銀',
    color: '#f8fafc', // brilliant metallic silver
    state: 'solid',
    description: '全金属中で最も高い電気伝導率、熱伝導率、そして最高レベルの可視光反射率を誇る、眩しく美しい貴金属。化学式は Ag。貨幣、宝飾、フィルム写真、鏡に愛用されます。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'platinum',
    nameEn: 'Platinum',
    nameJa: '白金',
    color: '#e2e8f0', // premium platinum white silver
    state: 'solid',
    description: '酸や熱、あらゆる化学攻撃に一切屈しない、金をも凌ぐ究極の化学的安定性と高融点を持つ白い貴金属（プラチナ）。化学式は Pt。排ガスを無害化する触媒の皇帝。',
    unlockedAtStart: false,
    era: 'industrial',
  },
  {
    id: 'mercury',
    nameEn: 'Mercury',
    nameJa: '水銀',
    color: '#94a3b8', // liquid metal mercury
    state: 'liquid',
    description: '金属でありながら融点がマイナス38度と極めて低く、常温で「液体」として存在する唯一の重金属。化学式は Hg。かつて温度計や金のアマルガム精錬、医薬品に使用されました。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'lead',
    nameEn: 'Lead',
    nameJa: '鉛',
    color: '#334155', // heavy dull grey lead
    state: 'solid',
    description: '非常に重く柔らかく、融点が低い青灰色の重金属。化学式は Pb。ウラン崩壊の最終安定形態であり、放射線を遮蔽する能力、蓄電池の電極や鉛筆（活字）の歴史を支えました。',
    unlockedAtStart: false,
    era: 'ancient',
  },
  {
    id: 'uranium',
    nameEn: 'Uranium',
    nameJa: 'ウラン',
    color: '#22c55e', // glowing neon green radioactive uranium
    state: 'solid',
    description: '自然界に存在する最も重く密度の高い元素であり、自発的に崩壊して莫大な原子力（熱量）を放出する放射性金属。化学式は U。原子爆弾や原子炉、核宇宙時代のコアです。',
    unlockedAtStart: false,
    era: 'cosmic',
  },
];

export const REACTIONS: Reaction[] = [
  // 1. Water + Fire -> Steam
  {
    id: 'water_fire',
    a: 'fire',
    b: 'water',
    products: ['steam'],
    description: '水が火の熱エネルギーを得て沸騰し、気体の水蒸気に変化します。',
  },
  // 2. Water + Soil -> Clay
  {
    id: 'water_soil',
    a: 'soil',
    b: 'water',
    products: ['clay'],
    description: '乾いた土に水が混ざり合い、粘着性と可塑性を持つ粘土が生まれます。',
  },
  // 3. Water + Electricity -> Oxygen & Hydrogen
  {
    id: 'water_electricity',
    a: 'electricity',
    b: 'water',
    products: ['oxygen', 'hydrogen'],
    description: '電気エネルギーにより水分子（H₂O）の強固な結合が切断され、酸素と水素に分解されます（電気分解）。',
  },
  // 4. Stone + Fire -> Lava
  {
    id: 'stone_fire',
    a: 'fire',
    b: 'stone',
    products: ['lava'],
    description: '固い岩石が火の超高温にさらされ、融解して液状の溶岩（マグマ）になります。',
  },
  // 5. Electricity + Stone -> Metal
  {
    id: 'electricity_stone',
    a: 'electricity',
    b: 'stone',
    products: ['metal'],
    description: '鉱石に強力な電流を流すことで金属元素が還元され、純度の高い有用な金属が得られます。',
  },
  // 6. Clay + Fire -> Brick
  {
    id: 'clay_fire',
    a: 'clay',
    b: 'fire',
    products: ['metal'], // Wait, brick or metal? Let's make clay + fire -> metal or wait, we can make structural element, but since we want to keep metal as the key scientific element, let's make it clay + fire -> glass, or Clay + Fire -> Metal (firing pottery is early metallurgic furnace). Let's do Clay + Fire -> Metal!
    description: '粘土を窯で高温で焼き固める、あるいは粘土中の金属分が還元され、硬質な素材や金属器の基礎が形成されます。',
  },
  // 7. Soil + Fire -> Glass
  {
    id: 'soil_fire',
    a: 'fire',
    b: 'soil',
    products: ['glass'],
    description: '砂土に含まれるケイ酸（二酸化ケイ素）が熱によって溶け、アモルファス状に固まって透き通るガラスになります。',
  },
  // 8. Electricity + Glass -> Silicon
  {
    id: 'electricity_glass',
    a: 'electricity',
    b: 'glass',
    products: ['silicon'],
    description: 'ガラス（二酸化ケイ素）を電気炉で高電圧処理し、酸素を分離して高純度のケイ素（シリコン）を抽出します。',
  },
  // 9. Electricity + Silicon -> Semiconductor
  {
    id: 'electricity_silicon',
    a: 'electricity',
    b: 'silicon',
    products: ['semiconductor'],
    description: 'ケイ素に電気刺激と不純物を加え、極微な電流の制御能力を付与して半導体へと加工します。',
  },
  // 10. Lava + Water -> Obsidian
  {
    id: 'lava_water',
    a: 'lava',
    b: 'water',
    products: ['obsidian'],
    description: 'ドロドロの超高温溶岩が冷たい水によって一瞬で急冷され、結晶化が進まずに黒光りする硬い黒曜石になります。',
  },
  // 11. Obsidian + Electricity -> Magnet
  {
    id: 'electricity_obsidian',
    a: 'electricity',
    b: 'obsidian',
    products: ['magnet'],
    description: '鉄分を多く含む火山岩（黒曜石）に雷や電気ショックが加わることで、永久磁石の特性が目覚めます。',
  },
  // 12. Oxygen + Hydrogen -> Water
  {
    id: 'hydrogen_oxygen',
    a: 'hydrogen',
    b: 'oxygen',
    products: ['water'],
    description: '可燃性の水素と助燃性の酸素が混ざり合い、激しいエネルギーを放ちながら再結合して安定した水へと戻ります。',
  },
  // 13. Steam + Metal -> Hydrogen & Carbon
  // Wait, let's make: Steam + Metal -> Rust + Hydrogen? Or Steam + Metal -> Hydrogen + Carbon? Let's do:
  // Metal + Fire -> Lava
  {
    id: 'fire_metal',
    a: 'fire',
    b: 'metal',
    products: ['lava'],
    description: '金属が極限の熱で融解し、灼熱の液体となります。',
  },
  // Star + Dust ... let's define other core reactions to make sure every substance can be produced and has reactions:
  // Let's list the reactions for Carbon, Hydrocarbon, Yeast, etc:
  // Plant + Fire -> Carbon (charcoal) + Carbon Dioxide
  {
    id: 'fire_plant',
    a: 'fire',
    b: 'plant',
    products: ['carbon', 'carbon_dioxide'],
    description: '植物が不完全燃焼（蒸し焼き）を起こすことで炭化し、炭素の塊である木炭と二酸化炭素を生み出します。',
  },
  // Carbon + Oxygen -> Carbon Dioxide
  {
    id: 'carbon_oxygen',
    a: 'carbon',
    b: 'oxygen',
    products: ['carbon_dioxide'],
    description: '純粋な炭素が酸素と結合して燃焼し、無色無臭の二酸化炭素（CO₂）ガスに変化します。',
  },
  // Carbon + Hydrogen -> Hydrocarbon
  {
    id: 'carbon_hydrogen',
    a: 'carbon',
    b: 'hydrogen',
    products: ['hydrocarbon'],
    description: '高温高圧の下で炭素と水素が有機的に重合し、多様な液体エネルギー資源である炭化水素（原油・有機炭素）が合成されます。',
  },
  // Hydrocarbon + Oxygen -> Carbon Dioxide & Water
  {
    id: 'hydrocarbon_oxygen',
    a: 'hydrocarbon',
    b: 'oxygen',
    products: ['carbon_dioxide', 'water'],
    description: '炭化水素が酸素を消費して完全に燃焼し、大量の熱エネルギーとともに二酸化炭素と水蒸気に分解します。',
  },
  // Hydrocarbon + Electricity -> Plastic (Wait, let's make it Hydrocarbon + Clay -> Yeast, or Water + Sugar -> Yeast, let's do:
  // Water + Soil -> Mud, Mud + Plant -> Yeast (natural fermentation on organic soil!)
  {
    id: 'plant_soil',
    a: 'plant',
    b: 'soil',
    products: ['yeast'],
    description: '肥沃な土壌で植物の有機物が腐植分解される過程で、発酵や化学合成を助ける単細胞真菌「酵母」が培養されます。',
  },
  // Yeast + Hydrocarbon -> Protein
  {
    id: 'hydrocarbon_yeast',
    a: 'hydrocarbon',
    b: 'yeast',
    products: ['protein'],
    description: '酵母菌が炭化水素の鎖を餌として代謝摂取し、アミノ酸を連ねて高分子のタンパク質を体内で急速に合成します（微生物タンパク質）。',
  },
  // Protein + Carbon Dioxide -> Amino Acid
  {
    id: 'carbon_dioxide_protein',
    a: 'carbon_dioxide',
    b: 'protein',
    products: ['amino_acid'],
    description: '二酸化炭素がタンパク質の酸性窒素基と水溶液中で結合することで、生命の設計図パーツである「アミノ酸」が切り出されます。',
  },
  // Amino Acid + Electricity -> Cell
  {
    id: 'amino_acid_electricity',
    a: 'amino_acid',
    b: 'electricity',
    products: ['cell'],
    description: '原始の海（アミノ酸プール）に超高圧の放電（雷など）が加わることで分子が極性を持って自己組織化し、生命最小の単位「細胞」が誕生します！',
  },
  // Cell + Soil -> Plant
  {
    id: 'cell_soil',
    a: 'cell',
    b: 'soil',
    products: ['plant'],
    description: '原始的な有機細胞が肥沃な大地に定着し、細胞分裂によって多細胞化し、太陽光を受け入れる最初の緑色の「植物」へと進化します。',
  },
  // Cell + Oxygen -> Bacteria
  {
    id: 'cell_oxygen',
    a: 'cell',
    b: 'oxygen',
    products: ['bacteria'],
    description: '酸素呼吸を行う特化細胞へと成長し、強靭な生存能力と細胞分裂力を持つ「細菌（バクテリア）」へと分化します。',
  },
  // Bacteria + Protein -> Life
  {
    id: 'bacteria_protein',
    a: 'bacteria',
    b: 'protein',
    products: ['life'],
    description: 'バクテリアがアミノ酸やタンパク質のエンベロープと共生・統合を遂げることで、遺伝情報を有する自律的な「生命体（多細胞生物）」としての真の覚醒を迎えます！',
  },
  // Life + Metal -> Robot (Civilization tech goal!)
  {
    id: 'life_metal',
    a: 'life',
    b: 'metal',
    products: ['semiconductor'], // Wait, if Robot isn't in SUBSTANCES, let's keep it as is or produce semiconductor/planet
    description: '生命の知性が頑強な金属素材を操り、電子の制御と合体させることで、肉体の制約を超えた存在へとステップアップします。',
  },
  // Life + Hydrogen -> Star (Cosmic ignition!)
  {
    id: 'hydrogen_life',
    a: 'hydrogen',
    b: 'life',
    products: ['star'],
    description: '知的生命体が、全宇宙に遍在する水素をコントロールして超高圧核融合を人工点火、または天体を融合させて、自ら輝く「恒星（太陽）」を創造します！',
  },
  // Star + Obsidian -> Black Hole
  {
    id: 'obsidian_star',
    a: 'obsidian',
    b: 'star',
    products: ['black_hole'],
    description: '輝く恒星の炉に重元素の極致である黒曜石が融合し、重力の均衡が崩壊。時空を歪めてすべてを飲み込む「ブラックホール」へと超新星爆発します。',
  },
  // Star + Clay -> Planet
  // Let's do: Star + Soil -> Planet
  {
    id: 'soil_star',
    a: 'soil',
    b: 'star',
    products: ['planet'],
    description: '恒星の周囲を漂う無数の塵や土壌が巨大な重力で集積し、美しい海と陸地、そして大気を備えた「惑星」が形成されます。',
  },
  // Planet + Life -> Galaxy (Universal expand!)
  {
    id: 'life_planet',
    a: 'life',
    b: 'planet',
    products: ['universe'], // Let's make Planet + Life -> Universe or Planet + Star -> Galaxy
    description: '惑星に宿った生命の文明が絶頂に達し、恒星間を行き来する宇宙大の超エネルギー網を編み、究極の宇宙調和を準備します。',
  },
  // Black Hole + Star -> Universe & Uranium (Cosmic cycle & Heavy Elements!)
  {
    id: 'black_hole_star',
    a: 'black_hole',
    b: 'star',
    products: ['universe', 'uranium'],
    description: 'あらゆる物質を飲み込むブラックホールと、すべての光を生む恒星が接触。特異点でのビッグバン現象により「宇宙」が再誕し、同時に超高圧降着円盤の極限空間（rプロセス）により「ウラン」も合成されます！',
  },
  // Silicon + Water -> Glass
  {
    id: 'silicon_water',
    a: 'silicon',
    b: 'water',
    products: ['glass'],
    description: 'ケイ素が水中の酸素原子とゆっくり水熱反応を起こし、安定した二酸化ケイ素（シリカ・ガラス質）に変化します。',
  },
  // Magnet + Metal -> Electricity (Generator)
  {
    id: 'magnet_metal',
    a: 'magnet',
    b: 'metal',
    products: ['electricity'],
    description: 'コイル状の金属に磁石を接近・運動させることで電磁誘導が起き、クリーンで強力な「電気」を生み出します（発電機）。',
  },
  // Oxygen + Fire -> Carbon Dioxide (Combustion of atmosphere!)
  {
    id: 'fire_oxygen',
    a: 'fire',
    b: 'oxygen',
    products: ['carbon_dioxide'],
    description: '酸素の助けを得て猛烈に火が燃え広がり、周囲の炭素質ガスを焼き尽くして二酸化炭素を噴き出します。',
  },
  // Steam + Soil -> Clay
  {
    id: 'soil_steam',
    a: 'soil',
    b: 'steam',
    products: ['clay'],
    description: '乾いた土壌が微細な水蒸気（スチーム）を吸うことで、均一に水分が浸透し、高品質な粘土が熟成されます。',
  },
  // 1. Stone + Water -> Sand
  {
    id: 'stone_water',
    a: 'stone',
    b: 'water',
    products: ['sand'],
    description: '強固な石が流れる水の摩擦と長い歳月によって風化・摩耗し、細かなサラサラの砂粒へと姿を変えます。',
  },
  // 2. Carbon + Lava -> Diamond
  {
    id: 'carbon_lava',
    a: 'carbon',
    b: 'lava',
    products: ['diamond'],
    description: '純粋な炭素がマントルや溶岩の超高温・超高圧にさらされ、最も強固な三次元共有結合の結晶構造であるダイヤモンドへと変貌します。',
  },
  // 3. Metal + Clay -> Bronze
  {
    id: 'metal_clay',
    a: 'clay',
    b: 'metal',
    products: ['bronze'],
    description: '粘土で強固な鋳型を作り、溶かした各種金属を混ぜ合わせて鋳造することで、人類初の本格的な合金「青銅」が誕生します。',
  },
  // 4. Carbon + Oxygen -> Gunpowder
  {
    id: 'carbon_oxygen_gunpowder',
    a: 'carbon',
    b: 'oxygen',
    products: ['gunpowder'],
    description: '炭素の粉末と、酸化剤（酸素を豊富に含む物質）を適切に調合することで、劇的な燃焼反応を起こす「火薬」を錬成します。',
  },
  // 5. Hydrocarbon + Clay -> Dynamite
  {
    id: 'hydrocarbon_clay',
    a: 'clay',
    b: 'hydrocarbon',
    products: ['dynamite'],
    description: '粘性の高い多孔質な粘土（珪藻土など）に液体の炭化水素（ニトログリセリン系燃料）を安全に吸収させ、安定した近代爆薬「ダイナマイト」を作ります。',
  },
  // 6. Water + Carbon Dioxide -> Acid
  {
    id: 'water_carbon_dioxide_acid',
    a: 'carbon_dioxide',
    b: 'water',
    products: ['acid'],
    description: '水（H₂O）に二酸化炭素（CO₂）が深く溶け込み、水素イオンを放出する強固な化学的性質「酸」を帯びた水溶液に変化します。',
  },
  // 7. Metal + Star -> Gold
  {
    id: 'metal_star',
    a: 'metal',
    b: 'star',
    products: ['gold'],
    description: '超新星爆発などの極限的な天体衝突エネルギー（恒星の炉）により、軽金属が宇宙的な超高圧還元を経て、永遠に輝き続ける「金」へと核変換されます。',
  },
  // 8. Semiconductor + Metal -> Computer
  {
    id: 'semiconductor_metal',
    a: 'metal',
    b: 'semiconductor',
    products: ['computer'],
    description: '半導体の電子制御スイッチと、金属の微細な導線パターンを精密に結線・積層することで、超高速演算が可能な「コンピュータ」が完成します。',
  },
  // 9. Semiconductor + Glass -> Laser
  {
    id: 'semiconductor_glass',
    a: 'glass',
    b: 'semiconductor',
    products: ['laser'],
    description: '半導体素子から生じる電気的励起光を、高精度なガラスレンズ・反射鏡で何度も往復させて波長を揃え、超高出力の「レーザー光」として射出します。',
  },
  // 10. Cell + Bacteria -> Virus
  {
    id: 'cell_bacteria',
    a: 'bacteria',
    b: 'cell',
    products: ['virus'],
    description: '細胞と細菌が生存競争を行う中で、細菌の遺伝情報が極限まで切り詰めて剥き出しになり、生命の最小複製カプセル「ウイルス」が分岐します。',
  },
  // 11. Water + Plant -> Algae
  {
    id: 'water_plant',
    a: 'plant',
    b: 'water',
    products: ['algae'],
    description: '植物の胞子や細胞が豊かな水中で繁殖し、水中光合成に高度に適応した原始的な緑色の水圏生命「藻類」へと退化・特化します。',
  },
  // 12. Life + Soil -> Fossil
  {
    id: 'life_soil',
    a: 'life',
    b: 'soil',
    products: ['fossil'],
    description: '生命体が地中に埋もれて長い地質年代を経ることで、肉体組成が周囲の鉱物質（土や砂）へとゆっくり置換され、硬い石の「化石」となります。',
  },
  // 13. Semiconductor + Life -> AI
  {
    id: 'semiconductor_life',
    a: 'life',
    b: 'semiconductor',
    products: ['ai'],
    description: '半導体の圧倒的な超高速演算能力に、生命が持つ自律思考や学習アルゴリズム（ニューラルネットワーク）のロジックを融合させ、「人工知能（AI）」を覚醒させます。',
  },
  // 14. Planet + Life -> UFO
  {
    id: 'planet_life',
    a: 'life',
    b: 'planet',
    products: ['ufo'],
    description: '惑星の資源と、そこに育まれた生命の叡智が宇宙進出への渇望と結びつき、重力をもねじ曲げて公転軌道を超える宇宙船「UFO」を結実させます。',
  },
  // 15. Black Hole + Electricity -> Energy
  {
    id: 'black_hole_electricity',
    a: 'black_hole',
    b: 'electricity',
    products: ['energy'],
    description: 'ブラックホールの極限的な回転重力場に強力な電磁気ショックを加えることで、エルゴ球から莫大な「純粋物理エネルギー」を電気エネルギーとして回収・抽出します。',
  },
  // 16. Acid + Metal -> Hydrogen & Electricity
  {
    id: 'acid_metal',
    a: 'acid',
    b: 'metal',
    products: ['hydrogen', 'electricity'],
    description: '強酸性液体が金属をイオン化して激しく腐食・溶解させる化学電池反応（ボルタ電池/ガルバニ電池）から、電気エネルギー（電力）と水素ガスを同時に取り出します。',
  },
  // 17. Gunpowder + Fire -> Energy
  {
    id: 'gunpowder_fire',
    a: 'fire',
    b: 'gunpowder',
    products: ['energy'],
    description: '火薬に一瞬の火花を当てることで急激な化学連鎖燃焼（爆発）を引き起こし、周囲を一瞬にして破壊的な「純粋エネルギー（衝撃波と熱）」で満たします。',
  },
  // 18. Computer + AI -> Universe
  {
    id: 'computer_ai',
    a: 'ai',
    b: 'computer',
    products: ['universe'],
    description: '超知能（AI）が超並列コンピュータの計算リソースの極限を使い果たした瞬間、物理法則そのものをシミュレートする「特異点ビッグバン」が発生し、新たな仮想の「宇宙」が生まれます！',
  },
  // 19. Acid + Stone -> Salt & Carbon Dioxide
  {
    id: 'acid_stone',
    a: 'acid',
    b: 'stone',
    products: ['salt', 'carbon_dioxide'],
    description: '酸性液体が炭酸カルシウムを多く含む岩石を強力に溶解・中和させ、無機塩類（塩）と二酸化炭素ガスを同時に放出します。',
  },
  // 20. Bacteria + Soil -> Ammonia
  {
    id: 'bacteria_soil',
    a: 'bacteria',
    b: 'soil',
    products: ['ammonia'],
    description: '土壌中の窒素固定細菌（根粒菌など）が、大気中の不活性な窒素分子から生命が直接利用可能な「アンモニア」を合成します。',
  },
  // 21. Acid + Ammonia -> Fertilizer
  {
    id: 'acid_ammonia',
    a: 'acid',
    b: 'ammonia',
    products: ['fertilizer'],
    description: '強酸性化合物とアンモニアガスの中和化学反応（中和熱）により、現代農業の基盤となる高効率な窒素系「化学肥料（硫酸アンモニウム等）」を生成します。',
  },
  // 22. Plant + Yeast -> Alcohol & Carbon Dioxide
  {
    id: 'plant_yeast',
    a: 'plant',
    b: 'yeast',
    products: ['alcohol', 'carbon_dioxide'],
    description: '酵母菌が植物に含まれるグルコース（糖類）を酸素なしで発酵分解させ、エチルアルコールと二酸化炭素ガス（炭酸ガス）を精製します（アルコール発酵）。',
  },
  // 23. Acid + Hydrocarbon -> Plastic
  {
    id: 'acid_hydrocarbon',
    a: 'acid',
    b: 'hydrocarbon',
    products: ['plastic'],
    description: '石油から得られた不飽和炭化水素に酸性極性触媒を作用させることで、炭素鎖を強力に重合反応させ、軽くて極めて不活性な高分子「プラスチック」を作り出します。',
  },
  // 24. Acid + Alcohol -> Ether
  {
    id: 'acid_alcohol',
    a: 'acid',
    b: 'alcohol',
    products: ['ether'],
    description: 'アルコール（エタノール）に強酸（濃硫酸等）を混合して中温加熱することで分子間の脱水縮合を引き起こし、揮発性の麻酔性物質「エーテル」を合成します。',
  },
  // 25. Carbon + Metal -> Steel
  {
    id: 'carbon_metal',
    a: 'carbon',
    b: 'metal',
    products: ['steel'],
    description: '溶融状態の鉄（金属）に適量の炭素（石炭コークス等）をブレンドして焼きを入れることで、靭性と極限の硬度を両立した超合金「鋼鉄」を精錬します。',
  },
  // 26. Metal + Oxygen -> Rust
  {
    id: 'metal_oxygen',
    a: 'metal',
    b: 'oxygen',
    products: ['rust'],
    description: '金属表面が活性な酸素分子と水分の存在下で徐々に酸化結合（電気化学的腐食）し、結合が脆くなった赤褐色の「サビ（酸化鉄）」に変化します。',
  },
  // 27. Hydrogen + Star -> Helium
  {
    id: 'hydrogen_star',
    a: 'hydrogen',
    b: 'star',
    products: ['helium'],
    description: '恒星の巨大な重力と高熱圧によって水素原子核が衝突・融合（核融合反応）し、安定した希ガスである「ヘリウム」が生成されます。',
  },
  // 28. Stone + Star -> Lithium
  {
    id: 'stone_star',
    a: 'stone',
    b: 'star',
    products: ['lithium'],
    description: '恒星を巡る強力な宇宙線が岩石（重元素）を破砕（核破砕反応）することで、最も軽くて電子密度の高いアルカリ金属である「リチウム」が単離されます。',
  },
  // 29. Silicon + Star -> Beryllium
  {
    id: 'silicon_star',
    a: 'silicon',
    b: 'star',
    products: ['beryllium'],
    description: '宇宙空間を飛び交う高エネルギーの宇宙線が、岩石地殻を構成するケイ素などの原子核を破砕し、極めて融点が高く硬質で軽量な「ベリリウム」を形成します。',
  },
  // 30. Acid + Clay -> Boron & Fluorine
  {
    id: 'acid_clay',
    a: 'acid',
    b: 'clay',
    products: ['boron', 'fluorine'],
    description: '粘土質のホウ酸塩やフッ化鉱物を強酸で分解抽出し、ガラスやエレクトロニクス用の「ホウ素」と、最も極性・反応性の高い強力な有毒気体「フッ素」を分離します。',
  },
  // 31. Ammonia + Oxygen -> Nitrogen & Water
  {
    id: 'ammonia_oxygen',
    a: 'ammonia',
    b: 'oxygen',
    products: ['nitrogen', 'water'],
    description: 'アンモニアと高純度の酸素ガスを反応・酸化させることで、大気の大半を構成する不活性な「窒素」と、副産物の「水」に熱分解します。',
  },
  // 32. Universe + Star -> Neon
  {
    id: 'universe_star',
    a: 'star',
    b: 'universe',
    products: ['neon'],
    description: '超新星爆発や恒星の最終燃焼プロセスにおいて、炭素とアルファ粒子が融合する核反応により、放電で赤く輝く不活性希ガス「ネオン」が全宇宙に放出されます。',
  },
  // 33. Salt + Electricity -> Sodium & Chlorine
  {
    id: 'salt_electricity',
    a: 'electricity',
    b: 'salt',
    products: ['sodium', 'chlorine'],
    description: '溶融状態の塩に高電流の電気を流して電気分解（工業的ダウンズ法）を行い、水と反応して激しく発火する「ナトリウム」と、黄緑色で有毒な「塩素」ガスを同時に生成します。',
  },
  // 34. Clay + Lava -> Magnesium
  {
    id: 'clay_lava',
    a: 'clay',
    b: 'lava',
    products: ['magnesium'],
    description: '地殻に含まれるケイ酸塩・マグネシウム酸化物を溶岩マグマの超高温下でコークス等により還元（ピジョン法等の熱還元製錬）することで、眩しい光を放って燃焼する「マグネシウム」を抽出します。',
  },
  // 35. Clay + Electricity -> Aluminum
  {
    id: 'clay_electricity',
    a: 'clay',
    b: 'electricity',
    products: ['aluminum'],
    description: '粘土（ボーキサイト）から得たアルミナを融解し、強力な電気で電解精錬（ホール・エルー法）することで、一円玉や航空機の材料となる軽量な「アルミニウム」を析出させます。',
  },
  // 36. Protein + Fire -> Phosphorus
  {
    id: 'protein_fire',
    a: 'fire',
    b: 'protein',
    products: ['phosphorus'],
    description: '生体の根幹物質であるタンパク質（骨などの有機リン成分）に炭素を混ぜて直接熱分解還元（骨炭蒸留）することで、マッチや自己発火性を持つ元素「リン」が単離されます。',
  },
  // 37. Lava + Stone -> Sulfur
  {
    id: 'lava_stone',
    a: 'lava',
    b: 'stone',
    products: ['sulfur'],
    description: '地中から湧き上がる溶岩流の熱と火山ガスが周囲の岩石と反応することで、温泉地特有の匂いを持つ、鮮やかな黄色の非金属元素「硫黄（イオウ）」の結晶が堆積します。',
  },
  // 38. Soil + Star -> Argon
  {
    id: 'soil_star_argon',
    a: 'soil',
    b: 'star',
    products: ['argon'],
    description: '地殻の土壌や岩石に含まれるカリウム40同位体が、星の長い歳月を経た放射性崩壊（電子捕獲）を終えることで、不活性で最も安定した希ガスである「アルゴン」がゆっくりと蓄積されます。',
  },
  // 39. Plant + Fire -> Potassium
  {
    id: 'plant_fire',
    a: 'fire',
    b: 'plant',
    products: ['potassium'],
    description: '草や木などの植物を燃やしてできた木灰（ポタッシュ）を水に溶かして炭酸塩を抽出し、加熱還元処理することで、極めて化学反応性が高く水で発火するアルカリ金属「カリウム」を取り出します。',
  },
  // 40. Soil + Acid -> Calcium & Carbon Dioxide
  {
    id: 'soil_acid',
    a: 'acid',
    b: 'soil',
    products: ['calcium', 'carbon_dioxide'],
    description: '炭酸カルシウムを主成分とする石灰質の土壌を酸性液体で化学溶解・電解還元することで、骨やシェルを形作る金属「カルシウム」を析出し、二酸化炭素を放出します。',
  },
  // 41. Stone + Chlorine -> Titanium
  {
    id: 'stone_chlorine',
    a: 'chlorine',
    b: 'stone',
    products: ['titanium'],
    description: '高チタン含有鉱石（石）に塩素ガスを吹き込み四塩化チタンに転化させ、金属マグネシウムなどで高温熱還元（クロール法）することで、軽くて鋼鉄並みに強い「チタン」が精錬されます。',
  },
  // 42. Metal + Lava -> Chromium
  {
    id: 'metal_lava',
    a: 'lava',
    b: 'metal',
    products: ['chromium'],
    description: 'クロム鉱石に金属やコークスを混ぜて溶岩マグマに匹敵する超高温電気炉で還元精錬（フェロクロム製造）することで、錆びないステンレス合金の主原料である超硬質金属「クロム」を取り出します。',
  },
  // 43. Stone + Carbon -> Iron
  {
    id: 'stone_carbon',
    a: 'carbon',
    b: 'stone',
    products: ['iron'],
    description: '鉄分を富む赤鉄鉱などの岩石（石）に炭素（石炭コークス）を配合し、溶鉱炉の熱で炭素還元を行うことで、文明を支えるもっとも頑強で強磁性の遷移金属「鉄」を取り出します。',
  },
  // 44. Sand + Fire -> Copper
  {
    id: 'sand_fire',
    a: 'fire',
    b: 'sand',
    products: ['copper'],
    description: '孔雀石や銅砂などの銅成分を多く含む砂を炭火で熱分解還元（古代溶鉱炉製錬）することで、電気配線や青銅合金に不可欠な、熱と電気をきわめてよく通す赤金色の「銅」を得ます。',
  },
  // 45. Sand + Acid -> Zinc
  {
    id: 'sand_acid',
    a: 'acid',
    b: 'sand',
    products: ['zinc'],
    description: '閃亜鉛鉱などの亜鉛鉱石を含む砂を酸で処理して亜鉛イオンを溶出し、さらに電気分解（またはコークス還元）することで、トタンや真鍮の原料となる防錆用の銀白色金属「亜鉛」を抽出します。',
  },
  // 46. Copper + Electricity -> Silver
  {
    id: 'copper_electricity',
    a: 'copper',
    b: 'electricity',
    products: ['silver'],
    description: '粗銅（銅）を硫酸銅電解槽で高圧電気精錬するプロセスにおいて、底面に沈殿する陽極泥（スライム）から、全金属で最高レベルの反射率と導電性を持つ美しい貴金属「銀」を回収します。',
  },
  // 47. Gold + Acid -> Platinum
  {
    id: 'gold_acid',
    a: 'acid',
    b: 'gold',
    products: ['platinum'],
    description: '金や王水（超強酸）の混合プロセスおよび白金族廃液の沈殿分離において、金よりもさらに融点が高く、触媒としての活性がきわめて高い究極の白金族貴金属「白金（プラチナ）」を精製します。',
  },
  // 48. Sulfur + Stone -> Mercury
  {
    id: 'sulfur_stone',
    a: 'stone',
    b: 'sulfur',
    products: ['mercury'],
    description: '硫黄分を多く含む辰砂（しんしゃ）などの赤い岩石（水銀鉱石）を加熱し、発生したガス状の水銀を凝縮させることで、常温で「液体」の姿を保つ不思議な高密度遷移金属「水銀」を精錬します。',
  },
  // 49. Uranium + Universe -> Lead
  {
    id: 'uranium_universe',
    a: 'universe',
    b: 'uranium',
    products: ['lead'],
    description: '宇宙で最大レベルの質量を持つウラン等の超重元素が、途方もない年月をかけて放射性崩壊を繰り返した終着点（崩壊系列の終点）として、きわめて比重が高く安定した「鉛」が生成されます。',
  },
  // 50. Empty placeholder (Merged with Black Hole + Star -> Universe & Uranium)
  // 51. Carbon Dioxide + Magnesium -> Carbon
  {
    id: 'co2_magnesium',
    a: 'carbon_dioxide',
    b: 'magnesium',
    products: ['carbon'],
    description: '二酸化炭素（CO₂）雰囲気中で高活性金属のマグネシウムを燃焼させると、酸素が激しく奪われる還元反応が起き、純粋な黒い「炭素（スス）」が遊離して生み出されます。',
  },
  // 52. Hydrocarbon + Electricity -> Amino Acid
  {
    id: 'hydrocarbon_lightning',
    a: 'hydrocarbon',
    b: 'electricity',
    products: ['amino_acid'],
    description: '原始の海に溶け込んだ炭化水素（有機原料）に電気エネルギー（雷放電）が炸裂することで化学反応が起こり、生命の起源となる「アミノ酸」が奇跡的に無機合成されます（ユーリー・ミラーの実験）。',
  },
  // 53. Steam + Steam -> Electricity (Steam Friction / Lightning)
  {
    id: 'steam_friction',
    a: 'steam',
    b: 'steam',
    products: ['electricity'],
    description: '水蒸気が激しく衝突し摩擦を起こすことで巨大な静電気（雷雲）が発生し、そこから強力な「電気」が放電されます。',
  },
];

// Map of reactions for quick O(1) reactant lookup (sorted reactant names)
export function getReaction(typeA: string, typeB: string): Reaction | undefined {
  const [first, second] = [typeA, typeB].sort();
  return REACTIONS.find(r => {
    const [rA, rB] = [r.a, r.b].sort();
    return rA === first && rB === second;
  });
}
