// 人員コピペしただけ
const decreasePersonnel2 = function(){
  // 人員を減らすボタンの処理
  const countElement = document.getElementById("personnel-count2");
  const decreaseButton = document.getElementById("personnel-decrease2");
  const increaseButton = document.getElementById("personnel-increase2");
  // 現在の人員を取得
  let count = parseInt(countElement.textContent, 10);
  // 人員を10減らす
  count = count - 10;
  countElement.textContent = count;
  // 消費予想も反映
  UpdateResourcesCost2(count);
  // 効果予想も更新
  updateEffects2(count);
  // 一定の範囲内になるように
  if (count <= 30) {
    decreaseButton.style.visibility = "hidden"; // レイアウト計算を保ったまま非表示
  }
  if (count < 90) {
    increaseButton.style.visibility= "visible"; // 表示
  }
};
const increasePersonnel2 = function(){
  // 人員を増やすボタンの処理
  const countElement = document.getElementById("personnel-count2");
  const decreaseButton = document.getElementById("personnel-decrease2");
  const increaseButton = document.getElementById("personnel-increase2");
  // 現在の人員を取得
  let count = parseInt(countElement.textContent, 10);
  // 人員を10増やす
  count = count + 10;
  countElement.textContent = count;
  // 消費予想も反映
  UpdateResourcesCost2(count);
  // 効果予想も更新
  updateEffects2(count);
  // 一定の範囲内になるように
  if (count > 30) {
    decreaseButton.style.visibility = "visible"; // 表示
  }
  if (count >= 90) {
    increaseButton.style.visibility = "hidden"; // 非表示
  }
};

// ボタンにイベントリスナーを追加
document.getElementById("personnel-decrease2").addEventListener("click", decreasePersonnel2);
document.getElementById("personnel-increase2").addEventListener("click", increasePersonnel2);

function UpdateResourcesCost2(count) {
  const costElement = document.getElementById("resources-cost2");
  // 予想消費を更新
  const shouhiCost = Math.floor(200 + count * 5 * window.gameDataByChar.shouhi);
  const hokyuuCost = 500 * window.gameDataByChar.hokyuu;
  costElement.textContent = "-" + shouhiCost + " +" + hokyuuCost;
};
  // 獲得スコアを更新
function updateEffects2(count) {
  const scoreRatio = [1, 1.13, 1.23, 1.31, 1.38, 1.44, 1.5];
  const ratioIndex = Math.floor((count - 30) / 10);
  // 範囲内に収める（0未満は0、配列長以上は最大値）
  const safeIndex = Math.max(0, Math.min(ratioIndex, scoreRatio.length - 1));
  const ratio = scoreRatio[safeIndex];
  // 現在表示されている選択肢を取得
  const choiceCards = document.querySelectorAll(".choice-card2");
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

const gameScenarios2 = [
    [
      {
        title: '大日本帝国基地からの連絡',
        effects: [{ stat: 'relations', value: 10 }, { stat: 'resources', value: -200 }],
        stories: [
          '1962年12月5日、一件の通信があった。',
          '大日本帝国華陽基地からだった。',
          'かの国では泥沼化した共栄圏情勢により、月面への物資援助が滞っているという。',
          "そこで少しの援助が欲しい、と。",
          "我々は少し迷ったが、彼らを助けることにした。"
        ],
        buttonText: "彼らは敵ではない。少なくとも、今は。"
      },
      {
        title: '通信システム拡張',
        effects: [{ stat: 'progress', value: 15 }],
        stories: [
          '新しい衛星通信システムの設置を開始。',
          '地球との通信が劇的に改善される。',
          '高速データ伝送の実験に成功。'
        ],
        buttonText: "実験は成功だ"
      },
      {
        title: '緊急対応訓練',
        effects: [{ stat: 'moon-development', value: 12 }],
        stories: [
          '宇宙飛行士が極限状況下での生存訓練を実施。',
          '複雑な救助シミュレーションを完了。',
          '危機管理能力が大幅に向上。'
        ],
        buttonText: "我々はどんな状況でも生き延びられるだろう"
      }
    ],
    [
      {
        title: '兵站船の墜落',
        effects: [{ stat: 'resources', value: -50 }, { stat: 'progress', value: -5 }],
        stories: [
          '補給船が着陸中に制御不能となり墜落。',
          '積荷の大半が損壊し、研究資料も消失した。',
          'この損失は痛い。'
        ],
        buttonText: "痛手は避けられなかった"
      },
      {
        title: '暗号通信の漏洩',
        effects: [{ stat: 'relations', value: -10 }],
        stories: [
          '機密通信の一部が外部に漏洩した可能性が浮上。',
          '日本側のメディアに我々の計画の断片が掲載される。',
          '関係当局が調査に乗り出したが、影響は避けられない。'
        ],
        buttonText: "誰が漏らした？"
      },
      {
        title: '研究班の内部対立',
        effects: [{ stat: 'progress', value: -10 }],
        stories: [
          '複数の主任研究員の意見が真っ向から対立。',
          '実験方針を巡って口論が続き、進行が停止。',
          '上層部の介入により一時的に収束するも、火種は消えていない。'
        ],
        buttonText: "科学も政治だ"
      },
    ],
    [
      {
        title: '月面資源の過剰採掘',
        effects: [{ stat: 'resources', value: 20 }],
        stories: [
          '資源枯渇を懸念する声を無視して採掘を強行。',
          '予想を超える成果が得られるが、環境破壊が深刻化。',
          '長期的な影響を懸念する研究者たちの抗議が高まる。'
        ],
        buttonText: "資源が必要なのだ"
      },
      {
        title: '人体改良実験',
        effects: [{ stat: 'progress', value: 25 }],
        stories: [
          '極限環境に適応するための人体改良実験が始まる。',
          '実験対象者の中に未知の副作用を示す者が現れる。',
          '成果と倫理の間で苦悩しながらも研究が続行される。'
        ],
        buttonText: "これでいいのか？？"
      },
      {
        title: '月面防衛システム強化',
        effects: [{ stat: 'moon-development', value: 22 }],
        stories: [
          '基地の防衛を目的とした自動砲塔の設置が進む。',
          '軍事利用への転用を懸念する声が上がる。',
          'システムは完成し、基地の防御力が大幅に向上する。'
        ],
        buttonText: "戦争はしたくないものだが"
      }
    ],
    [
      {
        title: '月面反乱の鎮圧',
        effects: [{ stat: 'relations', value: -10 }, { stat: 'moon-development', value: 15 }],
        stories: [
          '一部の作業員が待遇改善を求め反乱を起こす。',
          '武力による鎮圧が行われ、反乱は収束。',
          'その後、労働環境の改善策が導入される。'
        ],
        buttonText: "仕方ない"
      },
      {
        title: '核廃棄物の処理施設設置',
        effects: [{ stat: 'progress', value: 15 }],
        stories: [
          '核実験の副産物処理のため新施設が建設される。',
          '作業員たちが危険な環境に直面し、士気が低下。',
          '最終的に効率的な処理方法が確立される。'
        ],
        buttonText: "一安心だな"
      },
      {
        title: '自律型探査機の試験運用',
        effects: [{ stat: 'resources', value: 15 }, { stat: 'progress', value: 10 }],
        stories: [
          '新型探査機が月面での自律運用を開始。',
          '通信トラブルや制御ミスで一時運用が中断される。',
          '調整後、探査機は予想以上の成果を上げる。'
        ],
        buttonText: "実験は成功だ"
      }
    ]
  ]  
  
  
// つかいそう
const choiceCards2 = document.querySelectorAll(".choice-card2");
const gameText2 = document.getElementById("game-text2");
const modalGame2 = document.getElementById("modal-game2");
const gameButton2 = document.getElementById("game-button-will2");
let currentRound2 = 0;
let currentScenarioIndex2 = 0;
let currentStoryIndex2 = 0;
let isSeeingStory2 = false;
let hasSavedJPN = false; // 分岐に使用
let hasSavedJew = false; // 分岐に使用


// 選択肢を更新
function updateChoices2() {
  choiceCards2.forEach((card, index) => {
    const scenario = gameScenarios2[currentRound2][index];
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
    card.id = `selestion2-${index + 1}`;
  });
  // 物資の補充はどうする？
  // resetToChoices2のなかにありますよ～
}
  
// ストーリーテキストを更新
function updateStoryText2() {
  const currentScenario = gameScenarios2[currentRound2][currentScenarioIndex2];
  const gameTextElement = document.getElementById('game-text2');  
  if (currentStoryIndex2 < currentScenario.stories.length) {
    gameTextElement.textContent = currentScenario.stories[currentStoryIndex2];
    currentStoryIndex2++;
  } else {
    // ストーリーの最後ならボタンを表示
    document.getElementById("game-button-will2").style.display = "flex";
    document.getElementById("game-button-will2").classList.add("fast-fadein");
  }
}
document.getElementById("game-button-will2").addEventListener("click", resetToChoices2);
  
function resetToChoices2() {
  currentRound2++;
  currentStoryIndex2 = 0;
  isSeeingStory2 = false;

  document.getElementById("game-button-will2").style.display = "none";
  document.getElementById("gameTextBox2").classList.add("no-display");
  document.getElementById("gameTextBox2").classList.remove("yes-display");  
  document.getElementById("game2-choice").classList.remove("no-display", "fast-fadeout");
  document.getElementById("game2-choice").classList.add("fast-fadein");
  // 新しい選択肢
  if (currentRound2 < gameScenarios2.length) {
    updateChoices2();
    updateEffects2(Number(document.getElementById('personnel-count2').textContent));
    console.log("更新しました: ゲーム選択肢");
    // 物資を補充(ここに書けば初手で実行されないな)
    const resourcesElement = document.getElementById("resources2");
    let resources = parseInt(resourcesElement.textContent, 10);
    resources += 500 * window.gameDataByChar.hokyuu;
    resourcesElement.textContent = resources;
    console.log("補給適用倍率: 500 * " + window.gameDataByChar.hokyuu);
  } else {
    // ゲーム終了処理（後で関数書いて入れておく）
    console.log("終了 - ゲームコンテンツ");
    document.getElementById("game2-choice").classList.remove("fast-fadein");
    document.getElementById("game2-choice").classList.add("no-display");
    document.getElementById("gameTextBox2").classList.remove("yes-display", "fast-fadein-text");
    document.getElementById("gameTextBox2").classList.add("no-display");
    determineEnding();
  }
}
  
// 選択肢クリック時
function handleChoiceClick2(event) {
  event.stopPropagation();
  if (isSeeingStory2) return;
  isSeeingStory2 = true;
  // 物資を減少
  const personnelCount = parseInt(document.getElementById("personnel-count2").textContent, 10);
  const resourcesElement = document.getElementById("resources2");
  let resources = parseInt(resourcesElement.textContent, 10);
  const resourceCost = 200 + personnelCount * 5 * window.gameDataByChar.shouhi;
  resources -= resourceCost;
  if (resources < 0) {
    console.log("Failed to Resource-Control");
    determineEndingToBadEnd();
  }
  resourcesElement.textContent = resources;
  console.log("消費適用倍率: 200 + " + personnelCount + " * 5 * " + window.gameDataByChar.shouhi);
  // クリックされた選択肢カードを特定し、対応するシナリオのインデックスを取得
  const choiceCards = document.querySelectorAll(".choice-card2");
  choiceCards.forEach((card, index) => {
    if (card === event.currentTarget) {
      currentScenarioIndex2 = index;
      // 日本を救った場合、記録
      if (currentRound2 === 0 && gameScenarios2[currentRound2][index].title === "大日本帝国基地からの連絡") {
        hasSavedJPN = true;
        console.log("記録しました: 日本基地 - 救済");
      }
      // ボタンテキストを取得して書き換え
      const buttonText = gameScenarios2[currentRound2][index].buttonText;
      if (buttonText) {
        document.getElementById("game-button-will2").textContent = buttonText;
      }
    }
  });
  // ステータスの更新を追加
  const selectedScenario = gameScenarios2[currentRound2][currentScenarioIndex2];
  updateStatus2(selectedScenario.effects, personnelCount); // あとでかく
  // 選択肢を消してテキストを表示
  document.getElementById("game2-choice").classList.add("fast-fadeout");  
  setTimeout(function(){ 
    document.getElementById("game2-choice").classList.add("no-display"); 
    document.getElementById("gameTextBox2").classList.remove("no-display"); 
    document.getElementById("gameTextBox2").classList.add("yes-display"); 
    document.getElementById("gameTextBox2").classList.add("fast-fadein-text");     
    // 最初のストーリーテキストを表示
    updateStoryText2();
  }, 500);
}

// ステータスを更新する関数を追加
function updateStatus2(effects, personnelCount) {
  // 人員により倍率適用
  const scoreRatio = [1, 1.13, 1.23, 1.31, 1.38, 1.44, 1.5];
  const ratioIndex = Math.floor((personnelCount - 30) / 10);
  // 範囲内に収める（0未満は0、配列長以上は最大値）
  const safeIndex = Math.max(0, Math.min(ratioIndex, scoreRatio.length - 1));
  const ratio = scoreRatio[safeIndex];
  effects.forEach(effect => {
    const statElement = document.getElementById(`${effect.stat}2`);
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
function handleModalClick2() {
  // isSeeingStoryがtrueの場合連続クリックを防ぐ
  if (isSeeingStory2) {
    // 一時的に無効化
    document.getElementById('modal-game2').removeEventListener('click', handleModalClick2);
    updateStoryText2();
    // 少し遅延を置く
    setTimeout(() => {
      document.getElementById('modal-game2').addEventListener('click', handleModalClick2);
    }, 100);
  }
}

// 初期設定
function initializeGame2() {
  // 初期選択肢の設定
  updateChoices2();
  // 選択肢にイベントリスナーを追加
  document.querySelectorAll(".choice-card2").forEach(card => { 
    card.addEventListener('click', handleChoiceClick2);
  });
  // モーダルにイベントリスナーを追加
  document.getElementById('modal-game2').addEventListener('click', handleModalClick2);
}
initializeGame2();



// 分岐

document.querySelector("#save-Jew").addEventListener("click", function() {
  // 別にいいんだけどなんでquerySelector使っているんだ
  hasSavedJew = true;
  console.log("記録しました: 男 - 救済")
});

function determineEnding() {
  // √分岐system
  const Relations = Number(document.getElementById("relations2").textContent);
  const Progress = Number(document.getElementById("progress2").textContent);
  const Development = Number(document.getElementById("moon-development2").textContent);
  console.log("最終スコア: " + "研究: " + Progress + ", 開発: " + Development + ", 関係: " + Relations);
  if (Progress >= 100) {
    // 誰につく？の分岐
    document.getElementById("ENDING_TYPE").textContent = "TYPE_1";
    document.getElementById("modal-game").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game").style.display = "none";
      document.getElementById("modal-ending").style.display = "block";
      document.getElementById("modal-ending").classList.add("fadein");
    }, 1000);
  } else if (Relations >= 100 && Development >= 100 && hasSavedJPN == true && hasSavedJew == true) {
    // 日本と統合（ドイツ優位）
    document.getElementById("ENDING_TYPE").textContent = "TYPE_2";
    document.getElementById("modal-game").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game").style.display = "none";
      document.getElementById("modal-ending").style.display = "block";
      document.getElementById("modal-ending").classList.add("fadein");
    }, 1000);
  } else if (Development >= 100 && hasSavedJew == true) {
    // 月面帝国
    document.getElementById("ENDING_TYPE").textContent = "TYPE_3";
    document.getElementById("modal-game").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game").style.display = "none";
      document.getElementById("modal-ending").style.display = "block";
      document.getElementById("modal-ending").classList.add("fadein");
    }, 1000);
  } else if (Relations >= 100 && hasSavedJPN == true) {
    // 日本と統合（日本優位）
    document.getElementById("ENDING_TYPE").textContent = "TYPE_4";
    document.getElementById("modal-game").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game").style.display = "none";
      document.getElementById("modal-ending").style.display = "block";
      document.getElementById("modal-ending").classList.add("fadein");
    }, 1000);
  } else {
    determineEndingToBadEnd();
    console.log("分岐条件にあてはまりませんでした");
  }
}
function determineEndingToBadEnd(){
  // すべて終わっていないor物資が足りなくなる
  document.getElementById("ENDING_TYPE").textContent = "BADEND";
  document.getElementById("modal-game").classList.add("fadeout");
  setTimeout(() => {
    document.getElementById("modal-game").style.display = "none";
    document.getElementById("modal-ending").style.display = "block";
    document.getElementById("modal-ending").classList.add("fadein");
  }, 1000);
}

// 
function AnimationOfResultModal() {
  const imgWrap = document.querySelector('.img-wrap');
  const lineContainer = document.querySelector('.line-container');
  const lines = document.querySelectorAll('.line');

  // 画像アニメーションを再実行
  imgWrap.classList.remove('animate');
  void imgWrap.offsetWidth;
  imgWrap.classList.add('animate');

  // 少し待ってから線を伸ばす（画像アニメ完了後）
  setTimeout(() => {
    // 個別の線のアニメーション
    lines.forEach(line => {
      line.classList.remove('animate');
      void line.offsetWidth;
      line.classList.add('animate');
    });

    // 1.5秒後に位置を上に移動
    setTimeout(() => {
      imgWrap.style.top = '10%';
      lineContainer.style.top = '10%';

      // 🕒 アニメーション完了後の表示処理（ここが新しく追加された部分）
      setTimeout(() => {
        const title = document.getElementById('result-title');
        const listItems = document.querySelectorAll('#result-requirement li');
        const button = document.getElementById('result-button');
        let delay = 0;

        // タイトル表示
        setTimeout(() => {
          title.classList.remove('no-display');
          title.classList.add("fast-fadein");
        }, delay);
        delay += 200;

        // リストの各項目を順に表示
        listItems.forEach((li, index) => {
          setTimeout(() => {
            li.classList.remove('no-display');
            li.classList.add("fast-fadein");
          }, delay + index * 200);
        });

        // 最後にボタン表示（リストの後）
        setTimeout(() => {
          button.classList.remove('no-display');
          button.classList.add("fast-fadein");
          button.classList.add("active");
        }, delay + listItems.length * 200);

      }, 1000); // 上移動完了からさらに 1秒後
    }, 750);
  }, 750); // 最初の画像アニメ開始から 750ms
}
