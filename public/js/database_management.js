firestore.settings(settings);
var users = firestore.collection("users");
var groups = firestore.collection("groups");
var challenges = firestore.collection("challenges");
var username = firestore.collection("username");
var hintVisibility = false;
var optionVisibility = false;


function enableHint() {
    document.getElementById("hint").value = "";
    document.getElementById("hint").hidden = hintVisibility;
    document.getElementById("hintname").hidden = hintVisibility;
    hintVisibility = !hintVisibility;

}

function enableOptions() {
    document.getElementById("option1").value="";
    document.getElementById("option2").value="";
    document.getElementById("option3").value="";
    document.getElementById("options").hidden = optionVisibility;
    optionVisibility = !optionVisibility;
}

function trying() {
    createChallengeQUERY(
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



/**
 * Creates a group
 * @param groupName name of the group
 * @param groupOwnerUsername the ownser UID
 */
function createGroupQUERY(groupName, groupOwnerUsername) {
    var query = groups.add({
        groupName: groupName,
        groupOwner: users.doc(groupOwnerUsername),
        members: []
    }).then(function (e) {
        // This transaction makes possible the update in the list of the user.
        var transaction = firestore.runTransaction(t => {
            return t.get(users.doc(groupOwnerUsername))
                .then(doc => {
                    const ownGroupArray = doc.data().ownGroup;
                    ownGroupArray.push(groups.doc(e.id));
                    t.update(users.doc(groupOwnerUsername), {ownGroup: ownGroupArray});
                });
        }).then(result => {
            console.log('Transaction success!');
        }).catch(err => {
            console.log('Transaction failure:', err);
        });
        addToGroup(groupOwnerUsername, e.id)
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
 */
function createChallengeQUERY(URL, songname, artist, genre, hint, isPublic, option1, option2, option3) {
    console.log(URL, songname, artist, genre, hint, isPublic, option1, option2, option3);
    if (URL == "" || songname == "" || artist == "" || genre == "") {
        window.alert("The challenge cannot be created becuase of missing data");
        return;
    }

    if (hintVisibility && hint == "") {
        window.alert("You should specify a hint otherwise you can uncheck it");
        return;
    }

    if(optionVisibility){
        if(option1 == "" || option2 == "" || option3 == ""){
        window.alert("You are missing options! You can always uncheck the options and let us do it for you");
        return;
        }

        var op1 = option1.toLowerCase();
        var op2 = option2.toLowerCase();
        var op3 = option3.toLowerCase();
        var answer = songname.toLowerCase();
        if (op1 == op2 || op1 == op3 || op2 == op3 || answer == op1 || answer == op2 || answer == op3) {
            window.alert("There are similar options, please use different options or use free from if you are out of ideas.");
            return;
        }
    }

    if (!(URL.includes("https://www.youtube.com/watch?v="))) {
        window.alert("The URL tou are trying to insert is not valid.");
        return;
    }

 var creator = firebase.auth().currentUser.uid;
    console.log(creator);
    var query = challenges.add({
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

    })
}

/**
 * Get user by Username
 * @param username the user username
 */
function getUserbyUsernameQUERY(username) {
    var query = users.where("username", "==", username);
    query.get().then(function (results) {
        if (results.empty) {
            console.log("No documents found!");
        } else {
            var user;
            // go through all results
            results.forEach(function (doc) {
                //user = doc.data().id;
                console.log("Document data:", doc.data());
            });


            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function (error) {
        console.log("Error getting documents:", error);
    });

}

/**
 * Get user by Email
 * @param email the user email
 */
function getUserbyEmailQUERY(email) {
    var query = users.where("email", "==", email);
    query.get().then(function (results) {
        if (results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function (error) {
        console.log("Error getting documents:", error);
    });
}

/**
 * Add user to contactlist
 * @param username user UID
 * @param contactUsername contact UID
 */
function addContact(username, contactUsername) {
    var transaction = firestore.runTransaction(t => {
        return t.get(users.doc(username))
            .then(doc => {
                const contactArray = doc.data().contactList;
                contactArray.push(users.doc(contactUsername));
                t.update(users.doc(username), {contactList: contactArray});
            });
    }).then(result => {
        console.log('Transaction success!');
    }).catch(err => {
        console.log('Transaction failure:', err);
    });
}

/**
 * Add user to group
 * @param username user to add UID
 * @param groupID ID of the group
 */
function addToGroup(username, groupID) {
    // Add member to
    var transaction = firestore.runTransaction(t => {
        return t.get(groups.doc(groupID))
            .then(doc => {
                const membersArray = doc.data().members;
                membersArray.push(users.doc(username));
                t.update(groups.doc(groupID), {members: membersArray});
            });
    }).then(result => {
        console.log('Transaction success!');
    }).catch(err => {
        console.log('Transaction failure:', err);
    });

    var transaction2 = firestore.runTransaction(t => {
        return t.get(users.doc(username))
            .then(doc => {
                const belongsToGroup = doc.data().belongsToGroup;
                belongsToGroup.push(groups.doc(groupID));
                t.update(users.doc(username), {belongsToGroup: belongsToGroup});
            });
    }).then(result => {
        console.log('Transaction success!');
    }).catch(err => {
        console.log('Transaction failure:', err);
    });
}

function getUserChallengesQUERY() {
    var query = users.doc(firebase.auth().currentUser.uid);
    var ownChallengesIDs= [];
    query.get().then(function (results) {
        if(results.exists){
            var ownChallenges = results.data().ownChallenges;

            ownChallenges.forEach(function (doc) {
                ownChallengesIDs.add(doc.id)
            });
        }
        else
            console.log("No documents found!");

        challengesArray = [];
        ownChallengesIDs.forEach(function(e){
            challengesArray.push(getChallengeByidQUERY(e))
    }).catch(function (error) {
        console.log("Error getting documents:", error);
    });

    })
}

function getChallengeByidQUERY(challengeID){
    var query = challenges.doc(challengeID);
    query.get().then(function (results) {
        if(results.exists){
            var info = results.data();
            var challenge = Challenge(info.youtubeAPIid, info.song, info.artist, info.genre, info.hint, info.attempted, info.rightlyAnswered, info.isPublic, info.options, info.date, info.creator)
            return challenge;
        }
        else
            console.log("No documents found!");

    }).catch(function (error) {
        console.log("Error getting documents:", error);
    });
}

function getUserGroupsQUERY(username) {
    var query = users.belongsToGroup;
    query.get().then(function (results) {
        if (results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function (error) {
        console.log("Error getting documents:", error);
    });
}

function getUserAssignedChallenges(username) {
    var query = users.assignedChallenges;
    query.get().then(function (results) {
        if (results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function (error) {
        console.log("Error getting documents:", error);
    });
}

