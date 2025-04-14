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
  // モーダルのクリックイベントを設定
  document.getElementById("modal-ending").addEventListener("click", EndClick);
});


const EndClick = function() {
  // 処理中なら実行しない
  if(isSeeingEnding) {
    console.log("処理中のためクリックを無視します");
    return;
  }
  
  isSeeingEnding = true;
  
  // 現在の配列内のテキストを進める
  let currentArray = EndArray[currentRoundForEnding];
  
  // 次のテキストインデックスに進む
  EndTextIndex++;
  
  // 現在の配列内にまだテキストがある場合
  if (EndTextIndex < currentArray.length) {
    document.getElementById("ending-text").textContent = currentArray[EndTextIndex];
    isSeeingEnding = false;
  } 
  // 現在の配列の最後まで到達した場合
  else {
    // 最初の共通エンディング配列が終わった場合
    if (currentRoundForEnding === 0) {
      currentRoundForEnding = 1;
      EndTextIndex = 0;
      
      // ENDING_TYPEに基づいて次の配列をEndArrayに追加
      const endingType = document.getElementById("ENDING_TYPE").textContent;
      
      switch(endingType) {
        case "TYPE1":
          EndArray.push(TYPE1TextArray);
          break;
        case "TYPE2":
          EndArray.push(TYPE2TextArray);
          break;
        case "TYPE3":
          EndArray.push(TYPE3TextArray);
          break;
        case "TYPE4":
          EndArray.push(TYPE4TextArray);
          break;
        case "TYPE5":
          EndArray.push(BADENDTextArray);
          break;
        default:
          console.log("不明なエンディングタイプです");
          break;
      }
      
      // 次の配列の最初のテキストを表示
      document.getElementById("ending-text").textContent = EndArray[currentRoundForEnding][EndTextIndex];
      isSeeingEnding = false;
    } 
    // 分岐後のエンディング配列が終わった場合
    else {
      const endingType = document.getElementById("ENDING_TYPE").textContent;
      
      if (endingType === "TYPE1") {
        // TYPE1の場合、ボタンを表示
        document.getElementById("endbutton-1").style.display = "block";
        document.getElementById("endbutton-2").style.display = "block";
        
        // ENDADDITIONALBUTTONのテキストがtrueの場合のみendbutton-3も表示
        if (document.getElementById("ENDADDITIONALBUTTON").textContent === "true") {
          document.getElementById("endbutton-3").style.display = "block";
        }
      } else {
        // TYPE1以外の場合、エンディングスコアを表示
        DisplayEndingScore();
      }
      
      isSeeingEnding = false;
    }
  }
}