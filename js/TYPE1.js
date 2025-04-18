
const TYPE1_1 = function () {
  console.log("TYPE1ルート - ボルマンにつく");
  // ボタンを非表示＆押せないように
  const btn1 = document.getElementById("endbutton-1");
  const btn2 = document.getElementById("endbutton-2");
  const btn3 = document.getElementById("endbutton-3");
  [btn1, btn2, btn3].forEach(btn => {
    btn.classList.add("fast-fadeout");
    btn.disabled = true;
    btn.style.pointerEvents = "none";
  });
  // 初期設定
  const textArea = document.getElementById("ending-text");
  const story = [
    { text: "1-1-1" },
    { text: "1-1-2" },
    { text: "1-1-3", 
      action: () => {
        console.log("特別なアクションを実行");
      } 
    },
    { text: "1-1-4" },
    { text: "1-1-5" },
    { text: "1-1-6" }
  ];
  let currentTextIndex = 0;
  let isProcessingTYPE1 = false;
  // 初期テキストを表示
  if (story.length > 0) {
    textArea.textContent = story[0].text;
    currentTextIndex = 1; // 次に表示するのは2番目の要素
  }
  const clickHandler = function() {
    // 処理中なら何もしない
    if (isProcessingTYPE1) {
      console.log("処理中のためクリックを無視します");
      return;
    }
    isProcessingTYPE1 = true;
    // ストーリーの最後に到達したかチェック
    if (currentTextIndex >= story.length) {
      console.log("ストーリーの最後に到達しました");
      document.getElementById("modal-ending").removeEventListener("click", clickHandler);
      document.getElementById("modal-ending").classList.remove("fadein");
      document.getElementById("modal-ending").classList.add("fadeout");
      setTimeout(() => {
        document.getElementById("modal-ending").style.display = "none"
        document.getElementById("modal-restart").style.display = "block"
        document.getElementById("modal-restart").classList.add("fadein");
      }, 1000);
      return;
    }
    // 現在のテキストとアクションを取得
    const currentItem = story[currentTextIndex];
    // テキストを表示
    if (currentItem.text !== "") {
      textArea.textContent = currentItem.text;
    }
    // アクションがあれば実行
    if (typeof currentItem.action === 'function') {
      currentItem.action();
    }
    // 次のテキストインデックスに進む
    currentTextIndex++;
    isProcessingTYPE1 = false;
  };
  // テキストエリアにクリックイベントを追加
  document.getElementById("modal-ending").addEventListener("click", clickHandler);
  // 表示が終わったらイベントリスナを消しておく
  return function cleanup() {
    textArea.removeEventListener("click", clickHandler);
    console.log("TYPE1_1のイベントリスナーをクリーンアップしました");
  };
}
const TYPE1_2 = function () {
  console.log("TYPE1ルート - ゲーリングにつく");
  const story = [
    "1-2-1",
    "1-2-2",
    "1-2-3",
    "1-2-4",
    "1-2-5",
    "1-2-6"
  ]
}
const TYPE2_1 = function () {
  console.log("TYPE1ルート - ハイドリヒにつく");
  const story = [
    "2-1-1",
    "2-1-2",
    "2-1-3",
    "2-1-4",
    "2-1-5",
    "2-1-6"
  ]
}
const TYPE2_2 = function () {
  console.log("TYPE1ルート - 日本につく");
  const story = [
    "2-2-1",
    "2-2-2",
    "2-2-3",
    "2-2-4",
    "2-2-5",
    "2-2-6"
  ]
}
const TYPE2_4 = function () {
  console.log("TYPE1ルート - 我々が陽を照らす");
  const story = [
    "2-4-1",
    "2-4-2",
    "2-4-3",
    "2-4-4",
    "2-4-5",
    "2-4-6"
  ]
}




document.getElementById("endbutton-1").addEventListener("click", TYPE1_1);
document.getElementById("endbutton-2").addEventListener("click", TYPE1_2);
document.getElementById("endbutton-4").addEventListener("click", TYPE2_4)
// ボタン3のみ選択肢を更新する
document.getElementById("endbutton-3").addEventListener("click", function(){
  // 一度ボタンを非表示
  document.getElementById("endbutton-1").classList.add("fast-fadeout");
  document.getElementById("endbutton-2").classList.add("fast-fadeout");
  document.getElementById("endbutton-3").classList.add("fast-fadeout");
  // ボタンを押せなくする
  document.getElementById("endbutton-1").disabled = true;
  document.getElementById("endbutton-2").disabled = true;
  document.getElementById("endbutton-3").disabled = true;
  // 見えなくなった後...
  setTimeout(() => {
  // ボタン1と2を更新
    document.getElementById("endbutton-1").textContent = "ハイドリヒにつく";
    document.getElementById("endbutton-2").textContent = "この国に未来はない";
    document.getElementById("endbutton-4").textContent = "我々が陽を照らす";
    document.getElementById("endbutton-1").removeEventListener("click", TYPE1_1);
    document.getElementById("endbutton-2").removeEventListener("click", TYPE1_2);
    document.getElementById("endbutton-1").addEventListener("click", TYPE2_1);
    document.getElementById("endbutton-2").addEventListener("click", TYPE2_2);
    // 条件に合致するものだけ表示
    if(document.getElementById("ENDING_TYPE1_HEYDRICH").textContent == "true") {
      document.getElementById("endbutton-1").classList.remove("fast-fadeout");
      document.getElementById("endbutton-1").classList.add("fast-fadein");
      document.getElementById("endbutton-1").disabled = false;
    }
    if(document.getElementById("ENDING_TYPE1_BETRAY").textContent == "true") {
      document.getElementById("endbutton-2").classList.remove("fast-fadeout");
      document.getElementById("endbutton-2").classList.add("fast-fadein");
      document.getElementById("endbutton-2").disabled = false;
    }
    if(document.getElementById("ENDING_TYPE1_SHINETHESUN").textContent == "true") {
      document.getElementById("endbutton-4").classList.remove("no-display");
      document.getElementById("endbutton-4").classList.add("fast-fadein");
    }
  }, 500);
});

document.getElementById("restart-button").addEventListener("click", () => location.reload());