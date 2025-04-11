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
  // 獲得スコアを更新
};

// キャラ選択後に確定したgameDataByCharを使って更新
document.getElementById("confirm-button").addEventListener("click", function() {
  const count = parseInt(document.getElementById("personnel-count").textContent, 10);
  UpdateResourcesCost(count);
});

// スコア倍率を表示されている選択肢に適用
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


// ゲームシナリオデータ
const gameScenarios = [
  [
    {
      title: '月面基地の拡張',
      effects: [{ stat: 'resources', value: -100 }, { stat: 'development', value: 20 }],
      stories: [
        '月面基地の拡張計画が承認された。',
        '新しい居住区画の建設が始まる。',
        '資材の調達に苦労したが、予定通り進んでいる。',
        '最新技術を取り入れた設備が整いつつある。',
        '拡張工事が完了し、収容人数が2倍になった。'
      ],
      buttonText: "基地の未来に乾杯"
    },
    {
      title: '資源採掘プロジェクト',
      effects: [{ stat: 'resources', value: 150 }, { stat: 'environment', value: -15 }],
      stories: [
        '新たな資源採掘地点が発見された。',
        'ドリル装置の設置が完了した。',
        '予想以上の資源が確認され、チームは沸き立っている。',
        '環境への影響を懸念する声も上がっている。',
        '採掘は成功し、貴重な資源を確保した。'
      ],
      buttonText: "資源は力だ"
    },
    {
      title: '研究施設の強化',
      effects: [{ stat: 'research', value: 25 }, { stat: 'resources', value: -50 }],
      stories: [
        '研究施設の強化計画が提案された。',
        '最新の実験装置が月面へ運ばれる。',
        '科学者たちは新たな発見に胸を躍らせている。',
        '最初の実験結果が届き、期待以上の成果だ。',
        '研究施設の強化により、様々な技術革新が期待できる。'
      ],
      buttonText: "知識こそ最大の武器"
    }
  ],
  [
    {
      title: '外交使節団の派遣',
      effects: [{ stat: 'relations', value: 20 }, { stat: 'resources', value: -30 }],
      stories: [
        '他の月面基地との外交関係を強化するため、使節団の派遣を決定した。',
        '慎重に選ばれた外交官たちが出発の準備を整えている。',
        '最初の会談は緊張した雰囲気の中で始まった。',
        '徐々に信頼関係が築かれ、協力の可能性が見えてきた。',
        '使節団の活動は成功し、複数の協定が結ばれた。'
      ],
      buttonText: "友好は未来への架け橋"
    },
    {
      title: '防衛システムの強化',
      effects: [{ stat: 'security', value: 30 }, { stat: 'relations', value: -10 }],
      stories: [
        '増加する脅威に対抗するため、防衛システムの強化が提案された。',
        '新型センサーと防御兵器の設置が始まる。',
        '周辺基地からは懸念の声が上がっている。',
        'テスト発射が成功し、システムの有効性が確認された。',
        '基地の安全は確保されたが、緊張が高まったことも事実だ。'
      ],
      buttonText: "安全には代償がつきものだ"
    },
    {
      title: '医療技術の革新',
      effects: [{ stat: 'health', value: 25 }, { stat: 'research', value: 15 }],
      stories: [
        '宇宙環境特有の健康問題に対処するため、新たな医療研究が始まった。',
        '実験段階の治療法が開発され、テストが行われている。',
        '初期の結果は有望で、さらなる研究資金が投入された。',
        '画期的な医療機器が完成し、治療効果が劇的に向上した。',
        'この技術革新により、長期的な月面居住の実現可能性が高まった。'
      ],
      buttonText: "健康な体に健全な精神あり"
    }
  ],
  [
    {
      title: '宇宙農業の拡大',
      effects: [{ stat: 'resources', value: 100 }, { stat: 'health', value: 10 }],
      stories: [
        '食料自給率を上げるため、宇宙農業施設の拡大が決定した。',
        '新しい水耕栽培システムが導入され、生産効率が向上した。',
        '品種改良された作物が月面環境で育ち始めている。',
        '最初の収穫祭が行われ、住民たちの士気が上がった。',
        '食料供給が安定し、基地の持続可能性が大きく向上した。'
      ],
      buttonText: "実りある未来へ"
    },
    {
      title: '文化交流イベント',
      effects: [{ stat: 'morale', value: 25 }, { stat: 'relations', value: 15 }],
      stories: [
        '異なる国籍の住民間の結束を強めるため、文化交流イベントが企画された。',
        '音楽、料理、芸術を通じた交流が盛んに行われている。',
        '思いがけない友情が生まれ、基地内の雰囲気が明るくなった。',
        '他の月面基地からの参加者も増え、交流の輪が広がっている。',
        'イベントは大成功を収め、定期的な開催が決まった。'
      ],
      buttonText: "多様性は力なり"
    },
    {
      title: 'エネルギー革命',
      effects: [{ stat: 'technology', value: 30 }, { stat: 'environment', value: 20 }],
      stories: [
        '新型エネルギー源の開発プロジェクトが始動した。',
        '試作機の稼働テストが行われ、高い効率性が確認された。',
        '従来のシステムからの移行作業が着々と進んでいる。',
        '環境負荷の大幅な削減と同時に、出力も向上した。',
        '他の月面基地からも技術提供の要請が来るほどの成功を収めた。'
      ],
      buttonText: "未来のエネルギーを手に入れた"
    }
  ]
];

// グローバル変数
let currentRound = 0;
let currentScenarioIndex = 0;
let currentStoryIndex = 0;
let isSeeingStory = false;

// 選択肢を更新する関数
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
      const sign = effect.value > 0 ? "+" : ""; // 負の場合は+を付けない
      return `${statName}: ${sign}${effect.value}`;
    }).join(', ');
    
    card.querySelector("h3").textContent = scenario.title;
    card.querySelector("p").textContent = effectDescriptions;
    card.id = `selestion${index + 1}`;
  });
}


// ストーリーテキストを更新する関数
function updateStoryText() {
  const currentScenario = gameScenarios[currentRound][currentScenarioIndex];
  const gameTextElement = document.getElementById('game-text');
  
  if (currentStoryIndex < currentScenario.stories.length) {
    gameTextElement.textContent = currentScenario.stories[currentStoryIndex];
    currentStoryIndex++;
  } else if (currentRound === 1) { // 2ラウンド目の終了時に中間ストーリーへ
    console.log("中間ストーリーに移行します");
    // ストーリーの最後ならボタンを表示（ただし特別な関数を設定）
    const button = document.getElementById("game-button-will");
    button.textContent = currentScenario.buttonText;
    button.style.display = "flex";
    
    // モーダルのイベントリスナーを削除
    document.getElementById('modal-game').removeEventListener('click', handleModalClick);
    
    // ボタンに特別なイベントリスナーを追加
    button.onclick = showMiddleStory(); // この部分を変更
  } else {
    // ストーリーの最後ならボタンを表示
    const button = document.getElementById("game-button-will");
    button.textContent = currentScenario.buttonText;
    button.style.display = "flex";
    
    // モーダルのイベントリスナーを削除
    document.getElementById('modal-game').removeEventListener('click', handleModalClick);
    
    // ボタンにイベントリスナーを追加
    button.onclick = resetToChoices; // この部分を変更
  }
}

// 選択肢画面に戻る関数
function resetToChoices() {
  // 既存のイベントリスナーを削除
  const button = document.getElementById("game-button-will");
  button.onclick = null;
  
  currentRound++;
  currentStoryIndex = 0;
  isSeeingStory = false;

  button.style.display = "none";
  document.getElementById("gameTextBox").classList.remove("yes-display");
  document.getElementById("gameTextBox").classList.add("no-display");
  document.getElementById("game-choice").style.display = "block";
  
  // 新しい選択肢を表示（まだラウンドがある場合）
  if (currentRound < gameScenarios.length) {
    updateChoices();
    console.log("ゲーム選択肢を更新しました");
    // 物資を補充
    const resourcesElement = document.getElementById("resources");
    let resources = parseInt(resourcesElement.textContent, 10);
    resources += 500 * window.gameDataByChar.hokyuu;
    resourcesElement.textContent = resources;
  } else {
    // ゲーム終了処理
    console.log("ゲーム終了");
    document.getElementById("game-choice").style.display = "none";
    determineEnding();
  }
}

// 選択肢クリック時の処理
function handleChoiceClick(event) {
  if (isSeeingStory) return;
  // 物資の減少
  const personnelCount = parseInt(document.getElementById("personnel-count").textContent, 10);
  const resourcesElement = document.getElementById("resources");
  let resources = parseInt(resourcesElement.textContent, 10);
  const resourceCost = Math.floor(200 + personnelCount * 5 * window.gameDataByChar.shouhi);
  resources -= resourceCost;
  resourcesElement.textContent = resources;
  // 物資が0未満になった場合
  if (resources < 0) {
    console.log("失敗しました - 物資管理");
    determineEndingToBadEnd();
  }
  // 選択肢の効果を反映
  // クリックされた選択肢カードに対応するシナリオのインデックスを取得
  let selectedScenarioIndex = -1;
  const choiceCards = document.querySelectorAll(".choice-card");
  choiceCards.forEach((card, index) => {
    if (card === event.currentTarget) {
      selectedScenarioIndex = index;
      currentScenarioIndex = index;
      // 選択した効果をログに表示
      console.log("今から適用します - ", gameScenarios[currentRound][index].effects);
    }
  });
  // 選択した効果を反映
  if (selectedScenarioIndex !== -1) {
    const selectedScenario = gameScenarios[currentRound][selectedScenarioIndex];
    const effects = selectedScenario.effects;
    // 人員数に基づく倍率を計算
    const count = personnelCount;
    const scoreRatio = [1, 1.13, 1.23, 1.31, 1.38, 1.44, 1.5];
    const ratioIndex = Math.floor((count - 30) / 10);
    const safeIndex = Math.max(0, Math.min(ratioIndex, scoreRatio.length - 1));
    const ratio = scoreRatio[safeIndex];
    // 各効果を反映
    effects.forEach(effect => {
      const statElement = document.getElementById(effect.stat);
      if (statElement) {
        const currentValue = parseInt(statElement.textContent, 10);
        let value;
        // 負の値はそのまま
        if (effect.value < 0) {
          value = effect.value;
        } else {
          // 正の値の場合、statに応じて特別処理
          if (effect.stat === 'progress') {
            value = Math.floor(effect.value * ratio * window.gameDataByChar.kennkyuu);
            console.log("スコア適用倍率: " + ratio + " * " + window.gameDataByChar.kennkyuu);
          } else if (effect.stat === 'relations') {
            value = Math.floor(effect.value * ratio * window.gameDataByChar.kannkei);
            console.log("スコア適用倍率: " + ratio + " * " + window.gameDataByChar.kannkei);
          } else {
            value = Math.floor(effect.value * ratio);
            console.log("スコア適用倍率: " + ratio);
          }
        }
        // 新しい値を反映
        statElement.textContent = currentValue + value;
      } else {
        console.warn(`【重要】"${effect.stat}"が見つかりません:(  game.jsのgameScenariosを見直してください`);
      }
    });
  }
  // 選択肢を非表示にしてテキストを表示
  document.getElementById("game-choice").style.display = "none";
  document.getElementById("gameTextBox").classList.remove("no-display");
  document.getElementById("gameTextBox").classList.add("yes-display");
  // 最初のストーリーテキストを表示
  updateStoryText();
  isSeeingStory = true;
  // モーダルにイベントリスナーを追加
  document.getElementById('modal-game').addEventListener('click', handleModalClick);
}

// モーダルクリック時の処理
function handleModalClick() {
  if (isSeeingStory) {
    updateStoryText();
  }
}

// 初期設定
function initializeGame() {
  // 初期選択肢の設定
  updateChoices();
  // 初期人員数に応じた効果の更新
  const initialCount = parseInt(document.getElementById("personnel-count").textContent, 10);
  updateEffects(initialCount);
  // 選択肢にイベントリスナーを追加
  document.querySelectorAll(".choice-card").forEach(card => {
    card.addEventListener('click', handleChoiceClick);
  });
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', function() {
  initializeGame();
});



// 追加する中間イベント
let middleStoryIndex = 0;
const FindStoryTexts = [
  "なぜか配列の0番目だけ表示されない",
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
];
const IndonesiaStoryTexts = [
  "なぜか配列の0番目だけ表示されない",
  "特別なストーリー2",
  "特別なストーリー3",
  "特別なストーリー4"
];
const middleStoryArray = [FindStoryTexts,IndonesiaStoryTexts]
const middleStoryArrayIndex = 0;

function showMiddleStory() {
  console.log("中間ストーリー開始");
  // ボタンのイベントリスナーを削除
  const button = document.getElementById("game-button-will");
  // ボタンを一旦非表示に
  button.style.display = "none";
  if (middleStoryIndex < middleStoryTexts.length) {
    // 次のミドルストーリーテキストを表示
    const gameTextElement = document.getElementById('game-text');
    gameTextElement.textContent = middleStoryTexts[middleStoryIndex];
    middleStoryIndex++;
    // モーダルにイベントリスナーを設定
    document.getElementById('modal-game').addEventListener('click', handleMiddleStoryClick);
  } else {
    // ミドルストーリーが終わったら通常の進行に戻る
    middleStoryIndex = 0;
    resetToChoices();
  }
}

// ミドルストーリー用のクリックハンドラ
function handleMiddleStoryClick() {
  const gameTextElement = document.getElementById('game-text');
  const button = document.getElementById("game-button-will");
  
  if (middleStoryIndex < middleStoryTexts.length) {
    // 次のミドルストーリーテキストを表示
    gameTextElement.textContent = middleStoryTexts[middleStoryIndex];
    middleStoryIndex++;
  } else {
    // すべてのミドルストーリーテキストを表示したらボタンを表示
    button.textContent = "物語を続ける";
    button.style.display = "flex";
    
    // モーダルのイベントリスナーを削除
    document.getElementById('modal-game').removeEventListener('click', handleMiddleStoryClick);
    
    // ボタンにイベントリスナーを追加
    button.onclick = function() {
      // ミドルストーリーのインデックスをリセット
      middleStoryIndex = 0;
      resetToChoices();
    };
  }
}


// 中間後で書いといて


function determineEnding() {
  // √分岐system
  const Relations = Number(document.getElementById("relations").textContent);
  const Progress = Number(document.getElementById("progress").textContent);
  const Development = Number(document.getElementById("moon-development").textContent);
  console.log("最終スコア: " + Relations + "," + Progress + "," + Development);
  if (Progress >= 100) {
    // 誰につく？の分岐
    document.getElementById("ENDING_TYPE").textContent = "TYPE_1";
    document.getElementById("modal-game2").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game").style.display = "none";
      document.getElementById("modal-end").style.display = "block";
      document.getElementById("modal-end").classList.add("fadein");
    }, 1000);
  } else if (Relations >= 100 && Development >= 100 && hasSavedJPN == True) {
    // 日本と統合（ドイツ優位）
    document.getElementById("ENDING_TYPE").textContent = "TYPE_2";
    document.getElementById("modal-game").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game").style.display = "none";
      document.getElementById("modal-end").style.display = "block";
      document.getElementById("modal-end").classList.add("fadein");
    }, 1000);
  } else if (Development >= 100) {
    // 月面帝国
    document.getElementById("ENDING_TYPE").textContent = "TYPE_3";
    document.getElementById("modal-game").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game").style.display = "none";
      document.getElementById("modal-end").style.display = "block";
      document.getElementById("modal-end").classList.add("fadein");
    }, 1000);
  } else if (Relations >= 100 && hasSavedJPN == True) {
    // 日本と統合（日本優位）
    document.getElementById("ENDING_TYPE").textContent = "TYPE_4";
    document.getElementById("modal-game").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game").style.display = "none";
      document.getElementById("modal-end").style.display = "block";
      document.getElementById("modal-end").classList.add("fadein");
    }, 1000);
  } else {
    determineEndingToBadEnd();
  }
}

function determineEndingToBadEnd(){
  // すべて終わっていないor物資が足りなくなる
  document.getElementById("ENDING_TYPE").textContent = "BADEND";
  document.getElementById("modal-game").classList.add("fadeout");
  setTimeout(() => {
    document.getElementById("modal-game").style.display = "none";
    document.getElementById("modal-end").style.display = "block";
    document.getElementById("modal-end").classList.add("fadein");
  }, 1000);
}