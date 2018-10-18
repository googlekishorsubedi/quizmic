var users = firestore.collection("users");
var groups = firestore.collection("groups");
var challenges = firestore.collection("challenges");
var username = firestore.collection("username");

function testing(){
    //trying: p5BTzujAaddbzSjrIr6g
    //trying2: 5df5LtvXQRsFqgn0Pz8f
    // group: ulNnplX6cQNvJhWgz345

    //works createUserQUERY()
    //works createGroupQUERY()
    //works createChallengeQUERY()
    //works getUserbyEmailQUERY();
    //works getUserbyUsernameQUERY();
    //works addContact()
    //works addToGroup()

}

/**
 * Create a User
 * @param username the UID
 * @param email the email of the user
 */
function createUserQUERY(username, email){
    var query = users.add({
        username: username,
        email: email,
        score: 0,
        ownChallenges: [],
        contactList: [],
        belongsToGroup: [],
        challengesPlayed: 0
    }).then(function (e) {
        // Creates the reference in the username table
        this.username.doc(username).set({emailadress: email});
        // Add the assigned collection to the user.
        users.doc(e.id).collection("assignedChallenges").add({})
    })
}

/**
 * Creates a group
 * @param groupName name of the group
 * @param groupOwnerUsername the ownser UID
 */
function createGroupQUERY(groupName, groupOwnerUsername){
    var query = groups.add({
        groupName: groupName,
        groupOwner: users.doc(groupOwnerUsername),
        members: []
    }).then(function(e){
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
 * @param creator the creator of the challenge UID
 */
function createChallengeQUERY(URL, songname, artist, genre, hint, creator){
    var query = challenges.add({
        URL: URL,
        songname: songname,
        artist: artist,
        genre: genre,
        hint: hint,
        creator: users.doc(creator)
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
function getUserbyUsernameQUERY(username){
    var query = users.where("username", "==", username);
    query.get().then(function(results) {
        if(results.empty) {
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
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });

}

/**
 * Get user by Email
 * @param email the user email
 */
function getUserbyEmailQUERY(email){
    var query = users.where("email", "==", email);
    query.get().then(function(results) {
        if(results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });
}

/**
 * Add user to contactlist
 * @param username user UID
 * @param contactUsername contact UID
 */
function addContact(username, contactUsername){
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
function addToGroup(username, groupID){
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

function getUserChallengesQUERY(username){
    var query = users.ownChallenges;
    query.get().then(function(results) {
        if(results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });
}
function getUserGroupsQUERY(username){
    var query = users.belongsToGroup;
    query.get().then(function(results) {
        if(results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });
}
function getUserAssignedChallenges(username) {
    var query = users.assignedChallenges;
    query.get().then(function(results) {
        if(results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });
}

