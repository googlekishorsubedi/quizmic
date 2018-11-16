var playingChallenge;
var opt1;
var opt2;
var opt3;
var opt4;

function loadChallengePlay(){

    var parsedChallenge = JSON.parse(sessionStorage.getItem("playingChallenge"));
    playingChallenge = parsedChallenge;

    var shuffleArray = shuffle([parsedChallenge.option1, parsedChallenge.option2, parsedChallenge.option3, parsedChallenge.song]);

    //todo if there is no hint hidde the button;

    if(parsedChallenge.hint !== ""){
        document.getElementById("hint_button").hidden = false;
        document.getElementById("hint_box_div").hidden = false;
    }
    document.getElementById("playoption11").innerText = shuffleArray[0];
    document.getElementById("playoption22").innerText = shuffleArray[1];
    document.getElementById("playoption33").innerText = shuffleArray[2];
    document.getElementById("playoption44").innerText = shuffleArray[3];


    opt1 = document.getElementById("playoption1");
    opt2 = document.getElementById("playoption2");
    opt3 = document.getElementById("playoption3");
    opt4 = document.getElementById("playoption4");

    opt1.onclick = function() {
        checkAnswer(shuffleArray[0]);
    };

    opt2.onclick = function() {
        checkAnswer(shuffleArray[1]);
    };

    opt3.onclick = function() {
        checkAnswer(shuffleArray[2]);
    };

    opt4.onclick = function() {
        checkAnswer(shuffleArray[3]);
    };
}

function checkAnswer(answer){
    stopVideo();
    if(answer === playingChallenge.song){
        alert("This is the correct answer!")
    }
    else
        alert("This answer is incorrect the correct one should had been: " + playingChallenge.song)

    //TODO: the logic of addind the points and all that stuff.
    //TODO: where ever thereis an alert change it so that the cute box appears
    //TODO: security



}

/**
 * Shuffles array
 * REference in Stack Overflow;
 * @param array the array to be shuffled.
 * @returns shuffled array
 */
function shuffle(array) {
    var j, temp, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function blockButtons() {
    opt1.onclick = function() {
        alert("Time is up! SORRY!")

    }
    opt2.onclick = function() {
        alert("Time is up! SORRY!")

    }
    opt3.onclick = function() {
        alert("Time is up! SORRY!")

    }
    opt4.onclick = function() {
        alert("Time is up! SORRY!")

    }


}