firestore.settings(settings);
var users = firestore.collection("users");
var groups = firestore.collection("groups");
var challenges = firestore.collection("challenges");
var username = firestore.collection("username");

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
function addFriend(){
    var friendUsername = document.getElementById("friendUsername").value;
    var query = username.doc(friendUsername);

    query.get().then(function (results) {
        if (results.exists) {
            //adds friendUserName to current User's contact List
            var user = firebase.auth().currentUser;
            var userRef = users.doc(user.uid);
            userRef.get().then(function (results) {
            if (results.exists) {
                if(results.data().username == friendUsername){
                    alert("Can't add yourself to your friend's list")
                    return;
                }
                else 
                {
                    //check if friendusername already in the array 
                    var contactListArray = results.data().contactList;
                    for (i = 0; i < contactListArray.length; i++) { 
                        if(contactListArray[i] == friendUsername)
                        {
                            alert("User already in your friend list");
                            return;
                        }
                    }
                    
                    userRef.update({
                    contactList: firebase.firestore.FieldValue.arrayUnion(friendUsername)
                    });
                    alert("friend added");
                }
            } else 
                alert("this Username not found.");
            }).catch(function (error) {
            console.log("Error getting user owned challenges:", error);
            });

        } else 
            alert("Friend Username not found");
        }).catch(function (error) {
        console.log("Error getting user owned challenges:", error);
    });

}

function assignChallenge(challengeID, userName)
{
    var docRef = firestore.collection("username").doc(userName);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            var userId = doc.data().uid;
            firestore.collection("users").doc(userId).collection("assignedChallenges").doc(challengeID).set({challengeid: challengeID});
            alert("Succesfully assigned the challenge to", userName);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such username to assign the challenge!");
        }
    }).catch(function(error) {
        console.log("Error assigning the challenge", error);
    });

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

