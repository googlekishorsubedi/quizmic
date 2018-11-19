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


}

// This function creates a div object from a given string of the creator of the challenge
// the artist of the specific song, and the amount of points this challenge contains.
// It will return the created div.
function createDiv(challenge, todiv){

    var div = document.createElement("div");
    div.className = "nodebuddyholder";

    var assignedBy = document.createElement("p");
    assignedBy.className = "challengeName";

    var challengeName = document.createElement("p");
    challengeName.className = "challengeName";


    assignedBy.innerHTML = challenge.creator.id;
    challengeName.innerHTML = challenge.challengeName;

    div.appendChild(challengeName);
    div.appendChild(assignedBy);
    //if(document.getElementById('bypersonallyassigned').children == null){
        document.getElementById(todiv).appendChild(div);
    // }else{
    //     personally.insertBefore(div, personally.children[0])
    // }

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
    //todo: choose group of final genres genre

    if(document.getElementById("bygenre").children[0] != null) {
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


    classic.onclick = function() {
        document.getElementById("bygenre").removeChild(classic);
        document.getElementById("bygenre").removeChild(pop);
        document.getElementById("bygenre").removeChild(electronic);
        document.getElementById("bygenre").removeChild(rock);

        var button = document.createElement("div");
        button.className = "textgenre";
        button.innerText = "Classic";
        button.onclick = function() {

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

    rock.onclick = function() {
        document.getElementById("bygenre").removeChild(classic);
        document.getElementById("bygenre").removeChild(rock);
        document.getElementById("bygenre").removeChild(pop);
        document.getElementById("bygenre").removeChild(electronic);


        var button = document.createElement("div");
        button.className = "textgenre";
        button.innerText = "Rock";
        button.onclick = function() {

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

    pop.onclick = function() {
        document.getElementById("bygenre").removeChild(classic);
        document.getElementById("bygenre").removeChild(rock);
        document.getElementById("bygenre").removeChild(pop);
        document.getElementById("bygenre").removeChild(electronic);


        var button = document.createElement("div");
        button.className = "textgenre";
        button.innerText = "Pop";
        button.onclick = function() {

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

    electronic.onclick = function() {
        document.getElementById("bygenre").removeChild(classic);
        document.getElementById("bygenre").removeChild(rock);
        document.getElementById("bygenre").removeChild(pop);
        document.getElementById("bygenre").removeChild(electronic);

        var button = document.createElement("div");
        button.className = "textgenre";
        button.innerText = "Pop";
        button.onclick = function() {

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

    if(document.getElementById("byartist").children[0] != null) {
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
    summitButton.innerText= "SEARCH";
    summitButton.onclick = function() {
        document.getElementById("byartist").removeChild(search_description);
        document.getElementById("byartist").removeChild(input);
        document.getElementById("byartist").removeChild(summitButton);
        playArtistChallenge(input.value);

        var button = document.createElement("div");
        button.className = "textgenre";
        button.innerText = input.value;
        button.onclick = function() {

            var child = document.getElementById("byartist");
            console.log(child);
            while (child.firstChild) {
                child.removeChild(child.firstChild);
            }
            clickedArtist()

        };
        document.getElementById("byartist").appendChild(button);

    };


    document.getElementById("byartist").appendChild(search_description);
    document.getElementById("byartist").appendChild(input);
    document.getElementById("byartist").appendChild(summitButton);


}



function playGetChallenges() {

    //todo: check that the challenges has not been played before.
    //todo: display which challenges ave already been played (i will say in the end of the list.

    //todo: test it with same account.

    var user = sessionStorage.getItem("userID");
    var query = users.doc(user).collection("assignedChallenges");//.where("wasPlayed", "=", false);
    query.get().then(function (results) {
        results.forEach(function (hello) {
            var id = hello.data().challengeid;
            if (id != null) {
                var queryChallenge = challenges.doc(hello.data().challengeid);
                queryChallenge.get().then(function (challenge) {
                    var info = challenge.data();
                    //todo: query the user name;
                    //todo: catchs that are left;
                    var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                        info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge);

                    createDiv(challen, "bypersonallyassigned");
                    this.display_assigned_challenges.unshift(challen);
                    console.log(challenge.data());
                })
            }
        });


    }).catch(function (err) {
        console.log(err);
    })

}

function playPopularChallenge(){

    var query = challenges.where("isPublic", "==", true).orderBy("attempted", "desc");//.limit(20);
    query.get().then(function (results) {
        results.forEach(function (challenge) {
                    var info = challenge.data();
                    var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                        info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge);
                    createDiv(challen, "bypopular");
                    this.display_popular_challenges.unshift(challen);
                    console.log(challenge.data());
                })


    }).catch(function (err) {
        console.log(err);
    })

}

function playGenreChallenge(genre){

    var query = challenges.where("genre", "==", genre).limit(40);
    query.get().then(function (results) {
        results.forEach(function (challenge) {
            var info = challenge.data();
            var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge);
            createDiv(challen, "bygenre");
            this.display_genre_challenges.unshift(challen);
            console.log(challenge.data());
        })


    }).catch(function (err) {
        console.log(err);
    })

}

function playArtistChallenge(artist){
    //todo:check if the insertionis empty


    var query = challenges.where("artist", "==", artist).limit(40);
    query.get().then(function (results) {
        console.log();
        if(results.size == 0 ){
            alert("Sorry! This artist does not exist in the database. Try another");
        }

        results.forEach(function (challenge) {
            var info = challenge.data();
            var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge);
            createDiv(challen, "byartist");
            this.display_artist_challenges.unshift(challen);
            console.log(challenge.data());
        })
    }).catch(function (err) {
        console.log(err);
    })

}


//
// <div class="row">
//     <label class="">
//     <div class="inputtext">Artist:</div>
// <input class="createinputs" id="artist" type="text" name="artist">
//     </label>
//     </div>