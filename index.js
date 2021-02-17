var playerCards = [];
var dealerCards = [];

var playerScore = 0;
var dealerScore = 0;

var suits = ["C", "D", "S", "H"];
var deck = [];
var play = $(".start");
var info = $("#welcome");

for (var i = 0; i < suits.length; i++) {
  for (var j = 2; j <= 14; j++) {
    deck.push(suits[i] + j);
  }
}


// Functions

var rotation = function() {
  $(".deckCard").rotate({
    angle: 0,
    animateTo: 346 + 1400,
    easing: function(x, t, b, c, d) {
      return c * (t / d) + b;
    },
    callback: rotation
  });
};

var p = function() {
  return (37 + (3 * playerCards.length)).toString() + "%";
};
var d = function() {
  return (37 + (3 * dealerCards.length)).toString() + "%";
};
var padding = function(a) {
  console.log("padding " + (a.length * 20).toString());
  return (a.length * 20).toString();
};

var dealToPlayer = function(a) {
  $(".deckCard").show(0);
  rotation();
  $(".deckCard").animate({
      left: a,
      top: "48%"
    }, 400)
    .hide(0).animate({
      left: "11%",
      top: "2%"
    }, 0);

};
var dealToDealer = function(a) {
  $(".deckCard").show(0);
  rotation();
  $(".deckCard").animate({
      left: a,
      top: "15%"
    }, 400)
    .hide(0)
    .animate({
      left: "10%",
      top: "1.8%"
    }, 0);

};


var valuator = function(slice, where, sc) {

  switch (true) {
    case ((parseInt(slice) == 14) && ((sc + 11) <= 21)):
      return 11;
    case ((parseInt(slice) == 14) && ((sc + 11) > 21)):
      return 1;
    case ((parseInt(slice) > 10) && (parseInt(slice) < 14)):
      return 10;
    default:
      return parseInt(slice);
  }
};

var revealCard = function(to, value, where, sc) {
  var cardV = valuator(value.slice(1), where, sc);
  setTimeout(function() {
    $("#" + to + "").append("<img src=img/deck/" + value + ".png style='padding-left:" + padding(where) + "px'>");

    where.push(cardV);
  }, 400);


  return parseInt(cardV);

};

var randomCard = function() {
  var n = Math.floor(Math.random() * deck.length);
  var card = deck[n];
  deck.splice(deck.indexOf(card), 1);
  return card;
};
var displayScore = function(timer) {
  setTimeout(function() {
    $("#playerScore").html("<p>" + playerScore + "</p>");
    $("#dealerScore").html("<p>" + dealerScore + "</p>");
  }, timer);
};

var dealersTurn = function() {
  dealToDealer(d());
  sleep(400);
  return dealerScore += revealCard("flipCBack", randomCard(), dealerCards, dealerScore);
};

var bankWon = function() {

  $("header").hide("slide", {
    direction: "up"
  }, 100);
  $("#winner").fadeIn(200);
  $(".won").html("Bank Won!");
};

var playerWon = function() {
  $("header").hide("slide", {
    direction: "up"
  }, 100);
  $("#winner").fadeIn(200);
  $(".won").html("You Won!");
  $("#winner").css("background-image", "url(https://equity.guru/wp-content/uploads/2017/05/gold-coins.gif);");

};

// opening



play.bind("click",
  function() {
    info.fadeOut(100);
    $("header").show("slide", {
      direction: "up"
    }, 200);

    setTimeout(function() {
      dealToPlayer(p());
      return playerScore += revealCard("player", randomCard(), playerCards, playerScore);
    }, 1000);

    displayScore(1400);

    setTimeout(function() {
      dealToDealer(d());
      return dealerScore += revealCard("dealer", randomCard(), dealerCards, dealerScore);
    }, 1400);
    displayScore(1800);

    setTimeout(function() {
      dealToPlayer(p());
      return playerScore += revealCard("player", randomCard(), playerCards, playerScore);
    }, 1800);
    displayScore(2200);

    setTimeout(function() {
      dealToDealer(d());

      setTimeout(function() {
        $("#dealer").append('<div class="flipCard"> <div class="flipCardInner"><div class="flipCardFace"><img  src="img/cardBack.png" alt="card face down"></div><div class="flipCardBack" id="flipCBack"></div></div></div>');

      }, 400);
      setTimeout(function() {
        $(".deckCard").stopRotate();
      }, 400);
    }, 2200);
  }
);

 function sleep (milliseconds){
  return new Promise(function resolve() {setTimeout(resolve, milliseconds);});
}


// Hit button
$(".hit").bind("click", function() {
  if (playerCards.length >= 2 && playerScore < 21 && dealerCards.length < 2) {
    setTimeout(function() {
      dealToPlayer(p());
      return playerScore += revealCard("player", randomCard(), playerCards, playerScore);
    }, 0);
    displayScore(400);
    setTimeout(function() {
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
$(".stand").bind("click", function() {
  if (playerCards.length >= 2) {
    if (dealerCards.length < 2) {
      $(".flipCardInner").addClass("flip");
      setTimeout(function() {
        setTimeout(function() {
          $(".flipCardFace").hide();
        }, 400);
        return dealerScore += revealCard("flipCBack", randomCard(), dealerCards, dealerScore);
      }, 0);
      displayScore(400);
      setTimeout(function() {
        if (dealerScore < 17) {
          setTimeout(function() {
            do {

              dealToDealer(d());
            // await sleep(100);
              dealerScore += revealCard("flipCBack", randomCard(), dealerCards, dealerScore);
              displayScore(400);

            } while (dealerScore < 17);


            setTimeout(function() {
              dealerScore <= 21 && playerScore <= dealerScore ? bankWon() : playerWon();
            }, 1000);
          }, 1000);
        } else {
          setTimeout(function() {
            (playerScore < 22) && (playerScore > dealerScore) ? playerWon(): bankWon();
          }, 1000);
        }
      }, 800);

    }
  }

});
