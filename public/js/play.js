var display_assigned_challenges = [];
var display_artist_challenges = [];
var display_genre_challenges = [];
var display_popular_challenges = [];
var genre = document.getElementById('bygenre');
var artist = document.getElementById('byartist');
var popular = document.getElementById('bypopular');
var personally = document.getElementById('bypersonallyassigned');


//This is the main function called by onload on the play.html
function playMain() {

    genre = document.getElementById('bygenre');
    artist = document.getElementById('byartist');
    popular = document.getElementById('bypopular');
    personally = document.getElementById('bypersonallyassigned');


    //todo: load popular
    //todo: load assigned

    //todo:artist are loaded base on the user selection
    //todo: genre and

}

// This function creates a div object from a given string of the creator of the challenge
// the artist of the specific song, and the amount of points this challenge contains.
// It will return the created div.
function createDiv(challenge){

    var div = document.createElement("div");
    div.className = "nodebuddyholder";

    var assignedBy = document.createElement("p");
    assignedBy.className = "challengeName";

    var challengeName = document.createElement("p");
    challengeName.className = "challengeName";

    assignedBy.innerHTML = challenge.creator;
    challengeName.innerHTML = challenge.challengeName;

    div.appendChild(challengeName);
    div.appendChild(assignedBy);
    //if(document.getElementById('bypersonallyassigned').children == null){
        document.getElementById("bypersonallyassigned").appendChild(div);
    // }else{
    //     personally.insertBefore(div, personally.children[0])
    // }

}

// This function is to reveal the challenges when catergory is clicked
function revealchallenges(id) {
    var challenges = document.getElementById(id).children;

    if (challenges[1].style.display == "none") {
        challenges[0].style.marginTop = "10px";
        challenges[0].style.fontSize = "35px";
        for (var i = 0; i < challenges.length; i++) {
            challenges[i].style.display = "block";
        }
    } else {
        challenges[0].style.marginTop = "45%";
        challenges[0].style.fontSize = "50px";

        for (var i = 1; i < challenges.length; i++) {
            challenges[i].style.display = "none";
        }
    }
}

function clickedAssigned() {
    document.getElementById("bypersonallyassigned").removeChild(document.getElementById("bypersonallyassigned").children[0]);
    playGetChallenges();

}

function playGetChallenges() {

    //todo: check that the challenges has not been played before.
    //todo: display which challenges ave already been played (i will say in the end of the list.


    console.log("Hola");
    var user = "ng5xNPHtwKfi8aWnIQPegINbCWD2";//sessionStorage.getItem("userID");
    var query = users.doc(user).collection("assignedChallenges");//.where("wasPlayed", "=", false);
    var saveIDs = [];
    query.get().then(function (results) {
        results.forEach(function (hello) {
            var id = hello.data().challengeid;
            if (id != null) {
                var queryChallenge = challenges.doc(hello.data().challengeid);
                queryChallenge.get().then(function (challenge) {
                    var info = challenge.data();
                    //todo: query the user name;
                    var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                        info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge);

                    createDiv(challen);
                    this.display_assigned_challenges.unshift(challen);
                    console.log(challenge.data());
                })
            }
        });


    }).catch(function (err) {
        console.log(err);
    })


    // query.get().then(function (results) {
    //     if (results.exists) {
    //         var ownChallenges = results.data().ownChallenges;
    //
    //         ownChallenges.forEach(function (doc) {
    //              ownChallengesIDs.push(doc.id)
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
