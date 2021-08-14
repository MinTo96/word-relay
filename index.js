const inputWord = document.querySelector(".input-word");
const inputBtn = document.querySelector(".input-btn");
const suggestWord = document.querySelector(".suggestion-word");
const form = document.querySelector("#form");

let word = []; // 입력 받은 문자 저장
let i = 0; // 끝말잇기 단어 맞는지 체크하는 로직 변수
let errorPoint = 0; // 틀리는 횟수

// 초기 제시어 만들기
const makeArray = () => {
  const array = ["바나나", "꾸러미", "배낭", "여행", "가방"];
  word.push(array[Math.floor(Math.random() * 5)]);
};

// 초기 제시값 그려주기
const drawSuggestWord = () => {
  makeArray(); // 초기 제시값
  suggestWord.innerHTML = `${word[word.length - 1]}`;
};
drawSuggestWord();

// submit할 때 콜백 이벤트
const submitWord = (event) => {
  const inputValue = inputWord.value;

  // 에러 처리
  if (hasValue(inputValue)) {
    if (checkInputOne(inputValue)) {
      if (checkInputType(inputValue)) {
        if (checkLastWord(inputValue)) {
          checkDictionary(inputValue);
          event.preventDefault();
        }
      }
    }
  }
  // 게임오버
  gameOver();

  inputWord.value = "";
  console.log(word);
};

// 입력 받은 값의 유무 판단
const hasValue = (inputValue) => {
  if (!inputValue) {
    alert("무언가를 입력해주세요.");
    errorPoint++;
    return false;
  } else {
    return true;
  }
};

// 입력된 글자가 한 글자인지 판단
const checkInputOne = (inputValue) => {
  if (inputValue.length === 1) {
    alert("한 글자 이상의 문자를 입력해주세요.");
    errorPoint++;
    return false;
  } else {
    return true;
  }
};

// 입력 받은 값이 문자인지 판단
const checkInputType = (inputValue) => {
  const pattern_eng = /[a-zA-Z]/;
  const pattern_num = /[0-9]/;
  const pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/;
  if (
    pattern_eng.test(inputValue) ||
    pattern_num.test(inputValue) ||
    pattern_spc.test(inputValue)
  ) {
    errorPoint++;
    alert("올바른 문자형식으로 입력해주세요.");
    return false;
  } else {
    return true;
  }
};

// 앞에서 끝나는 단어로 시작하는지 판단
const checkLastWord = (inputValue) => {
  word.push(inputValue);
  i++;
  if (word[i - 1].charAt(word[i - 1].length - 1) !== inputValue.charAt(0)) {
    alert("그 단어로 시작하는게 아닐텐데요~?");
    errorPoint++;
    word.pop(inputValue);
    i--;
    return false;
  } else {
    return true;
  }
};

// 입력된 값이 사전에 있는 값인지 판단
const checkDictionary = (inputValue) => {
  let myHeaders = new Headers();
  myHeaders.append(
    "Cookie",
    "GTSID=OPD2&&QPgNhXnFPxY3H2cyLPD9J6hs8mT5hLF1p1qgytXX1qldT0cyD7Lr!-1983934964!1628923685424; WMONID=GjPrc1F-u8b; opendic=QPgNhXnFPxY3H2cyLPD9J6hs8mT5hLF1p1qgytXX1qldT0cyD7Lr!-1983934964"
  );

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(
    `https://opendict.korean.go.kr/api/search?key=CAB7A029D7F1FCE1F84DAF1240C5AFF9&q=${inputValue}&advanced=y&method=exact`,
    requestOptions
  )
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const result = parseInt(
        xmlDoc.getElementsByTagName("total")[0].childNodes[0].nodeValue
      );

      if (result >= 1) {
        changeSuggestWord(inputValue);
      } else {
        alert("사전에 없는 단어 입니다.");
        word.pop(inputValue);
        i--;
        errorPoint++;
        console.log(word);
      }
    })
    .catch((error) => console.log("error", error));
};

// 에러가 3번이면 게임 종료
const gameOver = () => {
  if (errorPoint === 3) {
    throw "게임 실패입니다.";
  }
};

// 입력된 값으로 제시어 변경
const changeSuggestWord = (inputValue) => {
  const userInputWord = inputValue;
  suggestWord.textContent = `${userInputWord}`;
  inputWord.value = "";
};

form.addEventListener("submit", submitWord);
