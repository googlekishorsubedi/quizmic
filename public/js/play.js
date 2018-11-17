//This is the main function called by onload on the play.html
function playMain(){
  var genre = document.getElementById('bygenre');
  var artist = document.getElementById('byartist');
  var popular = document.getElementById('bypopular');
  var personally = document.getElementById('bypersonallyassigned');

  // the purpose of this code is that it will make the divs, how fakeDataQuery gets this information is not important
  // more than likely however it will be returned in an array.

  // Change the value of length to change how many question nodes are shown.
  var length = 4;

  for(var i = 0; i < length; i++){
    var dataHolder = fakeDataQuery(i);
    var div1 = createDiv(dataHolder[0], dataHolder[1], i);
    var div2 = createDiv(dataHolder[0], dataHolder[1], i);
    var div3 = createDiv(dataHolder[0], dataHolder[1], i);
    var div4 = createDiv(dataHolder[0], dataHolder[1], i);

    genre.appendChild(div1);
    artist.appendChild(div2);
    popular.appendChild(div3);
    personally.appendChild(div4);
  }
}

// This function creates a div object from a given string of the creator of the challenge
// the artist of the specific song, and the amount of points this challenge contains.
// It will return the created div.
function createDiv(assigned, artist, points){
  var div = document.createElement("div");
  div.className = "nodebuddyholder";

  var assignedBy = document.createElement("p");
  assignedBy.className = "creatorUsername";

  var challengeName = document.createElement("p");
  challengeName.className = "challengeName";

  var pointsBy = document.createElement("p");
  pointsBy.className = "points";

  assignedBy.innerHTML = assigned + "";
  challengeName.innerHTML = "Challenge Name";
  pointsBy.innerHTML = points + "";

  div.appendChild(assignedBy);
  div.appendChild(challengeName);
  div.appendChild(pointsBy);

  return div;
}

//This function will call whatever actual function that Kishor or Kristalys makes
//and it will return the results probably in a double array.
//for right now it just has dummy representation
function fakeDataQuery(howManyResults){
  return ["Assigned by ___", "Artist", "Points"];
}

// This function is to reveal the challenges when catergory is clicked
function revealchallenges(id){
  var challenges = document.getElementById(id).children;

  if (challenges[1].style.display == "none") {
    challenges[0].style.marginTop = "10px";
      challenges[0].style.fontSize = "35px";
    for (var i = 0; i < challenges.length; i++) {
      challenges[i].style.display = "block";
    }
  }else {
    challenges[0].style.marginTop = "45%";
    challenges[0].style.fontSize = "50px";

      for (var i = 1; i < challenges.length; i++) {
        challenges[i].style.display = "none";
      }
  }
}

function playGetChallenges() {

    console.log("Hola")
    var user = sessionStorage.getItem("userID");
    var query = users.doc(user).collection("assignedChallenges");//.collection("assignedChallenges");
    var ownChallengesIDs = [];
    query.get().then(function (results){
      results.forEach(function (hello) {
          console.log(hello.data());
      })

    }).catch(function (err) {
      console.log(err);
    })


    // query.get().then(function (results) {
    //     if (results.exists) {
    //         var ownChallenges = results.data().ownChallenges;
    //
    //         ownChallenges.forEach(function (doc) {
    //             ownChallengesIDs.push(doc.id)
    //         });
    //     }
    //     else
    //         console.log("No documents found!");
    //
    //
    //     ownChallengesIDs.forEach(function (e) {
    //         var query = challenges.doc(e);
    //         query.get().then(function (results) {
    //             if (results.exists) {
    //                 var info = results.data();
    //                 var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
    //                     info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, e);
    //
    //                 createButtonSections(challen);
    //                 this.challengesArray.unshift(challen);
    //
    //             }
    //             else
    //                 console.log("No challenge was found with that ID!");
    //
    //         }).catch(function (error) {
    //             console.log("Error getting challenge ID:", error);
    //         });
    //     });
    // }).catch(function (error) {
    //     console.log("Error getting user owned challenges:", error);
    // });

}
