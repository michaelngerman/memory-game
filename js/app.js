/*
 * Create a list that holds all of your cards
 */
let card = document.getElementsByClassName('card');
let cards = [...card];

let deck = document.querySelector('.deck');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


//GETTING SHUFFLED CARDS
function shuffledCards() {
  let shuffled = shuffle(cards);
  shuffled.forEach(function(newCard) {
    deck.appendChild(newCard);
  });
};
shuffledCards();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//VARIABLES
let resetBtn = document.querySelector('.restart');
let timer = document.querySelector('.timer');
let seconds = 0, minutes = 0, hours = 0;
let interval;
let counter = document.querySelector('.moves');
let myCounter = 0;
let openCards = [];
let gameMessage = document.querySelector('.message');
let stars = document.querySelectorAll('.stars li');
let matchingCards = 0;
let modal = document.querySelector('.modal-box');
let finalMoves = document.querySelector('.final-moves');
let finalTimer = document.querySelector('.final-timer');
let finalStars = document.querySelector('.final-stars');
let replayButton = document.querySelector('.replay');
let close = document.querySelector('.close');


//RESET BUTTONS
replayButton.addEventListener('click', function(e) {
  resetBoard();
  modal.classList.add('hidden');
});


resetBtn.addEventListener('click', resetBoard);

close.addEventListener('click', function(e) {
  modal.classList.add('hidden');
});


//WELCOME MESSAGE ON BODY LOAD
document.body.onload = welcomeMessage();

//HTML
timer.innerHTML = "0 mins 0 secs";


//START TIMER
function startTimer() {
  //REITERATING THAT TIMER IS 0,0,0
  let seconds = 0, minutes = 0, hours = 0;
  //START INTERVAL FOR TIMER
  interval = setInterval(function() {
    //DISPLAY FOR TIMER
    timer.innerHTML = minutes + ' mins ' + seconds + ' secs'
    //INCREMINTING BY ONE
    seconds++;
    //CONVERTING 60 SECONDS TO ONE MINUTE
    if (seconds == 60) {
      minutes++;
      seconds = 0;
    }
    // console.log(timer()); INTERVAL OF 1000 ms = 1 sec
  }, 1000);
};

//FORMAT TIMER
function formatTimer() {
  let min = minutes < 10 ? '0' + String(minutes) : String(minutes);
  let sec = seconds < 10 ? '0' + String(seconds) : String(seconds);
  return min + ':' + sec;
};

//STOP TIMER
function stopTimer() {
  clearInterval(interval);
};

//RESET/CLEAR TIMER
function resetTimer() {
  //STOPS TIMER, RESETS TO 0,0,0 AND RESETS DISPLAY
  clearInterval(interval);
  let seconds = 0, minutes = 0, hours = 0;
  timer.innerHTML = "0 mins 0 secs";
};

//FLIPPING CARDS
//EVENT LISTENER
deck.addEventListener('click', card => {
  //SETTING CLICK TARGET TO EVENT
  let clickTarget = card.target;
  //IF TARGET IS A .CARD CLASS AND OPEN CARD ARRAY IS LESS THAN TWO,
  //THEN TOGGLE CARDS OPEN AND ADD TO OPEN CARD ARRAY
  if(clickTarget.classList.contains('card') && openCards.length < 2) {
    toggleOpen(clickTarget);
    addOpenCard(clickTarget);
    //IF OPEN CARD [] IS 2 THEN CHECK FOR MATCH, MOVE COUNTER 1 CHECK MOVES IN
    //STAR COUNTER FUNCTION
    if(openCards.length === 2) {
      matchCheck(clickTarget);
      moveCounter();
      starCounter();
    }
  }
});

//TOGGLE CARDS OPEN
function toggleOpen(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
  clickTarget.classList.toggle('disable');
};

//ADDING TO OPEN CARD ARRAY
function addOpenCard(clickTarget) {
  //PUSHING EVENT/CLICK TARGET CARDS TO OPEN CARDS []
  openCards.push(clickTarget);
  // console.log(openCards);
  //IF OPEN CARDS IS ONLY 1 AND COUNTER IS 0 THEN START TIMER
  if (openCards.length == 1 && myCounter == 0) {
    startTimer();
  }
};

//MATCHING/NOT MATCHING
function matchCheck() {
  if (
    //IF FIRST AND SECOND CARDS IN OPEN CARD [] ARE THE SAME THEN DISPLAY
    //MATCHED MESSAGE, ADD CLASS MATCH, RESET OPEN CARD [] AND CHECK
    //FOR TOTAL MATCHING COUNT TO DISPLAY FINISH MODAL
    openCards[0].firstElementChild.className ===
    openCards[1].firstElementChild.className
  ) {
    messageBoard(matchedPair);
    openCards[0].classList.add('match');
    openCards[1].classList.add('match');
    clearOpen();
    matchingCards++;
    if (matchingCards == 8) {
      setTimeout(function(e) {
        displayFinished();
      },500);
    };
    //IF THEY DON'T MATCH; DISPLAY MESSAGE, ADD NOMATCH CLASS, TOGGLE CARDS OFF
    //REMOVE CLASS, RESET OPEN [] DELAY FOR 900ms
  } else {
    messageBoard(misMatch);
    openCards[0].classList.add('noMatch');
    openCards[1].classList.add('noMatch');
    setTimeout(function() {
      toggleOpen(openCards[0]);
      toggleOpen(openCards[1]);
      openCards[0].classList.remove('noMatch');
      openCards[1].classList.remove('noMatch');
      clearOpen();
    }, 900);
  }
};

//CLEAR OPEN CARDS ARRAY
function clearOpen() {
  openCards = [];
}

//RESET/NEW GAME FUNCTION
function resetBoard() {
  cards.forEach(function(card) {
    card.classList = "card";
});
    matchingCards = 0;
    resetTimer();
    resetCounter();
    messageBoard(gameReset);
    shuffledCards();
    clearOpen();
    resetStar();
};

//RESET COUNTER
function resetCounter() {
  myCounter = 0;
  counter.innerHTML = '0';
}

//MOVING COUNTER
function moveCounter() {
  myCounter++;
  counter.innerHTML = myCounter;
};

//MESSAGES
function messageBoard(message) {
  gameMessage.innerHTML = message;
  setTimeout(function() {
    gameMessage.innerHTML = "";
  }, 1500);
};

let welcome = "Hello There!";
let gameReset = "Game has been reset!";
let matchedPair = "A great addition to my collection!";
let misMatch = "This wont do!";
let finished = "You've got the high ground!";

function welcomeMessage() {
  gameMessage.innerHTML = "Hello There!";
  setTimeout(function() {
    gameMessage.innerHTML = "";
  }, 5000);
};

//STARS
//STAR RATING BASED ON COUNTER`
function starCounter() {
  if (myCounter === 10 || myCounter === 15 || myCounter === 20) {
    hideStar();
    }
};

//LOOP FOR HIDING STARS;
function hideStar() {
  for(star of stars) {
    if(star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  };
};

//LOOP THROUGH STAR STYLES
function resetStar() {
  stars.forEach(function(star) {
    star.style.display = '';
  });
};

//GET STAR COUNT FOR MODAL
function getStars() {
  //SETTING VARIABLE FOR ARGUMENT
  let starRating = 0;
  //FOR LOOP TO CHECK FOR STYLE DISPLAYS NOT NONE AND TAKE COUNT
  for (star of stars) {
    if (star.style.display !== 'none') {
      starRating++;
    }
  }
  return starRating;
};
