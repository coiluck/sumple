// 共通√のデータ
const endingTextArray = [
  "月面基地、第二研究棟――防音パネルに覆われた狭い通信室に、ひとりで佇んでいた。",
  "ガラス越しに見える外の風景は、何も語らない。",
  "空はない。風もない。沈黙だけが、そこにあった。",
  ">新着通信：極秘・最優先",
  ">暗号照合完了。自動再生を開始します。",
  "雑音の混じった音声が、冷たい機械音に混ざって流れ始める。",
  "「……ここは地上。帝都ゲルマニアからの報告だ」",
  "「総統閣下は……死亡された」",
  "声は軍人のものだ。くぐもっていて、疲れ切っていた。どこかで砲声のような音が混じる。",
  "「ゲーリング元帥は、空軍施設を封鎖。信頼できる者以外の接触を拒否し、軍の動員を開始」",
  "「ボルマンはそれを拒絶し、自らが『正統なる後継者』と宣言した」",
  "「応じなかった地方司令部は粛清対象に指定され、武力衝突が発生している」",
  "無機質な声の中に、わずかな揺れがあった。",
  "「……ハイドリヒはポーランドに兵を集めている。武装親衛隊の残存戦力を吸収し、『秩序の再建』を掲げているらしい」",
  "そこで一瞬、沈黙が走った。",
  "「鋼鉄の帝国は、錆びて崩れ始めた」",
  "基地内の空調の音が、やけに大きく聞こえる。私は受信装置の前に立ったまま、目を伏せた。",
  "「あなたが今、月にいることは把握している。任務は続行中――だが」",
  "「あなたが帰還するその時、『帰る場所』が残っているかは、分からない」",
  "何かが、遠くで軋む音がした。地球では、戦争が始まった。再び。今度は自分たちの中で。",
  "「――あなたは、どこに帰るつもりだ？」",
  "通信は、そこで途切れた。",
  "長い沈黙。",
  "機械は黙り込み、モニターは再び黒に染まった。",
  "ゆっくりと窓の外へ目をやった。",
  "地平線の向こうに、地球が浮かんでいる。",
  "小さな、青い点。かつて『祖国』と呼ばれた、かつて『帝国』だった場所。",
  "だが、もはやそこに国はなく、旗はなく、命令も、栄光も、存在しない。",
  "鷲は墜ちた。鋼鉄は朽ちた。",
  "月――ここだけが、まだ静かだった。",
  "そのまま通信装置のスイッチを切った。",
  "そしてただ、死のように静かな月の地平を、目を閉じずに、見つめ続けた。"
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
    if (currentRoundForEnding === 0 && EndTextIndex >= endingTextArray.length) {
      currentRoundForEnding = 1; // 次のラウンドへ
      EndTextIndex = 0;          // インデックスをリセット
      console.log("表示します - 個別√");
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
          // ほんとは行われない処理（toEndingStoryの話）
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
        // 一度画面を切り替えるエフェクト
        document.getElementById("modal-ending").removeEventListener("click", EndClick);
        document.getElementById("modal-ending").classList.remove("fadein");
        document.getElementById("modal-ending").classList.add("fadeout");
        setTimeout(() => {
          document.getElementById("modal-ending").addEventListener("click", EndClick);
          document.getElementById("modal-ending").classList.remove("fadeout");
          document.getElementById("modal-ending").classList.add("fadein");
          // 次の配列の0番目を表示
          const firstTextData = EndArray[currentRoundForEnding][EndTextIndex];
          document.getElementById("ending-text").textContent = firstTextData ? firstTextData.text : "";
        }, 1000);
      } else {
        // TYPE1以外の終了処理（後で書いといて）
        // ん、それは下にあるな、ここはいつ実行されるんだ？
        // nextArrayがない時だからエラーだな
        console.log("見つかりません - 個別√配列");
      }
      isSeeingEnding = false;
    }
    // 分岐後のエンディング配列が終わった場合
    else {
      const endingType = document.getElementById("ENDING_TYPE").textContent;
      if (endingType === "TYPE_1") {
        console.log("表示します - TYPE1 エンディング選択")
        document.getElementById("modal-ending").removeEventListener("click", EndClick);
        // TYPE1の場合、ボタンを表示
        document.getElementById("endbutton-1").classList.remove("no-display");
        document.getElementById("endbutton-1").classList.add("fast-fadein");
        document.getElementById("endbutton-2").classList.remove("no-display");
        document.getElementById("endbutton-2").classList.add("fast-fadein");
        // 特殊条件をどれかひとつでも満たす場合はendbutton-3も表示
        if ( // 絶望みたいな条件
        document.getElementById("ENDING_TYPE1_HEYDRICH").textContent === "true" ||
        document.getElementById("ENDING_TYPE1_BETRAY").textContent === "true" ||
        document.getElementById("ENDING_TYPE1_SHINETHESUN").textContent === "true"
        ) {
          document.getElementById("endbutton-3").classList.remove("no-display");
          document.getElementById("endbutton-3").classList.add("fast-fadein");
        }
        return; 
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
    // ENDING_TYPEが"5"の場合、BADENDTextArrayを直接表示
    if (document.getElementById("ENDING_TYPE").textContent === "BADEND") {
      console.log("スキップします - 共通ルート");
      EndArray = [[{ text: "dummy" }], BADENDTextArray]; // ダミー配列と実際の配列
      EndTextIndex = 0;
      currentRoundForEnding = 1; // 直接2番目の配列（BADENDTextArray）を参照
      // BADENDTextArrayの最初の要素を表示
      document.getElementById("ending-text").textContent = BADENDTextArray[EndTextIndex].text;
    } else {
      // いらないはずだけど一応、ね
      document.getElementById("ending-text").textContent = EndArray[currentRoundForEnding][EndTextIndex];
    }
  }, 1000);
}
