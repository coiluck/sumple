const OpeningTextArray1 = [
  { text: "帝都 ゲルマニア" },
  { text: "――世界で最も強大な国の、世界で最も壮麗で、世界で最も不気味な心臓部。" },
  { text: "テキスト3" }
];
const OpeningTextArray2 = [
  {
    text: "テキスト2-1",
    action: () => {
    /*
      document.getElementById("character1").classList.add("visible");
    */
    }
  },
  { text: "テキスト2-2" },
  { text: "テキスト2-3" }
];
const OpeningTextArray3 = [
  { text: "テキスト3-1" },
  { text: "テキスト3-2" },
  { text: "テキスト3-3" }
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

const openingClick = function () {
  if (currentTextIndex < currentArray.length) {
    const currentItem = currentArray[currentTextIndex];
    textArea.textContent = currentItem.text;

    if (typeof currentItem.action === 'function') {
      currentItem.action(); // アクションを実行
    }

    currentTextIndex++;
  } else if (currentTextIndex >= currentArray.length && currentArrayIndex === 1) {
    // 次のオープニングへ
    console.log(`到達 - オープニング${currentArrayIndex}の最後`);
    modalOpening.classList.remove("fadein");
      modalOpening.classList.add("fadeout");
      setTimeout(() => {
        document.querySelector(".opening-background img").src = "./image/room.avif"
        modalOpening.classList.remove("fadeout");
        modalOpening.classList.add("fadein");
        currentArray = TextArrays[currentArrayIndex];
        currentTextIndex = 0;
        textArea.textContent = currentArray[currentTextIndex].text;
        currentTextIndex++;
        console.log(`開始 - オープニング${currentArrayIndex + 1}の表示`);
        currentArrayIndex++;
      }, 1000);
  } else if (currentTextIndex >= currentArray.length && currentArrayIndex === 2 ) {
    // 選択画面へ
    modalOpening.classList.remove("fadein");
    modalOpening.classList.add("fadeout");
    setTimeout(function(){ 
      modalOpening.style.display = "none";
      document.getElementById("modal-select").style.display = "block";
      document.getElementById("modal-select").classList.add("fadein");
    }, 1000);
  } else if (currentTextIndex >= currentArray.length && currentArrayIndex === 3 ) {
    // ゲーム画面へ
    console.log("終了 - オープニング");
    modalOpening.removeEventListener('click', openingClick); // イベントリスナーを解除
    // ローカルストレージに記録
    const hasSeenOpeningStory = localStorage.getItem("hasSeenOpeningStory");
    if (hasSeenOpeningStory === "true") {
      // Good Player :)
      console.log("知っています: ドイツのオープニング - 複数回目");
    } else {
      localStorage.setItem("hasSeenOpeningStory", "true");
      console.log("記録しました: ドイツのオープニング - 読了");
    }
    // チュートリアルを消す
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (hasSeenTutorial === "true") {
      console.log("削除しました: チュートリアル");
      document.getElementById("game-tutorial").style.display = "none";
    }
    // フェードアウト開始
    modalOpening.classList.add('fadeout');
    setTimeout(function() { 
      modalOpening.style.display = "none"; 
    }, 1000);
    setTimeout(function() {
      const modalGame = document.getElementById("modal-game");
      modalGame.style.display = "block";
      modalGame.classList.add('fadein');
    }, 1000);
  } else {
    alert("ストーリーの表示で意図しないバグが発生しました。製作者に報告してくれると助かります");
  }
}

modalOpening.addEventListener('click', openingClick);


const array2to3 = function() {
  const modalSelect = document.getElementById("modal-select");
  modalSelect.classList.remove("fadein");
  modalSelect.classList.add("fadeout");
  setTimeout(function () {
    modalSelect.style.display = "none";
    document.querySelector(".opening-background img").src = "./image/rocket.jpg"
    modalOpening.style.display = "block";
    modalOpening.classList.remove("fadeout");
    modalOpening.classList.add("fadein");
    currentTextIndex = 0;
    currentArrayIndex = 3;
    currentArray = TextArrays[2]; // 配列3
    textArea.textContent = currentArray[currentTextIndex].text;
    currentTextIndex++;
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