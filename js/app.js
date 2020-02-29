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


//get shuffled cards
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

//variables list
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


//reset buttons
replayButton.addEventListener('click', function(e) {
  resetBoard();
  modal.classList.add('hidden');
});


resetBtn.addEventListener('click', resetBoard);

close.addEventListener('click', function(e) {
  modal.classList.add('hidden');
});


//welcome message
document.body.onload = welcomeMessage();

//html
timer.innerHTML = "0 mins 0 secs";


//start timer
function startTimer() {
  let seconds = 0, minutes = 0, hours = 0;
  interval = setInterval(function() {
    timer.innerHTML = minutes + ' mins ' + seconds + ' secs'
    seconds++;
    //convert 60 secs to minute
    if (seconds == 60) {
      minutes++;
      seconds = 0;
    }
    // console.log(timer()); INTERVAL OF 1000 ms = 1 sec
  }, 1000);
};

//format timer
function formatTimer() {
  let min = minutes < 10 ? '0' + String(minutes) : String(minutes);
  let sec = seconds < 10 ? '0' + String(seconds) : String(seconds);
  return min + ':' + sec;
};

//stop timer
function stopTimer() {
  clearInterval(interval);
};

//reset timer
function resetTimer() {
  clearInterval(interval);
  let seconds = 0, minutes = 0, hours = 0;
  timer.innerHTML = "0 mins 0 secs";
};

//flipping the cards and adding event listener
deck.addEventListener('click', card => {
  //set click target
  let clickTarget = card.target;
  if(clickTarget.classList.contains('card') && openCards.length < 2) {
    toggleOpen(clickTarget);
    addOpenCard(clickTarget);
    if(openCards.length === 2) {
      matchCheck(clickTarget);
      moveCounter();
      starCounter();
    }
  }
});

//toggle cards open
function toggleOpen(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
  clickTarget.classList.toggle('disable');
};

//add open card array
function addOpenCard(clickTarget) {
  //pushing event cliking the target cards to open cards
  openCards.push(clickTarget);
  // console.log(openCards);
  if (openCards.length == 1 && myCounter == 0) {
    startTimer();
  }
};

//MATCHING/NOT MATCHING
function matchCheck() {
  if (
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
    //if cards dont match dispay message, add no match class, toggle cards off
    //remove class, clear open, delay 900ms
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

//clear open cards array
function clearOpen() {
  openCards = [];
}

//reset new game function
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

//reset counter
function resetCounter() {
  myCounter = 0;
  counter.innerHTML = '0';
}

//moving counter
function moveCounter() {
  myCounter++;
  counter.innerHTML = myCounter;
};

//messages
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

//star rating
function starCounter() {
  if (myCounter === 10 || myCounter === 15 || myCounter === 20) {
    hideStar();
    }
};

//hiding stars loop;
function hideStar() {
  for(star of stars) {
    if(star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  };
};

//star styles loop
function resetStar() {
  stars.forEach(function(star) {
    star.style.display = '';
  });
};

//star count for modal
function getStars() {
  //setting variable argument
  let starRating = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starRating++;
    }
  }
  return starRating;
};
