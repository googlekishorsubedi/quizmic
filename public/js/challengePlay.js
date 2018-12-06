var playingChallenge;
var opt1;
var opt2;
var opt3;
var opt4;
var userObj;

function loadChallengePlay() {

  userObj = JSON.parse(sessionStorage.getItem("userObject"));
  document.getElementById("profilepic").src = userObj.img;
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


function addScoreToDataBase(wasRight, answer) {
  console.log("enters here");
  var playMode = sessionStorage.getItem("playMode");
  var userid = sessionStorage.getItem("userID");
  console.log(userid + " " + playMode + " " + playingChallenge.id);

  if (playMode === "assigned") {

    if (wasRight) {
      var transaction = firestore.runTransaction(t => {
        return t.get(users.doc(userid).collection("assignedChallenges").doc(playingChallenge.id)).then(doc => {

          t.update(users.doc(userid).collection("assignedChallenges").doc(playingChallenge.id), {
            wasPlayed: true,
            answerGiven: answer
          });

          playingChallenge.attempted++;
          playingChallenge.rightlyAnswered++;
          t.update(challenges.doc(playingChallenge.id), {
            attempted: playingChallenge.attempted,
            rightlyAnswered: playingChallenge.rightlyAnswered
          });

          userObj.challengesPlayed++;
          userObj.score++;
          t.update(users.doc(userid), {
            challengesPlayed: userObj.challengesPlayed,
            score: userObj.score
          });

          var objUser = User(userObj.username, userObj.email, userObj.score, userObj.challengesPlayed, userObj.img);
          var str = UserToParce(objUser);
          var stringify = JSON.stringify(str);
          sessionStorage.setItem("userObject", stringify);



        }).catch(err => {
          console.log('Transaction failure4:', err);
        });

      }).then(t => {
        console.log('Transaction success!');
        document.location.replace("../html/play.html")


      }).catch(err => {
        console.log('Transaction failure:', err);
      });


    } else {
      var transaction = firestore.runTransaction(t => {

        return t.get(users.doc(userid).collection("assignedChallenges").doc(playingChallenge.id)).then(doc => {

          t.update(users.doc(userid).collection("assignedChallenges").doc(playingChallenge.id), {
            wasPlayed: true,
            answerGiven: answer
          });

          playingChallenge.attempted++;
          t.update(challenges.doc(playingChallenge.id), {
            attempted: playingChallenge.attempted
          });

          userObj.challengesPlayed++;
          t.update(users.doc(userid), {
            challengesPlayed: userObj.challengesPlayed
          });

          var objUser = User(userObj.username, userObj.email, userObj.score, userObj.challengesPlayed, userObj.img);
          var str = UserToParce(objUser);
          var stringify = JSON.stringify(str);
          sessionStorage.setItem("userObject", stringify);


        }).catch(err => {
          console.log('Transaction failure4:', err);
        });

      }).then(t => {
        console.log('Transaction success!');
        document.location.replace("../html/play.html")


      }).catch(err => {
        console.log('Transaction failure:', err);
      });
    }
  } else {

    if (wasRight) {
      var transaction = firestore.runTransaction(t => {
        return t.get(users.doc(userid)).then(doc => {

          userObj.challengesPlayed++;
          userObj.score++;
          t.update(users.doc(userid), {
            challengesPlayed: userObj.challengesPlayed,
            score: userObj.score
          });

          playingChallenge.attempted++;
          playingChallenge.rightlyAnswered++;
          t.update(challenges.doc(playingChallenge.id), {
            attempted: playingChallenge.attempted,
            rightlyAnswered: playingChallenge.rightlyAnswered
          });


          var objUser = User(userObj.username, userObj.email, userObj.score, userObj.challengesPlayed, userObj.img);
          var str = UserToParce(objUser);
          var stringify = JSON.stringify(str);
          sessionStorage.setItem("userObject", stringify);

        }).catch(err => {
          console.log('Transaction failure4:', err);
        });

      }).then(t => {
        console.log('Transaction success!');
        document.location.replace("../html/play.html")



      }).catch(err => {
        console.log('Transaction failure:', err);
      });


    } else {
      var transaction = firestore.runTransaction(t => {
        return t.get(users.doc(userid)).then(doc => {

          userObj.challengesPlayed++;
          t.update(users.doc(userid), {
            challengesPlayed: userObj.challengesPlayed
          });

          playingChallenge.attempted++;
          t.update(challenges.doc(playingChallenge.id), {
            attempted: playingChallenge.attempted
          });

          var objUser = User(userObj.username, userObj.email, userObj.score, userObj.challengesPlayed, userObj.img);
          var str = UserToParce(objUser);
          var stringify = JSON.stringify(str);
          sessionStorage.setItem("userObject", stringify);



        }).catch(err => {
          console.log('Transaction failure4:', err);
        });

      }).then(t => {
        console.log('Transaction success!');
        document.location.replace("../html/play.html")


      }).catch(err => {
        console.log('Transaction failure:', err);
      });
    }

  }

}

function checkAnswer(answer) {
  stopVideo();
  var wasItRight = false;
  if (answer === playingChallenge.song) {
    alert("This is the correct answer!");
    wasItRight = true;
  } else
    alert("This answer is incorrect the correct one should had been: " + playingChallenge.song);

  var playmode = sessionStorage.getItem("playMode");

  if (playmode !== "own") {
    addScoreToDataBase(wasItRight, answer);
  } else {
    document.location.replace("../html/create.html")

  }
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
    alert("Time is up! SORRY!");
    checkAnswer("");
  };

  opt2.onclick = function() {
    alert("Time is up! SORRY!");
    checkAnswer("");
  };

  opt3.onclick = function() {
    alert("Time is up! SORRY!");
    checkAnswer("");
  };

  opt4.onclick = function() {
    alert("Time is up! SORRY!");
    checkAnswer("");
  };


}
