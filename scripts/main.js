// adding firebase strucutres here
// creating a new account
firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // handle errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});



function startGame(){
    // this forloop is allowing the game to start over.
    for(var i = 1; i<=25; i++){
        clearBox(i);
    }
    
    setMessage(turn + "'s Turn.");
}

var winner = null;
var turn = "Order";


function setMessage(msg){
    document.getElementById("message").innerText = msg;
}


function nextMove(square){
    if(square.style.backgroundColor == ''){
        if(option == 'black'){
            square.style.backgroundColor = 'black';
        } else if(option == 'white'){
            square.style.backgroundColor = 'white';
        } 
        
        switchTurn();
    } else {
        setMessage("Pick another place")
    }
}

function chooseColor(choice){
    if(choice == 'black'){
        option = 'black';
        document.getElementById("message").innerText = choice;
    } else {
       option = 'white';
       document.getElementById("message").innerText = choice;
    }
    
}


function switchTurn() {
    if(checkForWinner(document.turn)){
        setMessage("Order Won")     
    }else if(turn == "Order"){
        turn = "Disorder";
        setMessage(turn + "'s Turn")
    } else {
        turn = "Order";
        setMessage(turn + "'s Turn")
    }
}

function checkForWinner(move){
    var result = false;
    if(checkRow(1,2,3,4,5, move) ||
       checkRow(6,7,8,9,10, move) ||
       checkRow(11,12,13,14,15, move) ||
       checkRow(16,17,18,19,20, move) ||
       checkRow(21,22,23,24,25, move) ||
       checkRow(1,6,11,16,21, move) ||
       checkRow(2,7,12,17,22, move) ||
       checkRow(3,8,12,18,23, move) ||
       checkRow(4,8,13,18,23, move) ||
       checkRow(5,10,15,20,25, move) ||
       checkRow(5,9,13,17,21, move) ||
       checkRow(1,7,13,19,25, move) ||
       checkRow(4,8,12,16, move) ||
       checkRow(22,18,14,10, move) ||
       checkRow(2,8,14,20, move) ||
       checkRow(6,12,18,24, move)){
           result = true;
       }
       return result;
}

// says check4 but currently only checking for 3  must fix this just bugfixing
/* dedcided to go with old checkRow to for win con    saving this to work on later
 array will have to be the possible rows
function check4(array){
    return array.some(function (a, e, i, o){
        return e > 1 && a === i[e -2] && a === i[e - 1];
    });
}
*/
function checkRow(a,b,c,d,e, move){
    var result = false;
    
    if(getBox(a) == 'black' && getBox(b) == 'black' && getBox(c) == 'black' && getBox(d) == 'black'
        || (getBox(b) == 'black' && getBox(c) == 'black' && getBox(d) == 'black' && getBox(e) == 'black'
        || getBox(a) == 'white' && getBox(b) == 'white' && getBox(c) == 'white' && getBox(d) == 'white'
        || getBox(b) == 'white' && getBox(c) == 'white' && getBox(d) == 'white' && getBox(e) == 'white'))
    {
        result = true;
    }
    return result;
}


function getBox(number){
    return document.getElementById('s' + number).style.backgroundColor;
}  

function clearBox(number){
    document.getElementById("s" + number).style.backgroundColor ="";
}


