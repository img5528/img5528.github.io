
const body = document.getElementsByTagName("body")[0];


let resArray = [];
let questionsArr = [];
let saveArr = [];
let userScoreArr = [];

let c = ['a','b','c','d','e'];
const scoreArr = [1, 0.5, 0.2, 0, 0, 0];



let q = 0;



function generateQuestionAnswers(){
const h2 = document.createElement('h2');
const answersBlock = document.createElement('div');
answersBlock.className = 'answers-block';


  h2.innerHTML = data[questionsArr[q]]['question'];
  for(let i = 0; i < c.length; i++) { 
    answersBlock.innerHTML += 
    `<label class="container" for="${c[i]}">
          <input type="checkbox" id="${c[i]}" name="q" value="${c[i]}" />
          <span class="checkmark">${c[i].toUpperCase()}</span>
          ${data[questionsArr[q]]['proposals'][i]}
      </label>`;
  }
  if (questionsArr.length > q) {
    q++;
  }
  body.append(answersBlock);
  body.prepend(h2);
  generateButton(answersBlock, 'submit')

};

function generateDataArray(){
  for (let i = 0; i < data.length; i++) {
    questionsArr.push(i);
  }
};

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function sliceArr(arr){
  arr = arr.slice(0, 20);
}

function getAnswers(){
  for (let i = 0; i < 5; i++) {
    if(document.querySelector(`input[value="${c[i]}"]`).checked){
      resArray.push(true);
    } else {
      resArray.push(false);
    }
  }
};

function saveAnswers(arr){
  saveArr.push(arr);
};

function saveScore(arr, q) {
  let tmp = 0;
  for (let i = 0; i < 5; i++) {
    if (arr[i] !== data[q]['answers'][i]) {
      tmp++;
    }
  }
  userScoreArr.push(scoreArr[tmp]);
};


function generateEndingArray(){
  const results = document.createElement('table');
  let tbody = document.createElement('tbody');
  let tableCase = 0;

  for (let i = 0; i < Math.ceil(questionsArr.length / 10); i++) {

    let row = tbody.insertRow()
    for (let j = 0; j < 10; j++) {
    if(tableCase >= questionsArr.length){
      break;
    }
      
      let cell = document.createElement('td');
      let score = 5;
      for (let x = 0; x < saveArr[tableCase].length; x++) {
        if(saveArr[tableCase][x] !== data[questionsArr[tableCase]]['answers'][x]){
          score--;
        }
      }

      cell.className = setScoreColor(score);
      cell.setAttribute('value', questionsArr[tableCase]);
      let cellText = document.createTextNode(tableCase + 1);
      cell.appendChild(cellText);
      row.appendChild(cell);

      tableCase++;
    }
  }
    results.appendChild(tbody);
    results.className = 'results';
    body.appendChild(results);
    generateButton(body, 'home');

    results.addEventListener('click', (e) => {
      let val = e.target.getAttribute('value');
      removeActiveClass();
      e.target.className += ' active';
      showAnswersAndTips(val);
    });
}

function setScoreColor(num){
  let colorClass = '';
  switch (num) {
    case 5:
      colorClass = 'perfect';
      break;
    case 4:
      colorClass = 'good';
      break;
    case 3:
      colorClass = 'quitegood';
      break;
    case 2:
    case 1:
    case 0:
      colorClass = 'wrong';
      break;
    default:
      colorClass = '';
      break;
  }
  return colorClass;
}



function removeActiveClass() {
  let elActive = document.querySelectorAll('.active');
  [].forEach.call(elActive, function(el) {
    el.classList.remove("active");
  });
};


function showAnswersAndTips(id){
  let answersTips = document.getElementById('answersTips');
  let answersTipsBlock = document.getElementById('answersTipsBlock');

  if(!answersTips){
    answersTips = document.createElement('table');
    answersTipsBlock = document.createElement('div');
  } else {
    answersTips.innerHTML = '';
    answersTipsBlock.innerHTML = '';
  }


  const h2 = document.createElement('h2');
  const h3 = document.createElement('h3');
  const h4 = document.createElement('h4');
  const tbody = document.createElement("tbody");
  const thead = document.createElement("thead");
  const tr = document.createElement('tr');
  const theader = ['answers','proposals', 'tips']
  const textTheader = ['Votre réponse','Réponse attendue', '', 'Explications'];
  let content = '';
  let resX;
  let resZ;

  for (let j = 0; j < 5; j++) {
    let row = document.createElement('tr');
    for (let i = 0; i < 4; i++) {
      let cell = document.createElement('td');
      let cellText = '';
      if(i === 0){
        content = saveArr[questionsArr[id]][j];
        resX = content;
      } else {
        content = data[id][theader[i-1]][j];
        if(i === 1){
          resZ = content;
        }
      }
      if(content === true){
        content = 'Vrai';
      } else if (content === false){
        content = 'Faux';
      }

      cellText = document.createTextNode(content);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    tbody.appendChild(row);
    row.className = resX === resZ ? 'trgood' : 'trwrong';
  }


  answersTips.appendChild(thead);
  for (let i = 0; i < 4; i++) {
    const td = document.createElement('td');
    tr.appendChild(td);
    td.innerText = textTheader[i];
  }
  thead.appendChild(tr);
  answersTips.appendChild(tbody);
  answersTips.id = 'answersTips';

  answersTipsBlock.prepend(answersTips);
  answersTipsBlock.id = 'answersTipsBlock';

  h4.innerHTML = 'Note obtenue : ' + userScoreArr[questionsArr.findIndex(e => e == id)];
  answersTipsBlock.prepend(h4);
  
  h3.innerHTML = 'Note totale : ' + Math.round(userScoreArr.reduce((a, b)=> a + b,0)*100)/100 + '/' + userScoreArr.length;
  answersTipsBlock.prepend(h3);
  
  h2.innerHTML = data[id]['question'];
  answersTipsBlock.prepend(h2);
  body.prepend(answersTipsBlock);
}


function getGlobalScore(){
  return userScoreArr.reduce((a,b) => a + b, 0);
}

function generateHome(){
  let div = document.createElement('div');
  body.append(div);

  generateButton(div, 'play');
}


  function generateButton(parent, buttonName) {
    let button = document.createElement('button');
  let categories = ['ue1', 'ue2'];
  let menu = ['normal'];

  switch (buttonName) {
    case 'home':
      button.className = 'home';
      button.innerText = `Retour à l'Accueil`;
      parent.appendChild(button);
      button.addEventListener('click', (e) => {
        reset();
        clear();
        init();
      });
    break;
    case 'submit':
      button.className = 'submit';
      button.innerText = `Valider votre choix`;
      parent.append(button);
      button.addEventListener('click', (e) => {
        getAnswers();
        saveAnswers(resArray);
        saveScore(resArray, questionsArr[(saveArr.length) -1]);
        resArray = [];
        clear();
        if(questionsArr.length > q) {
          generateQuestionAnswers();
        } else {
          generateEndingArray();
        }
      });
    break;
    case 'categories':
    case 'menu':
      for (let i = 0; i < eval(buttonName).length; i++) {
        let button = document.createElement('button');
        button.className = eval(buttonName)[i];
        button.innerText = eval(buttonName)[i];
        parent.append(button);
        button.addEventListener('click', (e) => {
        });
      }
      break;
    case 'play':
      button.className = 'play';
      button.innerText = `Lancer un quiz`;
      parent.append(button);
      button.addEventListener('click', (e) => {
        clear();
        generateQuestionAnswers();
      });
      break;
  }
}








function init(){
  generateDataArray();
  shuffle(questionsArr);
  if(questionsArr.length > 20){
    sliceArr(questionsArr);
  }
  generateHome();
};

function reset(){
  resArray = [];
  questionsArr = [];
  saveArr = [];
  userScoreArr = [];
  q = 0;
};

function clear(){
  body.innerHTML = '';
}


init();
