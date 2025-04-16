// 共通√のデータ
const endingTextArray = [
  "Text1",
  "text2",
  "text3"
];

// 個別√のデータ
const TYPE1TextArray = [
  { text: "type1-1" },
  { text: "type1-2" },
  { text: "type1-3" },
];
const TYPE2TextArray = [
  { text: "type2-1" },
  { text: "type2-2" },
  { text: "type2-3" },
];
const TYPE3TextArray = [
  { text: "type3-1" },
  { text: "type3-2" },
  { text: "type3-3" },
];
const TYPE4TextArray = [
  { text: "type4-1" },
  { text: "type4-2" },
  { text: "type4-3" },
];
const BADENDTextArray = [
  { text: "type5-1" },
  { text: "type5-2" },
  { text: "type5-3" },
];

let EndTextIndex = 0;
let currentRoundForEnding = 0;
// 初期配列を格納、分岐後に配列が追加される
let EndArray = [endingTextArray];
let isSeeingEnding = false;

document.addEventListener("DOMContentLoaded", (event) => {
  // 読み込まれたらエンドモーダルのテキストをendingTextArray配列の0番目に
  // 最初の表示は常に共通ルート
  document.getElementById("ending-text").textContent = EndArray[currentRoundForEnding][EndTextIndex];
  // モーダルのクリックイベントを設定
  document.getElementById("modal-ending").addEventListener("click", EndClick);
});

const EndClick = function() {
  // 処理中なら実行しない
  if (isSeeingEnding) {
    console.log("処理中のためクリックを無視します");
    return;
  }
  isSeeingEnding = true;
  // 現在の配列を取得
  let currentArray = EndArray[currentRoundForEnding];
  // 次のテキストインデックスに進む
  EndTextIndex++;
  // 現在の配列内にまだテキストがある場合
  if (EndTextIndex < currentArray.length) {
    // 現在のラウンドに応じてテキストの取得方法を変える
    let textToShow;
    if (currentRoundForEnding === 0) {
      // 共通ルートの場合、配列要素は文字列
      textToShow = currentArray[EndTextIndex];
    } else {
      // 分岐後ルートの場合、オブジェクト配列
      const currentTextData = currentArray[EndTextIndex];
      textToShow = currentTextData ? currentTextData.text : ""; // オブジェクトからtextプロパティを取得
    }
    document.getElementById("ending-text").textContent = textToShow;
    isSeeingEnding = false;
  }
  // 現在の配列の最後まで到達した場合
  else {
    // 最初の共通エンディング配列が終わった場合
    if (currentRoundForEnding === 0) {
      currentRoundForEnding = 1; // 次のラウンドへ
      EndTextIndex = 0;          // インデックスをリセット
      // ENDING_TYPEに基づいて次の配列を決定し、EndArrayに追加
      const endingType = document.getElementById("ENDING_TYPE").textContent;
      let nextArray = null; // 次に表示する配列を格納する変数
      switch (endingType) {
        case "TYPE_1":
          nextArray = TYPE1TextArray;
          break;
        case "TYPE_2":
          nextArray = TYPE2TextArray;
          break;
        case "TYPE_3":
          nextArray = TYPE3TextArray;
          break;
        case "TYPE_4":
          nextArray = TYPE4TextArray;
          break;
        case "TYPE_5":
          nextArray = BADENDTextArray;
          break;
        default:
          console.error("不明なエンディングタイプです:", endingType);
          isSeeingEnding = false; // エラーの場合は処理を中断
          return;
      }
      if (nextArray && nextArray.length > 0) {
        // EndArrayに次の配列を追加
        EndArray.push(nextArray); 
        // 次の配列の0番目を表示
        const firstTextData = EndArray[currentRoundForEnding][EndTextIndex];
        document.getElementById("ending-text").textContent = firstTextData ? firstTextData.text : "";
      } else {
        // 「すべて」の終了処理（後で書いといて）
      }
      isSeeingEnding = false;
    }
    // 分岐後のエンディング配列が終わった場合
    else {
      const endingType = document.getElementById("ENDING_TYPE").textContent;
      if (endingType === "TYPE_1") {
        // TYPE1の場合、ボタンを表示
        document.getElementById("endbutton-1").style.display = "block";
        document.getElementById("endbutton-2").style.display = "block";

        // 特殊条件をどれかひとつでも満たす場合はendbutton-3も表示
        if ( // 絶望みたいな条件
        document.getElementById("ENDING_TYPE1_HEYDRICH").textContent === "true" ||
        document.getElementById("ENDING_TYPE1_BETRAY").textContent === "true" ||
        document.getElementById("ENDING_TYPE1_SHINETHESUN").textContent === "true"
        ) {
          document.getElementById("endbutton-3").style.display = "block";
        }
        // TYPE1の場合、クリックイベントをここで止める（isSeeingEndingをtrueのままにするか、モーダル自体を非表示にする）
        // isSeeingEnding = true; // これ以降クリックしても進まないようにする
        // もしくはモーダル自体を操作するなど
        // document.getElementById("modal-ending").removeEventListener("click", EndClick); // イベントリスナーを削除
         return; // ★重要: ボタン表示後はクリックで進まないようにここで処理を終える

      } else {
        // TYPE1以外の場合、途中で選択はないので最後まで表示されたはず
        console.log("エンディング終了（TYPE1以外）");
        // クリックイベントを無効化
        isSeeingEnding = true;
        document.getElementById("modal-ending").removeEventListener("click", EndClick);
        document.getElementById("modal-ending").classList.remove("fadeoin");
        document.getElementById("modal-ending").classList.add("fadeout");
        setTimeout(() => {
          document.getElementById("modal-ending").style.display = "none";
          document.getElementById("modal-restart").style.display = "block";
          document.getElementById("modal-restart").classList.add("fadein");
        }, 1000);
        return; // 終了処理後はここで処理を終える
      }
    }
  }
};

// modal-resultのボタンを押すとモーダル移行
function toEndingStory() {
  document.getElementById("result-button").onclick = null;
  document.getElementById("modal-result").classList.remove("fadein");
  document.getElementById("modal-result").classList.add("fadeout");
  setTimeout(() => {
    document.getElementById("modal-result").style.display = "none";
    document.getElementById("modal-ending").style.display = "block";
    document.getElementById("modal-ending").classList.add("fadein");
  }, 1000);
}
