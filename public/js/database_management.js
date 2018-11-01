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

