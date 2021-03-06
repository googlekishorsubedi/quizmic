var users = firestore.collection("users");
var groups = firestore.collection("groups");
var challenges = firestore.collection("challenges");
var username = firestore.collection("username");
document.addEventListener("DOMContentLoaded", function(event) {
  var userid = sessionStorage.getItem("userID");
  var query = users.doc(userid);
  query.get().then(user => {

    var data = user.data();
    var objUser = User(data.username, data.email, data.score, data.challengesPlayed, data.img);
    var str = UserToParce(objUser);
    var stringify = JSON.stringify(str);
    sessionStorage.setItem("userObject", stringify);
    document.getElementById("profilepic").src = data.img;

  });
});

var stats;

function loadDashboard() {
  var stats = seeStats();
  StatsofFriends();
  getQuickChallenges();


}

firebase.auth().onAuthStateChanged(function(user) {
  console.log("authentication changed");

  var user = firebase.auth().currentUser;
  var emailRef = firestore.collection("users").doc(user.uid);
  emailRef.get().then(function(doc) {
    if (doc.exists) {
      document.getElementById("name").innerHTML = doc.data().username;
    } else {
      // doc.data() will be undefined in this case
      alert("User not found");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });

  // var username = firebase.collection("users").doc(user.uid).get()

});

function signOut() {
  sessionStorage.removeItem("userID");
  console.log("Llama el metodo");
  //sessionStorage.removeItem("userID");
  sessionStorage.clear();

  firebase.auth().signOut().then(function() {
    document.location.href = "../index.html";
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });

}

function getQuickChallenges() {
  var empty = document.getElementById('quickchallengelist');
  if (empty.childNodes.length > 1) {} else {
    empty.appendChild(needAChallenge());
  }

  var user = sessionStorage.getItem("userID");
  var query = users.doc(user).collection("assignedChallenges").where("wasPlayed", "==", false);
  query.get().then(function(results) {
    results.forEach(function(hello) {
      var id = hello.data().challengeid;
      if (id != null) {
        var queryChallenge = challenges.doc(hello.data().challengeid);
        queryChallenge.get().then(function(challenge) {
          var info = challenge.data();
          var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
            info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge, challenge.id);

          var q = users.doc(info.creator.id);
          q.get().then(u => {
            var uname = u.data().username;
            var pic = u.data().img;

            if (document.getElementById("removeme")) {
              var em = document.getElementById('quickchallengelist');
              document.getElementById("removeme").parentNode.removeChild(document.getElementById("removeme"));
            }

            if (pic === undefined) {
              createDivQuickChallenge(challen, uname, "../avatarphotos/beardman.png");
            } else {
              createDivQuickChallenge(challen, uname, pic);
            }
          }).catch(function(err) {
            console.log(err);
          });

        }).catch(function(err) {
          console.log(err);
        })
      }
    });
  }).catch(function(err) {
    console.log(err);
  })
}

function needAChallenge() {

  var div = document.createElement("div");
  div.className = "quickchallenge";
  div.id = "removeme"


  var subdivtext = document.createElement("div");
  subdivtext.className = "individualstatsheader1";


  var challengeName = document.createElement("p");
  challengeName.className = "challengeName";
  challengeName.innerHTML = "No personally assigned Challenges yet"

  subdivtext.appendChild(challengeName);
  div.appendChild(subdivtext);
  return div;
}


function createDivQuickChallenge(challenge, name, imgu) {

  var div = document.createElement("div");
  div.className = "quickchallenge";

  var subdivimg = document.createElement("div");
  subdivimg.className = "statisticspic";


  var subdivtext = document.createElement("div");
  subdivtext.className = "individualstatsheader1";


  var img = document.createElement("img");
  img.className = "statisticspic";
  img.src = imgu;


  var challengeName = document.createElement("p");
  challengeName.className = "challengeName";
  challengeName.onclick = function() {

    sessionStorage.setItem("playMode", "assigned");
    selectedchallenge = ChallengeToParce(challenge);
    var stringify = JSON.stringify(selectedchallenge);
    sessionStorage.setItem("playingChallenge", stringify);
    document.location.assign("../html/challenge.html");
    //document.location.replace("../html/challenge.html");
  };


  challengeName.innerHTML = challenge.challengeName + " by User: " + name;


  subdivimg.appendChild(img);
  subdivtext.appendChild(challengeName);
  div.appendChild(subdivimg);
  div.appendChild(subdivtext);

  document.getElementById("quickchallengelist").appendChild(div);

}
