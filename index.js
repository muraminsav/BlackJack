let playerCards = [];
let dealerCards = [];

let playerScore = 0;
let dealerScore = 0;
let playerWin = 0;
let dealerWin = 0;

let suits = ["C", "D", "S", "H"];
let deck = [];
let c = 1;
// Functions

const rotation = function () {
  $(".deckCard").rotate({
    angle: 0,
    animateTo: 346 + 1400,
    easing: function (x, t, b, c, d) {
      return c * (t / d) + b;
    },
    callback: rotation,
  });
};

// creating deck and card values
const generateDeck = function () {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 2; j <= 14; j++) {
      deck.push(suits[i] + j);
    }
  }
};
const valuator = function (slice, sc) {
  switch (true) {
    case parseInt(slice) == 14 && sc + 11 <= 21:
      return 11;
    case parseInt(slice) == 14 && sc + 11 > 21:
      return 1;
    case parseInt(slice) > 10 && parseInt(slice) < 14:
      return 10;
    default:
      return parseInt(slice);
  }
};
// -------------
// pading calculator
const p = function () {
  return (37 + 3 * playerCards.length).toString() + "%";
};
const d = function () {
  return (37 + 3 * dealerCards.length).toString() + "%";
};
const padding = function (a) {
  return (a.length * 20).toString();
};
//----------------

// dealig functions
const randomCard = function () {
  let n = Math.floor(Math.random() * deck.length);
  let card = deck[n];
  deck.splice(deck.indexOf(card), 1);
  return card;
};
const firstDeal = function () {
  $("#welcome").fadeOut(100);
  $("header").show("slide", { direction: "up" }, 200);
  setTimeout(function () {
    dealToPlayer(p());
    return (playerScore += revealCard(
      "player",
      randomCard(),
      playerCards,
      playerScore
    ));
  }, 1000);
  displayScore(1400);
  setTimeout(function () {
    dealToDealer(d());
    return (dealerScore += revealCard(
      "dealer",
      randomCard(),
      dealerCards,
      dealerScore
    ));
  }, 1400);
  displayScore(1800);
  setTimeout(function () {
    dealToPlayer(p());
    return (playerScore += revealCard(
      "player",
      randomCard(),
      playerCards,
      playerScore
    ));
  }, 1800);
  displayScore(2200);
  setTimeout(function () {
    dealToDealer(d());
    setTimeout(function () {
      $("#dealer").append(
        '<div class="flipCard"> <div class="flipCardInner"><div class="flipCardFace"><img   src="img/cardBack.png" alt="card face down" style="padding-top:20px"></div><div class="flipCardBack" id="flipCBack"></div></div></div>'
      );
    }, 400);
    setTimeout(function () {
      $(".deckCard").stopRotate();
    }, 400);
  }, 2200);
};
const dealToPlayer = function (a) {
  $(".deckCard").show(0);
  rotation();
  $(".deckCard")
    .animate({ left: a, top: "48%" }, 400)
    .hide(0)
    .animate({ left: "11%", top: "2%" }, 0);
};
const dealToDealer = function (a) {
  $(".deckCard").show(0);
  rotation();
  $(".deckCard")
    .animate({ left: a, top: "15%" }, 400)
    .hide(0)
    .animate({ left: "10%", top: "1.8%" }, 0);
};
const revealCard = function (to, value, where, sc) {
  let cardV = valuator(value.slice(1), sc, where);
  setTimeout(function () {
    $("#" + to + "").append(
      "<img src=img/deck/" +
        value +
        ".png style='padding-left:" +
        padding(where) +
        "px; padding-top:" +
        padding(where) +
        "px'>"
    );

    where.push(cardV);
  }, 400);

  return parseInt(cardV);
};
// ------------------------

// score updates
const displayScore = function (timer) {
  setTimeout(function () {
    $("#playerScore").html("<p>" + playerScore + "</p>");
    $("#dealerScore").html("<p>" + dealerScore + "</p>");
  }, timer);
};
const displayWins = function () {
  $(".playerWins").text(playerWin);
  $(".bankWins").text(dealerWin);
};
// -----------------------

// Dealer final cards
const dealer = function (dealerScore) {
  if (dealerScore >= 17) return dealerScore;
  c += 1;
  setTimeout(function () {
    dealToDealer(d());
    setTimeout(function () {
      dealerScore += revealCard(
        "flipCBack",
        randomCard(),
        dealerCards,
        dealerScore
      );
      return dealer(dealerScore);
    }, 2 * c);
  }, 200 * c);
};

const finalScoreTimer = function () {
  setTimeout(function () {
    if (
      dealerCards.reduce((a, b) => {
        return a + b;
      }) >= 17
    ) {
      dealerScore = dealerCards.reduce((a, b) => {
        return a + b;
      });
      displayScore(20);
      setTimeout(function () {
        winnerIs();
        $(".deckCard").stopRotate();
      }, 300 * c);
    } else {
      dealerScore = dealerCards.reduce((a, b) => {
        return a + b;
      });
      displayScore(1);
      finalScoreTimer();
    }
  }, 400);
};
// ---------------------

// winner
const bankWon = function () {
  dealerWin += 1;

  $("header").hide(
    "slide",
    {
      direction: "up",
    },
    100
  );
  $("#winner").fadeIn(200);
  $(".won").html("Bank Won!");
  $(".hr").css("background-color", "#7a0303");
  $("#winner h1").css("color", "#7a0303");
  $("h2.won").css("color", "#7a0303");
  $(".bankWon").show().animate({ left: "50%" }, 1000);
  $("#winner button").css("background-color", "#7a0303").css("color", "white");
};

const playerWon = function () {
  playerWin += 1;

  $("header").hide(
    "slide",
    {
      direction: "up",
    },
    100
  );
  $("#winner").fadeIn(200);
  $(".playerWon").show(20);
  $(".hr").css("background-color", "#ffc107");
  $("#winner h1").css("color", "#ffc107");
  $("h2.won").css("color", "#ffc107");
  $(".won").html("You Won!");
  $("#winner button").css("background-color", "#ffc107").css("color", "black");
};

const winnerIs = function () {
  dealerScore < 22 && playerScore <= dealerScore ? bankWon() : playerWon();
};

const resetTable = function () {
  playerCards = [];
  playerScore = 0;
  dealerCards = [];
  dealerScore = 0;
  $("#dealer").children().remove();
  $("#player").children().remove();
  displayScore(1);
  deck = [];
  generateDeck();
};
// ------------------

// opening
generateDeck();

$(".start").bind("click", function () {
  firstDeal();
});

// Hit button
$(".hit").bind("click", function firstDeal() {
  if (playerCards.length >= 2 && playerScore < 21 && dealerCards.length < 2) {
    setTimeout(function () {
      dealToPlayer(p());
      return (playerScore += revealCard(
        "player",
        randomCard(),
        playerCards,
        playerScore
      ));
    }, 0);
    displayScore(400);
    setTimeout(function () {
      $(".deckCard").stopRotate();
      if (playerScore > 21) {
        bankWon();
      }
    }, 600);
  } else {
    $(".deckCard").stopRotate();
  }
});

// Stand button
$(".stand").bind("click", function () {
  if (playerCards.length >= 2 && $("#dealer").children().length >= 2) {
    dealerScore += revealCard(
      "flipCBack",
      randomCard(),
      dealerCards,
      dealerScore
    );
    $(".flipCardInner").addClass("flip");
    setTimeout(function () {
      $(".flipCardFace").hide();
    }, 400);
    displayScore(500);
    setTimeout(function () {
      if (dealerScore < 17) {
        dealer(dealerScore);
        finalScoreTimer();
      } else {
        setTimeout(function () {
          winnerIs();
        }, 600);
      }
    }, 600);
  }
});
// rematch button
$(".rematch").bind("click", function () {
  resetTable();
  $(".playerWon").hide();
  $(".bankWon").hide().animate({ left: "0%" });
  $("#winner").hide(100);
  displayWins();
  setTimeout(function () {
    firstDeal();
  }, 200);
});
