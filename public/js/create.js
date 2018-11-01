//firestore.settings(settings);
var users = firestore.collection("users");
var groups = firestore.collection("groups");
var challenges = firestore.collection("challenges");
var username = firestore.collection("username");
var hintHide = true;
var optionHide = true;
var challengesArray = [];

//TODO: automatically fill answers

function createMain() {
    getUserChallengesQUERY()

}

function enableHint() {
    hintHide = !hintHide;
    document.getElementById("hint").value = "";
    document.getElementById("hint").hidden = hintHide;
    document.getElementById("hintname").hidden = hintHide;


}

function enableOptions() {
    optionHide = !optionHide;
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("options").hidden = optionHide;

}

function trying() {
    createChallengeQUERY(
        document.getElementById('nameofchallenge').value,
        document.getElementById('url').value,
        document.getElementById('answer').value,
        document.getElementById('artist').value,
        document.getElementById('genre').value,
        document.getElementById('hint').value,
        document.getElementById('isPublic').checked,
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value);
}

function clearCreateForm() {
    document.getElementById('url').value = "";
    document.getElementById('answer').value = "";
    document.getElementById('artist').value = "";
    document.getElementById('genre').value = "";
    document.getElementById('isPublic').checked = false;
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("options").hidden = true;
    document.getElementById("hint").value = "";
    document.getElementById("hint").hidden = true;
    document.getElementById("hintname").hidden = true;
}

function createButtonSections(challenge) {
    var div = document.createElement("div");
    div.className = "nodebuddyholder";

    var challengeName = document.createElement("p");
    challengeName.className = "challengeName";

    var assignButton = document.createElement("button");
    assignButton.className = "assignButton";

    var editButton = document.createElement("button");
    editButton.className = "editButton";
    editButton.onclick = function () {
        editChallenge(challenge, div, editButton, deleteButton);
    };


    var deleteButton = document.createElement("button");
    deleteButton.className = "deleteButton";
    deleteButton.onclick = function () {
             deleteChallenge(challenge, div, editButton, deleteButton);
         };

    challengeName.innerHTML = challenge.challengeName;
    assignButton.innerHTML = "Assign";
    editButton.innerHTML = "Edit";
    deleteButton.innerHTML = "Delete";

    div.appendChild(challengeName);
    div.appendChild(assignButton);
    div.appendChild(editButton);
    div.appendChild(deleteButton);

    document.getElementById('indivualchallenges').appendChild(div);
}

function editChallenge(challenge, div, editButtons, deleteButtons) {
    div.style.backgroundColor = "red";

    var confirmation = confirm("Are you sure you want to delete the challenge?");
    if (confirmation) {

        document.getElementById('url').value = challenge.url;
        document.getElementById('answer').value = challenge.songname;
        document.getElementById('artist').value = challenge.artist;
        document.getElementById('genre').value = challenge.genre;
        document.getElementById('isPublic').checked = challenge.isPublic;
        optionHide = false;
        document.getElementById("options").hidden = optionHide;

        document.getElementById("option1").value = challenge.option1;
        document.getElementById("option2").value = challenge.option2;
        document.getElementById("option3").value = challenge.option3;
        hintHide = true;
        if(challenge.hint !== ""){
            hintHide = false;
        }

        document.getElementById("hint").hidden = hintHide;
        document.getElementById("hintname").hidden = hintHide;
        document.getElementById("hint").value = challenge.hint;




        // var user = sessionStorage.getItem("userID");
        // var transaction = firestore.runTransaction(t => {
        //
        // }).then(function () {
        //     console.log('Transaction success!');
        // }).catch(err => {
        //     console.log('Transaction failure:', err);
        // });
    }
}

function deleteChallenge(challenge) {
    div.style.backgroundColor = "red";

    var confirmation = confirm("Are you sure you want to edit the challenge?");
    if (confirmation) {
        var user = sessionStorage.getItem("userID");
        var transaction = firestore.runTransaction(t => {
            return t.get(users.doc(user))
                .then(doc => {
                    const ownChallenges = doc.data().ownChallenges;
                    var j = -1;
                    for (var i = 0; i < ownChallenges.length; i++) {
                        if (challenge.id === ownChallenges[i].id) {
                            j = i;
                            break;
                        }
                    }
                    if (j !== -1) {
                        ownChallenges.splice(j, 1);

                        t.update(users.doc(user), {ownChallenges: ownChallenges});

                        challenges.doc(challenge.id).delete().then(function () {
                            console.log("Challenge successfully deleted!");
                            editButtons.remove();
                            deleteButtons.remove();
                            div.remove();

                        }).catch(function (error) {
                            console.error("Error removing challenge: ", error);
                        });
                    }

                });
        }).then(function () {
            console.log('Transaction success!');
        }).catch(err => {
            console.log('Transaction failure:', err);
        });
    }
}


/**
 *
 */
function getUserChallengesQUERY() {

    var user = sessionStorage.getItem("userID");
    var query = users.doc(user);
    var ownChallengesIDs = [];
    query.get().then(function (results) {
        if (results.exists) {
            var ownChallenges = results.data().ownChallenges;

            ownChallenges.forEach(function (doc) {
                ownChallengesIDs.push(doc.id)
            });
        }
        else
            console.log("No documents found!");


        ownChallengesIDs.forEach(function (e) {
            var query = challenges.doc(e);
            query.get().then(function (results) {
                if (results.exists) {
                    var info = results.data();
                    var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                        info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, e);
                    this.challengesArray.push(challen);
                    createButtonSections(challen);
                }
                else
                    console.log("No challenge was found with that ID!");

            }).catch(function (error) {
                console.log("Error getting challenge ID:", error);
            });
        });
    }).catch(function (error) {
        console.log("Error getting user owned challenges:", error);
    });

}

/**
 * Create a challenge
 * @param URL the challenge URL
 * @param songname the name of the song
 * @param artist the artist of the song
 * @param genre the genre of the song
 * @param hint optional hint for the challenge
 * @param isPublic boolean value if the challenge would be shared publicly
 * @param option1 wrong option for challenge
 * @param option2 wrong option for challenge
 * @param option3 wrong option for challenge
 * @param challengeName name of the challenge
 */
function createChallengeQUERY(challengeName, URL, songname, artist, genre, hint, isPublic, option1, option2, option3) {
    console.log(URL, songname, artist, genre, hint, isPublic, option1, option2, option3);
    if (URL === "" || songname === "" || artist === "" || genre === "" || challengeName === "") {
        window.alert("The challenge cannot be created becuase of missing data");
        return;
    }

    if (hintHide && hint === "") {
        window.alert("You should specify a hint otherwise you can uncheck it");
        return;
    }

    if (optionHide) {
        if (option1 === "" || option2 === "" || option3 === "") {
            window.alert("You are missing options! You can always uncheck the options and let us do it for you");
            return;
        }

        var op1 = option1.toLowerCase();
        var op2 = option2.toLowerCase();
        var op3 = option3.toLowerCase();
        var answer = songname.toLowerCase();
        if (op1 === op2 || op1 === op3 || op2 === op3 || answer === op1 || answer === op2 || answer === op3) {
            window.alert("There are similar options, please use different options or use free from if you are out of ideas.");
            return;
        }
    }

    if (!(URL.includes("https://www.youtube.com/watch?v="))) {
        window.alert("The URL tou are trying to insert is not valid.");
        return;
    }
//TODO: THe validation pf the youtube and make sure that you just have the id when it comes to saving the URL
    var creator = firebase.auth().currentUser.uid;
    console.log(creator);
    var query = challenges.add({
        challengeName: challengeName,
        youtubeAPIid: URL,
        song: songname,
        artist: artist,
        genre: genre,
        hint: hint,
        attempted: 0,
        rightlyAnswered: 0,
        isPublic: isPublic,
        options: [option1, option2, option3],
        creator: users.doc(creator),
        date: new Date()
    }).then(function (e) {
        console.log(e);
        var transaction = firestore.runTransaction(t => {
            return t.get(users.doc(creator))
                .then(doc => {
                    const ownChallenges = doc.data().ownChallenges;
                    ownChallenges.push(challenges.doc(e.id));
                    t.update(users.doc(creator), {ownChallenges: ownChallenges});
                });
        }).then(result => {
            console.log('Transaction success!');
        }).catch(err => {
            console.log('Transaction failure:', err);
        });

        var challen = {
            challengeName: challengeName,
            youtubeID: URL,
            song: songname,
            artist: artist,
            genre: genre,
            hint: hint,
            attempted: 0,
            rightlyAnswered: 0,
            isPublic: isPublic,
            options: [option1, option2, option3],
            creator: users.doc(creator),
            date: new Date(),
            id: e.id
        };
        this.challengesArray.push(challen);
        createButtonSections(challen);
        clearCreateForm();

    })
}


