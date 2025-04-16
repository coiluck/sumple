
  const titleJPN = document.getElementById('title-JPN');
  const titleGER = document.getElementById('title-GER');
  const startButton = document.getElementById('start-button');


document.addEventListener('DOMContentLoaded', () => {
  // HTMLが読み込まれたら...
  // 初期状態を非表示に設定
  titleJPN.style.opacity = "0";
  titleGER.style.opacity = "0";
  setTimeout(function(){ 
    titleJPN.classList.add('fadein-title');
    titleGER.classList.add('fadein-title');
  }, 200);
  console.log("表示します: タイトル");
  if (window.innerWidth >= 1981) {
    alert("画面幅が大きすぎます。FHD以上の幅はレイアウトが崩れる可能性があります。Windowの幅を変更することをお勧めします");
  }
  setTimeout(function(){
    startButton.style.display = "block"; // "見える化"、ね
    startButton.classList.add('fadein-title-button'); // "おしゃれの本質"
  }, 1000);
  // startボタンに下線を引く
  setTimeout(function(){
    startButton.classList.add('active');
  }, 3500);
  console.log("表示します: スタートボタン");
});

document.getElementById('start-button').addEventListener('click', event => {
  // startボタンが押されたら...
  // 文字全部フェードアウト
  titleJPN.classList.add('fadeout-title');
  titleGER.classList.add('fadeout-title');
  startButton.classList.add('fadeout-title');
  console.log("消去します: タイトル");
  // 文字消えてから国家選択表示
  setTimeout(function(){
    const countrySection = document.getElementById('country-sections');
    const selectText = document.getElementById('select-text');
    const selectGER = document.getElementById('select-GER');
    countrySection.style.display = "flex";
    countrySection.classList.add('fadein');
    selectText.style.display = "block";
    selectText.classList.add('fadein');
    selectGER.style.display = "block";
    selectGER.classList.add('fadein');
    // 上の部分見づら過ぎておもろいw
    console.log("表示します: 国家選択");
  }, 800);
});

document.getElementById('select-GER').addEventListener('click', function() {
  // ドイツが選択されたら...
  const confirmButton = document.getElementById('select-country-confirm')
  confirmButton.classList.remove('active'); // 一度引いた線を消して..
  confirmButton.style.display = "block"; // ボタン表示
  confirmButton.classList.add('fadein');
  confirmButton.textContent = "総統のために！" // ドイツのボタンに書き換え
  setTimeout (function(){
    confirmButton.classList.add('active');
  }, 500);
});

// ここでわけてからイベントリスナーでモーダルひとつひとつ結び付ければいい
document.getElementById('select-country-confirm').addEventListener('click', function() {
  // 国家決定ボタンが押されたら...
  const forWho = document.getElementById('select-country-confirm').textContent
  if (forWho === "総統のために！"){
    console.log("選択: ドイツ")
    setTimeout(function(){
      document.getElementById("modal-opening").style.display = "flex";
      document.getElementById("modal-opening").classList.add('fadein');
    }, 1000); // タイトルが消えるのと同時にフェードイン開始
    setTimeout(function(){
      const hasSeenOpeningStory = localStorage.getItem("hasSeenOpeningStory");
      if (hasSeenOpeningStory === "true") {
        // Skip表示
        console.log("感知しました: オープニング - 複数回目");
        document.getElementById("skip-window").style.display = "block";
        document.getElementById("skip-window").classList.add('fadein');
      } else {
        console.log("感知しました: オープニング - 初回");
      }
    }, 1500); // 少し遅れてSkipボタンを表示
  } else {
    console.log("選択した国が見つかりません")
    alert("国家選択で意図しないバグが発生しました。製作者に報告してくれると助かります")
  }
  document.getElementById("modal-title").classList.add('fadeout');
  setTimeout(function(){ 
    document.getElementById('modal-title').style.display = "none"; 
  }, 1000);
});

// Skipボタンの処理
const skipCansel = function(event){
  // イベントの伝播を防ぐ
  event.stopPropagation();
  // スキップをキャンセル
  console.log("選択しました: スキップしない");
  document.getElementById("skip-button").removeEventListener('click', skipExecute); // イベントリスナーを解除
  document.getElementById("skip-cancel").removeEventListener('click', skipCansel); // イベントリスナーを解除
  document.getElementById("skip-window").classList.add('fadeout'); // フェードアウト開始
  setTimeout(function() { 
    document.getElementById("skip-window").style.display = "none"; 
  }, 1000);
}
const skipExecute = function(event){
  // イベントの伝播を防ぐ
  event.stopPropagation();
  // スキップする場合
  console.log("選択しました: スキップする");
  document.getElementById("skip-button").removeEventListener("click", skipExecute); // イベントリスナーを解除
  document.getElementById("skip-cancel").removeEventListener("click", skipCansel); // イベントリスナーを解除
  // 見えてるのはフェードアウト
  document.getElementById("modal-opening").classList.add("fadeout"); // フェードアウト開始
  setTimeout(function(){ 
    document.getElementById("modal-opening").style.display = "none"; 
  }, 1000);
  // 選択画面を表示
  document.getElementById("modal-select").style.display = "block";
  document.getElementById("modal-select").classList.add("fadein");
  // 選択画面の確定ボタンを押した後の挙動を変更（これが面倒なのよ）
  // opening,jsで書いた
}

document.getElementById("skip-cancel").addEventListener("click", skipCansel);
document.getElementById("skip-button").addEventListener("click", skipExecute);
