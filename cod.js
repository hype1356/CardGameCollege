const http = new XMLHttpRequest();

player1name = prompt("Enter name of player 1");
player2name = prompt("Enter name of player 2");
//generate cards
cards = [];
for (i=0;i<3;i++) {
  for (j=0;j<10;j++) {
    if (i == 0) {
      cards.push("Red " + j);
    } else if (i == 1) {
      cards.push("Yellow " + j);
    } else {
      cards.push("Black " + j);
    }
  }
}

shufcards = cards;
var m = shufcards.length, t, i;
while (m) {
  i = Math.floor(Math.random() * m--);
  t = shufcards[m];
  shufcards[m] = shufcards[i];
  shufcards[i] = t;
}

console.log(shufcards);

player1d = document.getElementById('player1d');
player2d = document.getElementById('player2d');
var li = document.createElement('li');

//create player arrays
player1 = [];
player2 = [];

//player1 win or loss funcs
function win() {
  player1.push(player1curr[0] + player1curr[1], player2curr[0] + player2curr[1]);
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(player1curr[0] + ' ' + player1curr[1]));
  player1d.appendChild(li);
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(player2curr[0] + ' ' + player2curr[1]));
  player1d.appendChild(li);
}
function loss() {
  player2.push(player1curr[0] + player1curr[1], player2curr[0] + player2curr[1]);
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(player1curr[0] + ' ' + player1curr[1]));
  player2d.appendChild(li);
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(player2curr[0] + ' ' + player2curr[1]));
  player2d.appendChild(li);
}

document.getElementById("cdleft").innerHTML = "Cards Left: " + shufcards.length;

function step() { //runs once per iteration
//while (shufcards.length != 0) {
  player1curr = shufcards.pop().split(" "); //take one card from top of list
  document.getElementById("p1h").innerHTML = player1curr[0] + ' ' + player1curr[1];
  player2curr = shufcards.pop().split(" ");
  document.getElementById("p2h").innerHTML = player2curr[0] + ' ' + player2curr[1];
  if (player1curr[0] == player2curr[0]) { //if colour is same
    if (player1curr[1] > player2curr[1]) {
      win();
    } else {
      loss();
    }
  } else { //if colour is not same
    switch(player1curr[0]) {
      case ('Red'):
        if (player2curr[0] == 'Black') {
          win();
        } else {
          loss();
        }
        break;
      case ('Yellow'):
        if (player2curr[0] == 'Red') {
          win();
        } else {
          loss();
        }
        break;
      case ('Black'):
        if (player2curr[0] == 'Yellow') {
          win();
        } else {
          loss();
        }
        break;
    }
  }
  document.getElementById("cdleft").innerHTML = "Cards Left: " + shufcards.length;
  if (shufcards.length == 0) {
    if (player1.length > player2.length) {
      alert("PLAYER 1 WINS");
      data = {winner: player1name, numofcards: player1.length};
    } else {
      alert("PLAYER 2 WINS");
      data = {winner: player2name, numofcards: player2.length};
    }
      http.open("POST", "/play/in");
      http.send(JSON.stringify(data));
    //window.location.replace("/home");
  }
}
document.getElementById("step").addEventListener("click", function(){step()});