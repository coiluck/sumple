const characters = [
  // キャラクター情報を取得
  { id: 'char1', name: 'エルンスト・フォム・ラート', job: '哀れみ深い紳士', effect: "他国との関係値の上昇効果 +25%", selectText: "関係値 +25%" },
  { id: 'char2', name: 'オットー・ハーン', job: '帝国の科学者', effect: "研究速度 +15%", selectText: "研究 +15%" },
  { id: 'char3', name: 'フンベルト・シェーンベルク', job: '戦略的な補給改革者', effect: "毎ターンの補給物資 +10%", selectText: "補給 +10%" },
  { id: 'char4', name: 'レーオン・エーベルハルト', job: '冷徹な兵站効率師', effect: "人員ひとりあたりの消費物資量 -15%", selectText: "物資消費 -15%" }
];

// 選択されたキャラクターを格納する配列
const selectedCharacters = [];
// 最大選択数
const maxSelections = 2;
// リストを取得
const chosenList = document.getElementById('chosen-list');

// リストアイテムの削除処理
const removeCharacterFromList = (character) => {
  // 配列から削除
  const index = selectedCharacters.findIndex(selected => selected.id === character.id);
  if (index > -1) {
    selectedCharacters.splice(index, 1);
  }
  // リストから削除
  const listItem = document.querySelector(`#chosen-list li[data-id="${character.id}"]`);
  if (listItem) {
    chosenList.removeChild(listItem);
  }
  // 全て削除された場合、初期メッセージを再表示
  if (selectedCharacters.length === 0) {
    const placeholderItem = document.createElement('li');
    placeholderItem.textContent = 'まだ選択されていません。';
    chosenList.appendChild(placeholderItem);
  }
};

// キャラクタークリック時
characters.forEach(character => {
  const charElement = document.getElementById(character.id);
  charElement.addEventListener('click', () => {
    // 最大選択数を超えた場合は追加しない
    if (selectedCharacters.length >= maxSelections) {
      alert('2人までしか選択できません');
      return;
    }
    // すでに選択済みの場合は追加しない
    if (selectedCharacters.some(selected => selected.id === character.id)) {
      alert(character.name + "はすでに選択されています");
      return;
    }
    // 初回選択時に「まだ選択されていません。」を削除
    if (selectedCharacters.length === 0) {
      chosenList.innerHTML = '';
    }
    // 選択されたキャラクターを追加
    selectedCharacters.push(character);
    // リストに追加
    const listItem = document.createElement('li');
    listItem.innerHTML = character.name + "<br>" + "(" + character.selectText + ")";
    listItem.setAttribute('data-id', character.id); // キャラクターIDを設定
    chosenList.appendChild(listItem);
    // リストアイテムのクリックイベントで削除処理を設定
    listItem.addEventListener('click', () => {
      removeCharacterFromList(character);
    });
  });
});
window.gameDataByChar = {
  kannkei: 1,
  kennkyuu: 1,
  hokyuu: 1,
  shouhi: 1
};
// 確定ボタンが押された時の処理
document.getElementById('confirm-button').addEventListener('click', function() {
  // 選択されたキャラクターをループで処理
  selectedCharacters.forEach(character => {
    if (character.id === 'char1') {
      window.gameDataByChar.kannkei = 1.25;
      console.log(character.name + "の選択処理が完了しました");
    } else if (character.id === 'char2') {
      window.gameDataByChar.kennkyuu = 1.15;
      console.log(character.name + "の選択処理が完了しました");
    } else if (character.id === 'char3') {
      window.gameDataByChar.hokyuu = 1.1;
      console.log(character.name + "の選択処理が完了しました");
    } else if (character.id === 'char4') {
      window.gameDataByChar.shouhi = 0.85;
      console.log(character.name + "の選択処理が完了しました");
    }
  });
  console.log("以下の数値でゲームを始めます:", window.gameDataByChar);
  // 選択モーダルを閉じる処理はopening.jsに書いた
  // ゲームモーダルに移る処理もopening.jsに書いた
  // チュートリアルを消す処理もopening.jsに書いた
});