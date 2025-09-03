
const suits = ["C", "D", "H", "S"]; 
const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

let deck = [];

let dealerSum = 0;
let yourSum   = 0;

let dealerAceCount = 0;
let yourAceCount   = 0;

let hidden = null;     
let canHit = true;     

window.addEventListener("load", () => {
  buildDeck();
  shuffleDeck();
  startGame();

  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
  document.getElementById("refresh").addEventListener("click", refresh);
});

function buildDeck() {
  deck = [];
  for (i=0;i<suits.length;i++) {
    for (j=0;j<values.length;j++) {
      deck.push(values[j]+ "-"+ suits[i]);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    const j = Math.floor(Math.random() * deck.length);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function startGame() {
  hidden = deck.pop(); 

     for(i=0;i<1;i++) {
     const card = deck.pop();
    dealerSum = getCardValue(hidden) + getCardValue(card);
    // console.log(dealerSum);
    dealerAceCount += isAce(card);
    const img = createCardImg(card);
    document.getElementById("dealer-cards").appendChild(img);
     }

    
    

  
  for (let i = 0; i < 2; i++) {
    const card = deck.pop();
    yourSum += getCardValue(card);
    yourAceCount += isAce(card);
    const img = createCardImg(card);
    document.getElementById("your-cards").appendChild(img);
  }

  document.getElementById("your-sum").textContent = yourSum;
}

function hit() {
  if (!canHit) return;

  const card = deck.pop();
  yourSum += getCardValue(card);
  yourAceCount += isAce(card);

  const img = createCardImg(card);
  document.getElementById("your-cards").appendChild(img);

  const adjusted = adjustForAces(yourSum, yourAceCount);
  document.getElementById("your-sum").textContent = adjusted;

  if (adjusted > 21) {
    canHit = false;
    finishGame();
  }
}

function stay() {
 while(dealerSum<17)
 { 
     const card = deck.pop();
    dealerSum += getCardValue(card);
    dealerAceCount += isAce(card);
    const img = createCardImg(card);
    document.getElementById("dealer-cards").appendChild(img);
     
}
  if (!canHit) return finishGame();
   canHit = false;


  finishGame();
}

function refresh(){
  location.reload(true);
}

function finishGame() {
  
  const hiddenImg = document.getElementById("hidden");
  hiddenImg.src = `./cards/${hidden}.png`;

  dealerSum = adjustForAces(dealerSum +  dealerAceCount );
  yourSum   = adjustForAces(yourSum, yourAceCount);

  document.getElementById("dealer-sum").textContent = dealerSum;
  document.getElementById("your-sum").textContent   = yourSum;

  
  let message = "";
  if (yourSum > 21) {
    message = "You busted! Dealer wins.";
  } else if (dealerSum > 21) {
    message = "Dealer busted! You win!";
  } else if (yourSum === dealerSum) {
    message = "Push (tie).";
  } else if (yourSum > dealerSum) {
    message = "You win!";
  } else {
    message = "Dealer wins.";
  }

  document.getElementById("results").textContent = message;
  document.getElementById("hit").disabled = true;
  document.getElementById("stay").disabled = true;
}



function getCardValue(card) {
  const value = card.split("-")[0]; 
  if (value === "A") return 11;
  if (["J","Q","K"].includes(value)) return 10;
  return parseInt(value, 10);
}

function isAce(card) {
  return card.startsWith("A") ? 1 : 0;
}

function adjustForAces(sum, aceCount) {
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount--;
  }
  return sum;
}

function createCardImg(code) {
  const img = document.createElement("img");
  img.src = `./cards/${code}.png`;
  img.alt = code;
  return img;
}