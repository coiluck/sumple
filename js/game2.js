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
          '1962年12月5日、途絶えていた通信回線が一瞬だけ開いた。',
          '発信元は、東方に位置する大日本帝国の華陽基地。',
          '共栄圏の混迷が月面の物流にも影を落とし、物資が枯渇しつつあるという。',
          '援助を乞う彼らの言葉は、どこか芝居がかっていたが、無視はできなかった。',
          "我々は少し迷ったが、支援を決定した。"
        ],
        buttonText: "彼らは敵ではない。少なくとも、今は。"
      },
      {
        title: '植物プラント施設',
        effects: [{ stat: 'moon-development', value: 15 }],
        stories: [
          '月面に自給自足の基盤を築くべく、全自動の植物プラント建設が開始された。',
          '冷たい金属の壁に囲まれた温室に、初めての緑が芽吹く。',
          'これは生命の実験ではなく、支配の証だ。我々は、地球の重力からも独立しようとしている。'
        ],
        buttonText: "これは未来の植民地の礎だ"
      },
      {
        title: '共同研究の提案を拒絶',
        effects: [{ stat: 'progress', value: 12 }],
        stories: [
          '大日本帝国から、月面の地質調査に関する共同研究の申し出が届いた。',
          '我々は機密保持を理由に、丁重ながら断固としてこれを拒絶した。',
          'その選択は、静かに国際関係の気温を数度下げた。',
          "冷たく、そして長く続く冬のように。"
        ],
        buttonText: "信頼なき協力は、ただの隙だ"
      }
    ],
    [
      {
        title: '地下核精製実験の開始',
        effects: [{ stat: 'resources', value: -50 }, { stat: 'progress', value: 5 }],
        stories: [
          '月面地下深部にて、核物質の精製実験が秘密裏に開始された。',
          '想定以上の放射線遮蔽コストと機材故障に見舞われつつも、第一段階は成功を収めた。',
          '地球に戻れば、これは外交の切り札、もしくは開戦の導火線となるだろう。'
        ],
        buttonText: "この成果は国家の切り札となる"
      },
      {
        title: '文化的親善交流',
        effects: [{ stat: 'relations', value: 10 }],
        stories: [
          '日本人スタッフを招いた月面文化観測会が、控えめに行われた。',
          '展示された書物と器具の数はわずかだが、その背後には国家と国家の視線があった。',
          'このわずかな融和も、やがて未来を形作るかもしれない。'
        ],
        buttonText: "氷は、わずかに溶け始めた"
      },
      {
        title: '研究棟の居住転用',
        effects: [{ stat: 'moon-development', value: 10 }, { stat: "progress", value: -5 }],
        stories: [
          '研究棟の一部を居住支援施設へ転用し、酸素供給能力はわずかに向上した。',
          '研究速度は一時的に低下したが、環境の安定は何にも代えがたい。',
          '生き延びるための選択だった。科学は、生存者の手によってのみ継がれるのだから。'
        ],
        buttonText: "死者に進歩はもたらせない"
      },
    ],
    [
      {
        title: '月面資源の過剰採掘',
        effects: [{ stat: "moon-development", value: 5 }, { stat: 'resources', value: 200 }],
        stories: [
          '慎重論を押し切り、月面地下資源の強行採掘が実施された。',
          '短期間で膨大な鉱物が得られたが、地層は破壊され、周囲の安定性が危ぶまれている。',
          'だが、空虚な倉庫より、脆い地盤のほうがまだ役に立つ。'
        ],
        buttonText: "先を見れば足元は見えぬ"
      },
      {
        title: '無人区域での新型核爆発試験',
        effects: [{ stat: 'progress', value: 25 }],
        stories: [
          '月面無人区域にて、最新型の核爆弾実験が行われた。',
          '爆発波と放射線散布のデータは、計画を遥かに上回る精度を示した。',
          'クレーターに残された焦土。それは科学の証か、破滅の前兆か。'
        ],
        buttonText: "科学に後退は許されない"
      },
      {
        title: '日本の調査チームの保護',
        effects: [{ stat: 'relations', value: 22 }],
        stories: [
          '突発的な通信障害の中、日本側調査隊からの支援信号を受信した。',
          '我々は彼らを一時的に保護。正式な報告も、政治的意図も交わされなかった。',
          'が、あの安堵の表情だけは、今も脳裏に焼きついている。'
        ],
        buttonText: "恩を売る―――それもまた戦略だ"
      }
    ],
    [
      {
        title: '居住設備の段階的刷新',
        effects: [ { stat: 'moon-development', value: 15 }],
        stories: [
          '長く放置されていた居住設備の刷新が、ようやく始まった。',
          '小さな個室、安定した温度管理、音漏れしない壁――それだけのことが、命をつなぐ。',
          '小さな快適さが、大きな士気へと繋がる。'
        ],
        buttonText: "日常こそ、最も強固な防衛だ"
      },
      {
        title: '核廃棄物の処理施設設置',
        effects: [{ stat: 'progress', value: 15 }],
        stories: [
          '月面地下に、核実験の遺物が積み上がっていた。',
          '腐蝕する容器と崩壊熱が、静かに危機を呼んでいた。',
          '遅すぎた措置――だが、これ以上の災厄は避けねばならない。'
        ],
        buttonText: "進歩には、影がついてまわる"
      },
      {
        title: '観測データの共有',
        effects: [{ stat: 'relations', value: 15 }, { stat: 'progress', value: -5 }],
        stories: [
          '月面の気象データと観測結果を、日本側と共有することで合意した。',
          '信頼とはまだ言えない。軍事的価値を持たぬ範囲での情報共有のみだ。',
          '言葉ではない。沈黙が、真の距離を物語っている。'
        ],
        buttonText: "冷たい同盟ほど、長く続く"
      }
    ],
    [
      {
        title: '淡水循環技術の試験導入',
        effects: [{ stat: 'relations', value: 10 }, { stat: 'moon-development', value: 5 }],
        stories: [
          '日本側の水処理技術に倣い、独自の再現実験が行われた。',
          '共同開発ではない。模倣と検証による独自路線だ。',
          '依存はせぬ。だが進歩の形を問う余裕も、もはやない。'
        ],
        buttonText: "自給こそが、統治の第一歩だ"
      },
      {
        title: '核兵器の完全配備',
        effects: [{ stat: 'progress', value: 15 }],
        stories: [
          '月面における核兵器の完全配備が完了した。',
          'それは防衛ではない。抑止であり、宣告である。',
          '誰もが知っている。この沈黙の衛星は、もう安全ではない。'
        ],
        buttonText: "沈黙の中にこそ、最大の威圧が宿る"
      },
      {
        title: '秘密裏に第二拠点を築く',
        effects: [{ stat: 'relations', value: -15 }, { stat: 'moon-development', value: 20 }],
        stories: [
          '大日本帝国との取り決めであった月面生活圏の協定を無視し、第二拠点を建設する計画が持ち上がった',
          '実現すればかの国との政治的対立は避けられないだろうが、我々は月面開発の主導権を握ることができるだろう',
          'やがてこの月は、完全に一つの旗のもとに統一されるだろう。'
        ],
        buttonText: "月面は帝国の「陽の当たる場所」だ"
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
    } else if (effect.stat === 'relations' && value >= 0) {
      value *= window.gameDataByChar.kannkei;
    } else if(effect.stat === 'resources') {
      // resourcesの場合は比率適用しない
      value = effect.value;  
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
    // modal-resultの設定
    document.getElementById("result-title").textContent = "誰につくか選ぶ";
    addItemsToList(["研究が終わっている"]);
    // これだけこの中の分岐を
    if (hasSavedJew == false) {
      document.getElementById("ENDING_TYPE1_HEYDRICH").textContent = "true"
    }
    if (hasSavedJPN == true && Relations >= 100) {
      document.getElementById("ENDING_TYPE1_BETRAY").textContent = "true"
    }
    if (hasSavedJew == true && Development >= 100) {
      document.getElementById("ENDING_TYPE1_SHINETHESUN").textContent = "true"
    }
    // モーダル移行
    document.getElementById("ENDING_TYPE").textContent = "TYPE_1";
    document.getElementById("modal-game2").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game2").style.display = "none";
      document.getElementById("modal-result").style.display = "block";
      document.getElementById("modal-result").classList.add("fadein");
      setTimeout(() => {
        AnimationOfResultModal()
      }, 1500);
    }, 1000);
  } else if (Relations >= 100 && Development >= 100 && hasSavedJPN == true) {
    // 日本と統合（ドイツ優位）
    // modal-resultの設定
    document.getElementById("result-title").textContent = "日本基地の傘下に入る";
    addItemsToList(["研究が終わっていない"],["関係値が100以上"],["月面開発が100以上"],["日本基地を救った"]);
    // モーダル移行
    document.getElementById("ENDING_TYPE").textContent = "TYPE_2";
    document.getElementById("modal-game2").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game2").style.display = "none";
      document.getElementById("modal-result").style.display = "block";
      document.getElementById("modal-result").classList.add("fadein");
      setTimeout(() => {
        AnimationOfResultModal()
      }, 1500);
    }, 1000);
  } else if (Development >= 100 && hasSavedJew == true) {
    // 月面帝国
    // modal-resultの設定
    document.getElementById("result-title").textContent = "月面帝国を築く";
    addItemsToList(["研究が終わっていない"],["月面開発が100以上"],["ユダヤ人を見逃した"]);
    // モーダル移行
    document.getElementById("ENDING_TYPE").textContent = "TYPE_3";
    document.getElementById("modal-game2").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game2").style.display = "none";
      document.getElementById("modal-result").style.display = "block";
      document.getElementById("modal-result").classList.add("fadein");
      setTimeout(() => {
        AnimationOfResultModal()
      }, 1500);
    }, 1000);
  } else if (Relations >= 100 && hasSavedJPN == true) {
    // 日本と統合（日本優位）
    // modal-resultの設定
    document.getElementById("result-title").textContent = "日本基地の傘下に入る";
    addItemsToList(["研究が終わっていない"],["関係値が100以上"],["日本基地を救った"]);
    // モーダル移行
    document.getElementById("ENDING_TYPE").textContent = "TYPE_4";
    document.getElementById("modal-game2").classList.add("fadeout");
    setTimeout(() => {
      document.getElementById("modal-game2").style.display = "none";
      document.getElementById("modal-result").style.display = "block";
      document.getElementById("modal-result").classList.add("fadein");
      setTimeout(() => {
        AnimationOfResultModal()
      }, 1500);
    }, 1000);
  } else {
    determineEndingToBadEnd();
    console.log("分岐条件にあてはまりませんでした");
  }
}
function determineEndingToBadEnd(){
  // すべて終わっていないor物資が足りなくなる
  // modal-resultの設定
  document.getElementById("result-title").textContent = "Bad End";
  addItemsToList(["他4つの分岐条件にあてはまらない"],["または物資の値が負になる"]);
  // モーダル移行
  document.getElementById("ENDING_TYPE").textContent = "BADEND";
  document.getElementById("modal-game2").classList.add("fadeout");
  setTimeout(() => {
    document.getElementById("modal-game2").style.display = "none";
    document.getElementById("modal-result").style.display = "block";
    document.getElementById("modal-result").classList.add("fadein");
    setTimeout(() => {
      AnimationOfResultModal()
    }, 1500);
  }, 1000);
}

// 分岐条件を記載
function addItemsToList(items) {
  const ul = document.getElementById('result-requirement');
  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'no-visible';
    li.textContent = item;
    ul.appendChild(li);
  });
}

// result用のアニメーション
function AnimationOfResultModal() {
  const imgWrap = document.querySelector('.img-wrap');
  const lineContainer = document.querySelector('.line-container');
  const lines = document.querySelectorAll('.line');

  // 画像アニメーションを実行
  imgWrap.classList.remove('no-display');
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
      // アニメーション完了後の表示処理
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
            li.classList.remove('no-visible');
            li.classList.add("fast-fadein");
          }, delay + index * 200);
        });
        // 最後にボタン表示（リストの後）
        setTimeout(() => {
          button.classList.remove('no-display');
          button.classList.add("fast-fadein");
          button.classList.add("active");
        }, delay + listItems.length * 200 + 200);
      }, 1000); // 上移動完了からさらに 1秒後
    }, 750);
  }, 750); // 最初の画像アニメ開始から 750ms
}
