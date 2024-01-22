const state = {
  score:{
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points")
  },
  cardSprites:{
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards:{
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSide:{
  player1: "player-cards",
  player1Box: document.querySelector("#player-cards"),
  computer: "computer-cards",
  computerBox: document.querySelector("#computer-cards"),
},
  actions:{
      button: document.getElementById("next-duel"),
  }
};


const pathImages = "./src/assets/img/";

const cardData = [
  {
    id: 0,
    name: "Sonic",
    type: "Rock",
    img: `${pathImages}sonic.png`,
    WinOf: [2,5,8],
    LoseOf: [1,4,7],
  },
    {
    id: 1,
    name: "Shadow",
    type: "Paper",
    img: `${pathImages}Shadow.png`,
    WinOf: [0,3,6],
    LoseOf: [2,5,8],
  },
    {
    id: 2,
    name: "Amy Rose",
    type: "Scissors",
    img: `${pathImages}AmyRose.png`,
    WinOf: [1,4,7],
    LoseOf: [0,3,6],
  },
    {
    id: 3,
    name: "Knuckles",
    type: "Rock",
    img: `${pathImages}Knuckles.png`,
    WinOf: [2,5,8],
    LoseOf: [1,4,7],
  },
    {
    id: 4,
    name: "Miles Tails",
    type: "Paper",
    img: `${pathImages}MilesTails.png`,
   WinOf: [0,3,6],
    LoseOf: [2,5,8],
  },
    {
    id: 5,
    name: "Tikal",
    type: "Scissors",
    img: `${pathImages}Tikal.png`,
    WinOf: [1,4,7],
    LoseOf: [0,3,6],
  },
    {
    id: 6,
    name: "Silver",
    type: "Rock",
    img: `${pathImages}Silver.png`,
    WinOf: [2,5,8],
    LoseOf: [1,4,7],
  },
    {
    id: 7,
    name: "Doctor Eggman",
    type: "Paper",
    img: `${pathImages}DoctorEggman.png`,
    WinOf: [0,3,6],
    LoseOf: [2,5,8],
  },
    {
    id: 8,
    name: "Blaze",
    type: "Scissors",
    img: `${pathImages}Blaze.png`,
    WinOf: [1,4,7],
    LoseOf: [0,3,6],
  },

];

async function getRandomCardId(){
  const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide){
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "120px");
  cardImage.setAttribute("src", "./src/assets/img/backcard.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if(fieldSide === state.playerSide.player1){
    cardImage.addEventListener("click", () =>{
      setCardsField(cardImage.getAttribute("data-id"))
    })
    cardImage.addEventListener("mouseover", () =>{
    drawSelectCard(IdCard);
  });
  }

  return cardImage;
}

async function setCardsField(cardId){
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  await ShowhiddenCardDetails();

  await hiddenCardDetails();

  await drawCardsInfield(cardId, computerCardId);
  
  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function drawCardsInfield(cardId, computerCardId){
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function ShowhiddenCardDetails(){
  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";
}

async function hiddenCardDetails(){
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
  state.cardSprites.avatar.src = "./src/assets/img/backcard.png";
}

async function drawButton(text){
  state.actions.button.innerText = text.toUpperCase();
  state.actions.button.style.display = "block";
}

async function updateScore(){
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
  let duelResults = "Draw";
  let playerCard = cardData[playerCardId];

  if(playerCard.WinOf.includes(computerCardId)){
    duelResults = "Win";
    state.score.playerScore++;
  }

  if(playerCard.LoseOf.includes(computerCardId)){
    duelResults = "Lose";
    state.score.computerScore++;
  }
  await playAudio(duelResults);
  return duelResults;
}

async function removeAllCardsImages(){
  let {computerBox, player1Box} = state.playerSide;
  let imgElements = computerBox.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = player1Box.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index){
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide){
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function setBackCard(){
  state.fieldCards.player.src = "./src/assets/img/backcard.png";
  state.fieldCards.computer.src = "./src/assets/img/backcard.png";
}

async function resetDuel(){
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.cardSprites.avatar.src = "./src/assets/img/backcard.png";

  init();
}

async function playAudio(status){
  const audio = new Audio(`./src/assets/audio/${status}.wav`);
   audio.volume = 0.2;
   audio.play();
}

function init(){
  hiddenCardDetails();
  setBackCard();

  drawCards(6, state.playerSide.player1);
  drawCards(6, state.playerSide.computer);

  const bgm = document.getElementById("bgm");
  bgm.volume = 0.1;
  bgm.play();
}

init();



