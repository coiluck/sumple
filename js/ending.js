// 共通√のデータ
const endingTextArray = [
  "Text1",
  "text2",
  "text3"
]

// 個別√のデータ
const TYPE1TextArray = [
  { text: "type1-1" },
  { text: "type1-2" },
  { text: "type1-3" },
]
const TYPE2TextArray = [
  { text: "type2-1" },
  { text: "type2-2" },
  { text: "type2-3" },
]
const TYPE3TextArray = [
  { text: "type3-1" },
  { text: "type3-2" },
  { text: "type3-3" },
]
const TYPE4TextArray = [
  { text: "type4-1" },
  { text: "type4-2" },
  { text: "type4-3" },
]
const BADENDTextArray = [
  { text: "type5-1" },
  { text: "type5-2" },
  { text: "type5-3" },
]

let EndTextIndex = 0;
let currentRoundForEnding = 0;
let EndArray = [endingTextArray];
let isSeeingEnding = false;

// いつ開始すればいいんだ
// モーダルか

document.addEventListener("DOMContentLoaded", (event) => {
  // 読み込まれたらエンドモーダルのテキストをendingTextArray配列の0番目に
  document.getElementById("ending-text").textContent = EndArray[currentRoundForEnding][EndTextIndex]
});

const EndClick = function() {
  // 処理中なら実行しない
  if(isSeeingEnding) {
    console.log("処理中のためクリックを無視します");
    return;
  }
  // 現在の配列内のテキストを進める
  let currentArray = EndArray[currentRoundForEnding];
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
  } else if (){
    // 次の配列を決定
  } else {
    // 二個目も見たら終了処理
  }
}
