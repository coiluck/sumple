const OpeningTextArray1 = [
  { text: "帝都 ゲルマニア" },
  { text: "――世界で最も強大な国の、世界で最も壮麗で、世界で最も不気味な心臓部。" },
  { text: "テキスト3" }
];
const OpeningTextArray2 = [
  { text: "薄暗い部屋にランプの炎が揺れる。"},
  { text: "壁は厚く、小さな窓からはわずかな光しか届かない。" },
  { text: "外界と遮断されたこの場所では、時の流れすら曖昧になる。" },
  { text: "部屋の隅で、煙草の煙がゆっくりと渦を巻いていた。" },
  {
    text: "外界と遮断されたこの場所では、時の流れすら曖昧になる。" ,
  },
  { text: "「……相変わらず、ここは空気が悪いな」" ,
    action: () => {
      document.getElementById("opening-character").classList.remove("no-display");
      console.log("初のキャラ表示");
    } 
  },
  { text: "そう言って笑ったのは、親衛隊士官のハインツだ。" },
  { text: "灰色の制服に黒い手袋でどこか戯けたような口調の男だった。" },
  { text: "彼は机上に置かれたワイングラスに手を伸ばした。"},
  { text: "グラスを傾け、赤ワインを一口飲むと言葉を続ける。"},
  { text: "「打ち上げ、いよいよだな。まさか、お前が月まで行くことになるとは思わなかったぜ。出世したもんだ」"},
  { text: "机に肘をつきながら、彼は冗談めかして言う。"},
  { text: "「まあ、総統に気に入られてるんだろ？ 噂じゃ、お前に管轄権も与えられてるって話だ。すげえな、親衛隊すら口出しできねえってよ」"},
  { text: "軽口とは裏腹に、その言葉の端々には重圧が滲んでいる。  "},
  { text: "「で――そろそろ決めろってさ」"},
  { text: "煙草の火を灰皿に押し付けながら、彼は少し真面目な顔になった。"},
  { text: "「連れて行く人間だ。お前のチームだもの、お前が選ぶ。さて……誰にするんだ？」"},
];
const OpeningTextArray3 = [
  { text: "地鳴りのような振動が、大地を震わせる。  " },
  { text: "巨大なロケットが格納庫の中央にそびえ立つ。" },
  { text: `月面任務用の最新型、"ヴァルキューレII"。その表面には鉄十字が刻まれていた。`},
  { text: "整然と並ぶ兵士たちの列。その前に立つのは、ハインツだった。"},
  { text: "「……総統閣下は、今日は来ない」"},
  { text: "重い声だった。彼の目にはわずかな疲労がにじんでいた。"},
  { text: "「……あの人のことは、今は誰も話したがらない。ドクターたちも口が重い。」" },
  { text: "総統は未だにこの帝国で最も強い力を持っているが、その姿を見る者は稀になった。"},
  { text: "老いと病が肉体を蝕み、怒りだけが最後に残されたもののようだった。"},
  { text: "みな、閣下の機嫌を恐れている――それが、今の帝国の現実だった。" },
  { text: "「ただ、こんな言葉を預かっている」" },
  { text: "“Der Mond ist das Schicksal des Reiches. ”――――月は、帝国の運命なり。" },
  { text: "「たったそれだけだ。……だが、お前になら分かるだろ。その意味も、重さも。だから――頼んだぞ」" },
  { text: "短く、軍人らしい敬礼を交わしたあと、ハインツは小さく笑った。" },
  { text: "「ここで別れるかもしれないが――まあ、死ぬなよ。月の上で死体になったら、帰ってこれないからな」" },
  { text: "ロケットの足元から離れ、スタッフたちは持ち場に戻る。最終チェックが始まる。  " },
  { text: "警報が鳴り、照明が赤く染まる。" },
  { text: "> 3……" },
  { text: "> 2……" },
  { text: "> 1……" },
  { text: "炎が地を焦がし、空へと突き上がる。" },
  { text: "「――始めよう」" },
  { text: "私は、静かにその言葉を口にした。" },
  { text: "「始めよう――ライヒ最後の征服を！」  " },
];
const TextArrays = [
  OpeningTextArray1,
  OpeningTextArray2,
  OpeningTextArray3
];
const modalOpening = document.getElementById('modal-opening');
const textArea = document.getElementById('opening-text');

let currentArray = OpeningTextArray1;
let currentTextIndex = 0;
let currentArrayIndex = 1;

// 連続クリック防止のフラグを追加
let isProcessing = false;

const openingClick = function () {
  // 処理中なら何もしない
  if (isProcessing) {
    console.log("処理中のためクリックを無視します");
    return;
  }
  // 配列やインデックスの有効性をチェック
  if (!TextArrays || !Array.isArray(TextArrays) || typeof currentArrayIndex !== 'number' || currentArrayIndex < 0 || currentArrayIndex >= TextArrays.length) {
    console.error("TextArrays または currentArrayIndex が不正です。状態をリセットします。", {
      TextArrays: TextArrays,
      currentArrayIndex: currentArrayIndex
    });
    rebindClickListener(); // 初期状態に戻す
    // リセット後、最初のテキストを表示する
    if (currentArray && currentArray.length > 0 && typeof currentTextIndex === 'number' && currentTextIndex < currentArray.length) {
      textArea.textContent = currentArray[currentTextIndex].text;
    }
    return;
  }
  // 現在の配列を取得
  currentArray = TextArrays[currentArrayIndex];
  if (!currentArray || !Array.isArray(currentArray)) {
    console.error("現在のインデックスに対応する配列が見つからないか、配列ではありません。状態をリセットします。", {
      currentArrayIndex: currentArrayIndex
    });
    rebindClickListener();
    if (currentArray && currentArray.length > 0 && typeof currentTextIndex === 'number' && currentTextIndex < currentArray.length) {
      textArea.textContent = currentArray[currentTextIndex].text;
    }
    return;
  }
  // 現在の配列内のテキストを進める
  if (typeof currentTextIndex === 'number' && currentTextIndex < currentArray.length) {
    const currentItem = currentArray[currentTextIndex];
    // テキストが空でない場合のみ表示
    if (currentItem.text !== "") {
      textArea.textContent = currentItem.text;
    }
    if (typeof currentItem.action === 'function') {
      currentItem.action();
    }
    currentTextIndex++;
  // 現在の配列の最後まで到達した場合
  } else {
    isProcessing = true;
    console.log(`配列 ${currentArrayIndex} の最後に到達。次の処理へ移行します。`);
    // フェードアウト開始
    modalOpening.classList.remove("fadein");
    modalOpening.classList.add("fadeout");
    // フェードアウト後に次の処理を実行
    setTimeout(() => {
      const nextArrayIndex = currentArrayIndex + 1;
      if (nextArrayIndex === 1) { 
        // OpeningTextArray1 -> OpeningTextArray2 へ
        console.log("オープニング2へ移行");
        currentArrayIndex = nextArrayIndex; // インデックスを更新
        currentArray = TextArrays[currentArrayIndex]; // 新しい配列を設定
        currentTextIndex = 0; // テキストインデックスをリセット
        if (currentArray && currentArray.length > 0) {
          document.querySelector(".opening-background img").src = "./image/room.avif"; // 背景変更
          textArea.textContent = currentArray[currentTextIndex].text; // 最初のテキスト表示
          currentTextIndex++;
          modalOpening.classList.remove("fadeout");
          modalOpening.classList.add("fadein");
          isProcessing = false; // 処理完了
        } else {
          console.error("オープニング2の配列が無効です");
          rebindClickListener();
        }
      } else if (nextArrayIndex === 2) { 
        // OpeningTextArray2 -> 選択画面へ
        console.log("選択画面へ移行");
        currentArrayIndex = nextArrayIndex; // インデックスを更新（次の array2to3 で使うため）
        modalOpening.style.display = "none";
        modalOpening.classList.remove("fadeout");
        const modalSelect = document.getElementById("modal-select");
        modalSelect.style.display = "block";
        modalSelect.classList.add("fadein");
        // isProcessing は選択画面のボタンが押されるまで true のままにするか、
        // ここで false にして選択画面側の処理で再度 true にするか。
        // ここでは一旦 false にして、選択画面の責務とする。
        isProcessing = false;
      } else if (nextArrayIndex === 3) { 
        // OpeningTextArray3 -> ゲーム画面へ
        console.log("ゲーム画面へ移行");
        currentArrayIndex = nextArrayIndex; 
        // ローカルストレージ記録
        localStorage.setItem("hasSeenOpeningStory", "true");
        console.log("記録しました: ドイツのオープニング - 読了");
        const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
        if (hasSeenTutorial === "true") {
          console.log("削除しました: チュートリアル");
          const tutorialElement = document.getElementById("game-tutorial");
          if (tutorialElement) tutorialElement.style.display = "none";
        }
        modalOpening.style.display = "none";
        modalOpening.classList.remove("fadeout");
        modalOpening.removeEventListener('click', openingClick);
        // ゲーム画面表示のフェードイン (少し遅延させる)
        setTimeout(function() {
        const modalGame = document.getElementById("modal-game");
        modalGame.style.display = "block";
        modalGame.classList.add('fadein');
        isProcessing = false;
        }, 100);
      } else {
        // 想定外！
        console.error("予期しない次の ArrayIndex:", nextArrayIndex, "。状態をリセットします。");
        rebindClickListener();
      }
    }, 1000);
  }
};


function resetToInitialState() {
  console.log("状態をリセットしています...");
  currentArrayIndex = 0; // 最初の配列のインデックス
  currentArray = TextArrays[currentArrayIndex]; // 最初の配列
  currentTextIndex = 0; // テキストインデックスもリセット
  isProcessing = false;
  textArea.textContent = ""; // テキストエリアをクリア (初期テキストは別途表示)
  const initialBackground = "./image/germania.avif";
  const backgroundElement = document.querySelector(".opening-background img");
  if (backgroundElement) backgroundElement.src = initialBackground;
  modalOpening.style.display = "block";
  modalOpening.classList.remove("fadeout", "fadein");
  // 最初のテキストを表示
  if (currentArray && currentArray.length > 0 && currentArray[currentTextIndex]) {
    textArea.textContent = currentArray[currentTextIndex].text;
    currentTextIndex++;
  } else {
    console.error("リセット後の初期テキスト表示に失敗しました。");
  }
  modalOpening.removeEventListener('click', openingClick); // 念のため削除
  modalOpening.addEventListener('click', openingClick);
  console.log("状態をリセットしました");
}

function rebindClickListener() {
  modalOpening.removeEventListener('click', openingClick);
  resetToInitialState();
}

modalOpening.addEventListener('click', openingClick);

const array2to3 = function() {
  // 二重実行防止
  if (isProcessing) {
    console.log("array2to3: 処理中のためクリックを無視します");
    return;
  }
  isProcessing = true; 
  const modalSelect = document.getElementById("modal-select");
  modalSelect.classList.remove("fadein");
  modalSelect.classList.add("fadeout");
  setTimeout(function () {
    modalSelect.style.display = "none";
    modalSelect.classList.remove("fadeout"); 
    currentArrayIndex = 2; //  OpeningTextArray3 
    currentArray = TextArrays[currentArrayIndex];
    currentTextIndex = 0;
    if (currentArray && currentArray.length > 0 && currentArray[currentTextIndex]) {
       // UI更新 (背景、モーダル表示、最初のテキスト)
      document.querySelector(".opening-background img").src = "./image/rocket.avif";
      modalOpening.style.display = "block";
      modalOpening.classList.remove("fadeout");
      modalOpening.classList.add("fadein");
      textArea.textContent = currentArray[currentTextIndex].text;
      currentTextIndex++;
      modalOpening.removeEventListener('click', openingClick); // 念のため削除
      modalOpening.addEventListener('click', openingClick); // 再度追加
      console.log("オープニング3の表示開始");
      isProcessing = false; // 処理完了時にフラグを解除
    } else {
      console.error("配列3が無効、または最初のテキストがありません");
      rebindClickListener(); // 初期状態に戻す
      // isProcessing は rebindClickListener 内で false になる
    }
  }, 1000);
}

document.getElementById("confirm-button").addEventListener('click', array2to3);

document.getElementById("skip-button").addEventListener('click', function() {
  // skipボタンが押されたら...
  // 既存のイベントリスナーを削除
  document.getElementById("confirm-button").removeEventListener('click', array2to3);
  // 新しいイベントリスナーを追加
  document.getElementById("confirm-button").addEventListener('click', function() {
    const modalSelect = document.getElementById("modal-select");
    modalSelect.classList.remove("fadein");
    modalSelect.classList.add("fadeout");
    setTimeout(function () {
      modalSelect.style.display = "none";
      modalOpening.removeEventListener('click', openingClick);
      // ゲームモーダルに移行
      const modalGame = document.getElementById("modal-game");
      modalGame.style.display = "block";
      modalGame.classList.add('fadein');
      // チュートリアルを消す
      const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
      if (hasSeenTutorial === "true") {
        console.log("削除しました: チュートリアル");
        document.getElementById("game-tutorial").style.display = "none";
      }
    }, 1000);
  });
});


// 初期化処理 (ページの読み込み完了時)
window.addEventListener('DOMContentLoaded', () => {
  if (TextArrays && TextArrays.length > 0 && TextArrays[0] && Array.isArray(TextArrays[0]) && TextArrays[0].length > 0 && TextArrays[0][0]) {
      currentArrayIndex = 0;
      currentArray = TextArrays[currentArrayIndex];
      currentTextIndex = 0;
      isProcessing = false; // 初期状態は処理中でない

      textArea.textContent = currentArray[currentTextIndex].text;
      currentTextIndex++; // 最初のテキストを表示したので次へ

      modalOpening.addEventListener('click', openingClick); // クリックリスナーを設定
      console.log("完了 - 初期設定");
  } else {
      console.error("初期テキスト配列の読み込みまたは設定に失敗しました。");
      // エラーメッセージを画面に表示するなどのフォールバック処理
      textArea.textContent = "エラー: ゲームデータの読み込みに失敗しました。";
  }
});