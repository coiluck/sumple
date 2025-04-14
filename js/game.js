document.getElementById("game-tutorial-close").addEventListener("click", function() {
  // チュートリアルが閉じられた時の処理
  document.getElementById("game-tutorial").classList.add("fast-fadeout");
  setTimeout(function(){
    document.getElementById("game-tutorial").style.display = "none";
  }, 500);
  const neverShowCheckbox = document.getElementById("neverShowMeTutorialModal");
  if (neverShowCheckbox && neverShowCheckbox.checked) {
    // 「二度と表示しない」を選択したらローカルストレージに書き込む
    localStorage.setItem("hasSeenTutorial", "true");
    console.log("記録しました: チュートリアル - 二度と表示しない");
  }
});



const decreasePersonnel = function(){
  // 人員を減らすボタンの処理
  const countElement = document.getElementById("personnel-count");
  const decreaseButton = document.getElementById("personnel-decrease");
  const increaseButton = document.getElementById("personnel-increase");
  // 現在の人員を取得
  let count = parseInt(countElement.textContent, 10);
  // 人員を10減らす
  count = count - 10;
  countElement.textContent = count;
  // 消費予想も反映
  UpdateResourcesCost(count);
  // 効果予想も更新
  updateEffects(count);
  // 一定の範囲内になるように
  if (count <= 30) {
    decreaseButton.style.visibility = "hidden"; // レイアウト計算を保ったまま非表示
  }
  if (count < 90) {
    increaseButton.style.visibility= "visible" // 表示
  }
};
const increasePersonnel = function(){
  // 人員を増やすボタンの処理
  const countElement = document.getElementById("personnel-count");
  const decreaseButton = document.getElementById("personnel-decrease");
  const increaseButton = document.getElementById("personnel-increase");
  // 現在の人員を取得
  let count = parseInt(countElement.textContent, 10);
  // 人員を10増やす
  count = count + 10;
  countElement.textContent = count;
  // 消費予想も反映
  UpdateResourcesCost(count);
  // 効果予想も更新
  updateEffects(count);
  // 一定の範囲内になるように
  if (count > 30) {
    decreaseButton.style.visibility = "visible" // 表示
  }
  if (count >= 90) {
    increaseButton.style.visibility = "hidden"; // 非表示
  }
};

// ボタンにイベントリスナーを追加
document.getElementById("personnel-decrease").addEventListener("click", decreasePersonnel);
document.getElementById("personnel-increase").addEventListener("click", increasePersonnel);

function UpdateResourcesCost(count) {
  const costElement = document.getElementById("resources-cost");
  // 予想消費を更新
  const shouhiCost = Math.floor(200 + count * 5 * window.gameDataByChar.shouhi);
  const hokyuuCost = 500 * window.gameDataByChar.hokyuu;
  costElement.textContent = "-" + shouhiCost + " +" + hokyuuCost;
};

// キャラ選択後に確定したgameDataByCharを使って更新
document.getElementById("confirm-button").addEventListener("click", function() {
  const count = parseInt(document.getElementById("personnel-count").textContent, 10);
  UpdateResourcesCost(count);
  updateEffects(count)
});


// 獲得スコアを更新
function updateEffects(count) {
  const scoreRatio = [1, 1.13, 1.23, 1.31, 1.38, 1.44, 1.5];
  const ratioIndex = Math.floor((count - 30) / 10);
  // 範囲内に収める（0未満は0、配列長以上は最大値）
  const safeIndex = Math.max(0, Math.min(ratioIndex, scoreRatio.length - 1));
  const ratio = scoreRatio[safeIndex];
  // 現在表示されている選択肢を取得
  const choiceCards = document.querySelectorAll(".choice-card");
  choiceCards.forEach((card, index) => {
    // データを取得
    const scenario = gameScenarios[currentRound][index];
    const effectDescriptions = scenario.effects.map(effect => {
      let statName;
      switch (effect.stat) {
        case 'resources': statName = '資源'; break;
        case 'relations': statName = '他国との関係'; break;
        case 'progress': statName = '研究進度'; break;
        case 'moon-development': statName = '月面開発'; break;
        default: statName = '不明';
      }
      // 計算値の設定
      let calculatedValue;
      if (effect.value < 0) {
        // 負の値はそのまま
        calculatedValue = effect.value;
      } else {
        // 特別処理
        if (effect.stat === 'progress') {
          // progressの場合はkennkyuuをかける
          calculatedValue = Math.floor(effect.value * ratio * window.gameDataByChar.kennkyuu);
        } else if (effect.stat === 'relations') {
          // relationsの場合はkannkeiをかける
          calculatedValue = Math.floor(effect.value * ratio * window.gameDataByChar.kannkei);
        } else if(effect.stat === 'resources') {
          // resourcesの場合は比率適用しない
          calculatedValue = effect.value;
        } else {
          // その他の正の値
          calculatedValue = Math.floor(effect.value * ratio);
        }
      }
      const sign = calculatedValue > 0 ? "+" : ""; // 負の場合は+を付けない
      return `${statName}: ${sign}${calculatedValue}`;
    }).join(', ');
    // カード内の効果を更新
    card.querySelector("p").textContent = effectDescriptions;
  });
}

// ゲームデータ
const gameScenarios = [
  [
    {
      title: '実験機材の輸送を優先',
      effects: [{ stat: 'progress', value: 16 }, { stat: "moon-development", value: -5}],
      stories: [
        '補給艦の物資積載量に限りがある中、我々は月面に不足していた実験機材を優先的に積み込んだ。',
        'これは本国からの命令であり、インフラ資材や医療品の多くは次回の便に回された。',
        '気密区画の整備が遅れ、乗組員の数名が低温障害に見舞われたが、報告は控えられた。'
      ],
      buttonText: '本国からの命令が絶対だ'
    },
    {
      title: '生活インフラ資材を輸送',
      effects: [{ stat: 'moon-development', value: 14 }],
      stories: [
        '優先されたのは、気圧調整装置と簡易水再生システムだった。',
        '基地内の空調が安定し、湿度・温度の管理も精度を増す。',
        '作業効率が上がり、乗組員の間にもわずかながら安堵が広がった。'
      ],
      buttonText: 'まずは人間が生きられる場所を'
    },
    {
      title: '日本基地から物資の譲渡',
      effects: [{ stat: 'relations', value: 12 }, { stat: "resources", value: 100}],
      stories: [
        '大日本帝国の月面基地と通信を繋ぎ、支援の要請を行った。',
        '物資の譲渡と同時に、両国の基地間での医療支援協定が交わされる。',
        '帝国内部では「恥辱」とする声もあるが、現場はすでに月の現実と向き合っていた。'
      ],
      buttonText: '協力なくして生存はない'
    }
  ],
  [
    {
      title: '放射線観測施設を構築',
      effects: [{ stat: 'progress', value: 12 }],
      stories: [
        '月面実験を強く望む本国の要請を受け、我々は月面に実験施設を建設した。',
        '月面の放射線データは、核反応機構の理論に新たな仮説をもたらした。',
        '地球上での実験では得られなかった精度に研究者らは喜ぶ。'
      ],
      buttonText: "放射線実験はいつか役に立つだろう"
    },
    {
      title: '補給船停泊所の整備',
      effects: [{ stat: "moon-development", value: 5}, { stat: 'resources', value: 50 }],
      stories: [
        'これから何度も訪れるであろう補給線のため、月面着陸地点に半永久的な停泊所を整備することにした。',
        "粉塵舞い上がる地表に、初めて「繰り返し使う」ことを前提とした構造物が建つ。",
        "赤黒い粉塵の地に無言の鋼鉄の杭が沈み、帝国の旗がはためく。",
        '溶接の火花が夜空に散り、鉄の支柱が「定着」の意思を突き立てる――この月は、ただの観測地ではない。これは、領土だ。'
      ],
      buttonText: 'ここが新たな補給線の起点となる'
    },
    {
      title: '生活棟の拡張工事',
      effects: [{ stat: 'moon-development', value: 15 }],
      stories: [
        '我々は狭苦しい宇宙船にお別れする計画に取り掛かった。',
        '居住スペースの拡張によってより快適な月面生活を送れるだろう。',
        '人間の長期滞在を可能にする設計だ。'
      ],
      buttonText: "居住第一！"
    }
  ],
  [
    {
      title: 'クレーター内部を調査',
      effects: [{ stat: 'progress', value: 12 }],
      stories: [
        'ヴァルキューレⅡの着陸時に見たクレーターを目指し、探索が行われた。',
        "クレーター内部に露出していた鉱石成分を採取・分析する。",
        'ウラン系列に類似する未知の鉱物が発見され、月面資源の戦略的価値が再評価されることとなった。',
        '本国は即座に追加の採取・解析命令を発し、緊張が走った。'
      ],
      buttonText: "この発見がすべてを変えるかもしれない"
    },
    {
      title: '日本の無人機に接近',
      effects: [{ stat: 'progress', value: 20 }, { stat: "relations", value: -10}],
      stories: [
        'かの国では我々と同じように無人機による月面探査を行っている。',
        '我々は日本の無人機に「偶然」接近し、詳細な観察を行った。',
        '技術的優位を確認した本国は満足したが、大日本帝国は苛立ちを隠せない。',
        "抗議が届いたのは3日後。だが、すでに解析は完了していた。"
      ],
      buttonText: "行動の先に、成果がある"
    },
    {
      title: '基地周辺の地形を検証',
      effects: [{ stat: 'moon-development', value: 18 }],
      stories: [
        '基地周辺半径5kmの地形調査を実施し、構造物設置可能区域をマッピングする。',
        '月面特有の地質パターンが把握され、建築可能エリアの安全マップが作成される',
        'これは始まりだ――帝国都市の礎となる地を選定するための、第一歩。'
      ],
      buttonText: "この地に「都市」を築く"
    }
  ],
  [
    {
      title: '植物の育成実験',
      effects: [{ stat: 'moon-development', value: 12 }, { stat: "resources", value: 50 }],
      stories: [
        "月面の温室内、地球から持ち込んだ種子が静かに芽を出した。",
        "だが、成功率は五割以下。酸素濃度、放射線、重力……どれも植物にとって過酷すぎた。",
        "研究主任は口元を引き締め、記録を取り続ける。",
        "生き延びた芽の一本一本が、未来の命綱だ。",
        "「これが育てば、自給自足への第一歩だ」",
        "そう言った彼の目には、疲れよりも焦燥が滲んでいた。",
        "だが、温室の片隅で一株のトマトが花を咲かせたとき、誰もが無言でその小さな生命に頭を垂れた。"
      ],
      buttonText: "自給自足への一歩だ"
    },
    {
      title: '小型センサー群の設置',
      effects: [{ stat: 'progress', value: 16 }, { stat: "moon-development", value: 3 }],
      stories: [
        "基地の周囲に小型の地震センサー群を設置することが決定された。",
        "月の地殻活動についての情報は限られており、拠点建設の安全性を検証するには正確な振動データが不可欠だった。",
        "灰色の砂に半ば埋もれるようにして点在するセンサーが、やがて微かな地震波を検出し始める。",
        "それは月が完全な沈黙の世界ではないことを、静かに、しかし確かに告げていた。"
      ],
      buttonText: "データを集めよう"
    },
    {
      title: '通信システムの拡張',
      effects: [{ stat: 'moon-development', value: 15 }],
      stories: [
        "通信の遅延が、生死を分けることがある。月の裏側ではそれが常識だ。",
        "新たに配備された中継塔は、静かに起動を開始した。",
        "アンテナが地球を捉えるたび、短く電子音が鳴る。",
        "それは孤独を断ち切る唯一の音だった。"
      ],
      buttonText: "ピコーン"
    }
  ],
  [
    {
      title: '技術成果を前面に出す',
      effects: [{ stat: 'resources', value: 200 }, { stat: "progress", value: 5 }],
      stories: [
        '通信室の照明が落とされ、静かに記録映像が流れ始める。',
        "機械式アームの試運転、放射線遮蔽シェルの実験結果、月面で採取された鉱物成分。",
        '本国は我々の月面での成果に満足したようだった。'
      ],
      buttonText: "報告は以上だ"
    },
    {
      title: 'そんなことより研究だ',
      effects: [{ stat: 'progress', value: 20 }],
      stories: [
        '月面での成果に夢中になっていた我々には、本国すらも水を差せないようだった',
        '報告は後回しにして研究者らは日夜実験を続ける。',
        "我々にとって通信は義務ではない――任務の進行こそが忠誠の証だった。"
      ],
      buttonText: "我々は報告のために来たのではない"
    },
    {
      title: '基地と周辺を紹介',
      effects: [{ stat: 'resources', value: 200 }, { stat: "moon-development", value: 5 }],
      stories: [
        'カメラは無音のまま、気圧調整室を抜け、月面を滑るように進んでいく。',
        '静寂に包まれた外壁、白く凍った装甲、わずかに灯る作業灯。',
        '本国は我々が月面に築いた壮大な基地に満足したようだった。'
      ],
      buttonText: "報告は以上だ"
    }
  ]
];
// scenario-description用のテキストを用意するのとかおしゃれかも
// 全部出来上がってからにしてください
// すぐできるしやっちゃった～:)
const scenarioDescriptionArray = [
  "我々は追加の補給を選択できるようだ",
  "月面に最初に建設すべき施設はどれだろうか",
  "月面の探索が行われる",
  "隊員たちに初めての月面任務を与える時が来た",
  "月面から本国へ映像・音声信号が発信される予定だ"
]

let currentRound = 0;
let currentScenarioIndex = 0;
let currentStoryIndex = 0;
let isSeeingStory = false;

// 選択肢を更新
function updateChoices() {
  const choiceCards = document.querySelectorAll(".choice-card");
  choiceCards.forEach((card, index) => {
    const scenario = gameScenarios[currentRound][index];
    const effectDescriptions = scenario.effects.map(effect => {
      let statName;
      switch (effect.stat) {
        case 'resources': statName = '資源'; break;
        case 'relations': statName = '他国との関係'; break;
        case 'progress': statName = '研究進度'; break;
        case 'moon-development': statName = '月面開発'; break;
        default: statName = '不明';
      }
      return `${statName}: +${effect.value}`;
    }).join(', ');
    
    card.querySelector("h3").textContent = scenario.title;
    card.querySelector("p").textContent = effectDescriptions;
    card.id = `selestion${index + 1}`;
  });
}

// ストーリーテキストを更新
function updateStoryText() {
  const currentScenario = gameScenarios[currentRound][currentScenarioIndex];
  const gameTextElement = document.getElementById('game-text');  
  if (currentStoryIndex < currentScenario.stories.length) {
    gameTextElement.textContent = currentScenario.stories[currentStoryIndex];
    currentStoryIndex++;
  } else {
    // ストーリーの最後ならボタンを表示
    document.getElementById("game-button-will").style.display = "flex";
    document.getElementById("game-button-will").classList.add("fast-fadein");
  }
}

document.getElementById("game-button-will").addEventListener("click", resetToChoices);

// 選択肢画面に戻る
function resetToChoices() {
  currentRound++;
  currentStoryIndex = 0;
  isSeeingStory = false;
  document.getElementById("game-button-will").style.display = "none";
  document.getElementById("gameTextBox").classList.add("no-display");
  document.getElementById("gameTextBox").classList.remove("yes-display");  
  document.querySelector(".game-screen").classList.remove("no-display", "fast-fadeout");
  document.querySelector(".game-screen").classList.add("fast-fadein");
  // 新しい選択肢
  if (currentRound < gameScenarios.length) {
    updateChoices();
    updateEffects(Number(document.getElementById('personnel-count').textContent));
    document.getElementById("game-description1").textContent = scenarioDescriptionArray[currentRound];
    console.log("ゲーム選択肢を更新しました");
    // 物資を補充(ここに書けば初手で実行されないな)
    const resourcesElement = document.getElementById("resources");
    let resources = parseInt(resourcesElement.textContent, 10);
    resources += 500 * window.gameDataByChar.hokyuu;
    resourcesElement.textContent = resources;
    console.log("補給適用倍率: 500 * " + window.gameDataByChar.hokyuu);
  } else {
    // ゲーム終了処理（後で関数書いて入れておく）
    document.querySelector(".game-screen").classList.remove("fast-fadein");
    document.querySelector(".game-screen").classList.add("no-display");
    document.getElementById("gameTextBox").classList.remove("yes-display", "fast-fadein-text");
    document.getElementById("gameTextBox").classList.add("no-display");
    setTimeout(function () {
      document.getElementById("gameTextBox").classList.remove("no-display");
      document.getElementById("gameTextBox").classList.add("yes-display");
      document.getElementById("gameTextBox").classList.add("fast-fadein-text");
      // 終わったら...
      displayFindJewStory();
    }, 500);
  }
}

// 選択肢クリック時
function handleChoiceClick(event) {
  event.stopPropagation();
  if (isSeeingStory) return;
  isSeeingStory = true;
  // 物資を減少
  const personnelCount = parseInt(document.getElementById("personnel-count").textContent, 10);
  const resourcesElement = document.getElementById("resources");
  let resources = parseInt(resourcesElement.textContent, 10);
  const resourceCost = 200 + personnelCount * 5 * window.gameDataByChar.shouhi;
  resources -= resourceCost;
  resourcesElement.textContent = resources;
  console.log("消費適用倍率: 200 + " + personnelCount + " * 5 * " + window.gameDataByChar.shouhi);
  // クリックされた選択肢カードを特定し、対応するシナリオのインデックスを取得
  const choiceCards = document.querySelectorAll(".choice-card");
  choiceCards.forEach((card, index) => {
    if (card === event.currentTarget) {
      currentScenarioIndex = index;
      // ボタンテキストを取得して書き換え
      const buttonText = gameScenarios[currentRound][index].buttonText;
      if (buttonText) {
        document.getElementById("game-button-will").textContent = buttonText;
      }
    }
  });
  // ステータスの更新を追加
  const selectedScenario = gameScenarios[currentRound][currentScenarioIndex];
  updateStatus(selectedScenario.effects, personnelCount);
  // 選択肢を消してテキストを表示
  document.querySelector(".game-screen").classList.add("fast-fadeout");  
  setTimeout(function(){ 
    document.querySelector(".game-screen").classList.add("no-display"); 
    document.getElementById("gameTextBox").classList.remove("no-display"); 
    document.getElementById("gameTextBox").classList.add("yes-display"); 
    document.getElementById("gameTextBox").classList.add("fast-fadein-text");     
    // 最初のストーリーテキストを表示
    updateStoryText();
  }, 500);
}

// ステータスを更新する関数を追加
function updateStatus(effects, personnelCount) {
  // 人員により倍率適用
  const scoreRatio = [1, 1.13, 1.23, 1.31, 1.38, 1.44, 1.5];
  const ratioIndex = Math.floor((personnelCount - 30) / 10);
  // 範囲内に収める（0未満は0、配列長以上は最大値）
  const safeIndex = Math.max(0, Math.min(ratioIndex, scoreRatio.length - 1));
  const ratio = scoreRatio[safeIndex];

  effects.forEach(effect => {
    const statElement = document.getElementById(`${effect.stat}`);
    const currentValue = parseInt(statElement.textContent, 10);
    let value = effect.value;
    // value が負の値でない場合のみratioを適用
    if (value >= 0) {
      value *= ratio;
    }
    // 倍率適用
    if (effect.stat === 'progress' && value >= 0) { 
      value *= window.gameDataByChar.kennkyuu;
      console.log("スコア適用倍率 (progress): " + ratio + " * " + window.gameDataByChar.kennkyuu);
    } else if (effect.stat === 'relations' && value >= 0) {
      value *= window.gameDataByChar.kannkei;
      console.log("スコア適用倍率 (relations): " + ratio + " * " + window.gameDataByChar.kannkei);
    } else if(effect.stat === 'resources') {
      // resourcesの場合は比率適用しない
      value = effect.value;
      console.log("スコア適用倍率 (relations): 1" )
    } else if (value >= 0) {
      console.log("スコア適用倍率 (other): " + ratio);
    }
    // 加算する前に変動値を切り捨てる
    const calculatedValue = Math.floor(value);
    // 負の値の場合はそのまま加算
    statElement.textContent = currentValue + calculatedValue;
  });
}

// ストーリー読むとき
function handleModalClick() {
  // isSeeingStoryがtrueの場合連続クリックを防ぐ
  if (isSeeingStory) {
    // 一時的に無効化
    document.getElementById('modal-game').removeEventListener('click', handleModalClick);
    updateStoryText();
    // 少し遅延を置く
    setTimeout(() => {
      document.getElementById('modal-game').addEventListener('click', handleModalClick);
    }, 100);
  }
}

// 初期設定
function initializeGame() {
  // 初期選択肢の設定
  updateChoices();
  // 選択肢にイベントリスナーを追加
  document.querySelectorAll(".choice-card").forEach(card => { 
    card.addEventListener('click', handleChoiceClick);
  });
  // モーダルにイベントリスナーを追加
  document.getElementById('modal-game').addEventListener('click', handleModalClick);
}

// ゲーム初期化
initializeGame();

// イベントリスナーの重複登録を防ぐためのフラグ管理
const gameState = {
  isStoryInProgress: false,
  currentStoryPhase: 'initial', // 'initial', 'jewStory', 'middleStory'
  storyListeners: new Set()
};

// ストーリーリスナーの管理
function addStoryListener(element, listener) {
  if (!gameState.storyListeners.has(listener)) {
    element.addEventListener('click', listener);
    gameState.storyListeners.add(listener);
  }
}

function removeStoryListener(element, listener) {
  if (gameState.storyListeners.has(listener)) {
    element.removeEventListener('click', listener);
    gameState.storyListeners.delete(listener);
  }
}

// ユダヤ人イベント
function displayFindJewStory() {
  if (gameState.currentStoryPhase !== 'initial') return;
  
  gameState.currentStoryPhase = 'jewStory';
  gameState.isStoryInProgress = true;
  
  const textElement = document.getElementById('game-text');
  const modalElement = document.getElementById('modal-game');
  const buttonContainer = document.querySelector(".two-button-container");
  
  const JewStory1 = [
    "――月面基地 ノルトヴァッヘ",
    "灰のような静寂が支配するこの銀の牢獄で、夜は地球よりも深く重く降りてくる。",
    "仄暗い廊下を歩き個室へ戻る途中、格納庫の裏手からかすかな声を聞いた。",
    "金属板の継ぎ目に響く、掠れた低音。古びた旋律。",
    "言葉の意味は、わからなかった――だが、歌の痛みだけは感じ取れた。",
    "耳を澄ますと、それはイディッシュ語だった。忘れ去られた民族の、失われた歌。",
    "扉の隙間から中を覗くと、一人の男がそこにいた。",
    "作業服を着て、機械の影に身を潜めるように座り、ボトルを片手に揺れている。",
    "見た目では分からなかったが、その言葉と旋律がすべてを物語っていた。",
    "「……ユダヤ人か」",
    "呟いた声は、自分のものではないように響いた。",
    "男は黙って振り向いた。",
    "部屋に静寂が落ちた。",
    "あの男を報告し、本国に送るべきか？ それとも、何も見なかったふりをするべきか？",
    "彼の身柄を本国に差し出せばある程度の報酬が見込めるが、彼がどうなるかは分からない"
  ];
  
  let storyIndex = 0;
  textElement.textContent = JewStory1[storyIndex];

  const storyClickHandler = () => {
    if (!gameState.isStoryInProgress) return;
    
    storyIndex++;
    if (storyIndex < JewStory1.length) {
      textElement.textContent = JewStory1[storyIndex];
    } else {
      removeStoryListener(modalElement, storyClickHandler);
      buttonContainer.style.display = "flex";
    }
  };

  addStoryListener(modalElement, storyClickHandler);
}

// // 選択肢 - 上
function displaySaveJewStory() {
  const textElement = document.getElementById('game-text');
  const modalElement = document.getElementById('modal-game');
  
  gameState.isStoryInProgress = true;
  const saveJewStory = [
    "私は一歩踏み出しかけて、やめた。",
    "そして静かに背を向けた。",
    "ここには音声ログも監視カメラもない。",
    "誰もこの瞬間を知らない。記録されることも、裁かれることもない。", 
    "「気を付けたまえ。……非・ドイツ民族的な文化は処罰対象だ。ほかのメンバーに見つかるんじゃないぞ」",
    "そういって歩き出す。",
    "男は何も言わずに私の背を見つめていた。",
    "それきり歌声は聞こえなかった。"
  ];
  
  let storyIndex = 0;
  textElement.textContent = saveJewStory[storyIndex];

  const saveJewClickHandler = () => {
    if (!gameState.isStoryInProgress) return;
    
    storyIndex++;
    if (storyIndex < saveJewStory.length) {
      textElement.textContent = saveJewStory[storyIndex];
    } else {
      removeStoryListener(modalElement, saveJewClickHandler);
      gameState.currentStoryPhase = 'middleStory';
      document.getElementById('gameTextBox').classList.add("fast-fadeout-text");
      setTimeout(() => {
        document.getElementById('gameTextBox').classList.remove("fast-fadeout-text");
        document.getElementById('gameTextBox').classList.add("fast-fadein-text");
        displayMiddleStory();
      }, 500);
    }
  };

  addStoryListener(modalElement, saveJewClickHandler);
}

// 選択肢 - 下
function displayPunishJewStory() {
  const textElement = document.getElementById('game-text');
  const modalElement = document.getElementById('modal-game');
  
  gameState.isStoryInProgress = true;
  const punishJewStory = [
    "私は何も言わずに男の部屋を立ち去り、廊下を急ぎ気味に歩いた。",
    "部屋に戻るとすぐに無言で通信端末を開く。",
    "報告は簡潔だった。",
    "数日後、本国からのシャトルが彼を連れ帰った。",
    "報酬として物資 200を手に入れたが、基地にあの歌声はもう戻らなかった。"
  ];
  let storyIndex = 0;
  textElement.textContent = punishJewStory[storyIndex];

  const punishJewClickHandler = () => {
    if (!gameState.isStoryInProgress) return;
    
    storyIndex++;
    if (storyIndex === 2) {
      document.getElementById("resources").textContent = Number(document.getElementById("resources").textContent) + 200;
    }
    if (storyIndex < punishJewStory.length) {
      textElement.textContent = punishJewStory[storyIndex];
    } else {
      removeStoryListener(modalElement, punishJewClickHandler);
      gameState.currentStoryPhase = 'middleStory';
      document.getElementById('gameTextBox').classList.add("fast-fadeout-text");
      setTimeout(() => {
        document.getElementById('gameTextBox').classList.remove("fast-fadeout-text");
        document.getElementById('gameTextBox').classList.add("fast-fadein-text");
        displayMiddleStory();
      }, 500);
    }
  };

  addStoryListener(modalElement, punishJewClickHandler);
}

// ボタンイベントリスナー
document.getElementById('save-Jew').addEventListener('click', function() {
  const buttonContainer = document.querySelector(".two-button-container");
  buttonContainer.classList.add("fast-fadeout");
  setTimeout(() => {
    buttonContainer.style.display = "none";
    gameState.isStoryInProgress = false;
    displaySaveJewStory();
  }, 1000);
});

document.getElementById('punish-Jew').addEventListener('click', function() {
  const buttonContainer = document.querySelector(".two-button-container");
  buttonContainer.classList.add("fast-fadeout");
  setTimeout(() => {
    buttonContainer.style.display = "none";
    gameState.isStoryInProgress = false;
    displayPunishJewStory();
  }, 1000);
});

// 中間ストーリー
function displayMiddleStory() {
  if (gameState.currentStoryPhase !== 'middleStory') return;
  
  const textElement = document.getElementById('game-text');
  const modalElement = document.getElementById('modal-game');
  
  const storySequence = [
    "静かな通信室に音がなった。",
    "本国からの暗号化通信だ。",
    "モニターに目をやると、表示されたのは「南東アジア状況報告」の見出しだった。",
    ">インドネシアで大規模な反乱が勃発",
    ">日本軍の現地統治に対する武装蜂起が発生",
    "「また新たな火種か……」",
    "以前から東アジア情勢はきな臭かったが、ずいぶんと悪化したようだった。",
    "フィリピンの内戦が終わる気配はなく、そして今度はインドネシアか。",
    "あの地域の安定はどこに行ったんだ。",
    "静かな月の裏側で、地球の火はゆっくりと広がっている。",
    "白と黒の世界の中に、赤い光が滲みはじめていた。"
  ];
  
  let storyIndex = 0;
  textElement.textContent = storySequence[storyIndex];

  const middleStoryClickHandler = () => {
    if (!gameState.isStoryInProgress) return;
    
    storyIndex++;
    if (storyIndex < storySequence.length) {
      textElement.textContent = storySequence[storyIndex];
    } else {
      removeStoryListener(modalElement, middleStoryClickHandler);
      gameState.isStoryInProgress = false;
      changeToGame2();
    }
  };
  addStoryListener(modalElement, middleStoryClickHandler);
}

function changeToGame2() {
  // 数値を別のモーダルで使えるように取得
  const currentResources = document.getElementById('resources').textContent;
  const currentResourcesNum = parseInt(currentResources ,10); // 補給はこのターンも継続
  const currentRelations = document.getElementById('relations').textContent;
  const currentProgress = document.getElementById('progress').textContent;
  const currentPersonnel = document.getElementById('personnel-count').textContent;
  const currentMoonDevelopment = document.getElementById('moon-development').textContent;
  // それを新しいモーダルに入れる
  document.getElementById('resources2').textContent = currentResourcesNum + 500 * window.gameDataByChar.hokyuu;
  document.getElementById('relations2').textContent = currentRelations;
  document.getElementById('progress2').textContent = currentProgress;
  document.getElementById('personnel-count2').textContent = currentPersonnel;
  document.getElementById('moon-development2').textContent = currentMoonDevelopment;
  // いれる処理が終わってからid: modal-gameを非表示にし、id: modal-game2を表示
  document.getElementById('gameTextBox').classList.remove("fast-fadein-text");
  document.getElementById('gameTextBox').classList.add("fast-fadeout-text");
  setTimeout(function(){
    document.getElementById('modal-game').style.display = "none";
    document.getElementById('modal-game2').style.display = "block";
  }, 500);
}