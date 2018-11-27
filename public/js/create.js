//firestore.settings(settings);
document.addEventListener("DOMContentLoaded", function(event) {
    var userObj = JSON.parse(sessionStorage.getItem("userObject"));
    document.getElementById("profilepic").src = userObj.img;
    document.getElementById("editprofilepic").src = userObj.img;

});
var users = firestore.collection("users");
var groups = firestore.collection("groups");
var challenges = firestore.collection("challenges");
var username = firestore.collection("username");
var challengesArray = [];
var selectedchallenge;

function createMain() {
    getUserChallengesQUERY();
    getCompletedChallenges();

}

//TODO: what happend if i erause a challenge that was assigned;


function getCompletedChallenges(){

    var user = sessionStorage.getItem("userID");
    var query = users.doc(user).collection("assignedChallenges").where("wasPlayed", "==", true);
    query.get().then(function (results) {
        results.forEach(function (hello) {
            var id = hello.data().challengeid;
            if (id != null) {
                var queryChallenge = challenges.doc(hello.data().challengeid);
                queryChallenge.get().then(function (challenge) {
                    var info = challenge.data();
                    var challen = Challenge(info.challengeName, info.youtubeAPIid, info.song, info.artist, info.genre,
                        info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, challenge, challenge.id);

                    var q = users.doc(info.creator.id);
                    q.get().then(u => {
                        var uname = u.data().username;
                        createChallengeSectionForplayedChallenges(challen, uname, id.answerGiven);
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
function createChallengeSectionForplayedChallenges(challenge, user, answerGiven) {
    var div = document.createElement("div");
    challenge.div = div;
    div.className = "nodebuddyholder";

    var challengeName = document.createElement("p");
    challengeName.className = "challengeName";
    challengeName.onclick = function () {
        alert("Your answer was: " + answerGiven + "\n Correct answer: " + challenge.song )

    };


    var userd = document.createElement("p");
    userd.className = "challengeName";
    userd.onclick = function () {
        alert("Your answer was: " + answerGiven + "\n Correct answer: " + challenge.song )
    };


    challengeName.innerHTML = challenge.challengeName;
    userd.innerHTML = user;

    div.appendChild(challengeName);
    div.appendChild(userd);

    console.log("ndodbvoenr");
    document.getElementById('completechallenges').appendChild(div);

}


function enableHint() {
    var show = !document.getElementById("hintEnable").checked;
    document.getElementById("hint").hidden = show;
    document.getElementById("hintname").hidden = show;
    document.getElementById("hint").value = "";

}

function openassignpopup(challenge) {
    document.getElementById("openassignpopupForm").style.display = "block";

    document.getElementById('assignbuttoncs').onclick = function () {
        assignChallenge(challenge.id, document.getElementById('assignbuttonpop').value);
    }
}

function closeassignpopup() {
    document.getElementById("openassignpopupForm").style.display = "none";
}

function enableOptions() {
    document.getElementById("options").hidden = !document.getElementById("optionsEnable").checked;
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
}


function quickChallenge(){
    createChallengeQUERY(
        document.getElementById('nameofchallenge2').value,
        document.getElementById('url2').value,
        document.getElementById('answer2').value,
        document.getElementById('artist2').value,
        document.getElementById('genre2').value,
        "",
        true,
        "",
        "",
        "",
        false,
        false);

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
        document.getElementById('option3').value,
        document.getElementById("optionsEnable").checked,
        document.getElementById("hintEnable").checked);
}

function clearCreateForm() {
    try {
        document.getElementById('nameofchallenge').value = "";
        document.getElementById('url').value = "";
        document.getElementById('answer').value = "";
        document.getElementById('artist').value = "";
        document.getElementById('genre').value = "";
        document.getElementById('isPublic').checked = false;
        document.getElementById("optionsEnable").checked = false;
        document.getElementById("option1").value = "";
        document.getElementById("option2").value = "";
        document.getElementById("option3").value = "";
        document.getElementById("options").hidden = true;
        document.getElementById("hintEnable").checked = false;
        document.getElementById("hint").value = "";
        document.getElementById("hint").hidden = true;
        document.getElementById("hintname").hidden = true;
    }catch (e) {

    }

    try {
        document.getElementById('nameofchallenge2').value = "";
        document.getElementById('url2').value= "";
        document.getElementById('answer2').value = "";
        document.getElementById('artist2').value = "";
        document.getElementById('genre2').value = "";
    }catch (e) {

    }

}


function createButtonSections(challenge) {
    var div = document.createElement("div");
    challenge.div = div;
    div.className = "nodebuddyholder";

    var challengeName = document.createElement("p");
    challengeName.className = "challengeName";
    challengeName.onclick = function () {
        sessionStorage.setItem("playMode", "own");
        selectedchallenge = ChallengeToParce(challenge);
        var stringify = JSON.stringify(selectedchallenge);
        sessionStorage.setItem("playingChallenge", stringify);
        document.location.assign("../html/challenge.html");
        //document.location.replace("../html/challenge.html");

    };


    var assignButton = document.createElement("button");
    assignButton.className = "assignButton";
    assignButton.onclick = function () {
        openassignpopup(challenge);
    };

    var editButton = document.createElement("button");
    editButton.className = "editButton";
    editButton.onclick = function () {
        editChallenge(challenge, div, editButton, deleteButton, challengeName);
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

    var ediv = null;
    if (challengesArray.length > 0)
        ediv = challengesArray[0].div;
    document.getElementById('indivualchallenges').insertBefore(div, ediv);
}

function editChallenge(challenge, div, editButtons, deleteButtons, challengeName) {

    var confirmation = confirm("Are you sure you want to edit the challenge?");
    if (confirmation) {

        document.getElementById('nameofchallenge').value = challenge.challengeName;
        document.getElementById('url').value = challenge.youtubeID;
        document.getElementById('answer').value = challenge.song;
        document.getElementById('artist').value = challenge.artist;
        document.getElementById('genre').value = challenge.genre;


        document.getElementById('isPublic').checked = challenge.isPublic;

        document.getElementById("optionsEnable").checked = true;
        document.getElementById("options").hidden = false;
        document.getElementById("option1").value = challenge.options[0];
        document.getElementById("option2").value = challenge.options[1];
        document.getElementById("option3").value = challenge.options[2];

        var exist = (challenge.hint === "");
        document.getElementById("hintEnable").checked = !exist;
        document.getElementById("hint").hidden = exist;
        document.getElementById("hintname").hidden = exist;
        if (exist)
            document.getElementById("hint").value = "";
        else
            document.getElementById("hint").value = challenge.hint;

        document.getElementById("createchallengebutton").hidden = true;
        document.getElementById("cancelEdit").hidden = false;
        document.getElementById("summitEdit").hidden = false;

        document.getElementById("cancelEdit").onclick = function () {
            clearCreateForm();
            document.getElementById("createchallengebutton").hidden = false;
            document.getElementById("cancelEdit").hidden = true;
            document.getElementById("summitEdit").hidden = true;
        };

        document.getElementById("summitEdit").onclick = function () {
            var cname = document.getElementById('nameofchallenge').value;
            var url = document.getElementById('url').value;
            var song = document.getElementById('answer').value;
            var artist = document.getElementById('artist').value;
            var genre = document.getElementById('genre').value;
            var hint = document.getElementById('hint').value;
            var ispublic = document.getElementById('isPublic').checked;
            var opt1 = document.getElementById('option1').value;
            var opt2 = document.getElementById('option2').value;
            var opt3 = document.getElementById('option3').value;
            var optenable = document.getElementById("optionsEnable").checked;
            var hintenable = document.getElementById("hintEnable").checked;
            if (!checkTheInputForChallenges(cname, url, song, artist, genre, hint, ispublic, opt1, opt2, opt3, optenable, hintenable)) {
                return;
            }
            document.getElementById("createchallengebutton").hidden = false;
            document.getElementById("cancelEdit").hidden = true;
            document.getElementById("summitEdit").hidden = true;

            if (!optenable) {
                var query = challenges.where("genre", "==", genre);
                query.get().then(function (results) {
                    var selected_challenge = Math.floor(Math.random() * results.size);
                    console.log(results.docs[selected_challenge].id);
                    var opti = results.docs[selected_challenge].data().options;

                    var transaction = firestore.runTransaction(t => {
                        return t.get(challenges.doc(challenge.id)).then(doc => {
                            console.log(challenge.id);

                            var data = doc.data();
                            challenge.challengeName = cname;
                            challenge.youtubeID = url;
                            challenge.song = song;
                            challenge.artist = artist;
                            challenge.genre = genre;
                            challenge.hint = hint;
                            challenge.isPublic = ispublic;
                            challenge.options = opti;
                            challengeName.innerText = cname;

                            t.update(challenges.doc(challenge.id), {
                                challengeName: cname,
                                youtubeAPIid: url,
                                song: song,
                                artist: artist,
                                genre: genre,
                                hint: hint,
                                attempted: data.attempted,
                                rightlyAnswered: data.rightlyAnswered,
                                isPublic: ispublic,
                                options: opti,
                                creator: users.doc(sessionStorage.getItem("userID")),
                                date: data.date
                            })
                        }).catch(err => {
                            console.log('Transaction failure:', err);
                        });

                    }).then(function () {
                        console.log('Transaction success!');
                    }).catch(err => {
                        console.log('Transaction failure:', err);
                    });
                    clearCreateForm();
                }).catch(err => {
                    console.log('Transaction failure:', err);
                })
            }
            else {
                var transaction = firestore.runTransaction(t => {
                    return t.get(challenges.doc(challenge.id)).then(doc => {

                        var data = doc.data();
                        challenge.challengeName = cname;
                        challenge.youtubeID = url;
                        challenge.song = song;
                        challenge.artist = artist;
                        challenge.genre = genre;
                        challenge.hint = hint;
                        challenge.isPublic = ispublic;
                        challenge.options = [opt1, opt2, opt3];
                        challengeName.innerText = cname;

                        t.update(challenges.doc(challenge.id), {
                            challengeName: cname,
                            youtubeAPIid: url,
                            song: song,
                            artist: artist,
                            genre: genre,
                            hint: hint,
                            attempted: data.attempted,
                            rightlyAnswered: data.rightlyAnswered,
                            isPublic: ispublic,
                            options: [opt1, opt2, opt3],
                            creator: users.doc(sessionStorage.getItem("userID")),
                            date: data.date
                        })
                    }).catch(err => {
                        console.log('Transaction failure:', err);
                    });

                }).then(function () {
                    console.log('Transaction success!');
                }).catch(err => {
                    console.log('Transaction failure:', err);
                });
                clearCreateForm();
            }
        }
    }
}

function deleteChallenge(challenge, div, editButtons, deleteButtons, challengeName) {

    var confirmation = confirm("Are you sure you want to delete the challenge?");
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
                            challengesArray.splice(challengesArray.indexOf(challenge), 1)

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
 * Get challenges that were created by user that is signed in.
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
                        info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator, results, e);

                    createButtonSections(challen);
                    this.challengesArray.unshift(challen);

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

function checkTheInputForChallenges(challengeName, URL, songname, artist, genre, hint, isPublic, option1, option2, option3, optionsEnabled, hintEnabled) {
    if (URL === "" || songname === "" || artist === "" || genre === "" || challengeName === "") {
        window.alert("The challenge cannot be created becuase of missing data");
        return false;
    }

    if (hintEnabled && hint === "") {
        window.alert("You should specify a hint otherwise you can uncheck it");
        return false;
    }

    if (optionsEnabled) {
        if (option1 === "" || option2 === "" || option3 === "") {
            window.alert("You are missing options! You can always uncheck the options and let us do it for you");
            return false;
        }

        var op1 = option1.toLowerCase();
        var op2 = option2.toLowerCase();
        var op3 = option3.toLowerCase();
        var answer = songname.toLowerCase();
        if (op1 === op2 || op1 === op3 || op2 === op3 || answer === op1 || answer === op2 || answer === op3) {
            window.alert("There are similar options, please use different options or use free from if you are out of ideas.");
            return false;
        }
    }

    if (!(URL.includes("https://www.youtube.com/watch?v="))) {
        window.alert("The URL tou are trying to insert is not valid.");
        return false;
    }
    return true;
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
 * @param optionsEnabled the user gave the options
 * @param hintEnabled the user gave the hint
 */
function createChallengeQUERY(challengeName, URL, songname, artist, genre, hint, isPublic, option1, option2, option3, optionsEnabled, hintEnabled) {


    if (!checkTheInputForChallenges(challengeName, URL, songname, artist, genre, hint, isPublic, option1, option2, option3, optionsEnabled, hintEnabled)) {
        return;
    }

    if (!optionsEnabled) {
        var query = challenges.where("genre", "==", genre);
        query.get().then(function (results) {
            var selected_challenge = Math.floor(Math.random() * results.size);
            console.log(results.docs[selected_challenge].id);
            var opti = results.docs[selected_challenge].data().options;

            var creator = sessionStorage.getItem("userID");
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
                options: opti,
                creator: users.doc(creator),
                date: new Date()
            }).then(function (e) {
                console.log(e.id);
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
                    options: opti,
                    creator: users.doc(creator),
                    date: new Date(),
                    id: e.id
                };
                try {
                    createButtonSections(challen);
                    this.challengesArray.unshift(challen);

                }catch (e) {
                    //do nothing

                }
                clearCreateForm();
            })

        }).catch(function (err) {
            console.log(err);
        });
    }
    else {

        var creator = sessionStorage.getItem("userID");
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

            createButtonSections(challen);
            this.challengesArray.unshift(challen);
            clearCreateForm();

        })

    }
}
