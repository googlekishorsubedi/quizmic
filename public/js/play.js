var display_assigned_challenges = [];
var display_artist_challenges = [];
var display_genre_challenges = [];
var display_popular_challenges = [];
var genre = document.getElementById('bygenre');
var artist = document.getElementById('byartist');
var popular = document.getElementById('bypopular');
var personally = document.getElementById('bypersonallyassigned');
document.addEventListener("DOMContentLoaded", function(event) {
    var userObj = JSON.parse(sessionStorage.getItem("userObject"));
    document.getElementById("profilepic").src = userObj.img;
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if(page === "settings.html"){
        document.getElementById("editprofilepic").src = userObj.img;
    }
});

//This is the main function called by onload on the play.html
function playMain() {

}

// This function creates a div object from a given string of the creator of the challenge
// the artist of the specific song, and the amount of points this challenge contains.
// It will return the created div.
function createDiv(challenge, name, todiv) {

    var div = document.createElement("div");
    div.className = "nodebuddyholder";

    var assignedBy = document.createElement("p");
    assignedBy.className = "challengeName";

    var challengeName = document.createElement("p");
    challengeName.className = "challengeName";
    challengeName.onclick = function () {
        if ("bypersonallyassigned" === todiv) {
            sessionStorage.setItem("playMode", "assigned");
        }
        if ("bygenre" === todiv || "byartist" === todiv) {
            sessionStorage.setItem("playMode", "public");
        }

        selectedchallenge = ChallengeToParce(challenge);
        var stringify = JSON.stringify(selectedchallenge);
        sessionStorage.setItem("playingChallenge", stringify);
        document.location.assign("../html/challenge.html");
        //document.location.replace("../html/challenge.html");

    };


    assignedBy.innerHTML = name;
    challengeName.innerHTML = challenge.challengeName;


    div.appendChild(challengeName);
    div.appendChild(assignedBy);

    if ("bypersonallyassigned" === todiv) {


        var declinebutton = document.createElement("button");
        declinebutton.className = "assignButton";
        declinebutton.innerText = "Decline";
        declinebutton.onclick = function () {
            if (confirm("Are you sure that you want to decline this challenge?")) {
                deleteAssignChallenge(challenge.id, div, todiv);
            }
        };

        div.appendChild(declinebutton);

    }
    //if(document.getElementById('bypersonallyassigned').children == null){
    document.getElementById(todiv).appendChild(div);
    // }else{
    //     personally.insertBefore(div, personally.children[0])
    // }

}

function deleteAssignChallenge(id, div, todiv) {

    var user = sessionStorage.getItem("userID");
    var query = users.doc(user).collection("assignedChallenges").doc(id).delete();
    query.then(function () {
        console.log("Document successfully deleted!");
        document.getElementById(todiv).removeChild(div);
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}

function clickedAssigned() {
    document.getElementById("bypersonallyassigned").removeChild(document.getElementById("bypersonallyassigned").children[0]);
    playGetChallenges();

}

function clickedPopular() {
    document.getElementById("bypopular").removeChild(document.getElementById("bypopular").children[0]);
    playPopularChallenge();

}

function clickedGenre() {
    if (document.getElementById("bygenre").children[0] != null) {
        document.getElementById("bygenre").removeChild(document.getElementById("bygenre").children[0]);
    }
    var classic = document.createElement("div");
    classic.className = "textgenre";
    classic.innerText = "Classic";

    var rock = document.createElement("div");
    rock.className = "textgenre";
    rock.innerText = "Rock";

    var pop = document.createElement("div");
    pop.className = "textgenre";
    pop.innerText = "Pop";

    var electronic = document.createElement("div");
    electronic.className = "textgenre";
    electronic.innerText = "Electronic";

    document.getElementById("bygenre").appendChild(classic);
    document.getElementById("bygenre").appendChild(rock);
    document.getElementById("bygenre").appendChild(pop);
    document.getElementById("bygenre").appendChild(electronic);


    classic.onclick = function () {
        document.getElementById("bygenre").removeChild(classic);
        document.getElementById("bygenre").removeChild(pop);
        document.getElementById("bygenre").removeChild(electronic);
        document.getElementById("bygenre").removeChild(rock);

        var button = document.createElement("div");
        button.className = "textgenre";
        button.innerText = "Classic";
        button.onclick = function () {

            var child = document.getElementById("bygenre");
            console.log(child);
            while (child.firstChild) {
                child.removeChild(child.firstChild);
            }
            clickedGenre()

        };
        document.getElementById("bygenre").appendChild(button);


        playGenreChallenge("Classic");
    };

    rock.onclick = function () {
        document.getElementById("bygenre").removeChild(classic);
        document.getElementById("bygenre").removeChild(rock);
        document.getElementById("bygenre").removeChild(pop);
        document.getElementById("bygenre").removeChild(electronic);


        var button = document.createElement("div");
        button.className = "textgenre";
        button.innerText = "Rock";
        button.onclick = function () {

            var child = document.getElementById("bygenre");
            console.log(child);
            while (child.firstChild) {
                child.removeChild(child.firstChild);
            }
            clickedGenre()
        };
        document.getElementById("bygenre").appendChild(button);


        playGenreChallenge("Rock");
    };

    pop.onclick = function () {
        document.getElementById("bygenre").removeChild(classic);
        document.getElementById("bygenre").removeChild(rock);
        document.getElementById("bygenre").removeChild(pop);
        document.getElementById("bygenre").removeChild(electronic);


        var button = document.createElement("div");
        button.className = "textgenre";
        button.innerText = "Pop";
        button.onclick = function () {

            var child = document.getElementById("bygenre");
            console.log(child);
            while (child.firstChild) {
                child.removeChild(child.firstChild);
            }
            clickedGenre()
        };
        document.getElementById("bygenre").appendChild(button);


        playGenreChallenge("Pop");
    };

    electronic.onclick = function () {
        document.getElementById("bygenre").removeChild(classic);
        document.getElementById("bygenre").removeChild(rock);
        document.getElementById("bygenre").removeChild(pop);
        document.getElementById("bygenre").removeChild(electronic);

        var button = document.createElement("div");
        button.className = "textgenre";
        button.innerText = "Electronic";
        button.onclick = function () {

            var child = document.getElementById("bygenre");
            console.log(child);
            while (child.firstChild) {
                child.removeChild(child.firstChild);
            }
            clickedGenre()
        };
        document.getElementById("bygenre").appendChild(button);
        playGenreChallenge("Electronic");
    };

}

function clickedArtist() {

    if (document.getElementById("byartist").children[0] != null) {
        document.getElementById("byartist").removeChild(document.getElementById("byartist").children[0]);
    }
    var search_description = document.createElement("div");
    search_description.className = "textgenre";
    search_description.innerText = "Type an Artist:";

    var input = document.createElement("input");
    input.type = "text";
    input.name = "Artist";
    input.id = "artist_search";

    var summitButton = document.createElement("button");
    summitButton.innerText = "SEARCH";
    summitButton.onclick = function () {

        if (!(input.value === "" || input.value === null)) {
            document.getElementById("byartist").removeChild(search_description);
            document.getElementById("byartist").removeChild(input);
            document.getElementById("byartist").removeChild(summitButton);

            playArtistChallenge(input.value);

            var button = document.createElement("div");
            button.className = "textgenre";
            button.innerText = input.value;
            button.onclick = function () {

                var child = document.getElementById("byartist");
                console.log(child);
                while (child.firstChild) {
                    child.removeChild(child.firstChild);
                }
                clickedArtist()

            };
            document.getElementById("byartist").appendChild(button);
        }

    };


    document.getElementById("byartist").appendChild(search_description);
    document.getElementById("byartist").appendChild(input);
    document.getElementById("byartist").appendChild(summitButton);


}


function playGetChallenges() {

    var user = sessionStorage.getItem("userID");
    var query = users.doc(user).collection("assignedChallenges").where("wasPlayed", "==", false);
    query.get().then(function (results) {
        results.forEach(function (hello) {
            var id = hello.data().challengeid;
            if (id != null) {
                var queryChallenge = challenges.doc(hello.data().challengeid);
                queryChallenge.get().then(function (challenge) {
                    var info = challenge.data();
                    //todo: catchs that are left;
                    var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                        info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge, challenge.id);

                    var q = users.doc(info.creator.id);
                    q.get().then(u => {
                        var uname = u.data().username;
                        createDiv(challen, uname, "bypersonallyassigned");
                        this.display_assigned_challenges.unshift(challen);
                        console.log(challenge.data());
                    }).catch(function (err) {
                        console.log(err);
                    });

                }).catch(function (err) {
                    console.log(err);
                })
            }
        });

    }).catch(function (err) {
        console.log(err);
    })

}

function playPopularChallenge() {

    var query = challenges.where("isPublic", "==", true).orderBy("attempted", "desc");//.limit(20);
    query.get().then(function (results) {
        results.forEach(function (challenge) {
            var info = challenge.data();
            var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge, challenge.id);

            var q = users.doc(info.creator.id);
            q.get().then(u => {
                var uname = u.data().username;
                createDiv(challen, uname, "bypopular");
                this.display_popular_challenges.unshift(challen);
                console.log(challenge.data());
            }).catch(function (err) {
                console.log(err);
            });
        })


    }).catch(function (err) {
        console.log(err);
    })

}

function playGenreChallenge(genre) {

    var query = challenges.where("genre", "==", genre).where("isPublic", "==", true).limit(40);
    query.get().then(function (results) {
        results.forEach(function (challenge) {
            var info = challenge.data();
            var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge, challenge.id);

            var q = users.doc(info.creator.id);
            try{
            q.get().then(u => {
                var uname = u.data().username;
                createDiv(challen, uname, "bygenre");
                this.display_genre_challenges.unshift(challen);
                console.log(challenge.data());
            }).catch(function (err) {
                console.log(err);
            });} catch (e) {
                //Nothing
            }
        })


    }).catch(function (err) {
        console.log(err);
    })

}

function playArtistChallenge(artist) {
    //todo: case sensitive.


    var query = challenges.where("artist", "==", artist).where("isPublic", "==", true).limit(40);
    query.get().then(function (results) {
        console.log();
        if (results.size === 0) {
            alert("Sorry! This artist does not exist in the database. Try another");
        }

        results.forEach(function (challenge) {
            var info = challenge.data();
            var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge, challenge.id);

            var q = users.doc(info.creator.id);
            q.get().then(u => {
                var uname = u.data().username;
                createDiv(challen, uname, "byartist");
                this.display_artist_challenges.unshift(challen);
                console.log(challenge.data());
            }).catch(function (err) {
                console.log(err);
            });

        })
    }).catch(function (err) {
        console.log(err);
    })

}
