var playingChallenge;
var opt1;
var opt2;
var opt3;
var opt4;

function loadChallengePlay() {

    var parsedChallenge = JSON.parse(sessionStorage.getItem("playingChallenge"));
    playingChallenge = parsedChallenge;

    var shuffleArray = shuffle([parsedChallenge.option1, parsedChallenge.option2, parsedChallenge.option3, parsedChallenge.song]);

    if (parsedChallenge.hint !== "") {
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

    opt1.onclick = function () {
        checkAnswer(shuffleArray[0]);
    };

    opt2.onclick = function () {
        checkAnswer(shuffleArray[1]);
    };

    opt3.onclick = function () {
        checkAnswer(shuffleArray[2]);
    };

    opt4.onclick = function () {
        checkAnswer(shuffleArray[3]);
    };
}

//todo: clear up session storage challenge, playMode and all that stuff;

function addScoreToDataBase(wasRight, answer) {
    console.log("enters here");
    var playMode = sessionStorage.removeItem("playMode");
    var assign = false;
    if (playMode === "assigned") {
        assign = true;
    }

    if (wasRight) {
        var transaction = firestore.runTransaction(t => {
            return t.get(challenges.doc(playingChallenge.id)).then(doc => {

                var data = doc.data();
                console.log(playingChallenge.id);
                console.log(data);

                t.update(challenges.doc(playingChallenge.id), {
                    attempted: data.attempted+1,
                    rightlyAnswered: data.rightlyAnswered+1,
                }).then(trans => {
                    if (assign) {
                        var userid = sessionStorage.getItem("userID");
                        var query = users.doc(userid).collection("assignedChallenges").where("challengeid", "==", playingChallenge.id);
                        t.get(query).then(result => {
                                result.forEach(c => {
                                    t.update(c, {wasPlayed: true, answerGiven: answer}).then(last => {
                                        document.location.replace("../html/play.html")

                                    }).catch(err => {
                                        console.log('Transaction failure1:', err);
                                    })
                                })
                            }
                        ).catch(err => {
                            console.log('Transaction failure2:', err);
                        })
                    }
                }).catch(err => {
                    console.log('Transaction failure3:', err);
                })
            }).catch(err => {
                console.log('Transaction failure4:', err);
            });

        }).then(function () {
            console.log('Transaction success!');
        }).catch(err => {
            console.log('Transaction failure:', err);
        });


    } else {
        var transaction = firestore.runTransaction(t => {
            return t.get(challenges.doc(playingChallenge.id)).then(doc => {

                var data = doc.data();

                t.update(challenges.doc(playingChallenge.id), {
                    attempted: data.attempted+1,
                }).then(trans => {
                    if (assign) {
                        var userid = sessionStorage.getItem("userID");
                        var query = users.doc(userid).collection("assignedChallenges").where("challengeid", "==", playingChallenge.id);
                        t.get(query).then(result => {
                                result.forEach(c => {
                                    t.update(c, {wasPlayed: true, answerGiven: answer}).then(last => {
                                            document.location.replace("../html/play.html")
                                        //todo: redirect to the page woth finished challenges if it is a assigned one

                                    }).catch(err => {
                                        console.log('Transaction failure1:', err);
                                    })
                                })
                            }
                        ).catch(err => {
                            console.log('Transaction failure2:', err);
                        })
                    }
                }).catch(err => {
                    console.log('Transaction failure3:', err);
                })
            }).catch(err => {
                console.log('Transaction failure4:', err);
            });

        }).then(function () {
            console.log('Transaction success!');
        }).catch(err => {
            console.log('Transaction failure:', err);
        });
    }


}

function checkAnswer(answer) {
    stopVideo();
    var wasItRight = false;
    if (answer === playingChallenge.song) {
        alert("This is the correct answer!");
        wasItRight = true;
    }
    else
        alert("This answer is incorrect the correct one should had been: " + playingChallenge.song);

    var playmode = sessionStorage.getItem("playMode");
    if (playmode !== "own") {
        addScoreToDataBase(true, answer);
    } else {
        document.location.replace("../html/create.html")

    }
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
    opt1.onclick = function () {
        alert("Time is up! SORRY!")

    }
    opt2.onclick = function () {
        alert("Time is up! SORRY!")

    }
    opt3.onclick = function () {
        alert("Time is up! SORRY!")

    }
    opt4.onclick = function () {
        alert("Time is up! SORRY!")

    }


}